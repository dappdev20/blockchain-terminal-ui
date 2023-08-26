import { observable } from 'mobx';
import { REST_MARKET } from '../config/constants';

class MarketsStore {
  @observable.shallow markets = {};

  constructor() {
    this.fetchMarkets();
    setInterval(this.fetchMarkets, 86400000);
  }

  fetchMarkets() {
    fetch(`${REST_MARKET}/api/markets`)
      .then(response => response.json())
      .then(res => {
        this.markets = res;
      })
      .catch(console.log);
  }
}

export default () => {
  const store = new MarketsStore();
  return store;
};
