import { observable, action } from 'mobx';

import { CoinAddressRequest, WithdrawRequest } from '../lib/bct-ws';

class CoinAddressStore {
  @observable symbol = 'BTC';
  @observable coinDepositAddress = '';
  @observable errMsg = '';

  @action.bound createDepositAddress() {
    const clientId = localStorage.getItem('authClientId');
    if (clientId) {
      const payload = { Coin: this.symbol, ClientId: clientId };
      CoinAddressRequest(payload).then(res => {
        this.coinDepositAddress = res;
      });
    }
  }

  @action.bound withdrawDeposit(coin, address, amount) {
    // --- validation ---
    if (!coin || !address || !amount) {
      this.errMsg = 'Please input correct values';
    }

    // --- send request to websocket ---
    const payload = {
      Coin: coin,
      Address: address,
      Amount: amount
    };

    WithdrawRequest(payload).then(() => {
      console.log('[WithdrawRequest has sent]');
    });
  }
}

export default () => {
  const store = new CoinAddressStore();
  return store;
};
