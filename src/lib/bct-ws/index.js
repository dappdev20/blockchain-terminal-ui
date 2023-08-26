/* eslint-disable */
import socketCluster from 'socketcluster-client';
import { empty, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import throttle from 'lodash.throttle';
import uuidv4 from 'uuid/v4';

import { WS } from '../../config/constants';
import { refreshToken } from '../../utils';

import { createSCConnection, getOpenConnection } from './sc-connection';

// dot env vars are strings not boolean
if (process.env.REACT_APP_USE_TRACKER !== 'true') {
  console.log('===> Tracker is disabled by REACT_APP_USE_TRACKER="false"');
} else {
  if (process.env.REACT_APP_USE_SENTRY !== 'true') {
    console.log('===> Tracker is disabled due to dependencies on Sentry');
  } else {
    import('../../utils/taskStateTracker.js')
      .then(TaskStateTracker => {
        console.log('===> Tracker is enabled by REACT_APP_USE_TRACKER="true"');
      })
      .catch(err => {
        console.log('===> Tracker failed to initialize properly:', err);
      });
  }
}

const publisher = (throttleMs, publisher) => throttle(publisher, throttleMs, { trailing: false });

let scPublicConnection;
let scPrivateConnection;
let scPublicOpenObservable;
let scPrivateOpenObservable;

let orderEventsPublisher1;

export const recentTradesObservable = new BehaviorSubject({});
export const aggregatedSummaryBooksObservable = new BehaviorSubject({});
export const OrderBooksResponseObservable = new BehaviorSubject({});
export const orderHistoryObservable = new BehaviorSubject({});
export const positionObservableForAuth = new BehaviorSubject({});
export const coinsForWalletObservable = new BehaviorSubject({});
export const orderEventsObservable = new BehaviorSubject({});
export const orderConfirmationObservable = new BehaviorSubject({});
export const exchPlanObservable = new BehaviorSubject({});
export const portfolioDataObservable = new BehaviorSubject({});
export const claimedTransferNotificationObservable = new BehaviorSubject({});
export const privateNetworkObservable = new BehaviorSubject({});
export const publicNetworkObservable = new BehaviorSubject({});

export const getSCPublicObservable = () => {
  if (scPublicConnection) {
    return scPublicOpenObservable;
  }

  scPublicConnection = createSCConnection({
    port: WS.PUBLIC.PORT,
    hostname: WS.PUBLIC.HOST,
    autoReconnect: true
  });

  scPublicOpenObservable = getOpenConnection(scPublicConnection);

  scPublicConnection.subscribe(({ connected }) => {
    publicNetworkObservable.next(connected);
  });

  return scPublicOpenObservable;
};

export const getSCPrivateObservable = () => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    scPrivateConnection = null;
    scPrivateOpenObservable = empty();

    return scPrivateOpenObservable;
  }

  if (scPrivateConnection) {
    return scPrivateOpenObservable;
  }

  scPrivateConnection = createSCConnection({
    port: WS.PRIVATE.PORT,
    hostname: WS.PRIVATE.HOST,
    query: {
      token: authToken
    },
    autoReconnect: true
  });

  scPrivateOpenObservable = getOpenConnection(scPrivateConnection);

  scPrivateConnection.subscribe(({ connected }) => {
    privateNetworkObservable.next(connected);
  });

  return scPrivateOpenObservable;
};

/**
 *  MarketDataRequest
 */
export const MarketDataRequest = ({ Symbols, ProgramId, throttleMs = 100 }) => {
  if (!Array.isArray(Symbols)) {
    throw new Error(`Symbols needs to be non empty array [${Symbols}]`);
  }

  // getClientMarket()
  //     .then(cli => {
  //         cli.emit('MarketDataRequest', {
  //             symbols: Symbols,
  //             levels: 5000,
  //             throttleMs,
  //             // min,
  //             // max,
  //             // exchange,
  //         });

  //         // On reconnect
  //         cli.on('connect', () => {
  //             cli.emit('MarketDataRequest', {
  //                 symbols: Symbols,
  //                 levels: 5000,
  //                 throttleMs,
  //             });
  //         });
  //     })
  //     .catch(e => console.log(e.message || 'ClientMarket connection lost'));
};

/**
 *  MarketDataRequest for OrderBook table.
 */
export const OrderBookDataRequest = ({ Symbols, ProgramId, throttleMs = 50 }) => {
  if (!Array.isArray(Symbols)) {
    throw new Error(`Symbols needs to be non empty array [${Symbols}]`);
  }
  // getClientMarket()
  //     .then(cli => {

  //         cli.emit('MarketBreakdown', {
  //             symbols: Symbols,
  //             throttle: throttleMs,
  //             levels: 10,
  //             // exchanges: [2],
  //         });

  //         // On reconnect
  //         cli.on('connect', () => {
  //             cli.emit('MarketBreakdown', {
  //                 symbols: Symbols,
  //                 throttle: throttleMs,
  //                 levels: 10,
  //                 // exchanges: [2],
  //             });
  //         });
  //     })
  //     .catch(e => console.log(e.message || 'BCTSessionForOrderBook connection lost'));
};

/**
 *  RecentTrades data flow
 */
export const RecentTrades = ({ Symbols, throttleMs = 250 }) => {
  // getClientMarket()
  //     .then(cli => {
  //         const publishOnSubscription = publisher(throttleMs, data => {
  //             data = {
  //                 body: {
  //                     messages: [data],
  //                 },
  //             };
  //             recentTradesObservable.next(data);
  //         });
  //
  //         cli.on('recentTrades', publishOnSubscription);
  //     })
  //     .catch(e => console.log(e.message || 'getClientMarket connection lost'));

  return recentTradesObservable;
};

export const RecentTradesUpdate = ({ Symbols, throttleMs = 250 }) => {};

/*
 * This is the only working trading code I'm aware of.
 * Needs a backend tweak to allow us to roundtrip a client-generated unique ID in the payload but works
 * as long as there are no overlapping orders
 */
export const SendOrderTicket = (clientId, orderType, price, programId, route, side, size, symbol, ticketId) => {
  const payload = {
    ClientId: clientId,
    OrderType: orderType,
    Price: price,
    ProgramId: programId,
    Route: route,
    Side: side,
    Size: size,
    Symbol: symbol,
    TicketId: ticketId
  };

  return new Promise((resolve, reject) => {
    //The callback for an event listener must be a named function... Why? So that you can remove it later!
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('OrderTicket', payload);
      //Remove the event listener you set up last time...
      //cli.off("OrderConfirmation");
      //And recreate it for each order
      cli.once('OrderConfirmation', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  Response of submitted order
 */
// TODO: no return value now
export const OrderEvents = ({ throttleMs = 1 }) => {
  getSCPrivateObservable().subscribe(cli => {
    var throttleMsTime = 1;
    const publishOnSubscription =
      orderEventsPublisher1 ||
      publisher(throttleMsTime, data => {
        orderEventsObservable.next(data);
      });
    orderEventsPublisher1 = publishOnSubscription;
    cli.once('OrderEvents', publishOnSubscription);

    return orderEventsObservable;
  });
};

/*

  Payload looks like:

  {
    'market' : "BTC-USDT",
    'amount' : "0.0004",
    'side': 'BUY'
  }
 */
export const OrderRequestBestPriceBuy = payload => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('orderRequestBestPriceBuy', payload);

      // TODO/WARNING detach the other listeners once a response arrives
      // otherwise we will stack up event handlers and leak memory
      cli.once('orderResponse', response => {
        resolve(response);
      });

      cli.once('orderError', err => {
        reject(err);
      });

      cli.once('invalidOrder', err => {
        reject(err);
      });
    });
  });
};

/**
 *  Wallet coins request
 */
export const PositionRequest = ClientId => {
  getSCPrivateObservable().subscribe(cli => {
    cli.emit('PositionRequest', { ClientId });
  });
};

export const PositionReply = ({ throttleMs = 250 }) => {
  if (!localStorage.getItem('authToken')) {
    positionObservableForAuth.next({
      event: 'PositionResponseNotLoggedIn',
      data: {
        body: {
          messages: [
            {
              Positions: []
            }
          ]
        }
      }
    });
  } else {
    // Real wallet data
    getSCPrivateObservable().subscribe(cli => {
      const publishOnSubscription = publisher(throttleMs, data => {
        let lData = {
          body: {
            messages: [
              {
                Positions: data
              }
            ]
          }
        };
        positionObservableForAuth.next({
          event: 'PositionResponse',
          data: lData
        });
      });

      cli.off('PositionResponse');
      cli.on('PositionResponse', publishOnSubscription);
    });
  }

  return positionObservableForAuth;
};

/**
 *  CoinPairSearch coins request
 *
 *  an example of delayed response (the previous version didn't take into account timeouts)
 */
export const CoinsRequest = ({ Coin }) => {
  return new Promise(resolve => {
    getSCPublicObservable().subscribe(cli => {
      cli.emit('CoinsRequest2', { Coin });
      cli.once('CoinsResponse2', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  Execution Plan
 *
 *  an example with bool result
 */
export const OrderExecutionPlanRequest = payload => {
  return new Promise((resolve, reject) => {
    getSCPublicObservable().subscribe(cli => {
      cli.emit('StartExecPlan', payload);
      resolve(true);
    });
  });
};

/* TODO: refactor calling code so we can use .once fix
 * likely an issue with lowestexchangestore or convertstore
 */
export const GetExecPlans = ({ throttleMs = 250 }) => {
  getSCPublicObservable().subscribe(cli => {
    const publishOnSubscription = publisher(throttleMs, data => {
      exchPlanObservable.next(data);
    });

    cli.off('ExecPlan');
    cli.on('ExecPlan', publishOnSubscription);
  });

  return exchPlanObservable;
};

export const OrderStopExecutionPlan = payload => {
  return new Promise((resolve, reject) => {
    getSCPublicObservable()
      .subscribe(cli => {
        cli.emit('StopExecPlan', payload);
        resolve(true);
      })
      .catch(e => {
        console.log(e.message || 'can not getClientLive');
        reject(e);
      });
  });
};

/**
 *  CoinAddressRequest
 */
export const CoinAddressRequest = payload => {
  if (!localStorage.getItem('authToken')) {
    return new Promise((resolve, reject) => {
      getSCPublicObservable().subscribe(cli => {
        // TODO: Replace emit/once logic with ping/pong response
        cli.emit('CoinAddressRequest', payload);
        cli.once('CoinAddress', data => {
          if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
            resolve(data.Address);
          }
        });
      });
    });
  }
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('CoinAddressRequest', payload);
      cli.once('CoinAddress', data => {
        if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
          resolve(data.Address);
        }
      });
    });
  });
};

/**
 *  WithdrawRequest
 */
export const WithdrawRequest = payload => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('WithdrawRequest', payload);
      resolve(true);
    });
  });
};

/**
 *  ResetDemoBalances
 */
export const ResetDemoBalancesRequest = () => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('ResetDemoBalances', {});
      resolve(true);
    });
  });
};

/**
 *  TelegramTransferRequest
 */
export const TelegramTransferRequest = payload => {
  // {
  //     'Coin': 'btc',
  //     'Amount': '10',
  //     'To': '563959990',
  //     'Details': {
  //         'firstName': 'Igor',
  //         'lastName': 'Kovobski',
  //     }
  // }

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('TelegramTransferRequest', payload);
      resolve(true);
    });
  });
};

/**
 *  HistoryForCoinRequest
 */
export const HistoryForCoinRequest = payload => {
  // {
  //     Coin: "BTC",
  //     Limit: 10,
  //     Skip: 10
  // }

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('HistoryForCoinRequest', payload);
      cli.once('HistoryForCoinResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  Portfolio Data Request
 */
export const PortfolioDataRequest = payload => {
  getSCPrivateObservable().subscribe(cli => {
    cli.emit('PortfolioDataRequest', payload);
  });
};

export const GetSettingsRequest = payload => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(client => {
      try {
        client.emit('SettingsRequest', payload);
        client.once('Settings', data => resolve(data));
      } catch (e) {
        reject(e);
      }
    });
  });
};

export const UpdateSettingsRequest = payload => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(client => {
      try {
        client.emit('UpdateSettingsRequest', payload);
        client.once('SettingsUpdate', data => resolve(data));
      } catch (e) {
        reject(e);
      }
    });
  });
};

/**
 * Adds exchange credentials to member account
 * @param {object} payload
 * @param {string} payload.exchange
 * @param {string} payload.apiKey
 * @param {string} payload.apiSecret
 * @param {string|undefined} payload.uid
 * @param {string|undefined} payload.password
 */
export const AddExchange = payload => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('addExchange', payload);
      cli.once('exchangeAdded', res => resolve(res));
      cli.once('invalidExchange ', err => reject(err));
    });
  });
};

export const RemoveExchange = exchangeName => {
  const payload = {
    exchange: exchangeName
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('removeExchange', payload);
      cli.once('exchangeRemoved', res => resolve(res));
      cli.once('invalidExchange ', err => reject(err));
    });
  });
};

/**
 * Lists exchanges connected to a member's account
 */
export const GetConnectedExchanges = () => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      // Right now this method is fired on Application start
      // even if the user is unauthenticated. We should only
      // fire this for logged in users. This will mean passing
      // logged-in state to the ExchangesStore.
      if (!cli) return resolve([]);
      cli.emit('getConnectedExchanges', {});
      cli.once('connectedExchangesResponse', res => resolve(res));
    });
  });
};

/**
 * Get account balances for each exchanges which will be displayed in Account exchange table
 */

export const GetExchangeBalances = () => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      if (!cli) return resolve([]);
      cli.emit('getBalances', {});
      cli.once('balancesResponse', res => resolve(res));
    });
  });
};

/**
 *  PaymentRequest  (buying crypto)
 */
// Request: emit "PaymentRequest"
// {
//     "Payment": {
//         "Amount": 10,
//         "Coin": "BTC",
//         "PaymentAmount": 1000,
//         "PaymentCurrency": "USD",
//         "Card": {
//             "Type": "Visa",
//             "Name": "Foo bar",
//             "Number": "1111 1111 1111 1111",
//             "ExpDate": "10/20",
//             "Cvv": "123"
//         }
//     }
// }
export const PaymentRequest = (Type, Name, Number, ExpDate, Cvv) => {
  const payload = {
    Payment: {
      Amount: 0,
      Coin: '',
      PaymentAmount: 1000,
      PaymentCurrency: 'USD',
      Card: {
        Type,
        Name,
        Number,
        ExpDate,
        Cvv
      }
    }
  };

  getSCPrivateObservable().subscribe(cli => {
    cli.emit('PaymentRequest', payload);
  });
};

/**
 *  DepositAddressRequest
 */
// Request emit DepositAddressRequest
// {
//     Address: "1Ebfh6GruruXwHD67au8eNpL58NXr1YTkH"
// }

// Response on DepositAddressResponse
// - success case:
// {
//     Username: 'jon_doe_12345',
//     FirstName: 'jon',
//     LastName: 'doe',
//     PhotoUrl: 'https://t.me/i/userpic/320/jon_doe_12345.jpg',
//     Status: 'success',
// }

// - failed case:
// {
//     Msg: 'No user exists with such deposit address'
//     Status: 'failed',
// }

export const DepositAddressRequest = address => {
  const payload = {
    Address: address
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('DepositAddressRequest', payload);
      cli.once('DepositAddressResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  TelegramIdRequest
 */
// Request emit TelegramIdRequest
// {
//     Id: 510889450
// }

// Response on TelegramIdResponse
// - success case:
// {
//     Username: 'jon_doe_12345',
//     Status: 'success',
// }

// - failed case:
// {
//     Msg: 'Invalid TelegramID, please check number'
//     Status: 'failed',
// }

export const TelegramIdRequest = id => {
  const payload = {
    Id: id
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('TelegramIdRequest', payload);
      cli.once('TelegramIdResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 * WithdrawalRequest
 */
// - Request emit WithdrawalRequest
// {
//     RequestId: [uuidv4],
//     Coin: 'BTC',
//     Amount: '1',
//     ToAddress: '1GsojN1um3TPQyHXkcwr47uDw62YwAWfuH',
// }

// - Response: on WithdrawalResponse
// {
//     RequestId: [uuidv4],
//     Status,
//     Error,
// }

// Property Error will be empty if some amount of coins is sent successfully.

export const WithdrawalRequest = (coin, amount, address) => {
  const payload = {
    RequestId: uuidv4(),
    Coin: coin,
    Amount: amount,
    Address: address
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('WithdrawalRequest', payload);
      cli.once('WithdrawalResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 * InitTransferRequest
 */
// ## init transfer
//
// FE sends ws request(Private):
//
// event = 'InitTransferRequest'
// data = {
//     Coin: 'USDT',
//     Amount: 22.2,
//     ExpireIn: '2h' (optional),
// }
// If ExpireIn is not sent then value '2d' will be used by default.
//
// BE sends response:
//
//     Success:
//          event = 'InitTransferResponse'
//          data = {
//              Status: 'success',
//              Error: '',
//          }
//
//     Failure:
//          data = {
//               Status: 'fail',
//               Error: 'Message text',
//          }

export const InitTransferRequest = (coin, amount, currency) => {
  const payload = {
    Coin: coin,
    Amount: amount,
    DefaultCurrency: currency,
    ExpireIn: '5m'
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('InitTransferRequest', payload);
      cli.once('InitTransferResponse', data => {
        // console.log('[InitTransferResponse]', data);
        resolve(data);
      });
    });
  });
};

export const PromotionTransferRequest = type => {
  const payload = { Type: type };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('PromotionTransferRequest', payload);
      cli.once('PromotionTransferResponse', data => {
        resolve(data);
      });
    });
  });
};

export const TransferNotification = () => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.once('TransferNotification', data => {
        resolve(data);
      });
    });
  });
};

export const TransferInfoDetailedRequest = uniqueId => {
  const payload = {
    TrId: uniqueId
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('TransferInfoDetailedRequest', payload);
      cli.once('TransferInfoDetailedResponse', data => {
        // console.log('[TransferInfoDetailedResponse]', data);
        resolve(data);
      });
    });
  });
};

export const TransferInfoRequest = uniqueId => {
  const payload = {
    TrId: uniqueId
  };

  return new Promise((resolve, reject) => {
    getSCPublicObservable().subscribe(cli => {
      cli.emit('TransferInfoRequest', payload);
      cli.once('TransferInfoResponse', data => {
        // console.log('[TransferInfoResponse]', data);
        resolve(data);
      });
    });
  });
};

export const ClaimTransfer = uniqueId => {
  const payload = {
    TrId: uniqueId
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('ClaimTransferRequest', payload);
      cli.once('ClaimTransferResponse', data => {
        console.log('[ClaimTransferResponse]', data);
        resolve(data);
      });
    });
  });
};

export const TransferHistoryRequest = payload =>
  new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      try {
        cli.emit('TransferHistoryRequest', payload);
        cli.once('TransferHistoryResponse', data => {
          resolve(data);
        });
      } catch (e) {
        reject(e);
      }
    });
  });

export const GetClaimedTransferNotification = ({ throttleMs = 10 }) => {
  getSCPrivateObservable().subscribe(cli => {
    const publishOnSubscription = publisher(throttleMs, data => {
      claimedTransferNotificationObservable.next(data);
    });

    cli.off('ClaimedTransferNotification');
    cli.on('ClaimedTransferNotification', publishOnSubscription);
  });

  return claimedTransferNotificationObservable;
};

// CancelTransferRequest
export const CancelTransferRequest = uniqueId => {
  const payload = {
    TrId: uniqueId
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('CancelTransferRequest', payload);
      cli.once('CancelTransferResponse', data => {
        // console.log('[CancelTransferResponse]', data);
        resolve(data);
      });
    });
  });
};

// RejectTransferRequest
export const RejectTransferRequest = uniqueId => {
  const payload = {
    TrId: uniqueId
  };

  return new Promise((resolve, reject) => {
    getSCPublicObservable().subscribe(cli => {
      cli.emit('RejectTransferRequest', payload);
      cli.once('RejectTransferResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  AutoConversion
 */
export const AutoConversionRequest = (start, end, amount) => {
  return new Promise((resolve, reject) => {
    const payload = {
      EndCurrency: end,
      StartCurrency: start,
      StartAmount: amount
    };

    getSCPrivateObservable().subscribe(cli => {
      cli.emit('CreateAutoConversionRequest', payload);
      cli.once('CreateAutoConversionResponse', data => {
        resolve(data);
      });
    });
  });
};

export const ListAutoConversionsRequest = () => {
  return new Promise((resolve, reject) => {
    const payload = {};
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('ListAutoConversionsRequest', payload);
      cli.once('ListAutoConversionsResponse', data => {
        resolve(data);
      });
    });
  });
};

export const RunAutoConversionRequest = (autoId, symbol) => {
  return new Promise((resolve, reject) => {
    const payload = {
      AutoConversionId: autoId,
      ArbitrageCoin: symbol // 'BTC', 'F:USD'
    };
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('RunAutoConversionRequest', payload);
      cli.once('RunAutoConversionResponse', data => {
        resolve(data);
      });
    });
  });
};

export const DeactivateAutoConversionRequest = autoId => {
  return new Promise((resolve, reject) => {
    const payload = {
      AutoConversionId: autoId
    };
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('DeactivateAutoConversionRequest', payload);
      cli.once('DeactivateAutoConversionResponse', data => {
        resolve(data);
      });
    });
  });
};

export const PauseAutoConversionRequest = autoId => {
  return new Promise((resolve, reject) => {
    const payload = {
      AutoConversionId: autoId
    };
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('PauseAutoConversionRequest', payload);
      cli.once('PauseAutoConversionResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  BuildListUserBillsRequest
 */
export const BuildListUserBillsRequest = () => {
  return new Promise((resolve, reject) => {
    const payload = {
      Coin: ''
    };

    getSCPrivateObservable().subscribe(cli => {
      cli.emit('BuildListUserBillsRequest', payload);
      cli.once('BuildListUserBillsResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 *  Conversions Currencies API
 */
export const ConversionRequest = (amount, start, end) => {
  return new Promise((resolve, reject) => {
    const payload = {
      Amount: amount,
      StartCoin: start,
      EndCoin: end
    };

    getSCPrivateObservable().subscribe(cli => {
      cli.emit('ConversionRequest', payload);
      cli.once('ConversionResponse', data => {
        resolve(data);
      });
    });
  });
};

/*
 *  Get trade history
 */

export const getTrades = payload => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.once('tradesResponse', res => resolve(res));
      cli.emit('getTrades', payload);
    });
  });
};

/**
 *  Order History Request/Response
 */
export const OrderHistoryRequest = ClientId => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('OrderHistoryRequest', { ClientId });
      resolve(true);
    });
  });
};

export const OrderHistoryReply = ({ throttleMs = 250 }) => {
  getSCPrivateObservable().subscribe(cli => {
    const publishOnSubscription = publisher(throttleMs, data => {
      data = {
        body: {
          messages: [
            {
              Tickets: data
            }
          ]
        }
      };
      orderHistoryObservable.next(data);
    });

    cli.off('OrderHistoryResponse');
    cli.on('OrderHistoryResponse', publishOnSubscription);
  });

  return orderHistoryObservable;
};

/**
 *  Bills API integration
 */
export const ListUserBillsRequest = coin => {
  const payload = {
    Coin: coin
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('ListUserBillsRequest', payload);
      cli.once('ListUserBillsResponse', data => {
        if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
          resolve(data);
        }
      });
    });
  });
};

export const BalanceRequest = ClientId => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('PositionRequest', { ClientId });
      cli.once('PositionResponse', data => {
        resolve(data);
      });
    });
  });
};

export const ExecPlanRequest = payload => {
  return new Promise((resolve, reject) => {
    getSCPublicObservable().subscribe(cli => {
      cli.emit('StartExecPlan', payload);
      cli.once('ExecPlan', data => {
        resolve(data);
      });
    });
  });
};

export const HistoryRequest = ClientId => {
  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      cli.emit('OrderHistoryRequest', { ClientId });
      cli.once('OrderHistoryResponse', data => {
        resolve(data);
      });
    });
  });
};

/**
 * Buy Order Request with best price
 * @param {Object} payload
 * @property {string} side "BUY" or "SELL"
 * @property {string} amount
 */
export const OrderRequestBestPrice = payload => {
  payload.market = 'ETH/BTC';
  const detachHandler = cli => {
    cli.off('orderResponse');
    cli.off('invalidOrder');
    cli.off('orderError');
  };

  return new Promise((resolve, reject) => {
    getSCPrivateObservable().subscribe(cli => {
      if (payload.side === 'BUY') {
        cli.emit('orderRequestBestPriceBuy', payload);
      } else if (payload.side === 'SELL') {
        cli.emit('orderRequestBestPriceSell', payload);
      }
      cli.once('orderResponse', res => {
        detachHandler(cli);
        resolve(res);
      });
      cli.once('invalidOrder', err => {
        detachHandler(cli);
        reject(err);
      });
      cli.once('orderError', err => {
        detachHandler(cli);
        reject(err);
      });
    });
  });
};

/**
 * ALERT: ===== DIRTY ZONE =======
 * Don't add new functions from here.
 * Here are only deprecated functions to be removed after confirmation.
 */

/**
 * @deprecated Need to confirm this functionality
 */
// export const GetMemberInformationRequest = () => {
//   return new Promise((resolve, reject) => {
//     getClientTrade()
//       .then(cli => {
//         cli.emit('GetMemberInformationRequest');
//         cli.once('GetMemberInformationResponse', data => {
//           resolve(data);
//         });
//       })
//       .catch(e => console.log(e.message || 'can not edit member information'));
//   });
// };

/**
 * @deprecated Need to confirm this functionality
 * @param {Object} payload
 */
// export const EditMemberInformationRequest = payload => {
//   return new Promise((resolve, reject) => {
//     getClientTrade()
//       .then(cli => {
//         cli.emit('EditMemberInformationRequest', payload);
//         cli.once('EditMemberInformationResponse', data => {
//           resolve(data);
//         });
//       })
//       .catch(e => console.log(e.message || 'can not edit member information'));
//   });
// };
