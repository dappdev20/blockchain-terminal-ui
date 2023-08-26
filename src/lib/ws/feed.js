import { switchMap, filter, map, tap, publishReplay, refCount, timeout } from 'rxjs/operators';
import { never } from 'rxjs';
import { getMarketConnection } from './ws-connection';

const DEFAULT_REQUEST_TIMEOUT = 5000;

const changeBehavior = (cmd, kind) => connection => {
  if (!connection) return never();

  const { readyState, CLOSING, CLOSED } = connection.ws;
  if (readyState === CLOSED || readyState === CLOSING) {
    return never();
  }

  connection.ws.send(JSON.stringify(cmd));

  return connection.messages.pipe(
    filter(x => x.event === kind),
    timeout(DEFAULT_REQUEST_TIMEOUT),
    map(x => x.data)
  );
};

export const getOrderBookBreakdowns = ({ symbol, levels, throttleMs, exchanges }) => {
  return getMarketConnection().pipe(
    switchMap(
      changeBehavior(
        {
          breakdownRequest: {
            symbols: [symbol],
            levels,
            throttleMs,
            exchanges
          }
        },
        'breakdown'
      )
    ),
    tap(null, console.warn),
    publishReplay(1),
    refCount()
  );
};

export const getOrderBookDataFeed = ({ symbol, levels, throttleMs, min, max, exchanges }) => {
  return getMarketConnection().pipe(
    switchMap(
      changeBehavior(
        {
          marketDataRequest: {
            symbols: [symbol],
            levels,
            throttleMs,
            min,
            max,
            exchanges
          }
        },
        'orderBook'
      )
    ),
    tap(null, console.warn),
    publishReplay(1),
    refCount()
  );
};
