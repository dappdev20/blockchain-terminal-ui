import socketCluster from 'socketcluster-client';
import { Observable } from 'rxjs';
import { filter, map, publishReplay, refCount, retry, repeat } from 'rxjs/operators';

const destroySocket = socket => {
  if (socket) {
    socket.off();
    socket.destroy();
  }
};

export const createSCConnection = options => {
  return Observable.create(obs => {
    const socket = socketCluster.create(options);

    socket.on('connect', () => {
      obs.next({ socket, connected: true });
    });

    socket.on('error', error => {
      console.log('socket error', error);
      obs.next({ socket, connected: false });

      // In case of a fatal error, close the socket
      // https://github.com/SocketCluster/socketcluster-client/blob/master/lib/scclientsocket.js#L611
      if (error.code >= 4500) {
        destroySocket(socket);
        obs.complete();
      }
    });

    return () => {
      destroySocket(socket);
    };
  }).pipe(
    // retry if there is an error
    retry(),
    // repeat if connection closed due to a fatal error
    repeat(),
    // remember last connection
    publishReplay(1),
    // calculate subscriptions count and close subscription when latest consumer unsubscribed
    refCount()
  );
};

export const getOpenConnection = obs => {
  return obs.pipe(
    filter(({ connected }) => connected),
    map(({ socket }) => socket),
    publishReplay(1),
    refCount()
  );
};
