import { observable, action } from 'mobx';

class SnackbarStore {
  @observable SnackBarProps = {};
  @observable open = false;
  @observable isRight = false;

  @action.bound Snackbar(props) {
    this.SnackBarProps = props;
    this.open = true;
  }

  @action.bound onClose() {
    this.open = false;
  }

  @action.bound setRightMode(mode) {
    this.isRight = mode;
  }
}

export default () => {
  const store = new SnackbarStore();
  return store;
};
