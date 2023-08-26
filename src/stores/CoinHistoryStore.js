import { observable, action } from 'mobx';
import { HistoryForCoinRequest } from '../lib/bct-ws';

class CoinHistoryStore {
  @observable coinHistory = [];

  @action.bound getCoinHistory(coin) {
    const payload = {
      Coin: coin,
      Limit: 20,
      Skip: 0
    };

    HistoryForCoinRequest(payload).then(history => {
      this.coinHistory = history;
    });
  }
}

export default () => new CoinHistoryStore();
