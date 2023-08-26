import React from 'react';
import { observable, action, computed, reaction } from 'mobx';

import { BUY_SIDE, SELL_SIDE } from '@/config/constants';
import { OrderRequestBestPriceBuy } from '@/lib/bct-ws';

class MarketOrderForm {
  @observable Amount = 0;
  @observable Total = 0;
  @observable baseSymbol = '';
  @observable quoteSymbol = '';
  @observable sliderMax = 0;
  @observable submitInProgress = false;
  side = null;
  snackbar = null;
  stockMode = false;

  constructor(side, snackbar) {
    this.side = side;
    this.snackbar = snackbar;
  }

  @action.bound setSliderMax(amount = 0) {
    this.sliderMax = amount;
  }

  @action.bound setAmount(amount = 0) {
    this.Amount = amount;
  }

  @action.bound setTotal(total) {
    this.Total = total;
  }

  @action.bound reset() {
    this.Amount = 0;
    this.Total = 0;
  }

  @action.bound setStockMode(sMode) {
    this.stockMode = sMode;
  }

  @computed get amount() {
    return this.Amount;
  }

  @computed get total() {
    return this.Total;
  }

  setSymbolPair(baseSymbol, quoteSymbol) {
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
  }

  @action.bound __submitProgressStart() {
    this.submitInProgress = true;
  }

  @action.bound __submitProgressStop() {
    this.submitInProgress = false;
  }

  @action.bound submitOrder = async () => {
    this.__submitProgressStart();

    const amount = parseFloat(this.side === BUY_SIDE ? this.Total : this.Amount);
    let baseWithoutPrefix = this.baseSymbol
      .split('F:')
      .join('')
      .split('S:')
      .join('');
    let quoteWithoutPrefix = this.quoteSymbol
      .split('F:')
      .join('')
      .split('S:')
      .join('');

    // TODO: remove hard coding of USDT. The backend currently supports
    // USDT-BCT and BCT-USDT market pairs
    if (baseWithoutPrefix === 'USD') baseWithoutPrefix = 'USDT';
    if (quoteWithoutPrefix === 'USD') quoteWithoutPrefix = 'USDT';

    // We hard code the side property of the payload since the market
    // order form always sells a specific amount of an asset the member
    // has on the exchange.
    const side = 'SELL';
    const market =
      this.side === BUY_SIDE
        ? `${quoteWithoutPrefix}-${baseWithoutPrefix}`
        : `${baseWithoutPrefix}-${quoteWithoutPrefix}`;

    const payload = {
      amount,
      market,
      side
    };

    this.showTradeState(amount, market, quoteWithoutPrefix, side);
    OrderRequestBestPriceBuy(payload)
      .then(response => {
        this.__submitProgressStop();
        this.showMarketOrder(response, amount, market);
        // TODO: update latest post-trade balances and trade history
      })
      .catch(err => {
        this.__submitProgressStop();
        this.showTradeMsg(`Market order failed: ${err.message}`);
      });
  };

  @action.bound showTradeState(amount, market, quote, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{this.side} Market order submitted!</b>
          </span>{' '}
          <br />
          <br />
          <span>
            <b>Market:</b> {market}
          </span>{' '}
          <br />
          <span>
            <b>Amount:</b> {amount} {quote}
          </span>{' '}
          <br />
        </>
      ),
      snackbarPositionType
    });
  }

  @action.bound showMarketOrder(response, amount, market) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{this.side} Market order succeeded!</b>
          </span>{' '}
          <br />
          <br />
          <span>
            <b>Market:</b> {market}
          </span>{' '}
          <br />
          <span>
            <b>Amount:</b> {amount}
          </span>{' '}
          <br />
        </>
      )
    });
  }

  @action.bound showTradeMsg(msg, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{msg}</b>
          </span>
        </>
      ),
      snackbarPositionType
    });
  }
}

class MarketOrderStore {
  @observable OrderFormBuy = null;
  @observable OrderFormSell = null;
  accountStoreRef = null;
  fiatCurrencyStoreRef = null;
  basicCurrency = 'BTC';

  constructor(yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar) {
    this.accountStoreRef = yourAccountStore;
    this.fiatCurrencyStoreRef = fiatCurrencyStore;

    this.OrderFormBuy = new MarketOrderForm(BUY_SIDE, snackbar.Snackbar);
    this.OrderFormSell = new MarketOrderForm(SELL_SIDE, snackbar.Snackbar);

    instrumentsReaction((baseSymbol, quoteSymbol) => {
      this.baseSymbol = baseSymbol;
      this.basicCurrency = quoteSymbol;
      this.OrderFormBuy.reset();
      this.OrderFormBuy.setSymbolPair(this.baseSymbol, this.basicCurrency);
      this.OrderFormSell.reset();
      this.OrderFormSell.setSymbolPair(this.baseSymbol, this.basicCurrency);
    });

    this.accountStoreRef.balancesReaction(({ baseCoinBalance, quoteCoinBalance }) => {
      this.OrderFormBuy.setTotal(quoteCoinBalance);
      this.OrderFormBuy.setSliderMax(quoteCoinBalance);
      this.OrderFormBuy.__submitProgressStop();
      this.OrderFormSell.setAmount(baseCoinBalance);
      this.OrderFormSell.setSliderMax(baseCoinBalance);
      this.OrderFormSell.__submitProgressStop();
    }, true);

    reaction(
      () => ({
        stockMode: fiatCurrencyStore.stockMode
      }),
      stockObj => {
        this.OrderFormBuy.setStockMode(stockObj.stockMode);
        this.OrderFormSell.setStockMode(stockObj.stockMode);
      }
    );

    orderBookBreakDownStore.priceReaction(midPrice => {
      const price = midPrice;
      this.OrderFormBuy.setAmount(price > 0 ? this.OrderFormBuy.Total / price : 0);
      this.OrderFormSell.setTotal(this.OrderFormSell.Amount * price);
    });
  }
}

export default (yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar) => {
  return new MarketOrderStore(
    yourAccountStore,
    instrumentsReaction,
    orderBookBreakDownStore,
    fiatCurrencyStore,
    snackbar
  );
};
