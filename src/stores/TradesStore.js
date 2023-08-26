import { observable, reaction } from 'mobx';
import { getTrades } from '../lib/bct-ws';
import { getScreenInfo } from '@/utils';

class Trades {
  @observable History = [];

  isLoggedIn = false;
  isRealTrading = false;
  isMobileDevice = false;

  constructor(settingsStore, smsAuthStore) {
    this.isLoggedIn = smsAuthStore.isLoggedIn;
    this.isRealTrading = settingsStore.isRealTrading;
    this.isMobileDevice = getScreenInfo().isMobileDevice;

    reaction(
      () => smsAuthStore.isLoggedIn,
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn && !this.isMobileDevice) this.fetchTrades();
      },
      { fireImmediately: true }
    );

    reaction(
      () => settingsStore.isRealTrading,
      isRealTrading => {
        this.isRealTrading = isRealTrading;
        if (!this.isMobileDevice) this.fetchTrades();
      },
      { fireImmediately: true }
    );
  }

  fetchTrades() {
    // reset previous history while we fetch new data
    // TODO: expose a loading flag to add a loading spinner
    this.History = [];

    const payload = {
      // will tell Back end to fetch latest trade history from exchanges
      refreshExchangeData: true,
      // will populate trade history with simulated trades
      paperTrading: this.isRealTrading !== true
    };

    getTrades(payload)
      .then(res => {
        this.History = this.formatTrades(res.data);
      })
      .catch(() => {
        this.History = [];
      });
  }

  formatTrades(exchanges) {
    const trades = Object.keys(exchanges).map(name => exchanges[name]);
    return trades;
  }
}

export default (settingsStore, smsAuthStore) => {
  return new Trades(settingsStore, smsAuthStore);
};
