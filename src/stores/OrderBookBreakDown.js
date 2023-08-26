import React from 'react';
import { observable, runInAction, reaction, action, computed } from 'mobx';

import { getScreenInfo, pageIsVisible } from '@/utils';
import {
  transformOrderBookData,
  processOrderBookData,
  reverseOrderBookPrices,
  convertOrderBookPrices
} from './utils/storeUtils';
import { ORDER_BOOK_THROTTLE, ORDER_BOOK_ROWS_COUNT } from '@/config/constants';
import { getOrderBookBreakdowns, getOrderBookDataFeed } from '@/lib/ws/feed';

const DEPTH_CHART_THROTTLE = 2000;
const DEPTH_CHART_LEVELS = 150;

class OrderBookBreakDownStore {
  // OrderBook specific properties
  @observable.shallow asks = [];
  @observable.shallow bids = [];
  @observable baseSymbol = '';
  @observable quoteSymbol = '';
  @observable hoveredItem = {};
  @observable isOrderBookConnected = true;
  @observable isOrderBookLoaded = false;
  @observable isOrderBookTimedOut = false;
  @observable midPrice = 0; // comes from API
  @observable avgPrice = 0; // calculated as `totalCost/totalAmount`
  @observable price = 0; // calculated as `avgPrice-midToAvgDiff`
  @observable priceDelta = 0; // calculated as `avgPrice-midToAvgDiff`
  @observable multiLegMode = false;

  // OrderBook computed props (based on Asks/Bids)
  @observable maxAmount = 0;
  @observable maxCost = 0;
  @observable totalAsksAmount = 0;
  @observable totalAsksCost = 0;
  @observable maxAskPrice = 0;
  @observable totalBidsAmount = 0;
  @observable totalBidsCost = 0;
  @observable maxBidPrice = 0;
  @observable isFiat = false;

  // DepthChart specific properties
  @observable.shallow dcAsks = [];
  @observable.shallow dcBids = [];
  @observable isDepthChartLoaded = false;
  @observable isDepthChartTimedOut = false;

  // DON'T CONNECT THESE PROPERIES TO COMPONENTS
  // use @computed `baseSymbol` and `quoteSymbol`
  @observable base = '';
  @observable quote = '';
  @observable multiLegCoin = '';
  @observable multiLegPriceRate = 1;

  multiLegAmountRate = 1;
  midToAvgDiff = 0;
  symbol = '';
  orderbookBreakDownArrivedTime = 0;
  exchanges = {};
  isMobileDevice = false;
  arbMode = false;
  fiatCurrencyStoreRef = null;
  spotCalcTimer = null;

  constructor(instrumentStore, exchangesStore, viewModeStore, fiatCurrencyStore, snackbar) {
    this.isMobileDevice = getScreenInfo().isMobileDevice;
    this.fiatCurrencyStoreRef = fiatCurrencyStore;
    this.instrumentStoreRef = instrumentStore;
    this.snackbar = snackbar;

    instrumentStore.instrumentsReaction((base = '', quote = '') => {
      if (this.arbMode) return;

      this.asks = [];
      this.bids = [];
      this.dcAsks = [];
      this.dcBids = [];

      this.isDepthChartLoaded = false;
      this.midToAvgDiff = 0;
      this.midPrice = 0;
      this.avgPrice = 0;
      this.price = 0;
      this.isFiat = quote.includes('F:');

      // please read and understand the below description before you change anything in this method
      // (edit the wiki when you change the logic)
      // https://gitlab.com/cryptoems/blockchain-terminal-ui/wikis/OrderBook-data-processing
      this.baseSymbol = base;
      this.quoteSymbol = quote;

      if (base.includes('F:') || base.includes('S:') || quote === 'F:USD') {
        this.setMultiLegMode(base, quote);
        return;
      }

      this.symbol = `${base}-${quote}`;
      this.base = base;
      this.quote = quote;

      this.multiLegMode = false;
      this.multiLegAmountRate = 1;
      this.multiLegPriceRate = 1;

      if (!this.isMobileDevice) {
        this.createSubscription();
      }
    }, true);

    reaction(
      () => {
        return {
          exchanges: exchangesStore.exchanges,
          validMarketExchanges: exchangesStore.validMarketExchanges
        };
      },
      ({ exchanges, validMarketExchanges }) => {
        this.exchanges = exchanges;
        if (!this.isMobileDevice && validMarketExchanges.length > 1) {
          this.createSubscription();
        }
      }
    );

    reaction(
      () => ({ arbMode: viewModeStore.arbMode }),
      ({ arbMode }) => {
        this.arbMode = arbMode;
        this.asks = [];
        this.bids = [];
      }
    );

    this.loadFromStorage();

    this.orderbookBreakDownArrivedTime = Math.round(Date.now() / 1000);

    setInterval(() => {
      if (this.subscribe) {
        const currentUnix = Math.round(Date.now() / 1000);
        const delta = currentUnix - this.orderbookBreakDownArrivedTime;
        if (delta > 5) {
          this.isOrderBookConnected = false;
        }
      }
    }, 1000);

    this.runSpotPriceDelta();
  }

  @computed get highestBidPrice() {
    return this.bids && this.bids.length > 0 ? this.bids[0][0] : 0;
  }

  @computed get lowestAskPrice() {
    return this.asks && this.asks.length > 0 ? this.asks[0][0] : 0;
  }

  runSpotPriceDelta = () => {
    clearTimeout(this.spotCalcTimer);
    this.midToAvgDiff = this.avgPrice - this.midPrice;
    this.spotCalcTimer = setInterval(() => {
      this.midToAvgDiff = this.avgPrice - this.midPrice;
    }, 60000);
  };

  @action.bound setMultiLegMode = async (c1, c2) => {
    try {
      this.removeSubscription();

      // please read and understand the below description before you change anything in this method
      // (edit the wiki when you change the logic)
      // https://gitlab.com/cryptoems/blockchain-terminal-ui/wikis/OrderBook-data-processing
      let price = 1;
      if (c1.includes('F:') || c1.includes('S:')) {
        // c1 fiat or stock
        this.base = 'BTC';
        this.quote = 'USDT';

        if (c2 !== 'BTC') {
          // no need to transform BTC-USD orderbook (only reverse)
          price = await this.fiatCurrencyStoreRef.getSpotRate(c1, 'BTC');
        }
      } else {
        // c1 is crypto
        this.base = c1;
        this.quote = c1 === 'BTC' ? 'USDT' : 'BTC';

        if (c1 !== 'BTC') {
          // no need to transform BTC-USD orderbook
          price = await this.fiatCurrencyStoreRef.getSpotRate('BTC', 'USDT');
        }
      }

      this.multiLegPriceRate = price;
      this.multiLegAmountRate = 1 / price;
      this.multiLegMode = true;

      if (!this.isMobileDevice) {
        this.createSubscription();
      }
    } catch (e) {
      console.log(e);
    }
  };

  @action.bound highlightRow = (type, price) => {
    if (!type) {
      this.hoveredItem = undefined;
      return;
    }

    const rows = type === 'buy' ? this.bids : this.asks;
    let index;
    for (index = 0; index < rows.length - 1; index++) {
      if (rows[index].price >= price) {
        break;
      }
    }

    if (index === rows.length) {
      index = rows.length - 1;
    }

    this.hoveredItem = {
      type,
      index
    };
  };

  loadFromStorage = () => {
    const exchangesStr = localStorage.getItem('exchanges') || '{}';
    try {
      this.exchanges = JSON.parse(exchangesStr) || {};
    } catch (e) {
      console.log(e);
    }
  };

  handleOrderBookData = ({ Asks = [], Bids = [], Symbol: pairSymbol, MidPrice, SpotPrice } = {}) => {
    runInAction(() => {
      this.isOrderBookConnected = true;
      this.orderbookBreakDownArrivedTime = Math.round(Date.now() / 1000);
      this.isOrderBookLoaded = Asks.length > 0 && Bids.length > 0;

      // please read and understand the below description before you change anything in this method
      // (edit the wiki when you change the logic)
      // https://gitlab.com/cryptoems/blockchain-terminal-ui/wikis/OrderBook-data-processing

      // !IMPORTANT: don't forget to check DepthChart when you change something here
      // probably you will need to apply the same changes to `handleDepthChartData`
      let asksBuffer = Asks;
      let bidsBuffer = Bids;
      let midPriceBuffer = MidPrice;
      let spotPriceBuffer = SpotPrice;

      if (this.baseSymbol === 'F:USD' || this.baseSymbol === 'USDT') {
        // reverse orderbook
        asksBuffer = reverseOrderBookPrices(Asks, SpotPrice);
        bidsBuffer = reverseOrderBookPrices(Bids, SpotPrice);
        midPriceBuffer = 1 / midPriceBuffer;
        spotPriceBuffer = 1 / spotPriceBuffer;
      } else if (this.multiLegMode) {
        // convert prices and amounts using multiLeg data
        const quoteQualifier =
          this.baseSymbol.includes('F:') || this.baseSymbol.includes('S:') ? this.multiLegAmountRate : 1;
        asksBuffer = convertOrderBookPrices(asksBuffer, this.multiLegPriceRate, quoteQualifier);
        bidsBuffer = convertOrderBookPrices(bidsBuffer, this.multiLegPriceRate, quoteQualifier);
        midPriceBuffer *= this.multiLegPriceRate;
        spotPriceBuffer *= this.multiLegPriceRate;
      }

      const {
        totalAmount: totalAsksAmount,
        totalCost: totalAsksCost,
        maxAmount: maxAsksAmount,
        maxCost: maxAsksCost,
        maxPrice: maxAskPrice
      } = processOrderBookData(asksBuffer);

      const {
        totalAmount: totalBidsAmount,
        totalCost: totalBidsCost,
        maxAmount: maxBidsAmount,
        maxCost: maxBidsCost,
        maxPrice: maxBidPrice
      } = processOrderBookData(bidsBuffer);

      this.totalAsksAmount = totalAsksAmount;
      this.totalAsksCost = totalAsksCost;
      this.totalBidsAmount = totalBidsAmount;
      this.totalBidsCost = totalBidsCost;

      this.maxAmount = Math.max(maxAsksAmount, maxBidsAmount);
      this.maxCost = Math.max(maxAsksCost, maxBidsCost);
      this.maxAskPrice = maxAskPrice;
      this.maxBidPrice = maxBidPrice;

      const nextAvgPrice = (totalAsksCost + totalBidsCost) / (totalAsksAmount + totalBidsAmount);
      if (this.price !== spotPriceBuffer) {
        this.priceDelta = this.price ? spotPriceBuffer - this.price : 0;
      }

      const noise = this.avgPrice ? this.avgPrice - nextAvgPrice : 0;
      this.asks = transformOrderBookData(asksBuffer.reverse(), noise);
      this.bids = transformOrderBookData(bidsBuffer, noise).reverse();

      this.midPrice = midPriceBuffer;
      this.avgPrice = nextAvgPrice;
      if (this.resetDeltaPriceOnNextRun) {
        this.resetDeltaPriceOnNextRun = false;
        this.runSpotPriceDelta();
      }
      this.symbol = pairSymbol;
      this.price = spotPriceBuffer;
    });
  };

  handleOrderBookError = () => {
    this.showSubscriptionMessage('Order book breakdown subscription failed to return response');
    this.isOrderBookTimedOut = true;
    this.instrumentStoreRef.setBase('BTC');
  };

  @action.bound createSubscription() {
    let exchanges = [];
    if (!this.exchanges.Global || !this.exchanges.Global.active) {
      exchanges = Object.keys(this.exchanges).filter(
        name => this.exchanges[name] && this.exchanges[name].active && name !== 'Global'
      );
    }

    if (!this.base || !this.quote) {
      return;
    }

    this.removeSubscription();

    // please read and understand the below description before you change anything in this method
    // (edit the wiki when you change the logic)
    // https://gitlab.com/cryptoems/blockchain-terminal-ui/wikis/OrderBook-data-processing

    // Allowed subscriptions:
    // - ANY CRYPTO to BTC
    // - BTC to USDT
    // throw an error if none of these rules match
    if (
      this.quote.includes('F:') ||
      this.quote.includes('S:') ||
      this.base.includes('F:') ||
      this.base.includes('S:')
    ) {
      throw new Error("websockets doesn't work with stock and fiat money. Please use `multileg` mode");
    }

    if (this.quote !== 'BTC' && this.quote !== 'USDT' && this.quote !== 'ETH') {
      throw new Error('Bad Coin pair');
    }

    const symbol = `${this.base}-${this.quote}`;
    this.subscribe = getOrderBookBreakdowns({
      symbol,
      levels: ORDER_BOOK_ROWS_COUNT,
      throttleMs: ORDER_BOOK_THROTTLE,
      exchanges
    }).subscribe(this.handleOrderBookData, this.handleOrderBookError);

    this.depthChartSubscription = getOrderBookDataFeed({
      symbol,
      levels: DEPTH_CHART_LEVELS,
      throttleMs: DEPTH_CHART_THROTTLE,
      min: null,
      max: null,
      exchanges
    }).subscribe(this.handleDepthChartData, this.handleDepthChartError);
  }

  @action.bound showSubscriptionMessage(msg) {
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

  @action.bound removeSubscription() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
      this.subscribe = undefined;
    }

    if (this.depthChartSubscription) {
      this.depthChartSubscription.unsubscribe();
      this.depthChartSubscription = undefined;
    }

    this.isOrderBookTimedOut = false;
    this.isDepthChartTimedOut = false;

    this.resetDeltaPriceOnNextRun = true;
  }

  patchLevels = data => {
    if (!data.length) {
      return data;
    }

    const spread = Math.abs(data[data.length - 1][0] - data[0][0]);
    const step = spread / DEPTH_CHART_LEVELS;

    let prevItem;
    return data.slice(1).reduce(
      (res, [price, amount], index) => {
        if (!prevItem) {
          prevItem = [price, amount];
          return res;
        }

        const [prevPrice, prevAmount] = prevItem;

        if (index && Math.abs(price - prevPrice) < step) {
          prevItem = [(price + prevPrice) / 2, amount + prevAmount];
        } else {
          res.push(prevItem);
          prevItem = [price, amount];
        }
        return res;
      },
      [data[0]]
    );
  };

  handleDepthChartData = ({ Asks = [], Bids = [], SpotPrice }) => {
    if (!pageIsVisible() || !Asks.length || !Bids.length) {
      return;
    }

    runInAction(() => {
      let asksBuffer = Asks;
      let bidsBuffer = Bids;

      // please read and understand the below description before you change anything in this method
      // (edit the wiki when you change the logic)
      // https://gitlab.com/cryptoems/blockchain-terminal-ui/wikis/OrderBook-data-processing

      if (this.baseSymbol === 'F:USD' || this.baseSymbol === 'USDT') {
        // reverse orderbook
        asksBuffer = reverseOrderBookPrices(Asks, SpotPrice);
        bidsBuffer = reverseOrderBookPrices(Bids, SpotPrice);
      } else if (this.multiLegMode) {
        // convert prices and amounts using multiLeg data
        const quoteQualifier =
          this.baseSymbol.includes('F:') || this.baseSymbol.includes('S:') ? this.multiLegAmountRate : 1;
        asksBuffer = convertOrderBookPrices(asksBuffer, this.multiLegPriceRate, quoteQualifier);
        bidsBuffer = convertOrderBookPrices(bidsBuffer, this.multiLegPriceRate, quoteQualifier);
      }

      this.dcBids = this.patchLevels(bidsBuffer);
      this.dcAsks = this.patchLevels(asksBuffer.slice().reverse());

      this.isDepthChartLoaded = this.dcAsks.length > 10 && this.dcBids.length > 10;
    });
  };

  handleDepthChartError = () => {
    this.showSubscriptionMessage('Order book data feed subscription failed to return response');
    this.isDepthChartTimedOut = true;
    this.instrumentStoreRef.setBase('BTC');
  };

  /**
   * Reaction handler for orderbook midPrice
   */
  priceReaction = (reactionHandler, fireImmediately = false) => {
    return reaction(
      () => ({ price: this.price }),
      ({ price }) => {
        const base = this.base.replace('F:', '').replace('S:', '');
        const quote = this.quote.replace('F:', '').replace('S:', '');
        if (!this.symbol.includes(base) || !this.symbol.includes(quote)) {
          // reset a price
          reactionHandler(0);
          return;
        }

        reactionHandler(price);
      },
      { fireImmediately }
    );
  };
}

export default (instrumentStore, exchangesStore, viewModeStore, fiatCurrencyStore, snackbar) => {
  const store = new OrderBookBreakDownStore(
    instrumentStore,
    exchangesStore,
    viewModeStore,
    fiatCurrencyStore,
    snackbar
  );
  return store;
};
