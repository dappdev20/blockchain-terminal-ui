/* eslint-disable */
import React from 'react';
import { observable, action, reaction } from 'mobx';

import { customDigitFormatWithNoTrim } from '@/utils';
import { ConversionRequest, PositionRequest } from '@/lib/bct-ws';
import { ClientId } from '@/config/constants';

class AutoSliderStore {
  @observable slidersHash = {};
  @observable activeAmount = 0;
  @observable activeSymbol = '';
  @observable totalBTCAmount = 0;
  @observable totalUSDAmount = 0;

  snackbar = null;
  accountStoreRef = null;
  fiatCurrencyStoreRef = null;
  coinsInMyWallet = [];
  lockSlider = false;

  constructor(yourAccountStore, snackbar, fiatCurrencyStore, portfolioStore) {
    this.accountStoreRef = yourAccountStore;
    this.fiatCurrencyStoreRef = fiatCurrencyStore;
    this.snackbar = snackbar.Snackbar;

    reaction(
      () => ({
        totalBTCAmount: portfolioStore.totalBTCAmount,
        totalUSDAmount: portfolioStore.totalUSDAmount
      }),
      portObj => {
        this.totalBTCAmount = portObj.totalBTCAmount;
        this.totalUSDAmount = portObj.totalUSDAmount;

        if (this.totalUSDAmount > 0 && this.totalBTCAmount > 0) {
          this.updatHashArray('BTC');
          this.updatHashArray('F:USD');
        }
      }
    );

    reaction(
      () => ({
        coinsInMyWallet: yourAccountStore.coinsInMyWallet
      }),
      walletObj => {
        this.coinsInMyWallet = walletObj.coinsInMyWallet;
        this.resetSliderHash();
        this.lockSlider = false;
      }
    );
  }

  resetSliderHash = () => {
    const newHash = this.slidersHash;
    for (let prop in newHash) {
      if (newHash.hasOwnProperty(prop)) {
        newHash[prop].valueSlider = 0;
      }
    }
    for (let i = 0; i < this.coinsInMyWallet.length; i++) {
      const coinObj = this.coinsInMyWallet[i];
      const symbol = coinObj.symbol;
      if (newHash[symbol]) {
        newHash[symbol].valueSlider = coinObj.position;
      }
    }

    this.slidersHash = newHash;
  };

  /**
   *  Update Hash array
   */
  @action.bound updatHashArray = async coin => {
    if (coin !== '' && coin !== null && this.slidersHash[coin] === undefined) {
      const rate = await this.fiatCurrencyStoreRef.getSpotRate(coin, 'F:USD');
      this.slidersHash = {
        ...this.slidersHash,
        [coin]: {
          price: rate,
          valueSlider: this.accountStoreRef.getPositionOf(coin) || 0
        }
      };
    }
    if (this.totalUSDAmount > 0 && this.totalBTCAmount > 0 && this.slidersHash[coin]) {
      const rate = this.slidersHash[coin].price || 0;
      let max = 0;
      if (coin !== 'BTC') {
        max = rate > 0 ? this.totalUSDAmount / rate : 0;
      } else {
        max = this.totalBTCAmount;
      }

      this.slidersHash = {
        ...this.slidersHash,
        [coin]: {
          ...this.slidersHash[coin],
          symbol: coin,
          maxSlider: max || 0
        }
      };
    }
  };

  /**
   *  AutoSlider UI events
   */
  @action.bound setAmountOf = (amt, coin) => {
    if (this.slidersHash[coin] && !this.lockSlider) {
      this.slidersHash = {
        ...this.slidersHash,
        [coin]: {
          valueSlider: amt
        }
      };
      this.activeSymbol = coin;
      this.activeAmount = amt;
    }
  };

  /**
   *  Auto Trading Module
   */
  @action.bound async proceedAutoTrade(isFullMode) {
    this.lockSlider = true;
    const c1Balance = this.accountStoreRef.getPositionOf(this.activeSymbol);
    let modeAmount = Math.abs(c1Balance - this.activeAmount);

    if (c1Balance > this.activeAmount && !isFullMode) {
      this.showNotiState(customDigitFormatWithNoTrim(modeAmount), 'SELL', this.activeSymbol);
      await this.waitFor(2000);
      const targetCurrency = this.activeSymbol === 'BTC' ? 'F:USD' : 'BTC';
      this.convertOrder(modeAmount, this.activeSymbol, targetCurrency);
    } else {
      this.showNotiState(customDigitFormatWithNoTrim(modeAmount), 'BUY', this.activeSymbol);
      const SUPPORTED_TSYM_CURRENCIES = ['BTC', 'USDT', 'F:USD', 'ETH'];

      for (let i = 0; i < this.coinsInMyWallet.length; i++) {
        const coinObj = this.coinsInMyWallet[i];
        if (coinObj.symbol !== this.activeSymbol) {
          if (!isFullMode) {
            const isSupportedCurrency =
              SUPPORTED_TSYM_CURRENCIES.includes(this.activeSymbol) ||
              SUPPORTED_TSYM_CURRENCIES.includes(coinObj.symbol);
            let mRate = 0;
            if (isSupportedCurrency) {
              mRate = await this.fiatCurrencyStoreRef.getSpotRate(this.activeSymbol, coinObj.symbol);
            }
            if (!isSupportedCurrency || mRate === 0) {
              const c1Rate = await this.fiatCurrencyStoreRef.getPriceOf(this.activeSymbol);
              const c2Rate = await this.fiatCurrencyStoreRef.getPriceOf(coinObj.symbol);
              mRate = c1Rate / c2Rate;
            }
            if (mRate === 0) {
              this.showTradeMsg(`${coinObj.symbol} to ${this.activeSymbol} Conversion Failed`);
              continue;
            }
            const totalAmount = coinObj.position / mRate;
            if (totalAmount >= modeAmount) {
              this.convertOrder(modeAmount * mRate, coinObj.symbol, this.activeSymbol);
              break;
            } else {
              this.convertOrder(coinObj.position, coinObj.symbol, this.activeSymbol);
              modeAmount = modeAmount - totalAmount;
            }
          } else {
            this.convertOrder(coinObj.position, coinObj.symbol, this.activeSymbol);
          }
        }
      }
    }
    this.lockSlider = false;
  }

  convertOrder = (size, Start, End) => {
    // this.showTradeState(size, Start, End, 'SELL');
    // await this.waitFor(2000);
    ConversionRequest(size, Start, End)
      .then(data => {
        try {
          const Message = data.Status.Message;
          const isSuccess = data.Status.IsSuccess;
          if (isSuccess) {
            const ConversionInfo = data.ConversionInfo;
            const Amount = ConversionInfo.Amount;
            const StartCoin = ConversionInfo.StartCoin;
            const EndCoin = ConversionInfo.EndCoin;
            const Rate = ConversionInfo.Rate;
            const Value = ConversionInfo.Value;
            this.showConversionState(Message, Amount, StartCoin, EndCoin, Rate, Value, this.side);
            setTimeout(PositionRequest(localStorage.getItem('authClientId') || ClientId), 500);
          } else {
            this.showTradeMsg(Message);
          }
        } catch (e) {
          this.showTradeMsg('Conversion failed');
          this.resetSliderHash();
        }
      })
      .catch(() => {
        this.showTradeMsg('Conversion failed');
        this.resetSliderHash();
      });
  };

  /**
   *  Notification for transaction status
   */
  showNotiState(size, side, symbol, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>Auto Convert Order Submitted!</b>
          </span>{' '}
          <br />
          <span>
            <b>{`${side} ${size} ${symbol}`}</b>
          </span>{' '}
          <span>
            <b>Amount:</b> {size} {symbol}
          </span>{' '}
          <span>
            <b>Symbol:</b> {symbol}
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

  @action.bound showConversionState(Message, Amount, StartCoin, EndCoin, Rate, Value, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{Message}</b>
          </span>{' '}
          <br />
          <span>
            <b>StartCoin:</b>
            <span>
              {customDigitFormatWithNoTrim(Amount, 10)} {StartCoin.replace(/F:|S:/, '')}
            </span>
          </span>{' '}
          <span>
            <b>EndCoin:</b>
            <span>
              {customDigitFormatWithNoTrim(Value, 10)} {EndCoin.replace(/F:|S:/, '')}
            </span>
          </span>{' '}
          <span>
            <b>Rate:</b> {customDigitFormatWithNoTrim(Rate, 15)}
          </span>
        </>
      ),
      snackbarPositionType
    });
  }

  @action.bound showTradeState(size, quote, base, side, snackbarPositionType) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{side} Order Submitted!</b>
          </span>{' '}
          <br />
          <span>
            <b>Side:</b> {`${quote}-${base}`}
          </span>{' '}
          <span>
            <b>Amount:</b> {size} {quote}
          </span>{' '}
        </>
      ),
      snackbarPositionType
    });
  }

  waitFor = delay => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };
}

export default (yourAccountStore, snackbar, fiatCurrencyStore, portfolioStore) => {
  return new AutoSliderStore(yourAccountStore, snackbar, fiatCurrencyStore, portfolioStore);
};
