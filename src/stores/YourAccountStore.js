import { observable, action, computed, toJS, reaction } from 'mobx';
import { findIndex, partial } from 'lodash';
import { PositionRequest, PositionReply, ResetDemoBalancesRequest, GetExchangeBalances } from '../lib/bct-ws';

import { ClientId } from '../config/constants';
import {
  normalizeYourAccountPositionDataWithAllCoins,
  registerForPositionReplies,
  updatePosition,
  updatePositionError
} from './utils/YourAccountStoreUtils';

class YourAccountStore {
  @observable.shallow CoinsForWallet = [];
  @observable isCoinsForWalletLoaded = false;
  @observable.shallow PortfolioData = [];
  @observable storeCredit = 0;
  @observable PortfolioValue = null;
  @observable.shallow PortfolioPieChartData = [];
  @observable.shallow baseCoins = [];
  @observable.shallow coinsInMyWallet = [];

  @observable baseCoinIndex = 0;
  @observable baseSelectedCoin = '';
  @observable quoteSelectedCoin = '';
  @observable baseCoinPrice = 0;
  @observable quoteCoinPrice = 0;
  @observable changeInPercent = 0;
  @observable resetWalletTable = false;
  @observable isSendFormOpened = false;
  @observable baseCoinBalance = 0;
  @observable quoteCoinBalance = 0;
  @observable isPositionLoaded = false;

  // Set default C1 = USD
  @observable selectedCoin = 'F:USD';

  @observable isNewUser = null;
  @observable exchangeBalances = [];
  @observable memberInfo = null;

  @observable isResetAccount = false;

  coinsInterval = null;
  instrumentStoreRef = null;
  arbMode = false;

  isRecentPositionPassed = true;
  timerHandleForRecentPositionCheck = null;
  MAX_LIMIT_RECENT_CHECK = 30;

  requestPositionTimeout = null;

  constructor(instrumentStore) {
    this.getExchangeBalances();

    registerForPositionReplies(
      PositionReply,
      localStorage.getItem('authClientId') || ClientId,
      partial(updatePosition, this.updateYourAccountStoreData),
      updatePositionError
    );

    // Get selected base coin index in wallet table
    instrumentStore.instrumentsReaction(async (base, quote) => {
      this.baseSelectedCoin = base;
      this.quoteSelectedCoin = quote;
      this.setSelectedCoinData();
    }, true);

    instrumentStore.baseCoinsReaction(bases => {
      this.CoinsForWallet = bases;
      this.baseCoins = this.filterList(bases);
      if (this.baseCoins && this.baseCoins.length > 0) {
        PositionRequest(localStorage.getItem('authClientId') || ClientId);
      }

      // set coins in my wallet when only it is logged in.
      const isLoggedIn = localStorage.getItem('signedin');
      if (isLoggedIn) this.setCoinInMyWallet();
    });

    this.instrumentStoreRef = instrumentStore;

    this.selectedCoin = 'BTC';
    this.isRecentPositionPassed = true;
  }

  /**
   *  Remove BCT/TUSD from lists
   */
  filterList = list =>
    list.filter(
      ({ symbol } = {}) =>
        symbol !== 'BCT' && symbol !== 'TUSD' && symbol !== 'S:USD' && symbol !== 'KRWETH' && symbol !== 'KRWBTC'
    );

  /**
   * Get coins in my wallet as MAP array
   * This builds top group of dropdown, removing items in top group from bottom group.
   */
  setCoinInMyWallet() {
    if (this.baseCoins.length === 0) return;
    this.coinsInMyWallet = [];
    for (let i = 0; i < this.PortfolioData.length; i++) {
      if (this.PortfolioData[i] && Number.parseFloat(this.PortfolioData[i].Position) > 0.0001) {
        // low limit is 0.0001
        // coin is in wallet, if baseList has it, remove from base list and add here, if not, just add new disabled one to list.
        const symbol = this.PortfolioData[i].Coin || '';

        // Disabled TopGroupItems, 2019-01-11
        const index = this.baseCoins.findIndex(x => x.symbol === symbol);
        if (index !== -1) {
          this.coinsInMyWallet.push({
            ...this.baseCoins[index],
            position: this.PortfolioData[i].Position
          });
        }
      }
    }
  }

  @computed.struct
  get portfolioData() {
    return toJS(this.PortfolioData);
  }

  @computed.struct
  get portfolioPieChartData() {
    return toJS(this.PortfolioPieChartData);
  }

  @action.bound
  updateYourAccountStoreData(Positions) {
    const YourAccountPositions = normalizeYourAccountPositionDataWithAllCoins(Positions, this.CoinsForWallet);

    const isLoggedIn = localStorage.getItem('signedin');
    if (!isLoggedIn) {
      this.isNewUser = true;
      this.PortfolioValue = null;
    } else {
      this.PortfolioValue = Positions;
      this.isNewUser = this.PortfolioValue.length === 0;
    }
    this.isPositionLoaded = Positions.length > 0;

    if (YourAccountPositions.length > 0) {
      this.PortfolioData = YourAccountPositions;
      this.instrumentStoreRef.setActivePostions(Positions);

      /**
       *  Get Store Credit(BCT balance)
       */
      const bctIndex = findIndex(this.PortfolioData, { Coin: 'BCT' });
      if (bctIndex !== -1) {
        this.storeCredit = (this.PortfolioData[bctIndex] && this.PortfolioData[bctIndex].Amount) || 0;
      } else {
        this.storeCredit = 0;
      }

      this.setSelectedCoinData();
      this.setCoinInMyWallet();
    }
  }

  @action.bound setSelectedCoinData = () => {
    let basePortfolioData;
    let quotePortfolioData;

    if (!this.baseSelectedCoin || !this.quoteSelectedCoin) return;

    try {
      for (let i = 0; i < this.PortfolioData.length; i++) {
        if (this.PortfolioData[i] && this.PortfolioData[i].Coin === this.baseSelectedCoin) {
          basePortfolioData = this.PortfolioData[i];
          this.baseCoinPrice = this.PortfolioData[i].Price;
          this.baseCoinBalance = this.PortfolioData[i].Position;
        }
        if (this.PortfolioData[i] && this.PortfolioData[i].Coin === this.quoteSelectedCoin) {
          quotePortfolioData = this.PortfolioData[i];
          this.quoteCoinPrice = this.PortfolioData[i].Price;
          this.quoteCoinBalance = this.PortfolioData[i].Position;
        }
        if (basePortfolioData && quotePortfolioData) break;
      }

      if (basePortfolioData && quotePortfolioData) {
        this.baseCoinPrice = basePortfolioData.Price;
        this.quoteCoinPrice = quotePortfolioData.Price;

        const baseCoinCurrentPrice = Number.parseFloat(basePortfolioData.Price);
        const baseCoinPrevPrice =
          Number.parseFloat(basePortfolioData.Price) - Number.parseFloat(basePortfolioData.Change);
        const quoteCoinCurrentPrice = Number.parseFloat(quotePortfolioData.Price);
        const quoteCoinPrevPrice =
          Number.parseFloat(quotePortfolioData.Price) - Number.parseFloat(quotePortfolioData.Change);

        const prevRate = quoteCoinPrevPrice > 0 ? baseCoinPrevPrice / quoteCoinPrevPrice : 0;
        const currentRate = quoteCoinCurrentPrice > 0 ? baseCoinCurrentPrice / quoteCoinCurrentPrice : 0;

        this.changeInPercent = prevRate > 0 ? (currentRate / prevRate - 1) * 100 : 0;
      }
    } catch (err) {
      console.log(err);
    }
  };

  balancesReaction = (reactionHandler, fireImmediately = true) => {
    return reaction(
      () => ({
        baseCoinBalance: this.baseCoinBalance,
        quoteCoinBalance: this.quoteCoinBalance
      }),
      data => reactionHandler(data),
      { fireImmediately }
    );
  };

  @action.bound getExchangeBalances = async () => {
    const balances = await GetExchangeBalances();
    this.exchangeBalances = balances.data;
  };

  @action.bound
  resetWalletTableState() {
    this.resetWalletTable = !this.resetWalletTable;
  }

  @action.bound resetDemoBalances() {
    ResetDemoBalancesRequest().then(() => {
      this.isResetAccount = true;
    });
  }

  @action.bound setSelectedCoin(coin) {
    this.selectedCoin = coin;
  }

  @action.bound setSendFormState(mode) {
    this.isSendFormOpened = mode;
  }

  requestPosition() {
    setTimeout(PositionRequest(localStorage.getItem('authClientId') || ClientId), 500);
  }

  requestPositionWithReply() {
    registerForPositionReplies(
      PositionReply,
      localStorage.getItem('authClientId') || ClientId,
      partial(updatePosition, this.updateYourAccountStoreData),
      updatePositionError
    );

    this.baseCoinIndex = 0;

    setTimeout(PositionRequest(localStorage.getItem('authClientId') || ClientId), 500);
  }

  @action.bound getPriceOf(coin) {
    for (let i = 0; i < this.PortfolioData.length; i++) {
      if (this.PortfolioData[i] && this.PortfolioData[i].Coin === coin) {
        return this.PortfolioData[i].Price;
      }
    }
    return 0;
  }

  @action.bound getPositionOf(coin) {
    for (let i = 0; i < this.PortfolioData.length; i++) {
      if (this.PortfolioData[i] && this.PortfolioData[i].Coin === coin) {
        return this.PortfolioData[i].Position;
      }
    }
    return 0;
  }
}

export default instrumentStore => {
  return new YourAccountStore(instrumentStore);
};
