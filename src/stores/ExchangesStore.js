import React from 'react';
import { observable, action, reaction } from 'mobx';

import mockData from '@/mock/exchanges-data';
import ExchangeFields from '@/mock/exchange-fields-data';
import { AddExchange, RemoveExchange, GetConnectedExchanges } from '../lib/bct-ws';
import { REST_MARKET } from '../config/constants';

class ExchangesStore {
  @observable.shallow exchanges = { Global: { name: 'Global', active: true } };
  @observable.shallow marketExchanges = []; // All exchange services
  @observable selectedExchange = { name: 'Global', icon: '' };
  @observable isEmptyExchange = false;
  @observable exchangeSearchValue = '';
  @observable.shallow validMarketExchanges = []; // Available market exchanges for base-quote coins
  @observable.shallow connectedExchanges = [];
  snackbar = null;
  arbMode = false;
  isLoggedIn = false;
  isRealTrading = false;

  constructor(instrumentStore, settingsStore, snackbar, viewModeStore, smsAuthStore) {
    this.snackbar = snackbar;
    this.isLoggedIn = smsAuthStore.isLoggedIn;
    this.isRealTrading = settingsStore.isRealTrading;

    reaction(
      () => smsAuthStore.isLoggedIn,
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) this.getConnectedExchanges();
      },
      { fireImmediately: true }
    );

    reaction(
      () => settingsStore.isRealTrading,
      isRealTrading => {
        this.isRealTrading = isRealTrading;
      },
      { fireImmediately: true }
    );

    instrumentStore.instrumentsReaction((base, quote) => {
      let symbol = '';
      if (this.arbMode) {
        symbol = 'ETH-BTC';
      } else {
        const baseCoin = (base || '').replace('F:', '');
        const quoteCoin = (quote || '').replace('F:', '');
        symbol = `${baseCoin}-${quoteCoin}`;
      }
      this.fetchRealMarketExchanges(symbol);
    }, true);

    reaction(
      () => {
        return {
          arbMode: viewModeStore.arbMode
        };
      },
      ({ arbMode }) => {
        this.arbMode = arbMode;
        if (arbMode) {
          this.fetchRealMarketExchanges('ETH-BTC');
        }
      }
    );

    this.clearExchanges();
  }

  // TODO: Real Market supported by our platform. Need to get from BE.
  fetchRealMarketExchanges() {
    const marketExchanges = mockData.slice();
    const validMarketExchanges = [];
    const validExchangeKeys = Object.keys(ExchangeFields);

    validExchangeKeys.forEach(key => {
      const marketIdx = marketExchanges.findIndex(m => m.name === key);
      if (marketIdx > -1) {
        marketExchanges[marketIdx].status = 'active';
        validMarketExchanges.push(marketExchanges[marketIdx]);
      }
    });

    marketExchanges.sort((a, b) => {
      if (a.status < b.status) {
        return -1;
      }

      if (a.status > b.status) {
        return 1;
      }

      return 0;
    });

    this.marketExchanges = marketExchanges;
    this.validMarketExchanges = validMarketExchanges;
    this.isEmptyExchange = validExchangeKeys.length === 0;
  }

  // TODO: not using for now. But will be used after fixing the BE endpoint
  fetchMarketExchanges(symbol) {
    fetch(`${REST_MARKET}/api/exchanges/${symbol}`)
      .then(response => response.json())
      .then(res => {
        const marketExchanges = mockData.slice();
        const validMarketExchanges = [];

        Object.keys(res).forEach(key => {
          const marketIdx = marketExchanges.findIndex(m => m.name === res[key].name);
          if (marketIdx > -1) {
            marketExchanges[marketIdx].urls = res[key].urls;
            marketExchanges[marketIdx].status = 'active';
            validMarketExchanges.push(marketExchanges[marketIdx]);
          }
        });

        marketExchanges.sort((a, b) => {
          if (a.status < b.status) {
            return -1;
          }

          if (a.status > b.status) {
            return 1;
          }

          return 0;
        });

        this.marketExchanges = marketExchanges;

        this.validMarketExchanges = validMarketExchanges;

        if (Object.keys(res).length === 0) {
          this.isEmptyExchange = true;
        } else {
          this.isEmptyExchange = false;
        }
      })
      .catch(console.log);
  }

  // The API credentials should not ever be stored unobfuscated
  // anywhere in the application at any point
  @action.bound addExchange(payload) {
    // We verify new API credentials before storing them. In paper
    // trading mode this verification always succeeds when the
    // apiKeysValid flag is passed.
    if (this.isRealTrading) {
      payload.verifyExchange = true;
    } else {
      payload.paperTrading = {
        apiKeysValid: true
      };
    }

    return new Promise(resolve => {
      AddExchange(payload)
        .then(res => {
          // Obfuscates API credentials before storing them in application
          // state. It might be nice to retrieved obfuscated and validated
          // credential from BE in response to AddExchangeAccount. When the
          // page reloads, the FE retrieves obfuscated keys from the BE so
          // this obfuscation only needs to happen here.
          payload.apiKey = `${payload.apiKey.substr(0, 4)}-xxxxx`;
          payload.apiSecret = `${payload.apiSecret.substr(0, 4)}-yyyyy`;

          this.exchanges = {
            ...this.exchanges,
            [payload.exchange]: payload
          };

          this.snackbar({
            message: () => (
              <span>
                <b>Added {payload.exchange}</b>
              </span>
            )
          });

          this.setExchangeApiSynced(payload.exchange, true);

          resolve(res);
        })
        .catch(err => {
          this.snackbar({
            message: () => (
              <span>
                <b>{err.message}</b>
              </span>
            )
          });
        });
    });
  }

  @action.bound getConnectedExchanges = async () => {
    this.connectedExchanges = await GetConnectedExchanges();
    this.connectedExchanges.forEach(({ exchange, api_key, api_secret, password, uid }) => {
      let exchangeName = exchange.name;

      // Hack to determine exchange name expected by front-end
      if (exchange.name === 'okcoinusd') exchangeName = 'OKEX';
      if (exchange.name === 'huobipro') exchangeName = 'Huobi';

      if (!exchangeName) return;

      this.exchanges[exchangeName] = {
        enabled: true,
        apiSynced: true,
        apiKey: api_key,
        apiSecret: api_secret
      };

      if (password) this.exchanges[exchangeName].password = password;
      if (uid) this.exchanges[exchangeName].uid = uid;
    });
  };

  // The API credentials should not ever be stored unobfuscated
  // anywhere in the application at any point
  @action.bound removeExchange(key) {
    return new Promise((resolve, reject) => {
      // --- access to backend --- //
      RemoveExchange(key)
        .then(res => {
          // For usage of side effects
          const newExchanges = this.exchanges;
          delete newExchanges[key];
          this.exchanges = { ...newExchanges };

          this.snackbar({
            message: () => (
              <span>
                <b>Removed {key}</b>
              </span>
            )
          });

          resolve(res);
        })
        .catch(err => {
          this.snackbar({
            message: () => (
              <span>
                <b>{err.message}</b>
              </span>
            )
          });
          reject(err);
        });
    });
  }

  @action.bound setExchangeActive(key, value) {
    this.exchanges = {
      ...this.exchanges,
      [key]: {
        ...this.exchanges[key],
        active: value
      }
    };

    const isAllUnSelected = this.validMarketExchanges.every(
      exchange => !this.exchanges[exchange.name] || !this.exchanges[exchange.name].active
    );

    this.exchanges = {
      ...this.exchanges,
      Global: {
        ...this.exchanges.Global,
        active: isAllUnSelected
      }
    };
  }

  @action.bound setExchangeApiSynced(exchangeName, isSynced) {
    if (exchangeName === 'Global') {
      const keys = Object.keys(this.exchanges);
      let newExchanges = {};
      for (let i = 0; i < keys.length; i++) {
        newExchanges = {
          ...newExchanges,
          [keys[i]]: {
            ...this.exchanges[keys[i]],
            apiSynced: false
          }
        };
      }

      this.exchanges = {
        ...newExchanges,
        Global: {
          ...this.exchanges.Global,
          apiSynced: isSynced
        }
      };
    } else {
      this.exchanges = {
        ...this.exchanges,
        Global: {
          ...this.exchanges.Global,
          apiSynced: false
        },
        [exchangeName]: {
          ...this.exchanges[exchangeName],
          apiSynced: isSynced
        }
      };
    }
  }

  @action.bound setExchange(exchangeName) {
    if (exchangeName === 'Global') {
      this.selectedExchange = {
        name: 'Global',
        icon: ''
      };
    } else if (this.marketExchanges && this.marketExchanges.length > 0) {
      for (let i = 0; i < this.marketExchanges.length; i++) {
        if (this.marketExchanges[i].name.toLowerCase() === exchangeName.toLowerCase()) {
          this.selectedExchange = this.marketExchanges[i];
          break;
        }
      }
    }
  }

  @action.bound getActiveExchanges() {
    let activeExchange = '';
    let activeExchanges = 0;
    for (let i = 0; i < this.marketExchanges.length; i++) {
      if (this.exchanges[this.marketExchanges[i].name] && this.exchanges[this.marketExchanges[i].name].active) {
        activeExchanges++;
        activeExchange = this.marketExchanges[i].name;
      }
    }

    const exchangesKeys = Object.keys(this.exchanges);

    const isGlobal =
      !exchangesKeys.length ||
      !exchangesKeys.some(name => this.exchanges[name].active) ||
      (this.exchanges.Global && this.exchanges.Global.active);

    if (isGlobal) {
      return 'Global';
    }

    return activeExchanges === 0
      ? this.validMarketExchanges.length === 1
        ? this.validMarketExchanges[0].name
        : `${this.validMarketExchanges.length} Exchanges`
      : activeExchanges === 1
      ? activeExchange
      : `${activeExchanges} Exchanges`;
  }

  @action.bound setExchangeSearchValue(value) {
    this.exchangeSearchValue = value;
  }

  @action.bound clearExchanges() {
    this.exchanges = { Global: { name: 'Global', active: true } };
  }
}

export default (instrumentStore, settingsStore, snackbar, viewModeStore, smsAuthStore) => {
  const store = new ExchangesStore(instrumentStore, settingsStore, snackbar, viewModeStore, smsAuthStore);
  return store;
};
