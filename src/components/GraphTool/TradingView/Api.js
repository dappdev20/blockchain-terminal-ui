import { BehaviorSubject } from 'rxjs';
import historyProvider from './historyProvider';
import { getSymbol, drawHistoryGraph, drawHistoryGraphWithMultiply } from './utils';

export const apiDataLoadObservable = new BehaviorSubject({}); // this is only for loading bar
const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', 'D'];

const config = {
  supported_resolutions: supportedResolutions
};

export default {
  onReady: cb => {
    // console.log("=====onReady running");
    setTimeout(() => cb(config), 0);
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    // console.log("====Search Symbols running");
  },
  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    if (symbolName.indexOf(':') < 0) {
      return;
    }

    const splited = symbolName.split(':');

    const data = {
      exchange: {
        code: splited[0]
      },
      market: {
        code: splited[1]
      }
    };

    setTimeout(() => {
      onSymbolResolvedCallback(getSymbol(data));
    }, 0);
  },
  getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
    apiDataLoadObservable.next({
      apiLoaded: false
    });

    historyProvider
      .getBars(symbolInfo, resolution, from, to, firstDataRequest)
      .then(bars => {
        if (bars.length > 0) {
          return drawHistoryGraph(
            bars,
            firstDataRequest,
            onHistoryCallback,
            symbolInfo,
            resolution,
            onErrorCallback,
            apiDataLoadObservable
          );
        }

        // --- use ETH-BTC market for no data coins --- //
        const noDataSymbolInfo = {
          exchange: {
            code: (symbolInfo.exchange || '').toLowerCase()
          },
          market: {
            code: 'ETH-BTC'
          }
        };
        historyProvider
          .getBars(symbolInfo, resolution, from, to, firstDataRequest)
          .then(bars => {
            return drawHistoryGraphWithMultiply(
              bars,
              firstDataRequest,
              onHistoryCallback,
              getSymbol(noDataSymbolInfo),
              resolution,
              onErrorCallback,
              apiDataLoadObservable
            );
          })
          .catch(err => onErrorCallback());
      })
      .catch(err => {
        console.log({ err });
        onErrorCallback(err);
      });
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    // console.log("=====subscribeBars runnning");
  },
  unsubscribeBars: subscriberUID => {
    // console.log("=====unsubscribeBars running");
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    //optional
    // console.log("=====calculateHistoryDepth running");
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined;
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
    // console.log("=====getMarks running");
  },
  getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
    // console.log("=====getTimeScaleMarks running");
  },
  getServerTime: cb => {
    // console.log("=====getServerTime running");
  }
};
