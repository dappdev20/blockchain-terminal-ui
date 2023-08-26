import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { isEqual } from 'lodash';

import { withSafeTimeout } from '@hocs/safe-timers';
import { STORE_KEYS } from '@/stores';
import { TV_CONFIG } from '@/config/constants';
import DataLoader from '@/components-generic/DataLoader';
import DataFeed, { apiDataLoadObservable } from './Api';
import { customIndicatorsGetter } from './utils';

import { Wrapper, ChartContainer, ApTradingViewChart } from './styles';

class BCTChart extends React.Component {
  studyIds = {};
  isSubscribed = false;

  state = {
    isLoading: false
  };

  componentDidMount() {
    const { exchanges, coinPair } = this.props;

    const symbols = Object.keys(exchanges)
      .filter(name => exchanges[name].active)
      .map(exchange => `${exchange === 'Global' ? 'CCCAGG' : exchange}:${coinPair}`);

    this.createChart(symbols, TV_CONFIG);

    if (!this.isSubscribed) {
      apiDataLoadObservable.subscribe({
        next: apiDataEvent => {
          if (this.isSubscribed && apiDataEvent) {
            if (apiDataEvent.apiLoaded) {
              this.setState({
                isLoading: false
              });
            } else {
              this.setState({
                isLoading: true
              });
            }
          }
        }
      });
      this.isSubscribed = true;
    }
  }

  componentDidUpdate(prevProps) {
    const { exchanges, coinPair } = this.props;
    if (!isEqual(prevProps.exchanges, exchanges) || prevProps.coinPair !== coinPair) {
      try {
        const symbols = Object.keys(exchanges)
          .filter(name => exchanges[name].active)
          .map(exchange => `${exchange === 'Global' ? 'CCCAGG' : exchange}:${coinPair}`);
        const prevMainSymbol = Object.keys(exchanges)
          .filter(name => exchanges[name].active)
          .map(exchange => `${exchange === 'Global' ? 'CCCAGG' : exchange}:${coinPair}`)[0];
        const removedSymbols = Object.keys(exchanges)
          .filter(name => !exchanges[name].active && name !== 'Global')
          .map(exchange => `${exchange === 'Global' ? 'CCCAGG' : exchange}:${coinPair}`);
        if (!this.tv || prevMainSymbol !== symbols[0]) {
          this.createChart(symbols, TV_CONFIG);
        } else {
          if (removedSymbols.length > 0) {
            removedSymbols.forEach(symbol => {
              if (this.studyIds[symbol]) {
                this.tv.chart().removeEntity(this.studyIds[symbol]);
                delete this.studyIds[symbol];
              }
            });
          }

          symbols.forEach((symbol, idx) => {
            if (idx !== 0 && !this.studyIds[symbol]) {
              this.studyIds[symbol] = this.tv.chart().createStudy('Overlay', true, false, [symbol], null, {
                style: 2,
                'lineStyle.color': `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                width: 2
              });
            }
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  componentWillUnmount() {
    if (this.tv && !this.tv.remove) {
      console.error(new Error('Method undefined this.tv.removed'));
      return;
    }

    try {
      this.tv.remove();
    } catch (err) {
      console.log(err.message);
    }
    this.isSubscribed = false;
  }

  createChart = (symbols, overrides) => {
    try {
      const chartOptions = {
        symbol: symbols[0],
        interval: '1',
        container_id: 'tv_chart_container',
        datafeed: DataFeed,
        library_path: 'trading_view/',
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        debug: false,
        custom_indicators_getter: customIndicatorsGetter,
        ...overrides
      };

      this.tv = new TradingView.widget(chartOptions);

      this.tv.onChartReady(() => {
        symbols.forEach((symbol, idx) => {
          if (idx !== 0) {
            this.studyIds[symbol] = this.tv.chart().createStudy('Overlay', true, false, [symbol], null, {
              style: 2,
              'lineStyle.color': `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              width: 2
            });
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { isCoinListOpen } = this.props;
    const { isLoading } = this.state;

    return (
      <Wrapper isCoinListOpen={isCoinListOpen}>
        <ChartContainer>
          <ApTradingViewChart id="tv_chart_container" />
        </ChartContainer>

        {isLoading && <DataLoader width={100} height={100} />}
      </Wrapper>
    );
  }
}

export default compose(
  withSafeTimeout,
  inject(STORE_KEYS.TRADINGVIEWSTORE, STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.EXCHANGESSTORE]: { selectedExchange, exchanges },
      [STORE_KEYS.TRADINGVIEWSTORE]: { isCoinListOpen }
    }) => ({
      selectedExchange,
      exchanges,
      isCoinListOpen
    })
  )
)(BCTChart);
