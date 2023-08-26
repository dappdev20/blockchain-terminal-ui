import { observable, action, reaction } from 'mobx';
import { isEqual } from 'lodash';
import moment from 'moment';
import { ClientId } from '../config/constants';
import { OrderHistoryReply, OrderHistoryRequest, orderHistoryObservable } from '../lib/bct-ws';
import { formatOrderHistoryDataForDisplay } from './utils/OrderHistoryUtils';

const throttleMs = 200;

class OrderHistory {
  @observable OrderHistoryData = [];
  @observable PortfolioGraphData = [];
  @observable lastPortfolioValue = 0;
  @observable TargetTicketId = '';

  orderHistoryReply$ = null;
  __subscriptionInited = false;
  PortfolioGraphData$ = [];

  fiatPrice = 1;
  isDefaultCrypto = true;
  defaultCryptoPrice = 0;
  countries = [];
  activePostions = [];
  Bases = [];

  constructor(instrumentStore, settingsStore) {
    this.fiatPrice = settingsStore.price;
    this.defaultCryptoPrice = settingsStore.defaultCryptoPrice;

    reaction(
      () => ({
        Bases: instrumentStore.normalizedCoins,
        activePositions: instrumentStore.activePositions
      }),
      ({ Bases, activePositions }) => {
        const cryptoArray = [];
        for (let i = 0; i < Bases.length; i++) {
          cryptoArray.push(Bases[i].symbol);
        }

        // Remove USDT and BTC from crypto array
        let index = cryptoArray.findIndex(a => a === 'USDT');
        if (index > -1) {
          cryptoArray.splice(index, 1);
        }
        index = cryptoArray.findIndex(a => a === 'BTC');
        if (index > -1) {
          cryptoArray.splice(index, 1);
        }

        // Append USDT and BTC to the start of crypto array
        cryptoArray.splice(0, 0, 'USDT', 'BTC');

        if (!isEqual(cryptoArray, this.cryptoArray) && cryptoArray.length > 0) {
          this.Bases = cryptoArray;
        }
        this.activePostions = [...activePositions];

        if (localStorage.getItem('authToken')) {
          this.requestOrderHistory();
        }
      }
    );

    reaction(
      () => ({
        price: settingsStore.price,
        defaultCryptoPrice: settingsStore.defaultCryptoPrice,
        countries: settingsStore.countries
      }),
      settings => {
        this.fiatPrice = settings.price;
        this.defaultCryptoPrice = settings.defaultCryptoPrice;
        this.PortfolioGraphData = this.getFiatPortfolioData(this.PortfolioGraphData$);
        this.countries = settings.countries;
        // this.updateOrderHistoryByFiat();
      }
    );
  }

  handleIncomingOrderHistory(orderHistoryData = {}) {
    const { body: { messages: [{ Tickets = [] } = {}] = [] } = {} } = orderHistoryData;

    if (this.Bases && this.Bases.length === 0) {
      return;
    }
    this.OrderHistoryData = formatOrderHistoryDataForDisplay(this.Bases, Tickets, this.countries);
    this.PortfolioGraphData$ = this.OrderHistoryData.slice()
      .reverse()
      .filter(item =>
        !this.isDefaultCrypto
          ? item.sourceTotal && !Number.isNaN(item.sourceTotal)
          : item.sourceFilled && !Number.isNaN(item.sourceFilled)
      )
      .map(item => ({
        x: moment(item.timeUnFormatted).valueOf(),
        y: this.isDefaultCrypto ? item.sourceFilled : item.sourceTotal
      }));

    // filter noisy from portfolio graph
    const noisyArr = [];
    let lastItem = -1;
    for (let i = 0; i < this.PortfolioGraphData$.length; i++) {
      lastItem = this.PortfolioGraphData$[i].y;
      if (lastItem > this.PortfolioGraphData$[i].y) {
        noisyArr.push(i);
      }
    }
    for (let i = noisyArr.length - 1; i >= 0; i--) {
      this.PortfolioGraphData$.splice(noisyArr[i], 1);
    }

    this.PortfolioGraphData = this.getFiatPortfolioData(this.PortfolioGraphData$);
  }

  getFiatPortfolioValue = portfolioValue => {
    if (!this.isDefaultCrypto) {
      return portfolioValue * this.fiatPrice;
    }
    return portfolioValue;
  };

  getFiatPortfolioData = usdPortfolioData => {
    const fiatPortfolioData = usdPortfolioData
      .filter(item => item.y && !Number.isNaN(item.y) && item.y !== 0)
      .map(({ x, y }) => {
        const fiatPortfolioValue = this.getFiatPortfolioValue(y);

        return {
          x,
          y: fiatPortfolioValue
        };
      });
    if (fiatPortfolioData.length) {
      this.lastPortfolioValue = fiatPortfolioData[fiatPortfolioData.length - 1].y;
    } else if (this.activePostions[0]) {
      this.lastPortfolioValue = this.activePostions[0].Position;
    }

    return fiatPortfolioData;
  };

  @action.bound
  setTargetTradeHistoryTicket(targetTicketId) {
    this.TargetTicketId = targetTicketId;
  }

  requestOrderHistory() {
    if (!this.__subscriptionInited) {
      this.orderHistoryReply$ = OrderHistoryReply({ throttleMs });
      orderHistoryObservable.subscribe({ next: this.handleIncomingOrderHistory.bind(this) });
      this.__subscriptionInited = true;
    }
    OrderHistoryRequest(localStorage.getItem('authClientId') || ClientId);
  }

  @action.bound resetOrderHistory() {
    this.OrderHistoryData = [];
    this.lastPortfolioValue = 0;
  }
}

export default (instrumentStore, settingsStore) => {
  return new OrderHistory(instrumentStore, settingsStore);
};
