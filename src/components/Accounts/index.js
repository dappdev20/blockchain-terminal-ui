import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import { IcExitFullScreen, ExitFullScreenWrapper } from '@/components/OrderHistoryAdv/Components';
import { MODE_KEYS } from '@/config/constants';
import { Wrapper } from './styles';
import Information from './Information';
import MainContent from './MainTable';

const injectProps = compose(
  inject(STORE_KEYS.YOURACCOUNTSTORE, STORE_KEYS.VIEWMODESTORE),
  observer,
  withProps(({ [STORE_KEYS.YOURACCOUNTSTORE]: { getExchangeBalances } }) => ({
    getExchangeBalances
  }))
);

class AccountSection extends React.PureComponent {
  state = {
    selectedCurrencies: '',
    selectedExchanges: '',
    selectedTotalCurrency: ''
  };

  componentDidMount() {
    this.props.getExchangeBalances();
  }

  toggle = (arr, obj) => {
    arr.includes(obj) ? arr.splice(arr.indexOf(obj), 1) : arr.push(obj);
    return arr;
  };

  handleCurrencyChange = currency => {
    this.setState({ selectedCurrencies: currency === 'All currencies' ? '' : currency });
  };

  handleExchangeChange = exchange => {
    this.setState({ selectedExchanges: exchange === 'All exchanges' ? '' : exchange });
  };

  handleTotalCurrencyChange = currency => {
    this.setState({ selectedTotalCurrency: currency });
  };

  handleExitFullScreen = () => {
    this.props[STORE_KEYS.VIEWMODESTORE].setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
  };

  render() {
    const { selectedCurrencies, selectedExchanges, selectedTotalCurrency } = this.state;
    return (
      <Wrapper>
        <ExitFullScreenWrapper onClick={this.handleExitFullScreen}>
          <IcExitFullScreen />
        </ExitFullScreenWrapper>

        <Information
          selectedCurrencies={selectedCurrencies}
          selectedExchanges={selectedExchanges}
          selectedTotalCurrency={selectedTotalCurrency}
          onCurrencyChange={this.handleCurrencyChange}
          onExchangeChange={this.handleExchangeChange}
          onTotalCurrencyChange={this.handleTotalCurrencyChange}
        />

        <MainContent
          selectedCurrencies={selectedCurrencies}
          selectedExchanges={selectedExchanges}
          selectedTotalCurrency={selectedTotalCurrency}
        />
      </Wrapper>
    );
  }
}

export default injectProps(AccountSection);
