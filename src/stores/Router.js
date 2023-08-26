import { observable, action } from 'mobx';

class RouterStore {
  @observable path = '/';

  constructor(path) {
    if (path) {
      this.path = path;
    }
    window.onpopstate = () => {
      this.push(window.location.pathname);
    };
  }

  @action
  push(path) {
    if (path === this.path) {
      return;
    }

    this.path = path;
    window.history.pushState(null, null, path);
  }
}

export default () => {
  return new RouterStore(window.location.pathname);
};
