import React from 'react';
import { observable, action, reaction } from 'mobx';
import uuidv4 from 'uuid/v4';

import {
  OrderExecutionPlanRequest,
  GetExecPlans,
  orderEventsObservable,
  orderConfirmationObservable,
  OrderEvents
} from '../lib/bct-ws';

const throttleMs = 2000;

export const donutChartModeStateKeys = {
  defaultModeKey: 'default',
  loadingModeKey: 'loading',
  doneModeKey: 'done'
};

class LowestExchangeStore {
  @observable Plan = [];
  @observable PlanForExchangesBar = [];
  @observable hoverExchange = '';
  @observable hoverExchangeFromDonut = '';
  @observable confirmed = false;
  @observable averagePrice = 0;
  @observable totalPrice = 0;
  @observable donutChartStatus = donutChartModeStateKeys.defaultModeKey;
  @observable isDonutModeFinishedForLabel = false; // true: finishing step, false: normal donut mode
  @observable isAutoTradingLoading = false;

  __subscriptionInited = false;
  ExecPlans$ = null;
  __orderEventSubscriptionInited = false;
  OrderEvents$ = null;

  symbol = null;
  amount = 0;
  incomingCount = 0;
  execPlanIntId = null;
  isArbDetailMode = false;

  startExecPlanTimeout = null;

  constructor(orderForm, orderBookStore, snackbar, telegramStore, convertStore, viewModeStore) {
    const isLoggedIn = localStorage.getItem('authToken');
    this.snackbar = snackbar;
    this.convertStore = convertStore;

    reaction(
      () => {
        return {
          amount: orderForm.Amount,
          baseSymbol: orderForm.baseSymbol,
          quoteSymbol: orderForm.quoteSymbol
        };
      },
      ({ amount, baseSymbol, quoteSymbol }) => {
        this.symbol = `${baseSymbol}-${quoteSymbol}`;
        this.amount = amount;
      }
    );

    reaction(
      () => {
        return {
          isArbDetailMode: viewModeStore.isArbDetailMode
        };
      },
      ({ isArbDetailMode }) => {
        this.isArbDetailMode = isArbDetailMode;
      }
    );

    this.ExecPlans$ = GetExecPlans({
      throttleMs
    });

    if (!this.__subscriptionInited) {
      this.ExecPlans$.subscribe({ next: this.handleIncomingExecPlanFrames.bind(this) });

      this.__subscriptionInited = true;
    }

    if (isLoggedIn) {
      this.requestOrderEvents();
    }

    reaction(
      () => {
        return {
          isPricesByExchangeCCASorted: orderBookStore.isPricesByExchangeCCASorted
        };
      },
      ({ isPricesByExchangeCCASorted }) => {
        if (isPricesByExchangeCCASorted === 1) {
          this.displayMessage('No exchanges exist for selected coin pair');
        }
      }
    );
  }

  displayMessage(msg) {
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

  requestOrderEvents() {
    this.OrderEvents$ = OrderEvents({
      throttleMs
    });

    if (!this.__orderEventSubscriptionInited) {
      this.__orderEventSubscriptionInited = true;

      orderConfirmationObservable.subscribe({
        next: orderConfirmation => {
          if (!orderConfirmation || !orderConfirmation.PlanOrders || this.isAutoTradingLoading) {
            return;
          }
          const EndCoin = orderConfirmation.EndCoin;
          const StartCoin = orderConfirmation.StartCoin;
          const plans = orderConfirmation.PlanOrders;
          if (plans && plans.length > 0) {
            const planTemp = [];
            for (let i = 0; i < plans.length; i++) {
              const obj = {};
              obj.Amount = StartCoin === 'USDT' ? plans[i].SpendAmount / plans[i].Price : plans[i].SpendAmount;
              obj.Ask = StartCoin;
              obj.Bid = EndCoin;
              obj.Exchange = plans[i].Exchange;
              obj.Price = plans[i].Price;
              obj.Side = StartCoin === 'USDT' ? 'buy' : 'sell';
              obj.Symbol = plans[i].Symbol;
              obj.spentAmount = StartCoin === 'USDT' ? plans[i].SpendAmount : plans[i].SpendAmount * plans[i].Price;
              obj.progress = 0;
              obj.Percentage = plans[i].Percentage;
              planTemp.push(obj);
            }
            // console.log("[planTemp]", planTemp);
            // this.Plan = planTemp;
            this.PlanForExchangesBar = planTemp;
          }
        }
      });

      orderEventsObservable.subscribe({
        next: orderEvents => {
          if (!orderEvents || this.isAutoTradingLoading) {
            return;
          }
          const event = orderEvents;
          const status = event.status || '';
          if (status === 'error') {
            return;
          }

          /**
           * Update Lowest ExchangeBar progress bars.
           */
          const FillPercentage = !!event.FillPercentage ? event.FillPercentage : 0;
          const Exchange = event.Exchange;

          for (let i = 0; i < this.PlanForExchangesBar.length; i++) {
            if (
              this.PlanForExchangesBar[i].Exchange !== undefined &&
              Exchange &&
              this.PlanForExchangesBar[i].Exchange.toLowerCase() === Exchange.toLowerCase() &&
              Number(this.PlanForExchangesBar[i].progress) <= Number(FillPercentage)
            ) {
              this.PlanForExchangesBar[i].Side = event.Side;
              this.PlanForExchangesBar[i].Price = event.ConversionCoef || 0;
              this.PlanForExchangesBar[i].spentAmount = event.SpentAmount || 0;
              this.PlanForExchangesBar[i].Amount =
                this.PlanForExchangesBar[i].spentAmount * this.PlanForExchangesBar[i].Price;
              this.PlanForExchangesBar[i].progress = FillPercentage;
              if (event.Percentage !== undefined && event.Percentage !== 0)
                this.PlanForExchangesBar[i].Percentage = event.Percentage || 0;
              break;
            }
          }
        }
      });
    }
  }

  /**
   *  initialize execution plan exchanges progress
   */
  handleIncomingExecPlanFrames(planData) {
    let data = planData;
    if (this.isAutoTradingLoading) {
      return;
    }

    // if (!this.confirmed && Number(this.amount) !== 0 && !this.hoverExchangeFromDonut) {
    if (!this.isArbDetailMode) {
      if (this.donutChartStatus === donutChartModeStateKeys.loadingModeKey) {
        this.donutChartStatus = donutChartModeStateKeys.doneModeKey;
      }
      this.incomingCount++;

      const details = data.Details;
      this.averagePrice = details ? details.ConversionCoef : this.averagePrice; // details ? details.AveragePrice : 0;
      this.totalPrice = details ? details.Total : this.totalPrice;
      this.amount = this.totalPrice / this.averagePrice;
      data = data.Plan;

      if (data && data.length > 0) {
        let isSideBuy = false;
        for (let i = 0; i < data.length; i++) {
          if (i < this.PlanForExchangesBar.length) {
            data[i].progress = this.PlanForExchangesBar[i].progress;
          } else {
            data[i].progress = 0;
          }
          data[i].Price = data[i].Amount / data[i].spentAmount || 0;
          if (!isSideBuy && data[i].Side === 'buy') {
            isSideBuy = true;
            data[i].Amount = data[i].spentAmount;
            data[i].spentAmount = data[i].Amount / data[i].Price;
          }
        }

        if (isSideBuy) {
          this.averagePrice = 1 / this.averagePrice;
        }

        data.sort((a, b) => (b.Price || 0) - (a.Price || 0));

        // data.sort((a, b) => (a.Percentage || 0) - (b.Percentage || 0));
        this.Plan = data;

        // data.sort((a, b) => (b.Price || 0) - (a.Price || 0));
        this.PlanForExchangesBar = data;
      }
    }
  }

  @action.bound resetExecPlan() {
    this.PlanForExchangesBar = [];
    this.confirmed = false;
  }

  @action.bound resetDonutChartStatus() {
    this.donutChartStatus = donutChartModeStateKeys.defaultModeKey;
  }

  @action.bound updateHoverExchange(exch) {
    this.hoverExchangeFromDonut = '';
    this.hoverExchange = exch;
  }

  @action.bound updateHoverExchangeFromDonut(exch) {
    this.hoverExchangeFromDonut = exch;
  }

  @action.bound clearExecPlanInterval() {
    clearInterval(this.execPlanIntId);
  }

  async __setExecPlans() {
    /**
         *  Order Execution - start
         - event = 'StartExecPlan'
         - payload:
         {
            ExecPlanId: 'd2a2b8a3-082e-4208-878d-fb7858ca1024',
            Symbol: 'BTC-USDT',
            Side: 'Sell', // Buy
            Size: 12.345465,
         }
         */
    const uuid = uuidv4();
    localStorage.setItem('ExecPlanId', uuid);
    OrderExecutionPlanRequest({
      ExecPlanId: uuid,
      // Symbol: this.symbol,
      Symbol: 'BTC-ETH',
      Side: 'Sell',
      Size: this.amount
    });

    this.incomingCount = 0;
  }

  @action.bound setAutoTradingLoading(mode) {
    this.isAutoTradingLoading = mode;
  }
}

export default (orderForm, orderBookStore, snackbar, telegramStore, convertStore, viewModeStore) => {
  const store = new LowestExchangeStore(
    orderForm,
    orderBookStore,
    snackbar,
    telegramStore,
    convertStore,
    viewModeStore
  );
  return store;
};
