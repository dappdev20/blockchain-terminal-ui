import { observable, action, reaction, computed, autorun } from 'mobx';
import BigNumber from 'bignumber.js';

import { roundToFixedNum } from '@/utils';
import {
  OrderTicketPayload,
  getOrderPrice,
  getOrderAmount,
  getOrderSymbol,
  getOrderSide
} from './utils/OrderEntryUtils';
import { BUY_SIDE, ClientId, ORDER_TICKET_TICKET_ID, SELL_SIDE } from '@/config/constants';

class OrderTicketForm {
  @observable Amount = '';
  @observable Price = '';
  @observable StopPrice = '';
  @observable submitInProgress = false;

  @observable baseSymbol = null;
  @observable quoteSymbol = null;
  @observable LastOrderTicketData = null;

  // Slider max value for order form, set by reaction from portfolioData change
  @observable sliderMax = '';

  submissionHandler = null;
  side = null;
  setTargetTradeHistoryTicket = null;
  accurateAmount = '';
  programId = '';

  isUserEnteredPrice = false;

  constructor(side, setTargetTradeHistoryTicket, programId) {
    this.side = side;
    this.setTargetTradeHistoryTicket = setTargetTradeHistoryTicket;
    this.programId = programId;
  }

  @action.bound setSliderMax(amount = '') {
    this.sliderMax = amount;
  }

  @action.bound setAmount(amount = '') {
    // input validation to prevent values over wallet number
    if (Number.parseFloat(amount) > this.accurateAmount) {
      this.Amount = this.accurateAmount;
    } else {
      this.Amount = amount;
    }
  }

  @action.bound setAccurateAmount(amount = '') {
    this.accurateAmount = amount;
  }

  @action.bound setPrice(price) {
    if (!this.isUserEnteredPrice) {
      this.Price = price;
    }
  }

  @action.bound setUserEnteredPrice(price) {
    if (!this.isUserEnteredPrice) {
      this.isUserEnteredPrice = true;
    }
    this.Price = price;
  }

  @action.bound setStopPrice(price) {
    this.StopPrice = price;
  }

  @action.bound
  reset() {
    this.Amount = '';
    this.Price = '';
    this.isUserEnteredPrice = false;
  }

  @computed get amount() {
    return this.Amount;
  }

  @computed get price() {
    return this.Price;
  }

  @computed get stopPrice() {
    return this.StopPrice;
  }

  @computed get total() {
    return roundToFixedNum(Number(this.amount) * Number(this.price), 6).toString();
  }

  @computed get enabled() {
    return !!(
      !this.submitInProgress &&
      this.baseSymbol &&
      this.quoteSymbol &&
      Number(this.total) > 0 &&
      this.submissionHandler
    );
  }

  @computed get lastOrderAmountExchanged() {
    return this.LastOrderTicketData === null ? '0' : getOrderAmount(this.LastOrderTicketData).toString();
  }

  @computed get lastOrderAmountReceived() {
    return this.LastOrderTicketData === null
      ? '0'
      : (getOrderPrice(this.LastOrderTicketData) * Number(this.lastOrderAmountExchanged)).toString();
  }

  @computed get lastOrderSymbol() {
    return this.LastOrderTicketData === null ? 'ETH-BTC' : getOrderSymbol(this.LastOrderTicketData).toString();
  }

  @computed get lastOrderSide() {
    return this.LastOrderTicketData === null ? 'Sell' : getOrderSide(this.LastOrderTicketData).toString();
  }

  setSubmissionHandler(submissionHandler) {
    this.submissionHandler = submissionHandler;
  }

  setSymbolPair(baseSymbol, quoteSymbol) {
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
  }

  @action.bound
  __submitProgressStart() {
    this.submitInProgress = true;
  }

  @action.bound
  __submitProgressStop() {
    this.submitInProgress = false;
    this.isUserEnteredPrice = false;
  }

  @action.bound
  submitOrder() {
    this.__submitProgressStart();

    if (Number(this.Amount) > Number(this.accurateAmount)) {
      this.Amount = this.accurateAmount;
    }

    const payload = OrderTicketPayload(
      this.baseSymbol,
      this.quoteSymbol,
      this.Amount,
      this.Price,
      this.side,
      localStorage.getItem('authClientId') || ClientId,
      this.programId
    );
    this.LastOrderTicketData = payload;
    this.submissionHandler(payload);
    this.setTargetTradeHistoryTicket(payload[ORDER_TICKET_TICKET_ID]);

    // this.reset();
    this.__submitProgressStop();
  }
}

class MarketOrderForm extends OrderTicketForm {
  constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
    super(side, setTargetTradeHistoryTicket, programId);
    this.highestBidPrice = highestBidPrice;
    this.lowestAskPrice = lowestAskPrice;

    // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
    reaction(
      () => coinsPairSearchForm.amount,
      amount => {
        super.setAmount(amount);
      }
    );

    this.__initMarketPriceReaction();
  }

  __initMarketPriceReaction() {
    reaction(() => this.marketOrderPrice, marketOrderPrice => super.setPrice(marketOrderPrice), {
      fireImmediately: true
    });
  }

  @computed
  get marketOrderPrice() {
    return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
  }
}

class LimitOrderForm extends OrderTicketForm {
  constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
    super(side, setTargetTradeHistoryTicket, programId);
    this.highestBidPrice = highestBidPrice;
    this.lowestAskPrice = lowestAskPrice;

    // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
    reaction(
      () => coinsPairSearchForm.amount,
      amount => {
        super.setAmount(amount);
      }
    );

    this.__initLimitPriceReaction();
  }

  __initLimitPriceReaction() {
    reaction(() => this.limitOrderPrice, limitOrderPrice => super.setPrice(limitOrderPrice), { fireImmediately: true });
  }

  @computed
  get limitOrderPrice() {
    return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
  }
}

class StopOrderForm extends OrderTicketForm {
  constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
    super(side, setTargetTradeHistoryTicket, programId);
    this.highestBidPrice = highestBidPrice;
    this.lowestAskPrice = lowestAskPrice;

    // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
    reaction(
      () => coinsPairSearchForm.amount,
      amount => {
        super.setAmount(amount);
      }
    );

    this.__initStopPriceReaction();
  }

  __initStopPriceReaction() {
    reaction(() => this.stopOrderPrice, stopOrderPrice => super.setPrice(stopOrderPrice), { fireImmediately: true });
  }

  @computed
  get stopOrderPrice() {
    return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
  }
}

class SpotOrderForm extends OrderTicketForm {
  constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
    super(side, setTargetTradeHistoryTicket, programId);
    this.highestBidPrice = highestBidPrice;
    this.lowestAskPrice = lowestAskPrice;

    // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
    reaction(
      () => coinsPairSearchForm.amount,
      amount => {
        super.setAmount(amount);
      }
    );

    this.__initMarketPriceReaction();
  }

  __initMarketPriceReaction() {
    reaction(() => this.marketOrderPrice, marketOrderPrice => super.setPrice(marketOrderPrice), {
      fireImmediately: true
    });
  }

  @computed
  get marketOrderPrice() {
    return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
  }
}

class CoinPairMarketOrderForm extends OrderTicketForm {
  @observable coinPrice = 0;
  coinPriceFromStore = -1;

  @computed
  get estimatedAmountReceived() {
    let marketOrderPriceMultiplier = new BigNumber(!Number.isNaN(Number(this.Amount)) ? this.Amount.toString() : 1);
    marketOrderPriceMultiplier = marketOrderPriceMultiplier.multipliedBy(new BigNumber(Number(this.coinPrice)));
    return marketOrderPriceMultiplier.toString();
  }

  @computed
  get validAmountEntered() {
    const amount = Number(this.Amount);
    // const price = Number(this.Price);
    const validAmountEntered = !Number.isNaN(amount) && !!amount;
    // const validPrice = !Number.isNaN(price) && price !== 0; // In case recent trade data isn't flowing (yet).
    return validAmountEntered;
  }
}

class OrderEntryStore {
  @observable selectedAskOrderItem = null;
  @observable selectedBidOrderItem = null;
  @observable selectedAsk = null;
  @observable selectedBid = null;

  updateFormAmountToAvailableMaxTimeout = null;

  constructor(
    orderBookBreakDownStore,
    highestBidPrice,
    lowestAskPrice,
    instrumentsReaction,
    snackbar,
    setTargetTradeHistoryTicket
  ) {
    autorun(() => {
      this.Bids = orderBookBreakDownStore.bids;
      this.Asks = orderBookBreakDownStore.asks;
    });

    this.snackbar = snackbar;

    this.CoinsPairSearchMarketOrderBuyForm = new CoinPairMarketOrderForm(
      SELL_SIDE,
      setTargetTradeHistoryTicket,
      'simple'
    );

    this.MarketOrderBuyForm = new MarketOrderForm(
      BUY_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );
    this.MarketOrderSellForm = new MarketOrderForm(
      SELL_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );

    this.LimitOrderFormBuy = new LimitOrderForm(
      BUY_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );
    this.LimitOrderFormSell = new LimitOrderForm(
      SELL_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );

    this.StopOrderFormBuy = new StopOrderForm(
      BUY_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );
    this.StopOrderFormSell = new StopOrderForm(
      SELL_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );

    this.SpotOrderFormBuy = new SpotOrderForm(
      BUY_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );
    this.SpotOrderFormSell = new SpotOrderForm(
      SELL_SIDE,
      setTargetTradeHistoryTicket,
      'standard',
      highestBidPrice,
      lowestAskPrice,
      this.CoinsPairSearchMarketOrderBuyForm
    );

    this.__initSelectedOrderItemReaction();
    this.__initInstrumentReactionHandler(instrumentsReaction);
  }

  // Reaction when user changes coin pair form baseSymbol and quoteSymbol, set amount to Max
  __initInstrumentReactionHandler(instrumentsReaction) {
    instrumentsReaction((baseSymbol, quoteSymbol) => {
      this.MarketOrderBuyForm.reset();
      this.MarketOrderBuyForm.setSymbolPair(baseSymbol, quoteSymbol);

      this.MarketOrderSellForm.reset();
      this.MarketOrderSellForm.setSymbolPair(baseSymbol, quoteSymbol);

      this.LimitOrderFormBuy.reset();
      this.LimitOrderFormBuy.setSymbolPair(baseSymbol, quoteSymbol);

      this.LimitOrderFormSell.reset();
      this.LimitOrderFormSell.setSymbolPair(baseSymbol, quoteSymbol);

      this.StopOrderFormBuy.reset();
      this.StopOrderFormBuy.setSymbolPair(baseSymbol, quoteSymbol);

      this.StopOrderFormSell.reset();
      this.StopOrderFormSell.setSymbolPair(baseSymbol, quoteSymbol);

      this.SpotOrderFormBuy.reset();
      this.SpotOrderFormBuy.setSymbolPair(baseSymbol, quoteSymbol);

      this.SpotOrderFormSell.reset();
      this.SpotOrderFormSell.setSymbolPair(baseSymbol, quoteSymbol);

      this.CoinsPairSearchMarketOrderBuyForm.reset();
      this.CoinsPairSearchMarketOrderBuyForm.setSymbolPair(baseSymbol, quoteSymbol);
    }, true);
  }

  __initSelectedOrderItemReaction() {
    reaction(
      () => this.selectedAskOrderItem,
      ({ amount, price }) => {
        this.LimitOrderFormSell.setAmount(amount);
        this.LimitOrderFormSell.setUserEnteredPrice(price);

        this.StopOrderFormSell.setAmount(amount);
        this.StopOrderFormSell.setUserEnteredPrice(price);
      }
    );

    reaction(
      () => this.selectedBidOrderItem,
      ({ price, amount }) => {
        this.LimitOrderFormBuy.setAmount(amount);
        this.LimitOrderFormBuy.setUserEnteredPrice(price);

        this.StopOrderFormBuy.setAmount(amount);
        this.StopOrderFormBuy.setUserEnteredPrice(price);
      }
    );
  }

  @action.bound
  setOrderFormData(data) {
    this.selectedAskOrderItem = data;
    this.selectedBidOrderItem = data;
  }
}

export default (
  Asks$,
  Bids$,
  highestBidPrice,
  lowestAskPrice,
  instrumentsReaction,
  snackbar,
  setTargetTradeHistoryTicket
) =>
  new OrderEntryStore(
    Asks$,
    Bids$,
    highestBidPrice,
    lowestAskPrice,
    instrumentsReaction,
    snackbar,
    setTargetTradeHistoryTicket
  );
