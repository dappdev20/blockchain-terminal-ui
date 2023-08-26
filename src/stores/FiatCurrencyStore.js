import { observable, action } from 'mobx';
import { mockCountries } from '@/mock/countries';

class FiatCurrencyStore {
  @observable price;
  @observable stockMode = false;
  countries = [];
  accountStoreRef = null;

  constructor(yourAccountStore) {
    this.accountStoreRef = yourAccountStore;

    setInterval(this.fetchPrice, 2 * 60 * 60 * 1000);
    this.fetchPrice();
  }

  @action.bound getPriceOf = symbol => {
    return new Promise(resolve => {
      if ((symbol || '').includes('S:')) {
        const curr = (symbol || '').replace('S:', '');
        fetch(`https://sandbox.iexapis.com/v1/stock/${curr}/price?token=Tpk_d3a0c378cfcc4c7eb3a1ae46268ed802`)
          .then(response => response.json())
          .then(data => {
            resolve(data);
          })
          .catch(() => {
            resolve(0);
          });
      } else {
        if (symbol && symbol.indexOf('F:') !== -1) {
          const curr = (symbol || '').replace('F:', '');
          if (this.countries && this.countries.length > 0) {
            const country = this.countries.find(country => country.currencyCode === curr);
            if (country) {
              resolve(1 / country.price);
            }
          }
          resolve(0);
        }
        resolve(this.accountStoreRef.getPriceOf(symbol));
      }
    });
  };

  fetchPrice = async () => {
    // Todo: Update - Remove this from FE
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

  @action.bound getStockPriceOf = symbol => {
    // Todo: Update - Remove this from FE
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

  @action.bound setStockMode(mode) {
    this.stockMode = mode;
  }

  @action.bound getSpotRate(base, quote) {
    return new Promise(resolve => {
      fetch(`https://market-data.bct.trade/api/convert/price?fsym=${base}&tsym=${quote}`)
        .then(response => response.json())
        .then(data => {
          resolve(data);
        })
        .catch(() => {
          resolve(0);
        });
    });
  }
}

export default yourAccountStore => {
  const store = new FiatCurrencyStore(yourAccountStore);
  return store;
};
