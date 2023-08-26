import { action, observable, reaction } from 'mobx';
import { mockCountries } from '@/mock/countries';

export const INITIAL_PRICES_LENGTH = 91;
export const MAX_PRICES_LENGTH = 500;

class PriceChartStore {
  @observable price = 0;
  @observable usdOfBTC = 1;

  base = null;
  quote = null;
  fiatPrice = 1;
  fiatMode = true;
  countries = [];

  // store refs
  accountStoreRef = null;
  fiatCurrencyStoreRef = null;

  constructor(
    instrumentStore,
    settingsStore,
    marketsStore,
    yourAccountStore,
    fiatCurrencyStore,
    orderBookBreakDownStore
  ) {
    if (settingsStore && settingsStore.price) {
      this.fiatPrice = settingsStore.price;
    }

    instrumentStore.instrumentsReaction(async (base, quote) => {
      try {
        const newPair = marketsStore.markets[`${base}-${quote}`];
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

      this.fiatMode = quote === 'USDT';
      this.price = 0;
      this.fetchSpPrice();
    }, true);

    // Make price data based by orderbook midPrice
    orderBookBreakDownStore.priceReaction(price => {
      this.price = price;
    });

    reaction(
      () => ({
        price: settingsStore.price
      }),
      settings => {
        this.fiatPrice = settings.price;
      }
    );

    this.accountStoreRef = yourAccountStore;
    this.fiatCurrencyStoreRef = fiatCurrencyStore;
    setInterval(this.fetchFiatPrice, 2 * 60 * 60 * 1000);
    this.fetchFiatPrice();
  }

  fetchFiatPrice = async () => {
    // Todo: We will use FiatCurrencyStore instead of direct access here
    if (process.env.NODE_ENV === 'production') {
      const url = '/price';

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.countries = data;
        })
        .catch(console.log);
    } else {
      this.countries = mockCountries;
    }
  };

  getPriceOf = symbol => {
    // Todo: We will use FiatCurrencyStore instead of direct access here
    if (symbol && symbol.indexOf('F:') !== -1) {
      const curr = (symbol || '').replace('F:', '');
      if (this.countries && this.countries.length > 0) {
        const country = this.countries.find(country => country.currencyCode === curr);
        if (country) {
          return 1 / country.price;
        }
      }
      return 1;
    }
    return this.accountStoreRef.getPriceOf(symbol);
  };

  @action.bound getStockPriceOf = symbol => {
    // Todo: We will use FiatCurrencyStore instead of direct access here
    return new Promise(resolve => {
      fetch(`https://sandbox.iexapis.com/v1/stock/${symbol}/price?token=Tpk_d3a0c378cfcc4c7eb3a1ae46268ed802`)
        .then(response => response.json())
        .then(data => {
          resolve(data);
        })
        .catch(() => {
          resolve(1);
        });
    });
  };

  fetchSpPrice = () => {
    this.usdOfBTC = this.getPriceOf('BTC');
  };
}

export default (
  instrumentStore,
  settingsStore,
  marketsStore,
  yourAccountStore,
  fiatCurrencyStore,
  orderBookBreakDownStore
) =>
  new PriceChartStore(
    instrumentStore,
    settingsStore,
    marketsStore,
    yourAccountStore,
    fiatCurrencyStore,
    orderBookBreakDownStore
  );
