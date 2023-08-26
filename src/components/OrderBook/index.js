import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';

import OrderBookTable from './OrderBookTable';

class OrderBook extends Component {
  setSettingsExchangeViewMode = () => {
    const {
      isLoggedIn,
      isUserDropDownOpen,
      setUserDropDownOpen,
      setSettingsExchangeViewMode,
      setAppStoreDropDownOpen
    } = this.props;

    if (isLoggedIn) {
      setUserDropDownOpen(!isUserDropDownOpen);
      setSettingsExchangeViewMode(true);
      setAppStoreDropDownOpen(false);
    }
  };

  render() {
    return <OrderBookTable setSettingsExchangeViewMode={this.setSettingsExchangeViewMode} />;
  }
}

const withOrderInstruments = compose(
  inject(
    STORE_KEYS.ORDERBOOKBREAKDOWN,
    STORE_KEYS.ORDERENTRY,
    STORE_KEYS.EXCHANGESSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.CONVERTSTORE,
    STORE_KEYS.TELEGRAMSTORE
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: {
        setSettingsExchangeViewMode,
        setAppStoreDropDownOpen,
        setPageIndexOfSmart,
        isUserDropDownOpen,
        setUserDropDownOpen
      },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
    }) => ({
      setSettingsExchangeViewMode,
      setAppStoreDropDownOpen,
      setPageIndexOfSmart,
      isUserDropDownOpen,
      setUserDropDownOpen,
      isLoggedIn
    })
  )
);

export default withOrderInstruments(OrderBook);
