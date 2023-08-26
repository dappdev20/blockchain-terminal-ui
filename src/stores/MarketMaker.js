import React from 'react';
import { observable, action } from 'mobx';
import { OrderRequestBestPrice } from '@/lib/bct-ws';

export const orderFormToggleKeys = {
  onToggleKey: 'on',
  offToggleKey: 'off'
};

class MarketMaker {
  @observable toggleMode = orderFormToggleKeys.offToggleKey;
  snackbar = null;

  constructor(snackbar) {
    this.snackbar = snackbar;
  }

  @action.bound toggleViewMode() {
    this.toggleMode =
      this.toggleMode === orderFormToggleKeys.offToggleKey
        ? orderFormToggleKeys.onToggleKey
        : orderFormToggleKeys.offToggleKey;
  }

  @action.bound showOrderForm() {
    this.toggleMode = orderFormToggleKeys.onToggleKey;
  }

  @action.bound showOrderFormWith(mode) {
    this.toggleMode = mode;
  }

  @action.bound
  requestMarketTrading(payload) {
    OrderRequestBestPrice(payload)
      .then(res => {
        this.snackbar({
          message: () => (
            <span>
              <b>{res.result}</b>
            </span>
          )
        });
      })
      .catch(err => {
        this.snackbar({
          message: () => (
            <span>
              <b>{err.result}</b>
            </span>
          )
        });
      });
  }
}

export default snackbar => {
  const store = new MarketMaker(snackbar);
  return store;
};
