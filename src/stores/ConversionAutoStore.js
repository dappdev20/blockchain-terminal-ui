import React from 'react';
import { observable, action, reaction } from 'mobx';
import {
  AutoConversionRequest,
  ListAutoConversionsRequest,
  RunAutoConversionRequest,
  PauseAutoConversionRequest
} from '@/lib/bct-ws';
import { BUY_SIDE, SELL_SIDE } from '@/config/constants';

export const arbStateKeys = {
  ARB_NONE: 'none',
  ARB_LOAD: 'loading',
  ARB_PLAN: 'plan',
  ARB_EXEC: 'execute',
  ARB_RUN: 'run',
  ARB_SETT: 'settle',
  ARB_DONE: 'done'
};

export const arbModeKeys = {
  AMODE_BTC: 'btc',
  AMODE_USD: 'usd',
  AMODE_PORTFOLIO: 'portfolio'
};

class ConversionAutoStore {
  @observable arbState;
  @observable activeCoin = 'F:USD';
  @observable activeCoinETHRate = 1;
  @observable isHoverPortfolio = false;
  @observable autoConversionId = 0;
  @observable arbitrageMode = arbModeKeys.AMODE_BTC;

  snackbar = null;
  baseSymbol = '';
  quoteSymbol = '';
  accountStoreRef = null;
  fiatCurrencyStoreRef = null;
  side = null;
  isArbStarted = false;
  coinsInMyWallet = [];
  arbTimerHandler = null;
  resetTimerHandler = null;

  constructor(yourAccountStore, instrumentsReaction, snackbar, viewModeStore, fiatCurrencyStore) {
    this.accountStoreRef = yourAccountStore;
    this.snackbar = snackbar.Snackbar;
    this.fiatCurrencyStoreRef = fiatCurrencyStore;

    instrumentsReaction((baseSymbol, quoteSymbol) => {
      this.baseSymbol = baseSymbol;
      this.quoteSymbol = quoteSymbol;
    });

    this.setAutoConversion();

    reaction(
      () => ({
        arbMode: viewModeStore.arbMode
      }),
      arbObj => {
        if (arbObj.arbMode && this.autoConversionId > 0) {
          // show notification
          this.showTradeStep(`${this.arbitrageMode.toUpperCase()} Arbitrage is Started`);

          // start arb
          this.side = SELL_SIDE;
          if (this.arbitrageMode === arbModeKeys.AMODE_BTC || this.arbitrageMode === arbModeKeys.AMODE_USD) {
            const coin = this.arbitrageMode === arbModeKeys.AMODE_BTC ? 'BTC' : 'F:USD';
            RunAutoConversionRequest(this.autoConversionId, coin)
              .then(data => {
                if (data.Status === 'success') {
                  clearTimeout(this.arbTimerHandler);
                  this.arbTimerHandler = setTimeout(() => {
                    this.isArbStarted = true;
                    this.setArbState(arbStateKeys.ARB_SETT);
                  }, 3000);
                } else if (data.Status === 'fail') {
                  this.showTradeStep(data.Message);
                }
              })
              .catch(() => {
                this.showTradeStep('Running Auto Conversion is Failed.');
              });
          } else {
            clearTimeout(this.arbTimerHandler);
            this.arbTimerHandler = setTimeout(() => {
              this.isArbStarted = true;
              this.setArbState(arbStateKeys.ARB_SETT);
              this.start();
            }, 3000);
          }
        } else if (this.autoConversionId > 0) {
          this.isArbStarted = false;
          PauseAutoConversionRequest(this.autoConversionId).catch(() => {
            this.showTradeStep('Pausing Auto Conversion is Failed.');
          });
        }
      }
    );

    reaction(
      () => ({
        coinsInMyWallet: yourAccountStore.coinsInMyWallet
      }),
      walletObj => {
        this.coinsInMyWallet = walletObj.coinsInMyWallet;
        // determine arbitrage mode
        const length = this.coinsInMyWallet.length;
        if (length === 1 && this.coinsInMyWallet[0]) {
          if (this.coinsInMyWallet[0].Coin === 'BTC') {
            this.arbitrageMode = arbModeKeys.AMODE_BTC;
          }
          if (this.coinsInMyWallet[0].Coin === 'F:USD') {
            this.arbitrageMode = arbModeKeys.AMODE_USD;
          }
        } else if (length > 1) {
          this.arbitrageMode = arbModeKeys.AMODE_PORTFOLIO;
        }

        if (this.isArbStarted && this.arbitrageMode !== arbModeKeys.AMODE_PORTFOLIO) {
          this.start();
        }
      }
    );

    reaction(
      () => ({
        isResetAccount: yourAccountStore.isResetAccount
      }),
      accountObj => {
        if (accountObj.isResetAccount) {
          this.autoConversionId = 0;
          yourAccountStore.isResetAccount = false;

          clearTimeout(this.resetTimerHandler);
          this.resetTimerHandler = setTimeout(() => {
            this.setAutoConversion();
          }, 5000);
        }
      }
    );
  }

  getAutoConversionList = () => {
    ListAutoConversionsRequest().then(data => {
      if (data && data.Status === 'success') {
        if (data.AutoConversions && data.AutoConversions.length > 0) {
          this.autoConversionId = data.AutoConversions[0].Id || 0;
          PauseAutoConversionRequest(this.autoConversionId);
        } else {
          this.autoConversionId = 0;
        }
      }
    });
  };

  setAutoConversion = () => {
    AutoConversionRequest('BTC', 'USDT', 1)
      .then(data => {
        if (data && data.Status === 'success') {
          this.autoConversionId = data.AutoConversionId || 0;
          PauseAutoConversionRequest(this.autoConversionId);
        } else if (data && data.Status === 'fail') {
          this.autoConversionId = 0;
          this.getAutoConversionList();
        }
      })
      .catch(() => {
        this.autoConversionId = 0;
        this.getAutoConversionList();
      });
  };

  @action.bound start = async () => {
    if (!this.isArbStarted) return;
    this.side = this.side !== SELL_SIDE ? SELL_SIDE : BUY_SIDE;

    if (this.side === BUY_SIDE) {
      await this.waitFor(4000);
      this.setArbState(arbStateKeys.ARB_LOAD);
      await this.waitFor(7000);
      if (this.isArbStarted) {
        this.setArbState(arbStateKeys.ARB_PLAN);
        await this.waitFor(4000);
      }
    } else {
      await this.waitFor(3000);
      if (this.isArbStarted) {
        this.setArbState(arbStateKeys.ARB_EXEC);
        await this.waitFor(3000);
      }
      if (this.isArbStarted) {
        this.setArbState(arbStateKeys.ARB_RUN);
        await this.waitFor(3000);
      }
      this.setArbState(arbStateKeys.ARB_SETT);
      await this.waitFor(6000);
    }

    if (this.arbitrageMode === arbModeKeys.AMODE_PORTFOLIO) {
      this.start();
    }
  };

  waitFor = delay => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  @action.bound setArbState(newArbState) {
    this.arbState = newArbState;
  }

  @action.bound setHoverPortfolio(mode) {
    this.isHoverPortfolio = mode;
  }

  @action.bound setActiveCoin(coin) {
    this.activeCoin = coin;
    this.fiatCurrencyStoreRef
      .getSpotRate(this.activeCoin, 'F:USD')
      .then(activeCoinETHRate => {
        this.activeCoinETHRate = 1 / activeCoinETHRate;
      })
      .catch(e => {
        console.log(e);
      });
  }

  @action.bound showTradeStep(msg) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{msg}</b>
          </span>
        </>
      )
    });
  }
}

export default (yourAccountStore, instrumentsReaction, snackbar, viewModeStore, fiatCurrencyStore) => {
  return new ConversionAutoStore(yourAccountStore, instrumentsReaction, snackbar, viewModeStore, fiatCurrencyStore);
};
