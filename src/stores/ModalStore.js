import { observable, action } from 'mobx';

class ModalStore {
  @observable ModalProps = {};
  @observable open = false;
  @observable isApiKeyModalOpened = false;

  _onClose = null;

  @action.bound Modal({ onClose, ...props }) {
    this.ModalProps = props;
    this.open = true;
    this.__setPropOnClose(onClose);
  }

  @action.bound onClose() {
    this.__handlePropsOnClose();
    this.__reset();
  }

  @action.bound onConfirm() {
    // should call confirm function, then close. No confirm function atm.
    this.__reset();
  }

  @action.bound setApiKeyModalOpenState(state) {
    this.isApiKeyModalOpened = state;
  }

  __reset() {
    this.open = false;
    this.ModalProps = {};
    this._onClose = null;
  }

  __setPropOnClose(onClose) {
    this._onClose = onClose;
  }

  __handlePropsOnClose() {
    if (this._onClose) {
      this._onClose();
    }
  }
}

export default () => {
  const store = new ModalStore();
  return store;
};
