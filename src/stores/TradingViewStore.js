import { observable, action } from 'mobx';

class TradingViewStore {
  @observable isCoinListOpen = false;

  @action.bound setCoinListOpen(open) {
    this.isCoinListOpen = open;
  }
}

export default () => new TradingViewStore();
