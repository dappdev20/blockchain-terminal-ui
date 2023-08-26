import { observable } from 'mobx';
import { combineLatest, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { privateNetworkObservable, publicNetworkObservable } from '../lib/bct-ws';

let store;

class NetworkStore {
  @observable isPrivateConnected = false;
  @observable isPublicConnected = false;
  // @observable isMarketConnected = false;
  @observable showConnectionLost = false;
  allowedDelay = 30000;

  constructor() {
    const isLoggedIn = localStorage.getItem('signedin') === 'true';

    combineLatest(privateNetworkObservable, publicNetworkObservable)
      .pipe(
        switchMap(([privateConnected, publicConnected]) => {
          this.isPrivateConnected = privateConnected;
          this.isPublicConnected = publicConnected;

          const isConnected = this.isPublicConnected && (!isLoggedIn || this.isPrivateConnected);

          if (isConnected) {
            return of(true);
          }
          return of(false).pipe(delay(this.allowedDelay));
        })
      )
      .subscribe(isConnected => {
        this.showConnectionLost = !isConnected;
      });
  }
}

export default () => {
  store = store || new NetworkStore();

  return store;
};
