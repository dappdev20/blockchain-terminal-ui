import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import DonutPortfolioChart from '@/lib/chartModules/donutChart';
import { formatFiatString } from '@/utils';
import DataLoader from '@/components-generic/DataLoader';
// import CoinIcon from '@/components-generic/CoinIcon';
import { BalanceLabel, Wrapper } from './styles';

class DonutChart extends Component {
  state = {
    isShowingPercent: false
  };

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getData = () => {
    const { data, isHoverPortfolio, activeCoin } = this.props;

    if (!data || !data.length) {
      return [];
    }

    return data
      .filter(({ btcValue = 0 }) => btcValue > 0)
      .reduce(
        (result, { btcValue = 0, symbol = '', hex = '' }) => {
          result.data.push(btcValue);
          result.labels.push(symbol);
          result.colors.push(hex);
          return result;
        },
        {
          data: [],
          labels: [],
          colors: [],
          selected: isHoverPortfolio ? activeCoin : ''
        }
      );
  };

  updateChart = () => {
    if (!this.el) {
      return;
    }

    const nextData = this.getData();

    if (this.chart) {
      this.chart.update(nextData);
      return;
    }

    this.chart = new DonutPortfolioChart({
      el: this.el,
      data: nextData
    });
  };

  destroyChart = () => {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };

  showPercent = status => {
    this.setState({ isShowingPercent: status });
  };

  render() {
    const { data, totalUSDBalance, isHoverPortfolio, activeCoin } = this.props;
    const { isShowingPercent } = this.state;
    const isStock = (activeCoin || '').includes('S:');
    const isFiat = (activeCoin || '').includes('F:');
    const isAUM = activeCoin === 'AUM';
    const isCrypto = !isStock && !isFiat && !isAUM;
    const activeCoinMap = data.find(coin => coin.coin === activeCoin);
    let decimalPoints = 0;

    if (isFiat) {
      decimalPoints = 2;
    } else if (isStock || isCrypto) {
      decimalPoints = 4;
    }

    let title;
    let details;
    let isTotalBalance = true;

    if ((isHoverPortfolio || this.state.isShowingPercent) && activeCoinMap) {
      const percentValue = ((activeCoinMap.usdValue / totalUSDBalance) * 100).toFixed(2);
      const integerAmount = percentValue.split('.')[0];
      const decimalAmount = (percentValue.split('.')[1] && percentValue.split('.')[1]) || '';
      title = (
        <div className="percent-title">
          <div className="integer">{integerAmount}</div>
          <div className="decimal">{decimalAmount}</div>
          <div className="percent">%</div>
        </div>
      );
      details = activeCoin.replace('F:', '').replace('S:', '');
      isTotalBalance = false;
    } else {
      title = `$${formatFiatString(totalUSDBalance, decimalPoints).unitValue}`;
      const integerAmount = title.split('.')[0];
      const decimalAmount = (title.split('.')[1] && title.split('.')[1]) || '';
      title = (
        <div className="decimal-title">
          {integerAmount}
          <span>{decimalAmount}</span>
        </div>
      );

      details = 'Total Balance';
      isTotalBalance = true;
    }

    if (!data.length) {
      this.destroyChart();
      return <DataLoader width={100} height={100} />;
    }

    return (
      <Wrapper>
        <canvas ref={el => (this.el = el)} />
        <BalanceLabel
          isEOS={activeCoin === 'EOS'}
          isHoverPortfolio={isHoverPortfolio}
          isShowingPercent={isShowingPercent}
          onMouseEnter={() => this.showPercent(true)}
          onMouseLeave={() => this.showPercent(false)}
          isTotalBalance={isTotalBalance}
        >
          <div className="title">
            {/* {isHoverPortfolio && <CoinIcon value={activeCoin} size={20} />} */}
            {title}
          </div>
          <span className="details">{details}</span>
        </BalanceLabel>
      </Wrapper>
    );
  }
}

const withStore = compose(
  inject(STORE_KEYS.PORTFOLIOSTORE, STORE_KEYS.CONVERSIONAUTOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.PORTFOLIOSTORE]: {
        data,
        getBTCBalanceOf,
        totalBTCAmount: totalBTCBalance,
        totalUSDAmount: totalUSDBalance
      },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { isHoverPortfolio, activeCoin }
    }) => ({
      data,
      isHoverPortfolio,
      activeCoin,
      getBTCBalanceOf,
      totalBTCBalance,
      totalUSDBalance
    })
  )
);

export default withStore(DonutChart);
