import { observable, runInAction, reaction } from 'mobx';

class OrderBookStore {
  @observable isPricesByExchangeCCASorted = 0; // 0: default, 1: no exchanges, 2: several exchanges
  @observable base = ''; // incoming data feed's base coin
  @observable quote = ''; // incoming data feed's quote coin

  arbMode = false;

  constructor(instrumentStore, viewModeStore, marketsStore) {
    this.marketsStore = marketsStore;

    instrumentStore.instrumentsReaction((base = '', quote = '') => {
      if (!this.arbMode && !base.includes('F:') && !base.includes('S:')) {
        this.resetStore(base, quote);
      }
    }, true);

    reaction(
      () => ({
        arbMode: viewModeStore.arbMode
      }),
      ({ arbMode }) => {
        this.arbMode = arbMode;
        const base = instrumentStore.selectedBase;
        const baseSymbolName = (base || '').includes('F:') || (base || '').includes('S:');

        /**
         *  1) Arbitrage App
         *  2) MultiLeg Mode
         */
        if (arbMode || baseSymbolName) {
          this.base = 'ETH';
          this.quote = 'BTC';
        } else {
          this.base = instrumentStore.selectedBase;
          this.quote = instrumentStore.selectedQuote;
        }
      }
    );
  }

  resetStore = (base, quote) => {
    runInAction(() => {
      try {
        const newPair = this.marketsStore.markets[`${base}-${quote}`];
        const pair = newPair.split('-');
        if (pair.length === 2) {
          this.base = pair[0];
          this.quote = pair[1];
        } else {
          this.base = base;
          this.quote = quote;
        }
      } catch (e) {
        this.base = base;
        this.quote = quote;
      }

      this.isPricesByExchangeCCASorted = 0;

      const baseName = (base || '').replace('F:', '');
      const quoteName = (quote || '').replace('F:', '');
      this.fetchBestRates(`${baseName}-${quoteName}`);
    });
  };

  async fetchBestRates(symbol) {
    // https://rest.qa.bct.trade/api/exchange-prices/BTC-USDT
    const url = `https://rest.qa.bct.trade/api/exchange-prices/${symbol}`;

    try {
      const rawResponse = await fetch(url);
      const response = await rawResponse.json();

      runInAction(() => {
        const { data, ok } = response;

        if (ok !== 1) {
          this.isPricesByExchangeCCASorted = 1;
          return;
        }

        if (data && data.prices) {
          this.isPricesByExchangeCCASorted = data.prices.length > 0 ? 2 : 1;
        }
      });
    } catch (e) {
      console.log('[fetchBestRates error]', e);
    }
  }
}

export default (instrumentStore, viewModeStore, marketsStore) =>
  new OrderBookStore(instrumentStore, viewModeStore, marketsStore);
