import { observable, action } from 'mobx';
import React from 'react';

export const STATE_KEYS = {
  coinSearch: 'COIN_SEARCH',
  amtInput: 'AMOUNT_INPUT',
  submitOrder: 'SUBMIT_ORDER',
  orderDone: 'ORDER_DONE'
};

const StateSequence = new Set([
  STATE_KEYS.coinSearch,
  STATE_KEYS.amtInput,
  STATE_KEYS.submitOrder,
  STATE_KEYS.orderDone
]);

class ConvertStore {
  @observable convertState;
  @observable currentProgress = 0;
  statesSequence = null;

  constructor(snackbar) {
    this.gotoFirstState();
    this.snackbar = snackbar;
  }

  @action.bound setCurrentProgress(currentProgress) {
    if (this.currentProgress !== currentProgress) {
      this.currentProgress = currentProgress;
    }
  }

  @action.bound progressState() {
    this.convertState = this.__nextState();
  }

  @action.bound showConvertState(msg) {
    this.snackbar({
      message: () => (
        <>
          <span>
            <b>{msg}</b>
          </span>
        </>
      )
    });
  }

  @action.bound setConvertState(state) {
    this.convertState = state;
  }

  @action.bound gotoFirstState() {
    this.__initStateSequence();
    this.convertState = this.__nextState();
  }

  __initStateSequence() {
    this.statesSequence = StateSequence.values();
  }

  __nextState() {
    const nextState = this.statesSequence.next();

    if (nextState.done) {
      this.__initStateSequence();
      return this.statesSequence.next().value;
    }

    return nextState.value;
  }
}

export default snackbar => {
  const store = new ConvertStore(snackbar);
  return store;
};
