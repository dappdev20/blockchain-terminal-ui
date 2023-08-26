import React from 'react';
import { observable, action, computed } from 'mobx';

import { BUY_SIDE, SELL_SIDE, ClientId } from '@/config/constants';
import { ConversionRequest, PositionRequest } from '@/lib/bct-ws';
import { customDigitFormatWithNoTrim } from '@/utils';

class ConvertEntryForm {
  @observable Amount = 0;
  @observable Total = 0;
  @observable baseSymbol = '';
  @observable quoteSymbol = '';
  @observable sliderMax = 0;
  @observable submitInProgress = false;
  side = null;
  snackbar = null;

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

  waitFor = delay => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  @action.bound submitOrder = async () => {
    this.__submitProgressStart();
    await this.waitFor(5000);

    const size = this.side === BUY_SIDE ? this.Total : this.Amount;
    const quote = this.side === BUY_SIDE ? this.quoteSymbol : this.baseSymbol;
    const base = this.side === BUY_SIDE ? this.baseSymbol : this.quoteSymbol;
    this.showTradeState(size, quote, base, this.side);
    ConversionRequest(size, quote, base)
      .then(data => {
        try {
          const Message = data.Status.Message;
          const isSuccess = data.Status.IsSuccess;
          if (isSuccess) {
            const {
              ConversionInfo: { Amount, StartCoin, EndCoin, Rate, Value }
            } = data;
            this.showConversionState(Message, Amount, StartCoin, EndCoin, Rate, Value, this.side);
            // update Position
            setTimeout(PositionRequest(localStorage.getItem('authClientId') || ClientId), 500);
          } else {
            this.showTradeMsg(Message);
          }
        } catch (e) {
          console.log(e);
          this.showTradeMsg('Conversion failed');
          this.__submitProgressStop();
        }
      })
      .catch(err => {
        console.log(err);
        this.showTradeMsg('Conversion failed');
        this.__submitProgressStop();
      });
  };

  @action.bound showTradeState(size, quote, base, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{this.side} Spot Order Submitted!</b>
          </span>{' '}
          <br />
          <span>
            <b>Side:</b> {`${quote.replace(/F:|S:/, '')}-${base.replace(/F:|S:/, '')}`}
          </span>{' '}
          <span>
            <b>Amount:</b> {size} {quote.replace(/F:|S:/, '')}
          </span>{' '}
        </>
      ),
      snackbarPositionType
    });
  }

  @action.bound showConversionState(message, amount, quote, base, rate, value, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{message}</b>
          </span>{' '}
          <br />
          <span>
            <b>StartCoin:</b>
            <span>
              {customDigitFormatWithNoTrim(amount, 10)} {quote.replace(/F:|S:/, '')}
            </span>
          </span>{' '}
          <span>
            <b>EndCoin:</b>
            <span>
              {customDigitFormatWithNoTrim(value, 10)} {base.replace(/F:|S:/, '')}
            </span>
          </span>{' '}
          <span>
            <b>Rate:</b> {customDigitFormatWithNoTrim(rate, 15)}
          </span>{' '}
        </>
      ),
      snackbarPositionType
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

class ConversionEntryStore {
  @observable OrderFormBuy = null;
  @observable OrderFormSell = null;
  accountStoreRef = null;
  fiatCurrencyStoreRef = null;
  basicCurrency = 'BTC';
  price = 1;

  constructor(yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar) {
    this.accountStoreRef = yourAccountStore;
    this.fiatCurrencyStoreRef = fiatCurrencyStore;
    this.OrderFormBuy = new ConvertEntryForm(BUY_SIDE, snackbar.Snackbar);
    this.OrderFormSell = new ConvertEntryForm(SELL_SIDE, snackbar.Snackbar);

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
      this.OrderFormBuy.setAmount(this.price > 0 ? this.OrderFormBuy.Total / this.price : 0);
      this.OrderFormBuy.__submitProgressStop();
      this.OrderFormSell.setAmount(baseCoinBalance);
      this.OrderFormSell.setSliderMax(baseCoinBalance);
      this.OrderFormSell.setTotal(this.OrderFormSell.Amount * this.price);
      this.OrderFormSell.__submitProgressStop();
    }, true);

    orderBookBreakDownStore.priceReaction(midPrice => {
      this.price = midPrice;
      this.OrderFormBuy.setAmount(this.price > 0 ? this.OrderFormBuy.Total / this.price : 0);
      this.OrderFormSell.setTotal(this.OrderFormSell.Amount * this.price);
    });
  }
}

export default (yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar) => {
  return new ConversionEntryStore(
    yourAccountStore,
    instrumentsReaction,
    orderBookBreakDownStore,
    fiatCurrencyStore,
    snackbar
  );
};
