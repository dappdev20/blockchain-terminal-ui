import { exchanges, coins, custodians } from './marketData';

// Generic Utils

export const randSelectionFrList = options => {
  return options[Math.floor(Math.random() * options.length)];
};

export const genRandFloat = (lowRange, highRange, float) => {
  return (Math.random() * (highRange - lowRange) + lowRange).toFixed(float);
};

// Component Utils
export const genFilledOrders = numRows => {
  const filledOrders = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    filledOrders.push({
      exchange: randSelectionFrList(exchanges),
      product: `${randSelectionFrList(coins)}/${randSelectionFrList(coins)}`,
      size: genRandFloat(0, 1, 4),
      filled: genRandFloat(0, 1, 4),
      price: genRandFloat(0, 1000, 2),
      fee: genRandFloat(0, 0, 4),
      time: `${genRandFloat(0, 59, 0)}M AGO`,
      orderStatus: randSelectionFrList(['FILLED', 'CANCELED'])
    });
  }
  return filledOrders;
};

export const genTradeHistory = numRows => {
  const tradeHistory = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    tradeHistory.push({
      time: '07.22.2019',
      pair: `${randSelectionFrList(coins)}/${randSelectionFrList(coins)}`,
      type: randSelectionFrList(['Limit', 'Market']),
      price: genRandFloat(0, 1, 4),
      filled: genRandFloat(0, 1000, 2),
      fee: genRandFloat(0, 0, 4),
      total: genRandFloat(0, 100, 0)
    });
  }
  return tradeHistory;
};

export const genOpenOrders = numRows => {
  const openOrders = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    openOrders.push({
      time: '07.22.2019',
      product: `${randSelectionFrList(coins)}/${randSelectionFrList(coins)}`,
      type: 'limit',
      side: 'buy',
      price: genRandFloat(0, 1, 4),
      size: genRandFloat(0, 1, 4),
      filled: genRandFloat(0, 1, 4),
      total: genRandFloat(0, 1, 4),
      triggers: genRandFloat(0, 1, 4),
      cancel: 'somebutton'
    });
  }
  return openOrders;
};

export const genOrderData = numRows => {
  const orderData = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    orderData.push({
      price: genRandFloat(386, 392, 2),
      amount: genRandFloat(0, 99, 6),
      exchange: randSelectionFrList(exchanges)
    });
  }
  return orderData;
};

export const genPortfolioData = numRows => {
  const PortfolioData = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    PortfolioData.push({
      coin: randSelectionFrList(coins),
      '%': genRandFloat(100, 0, 0),
      size: genRandFloat(99, 0, 5),
      amount: genRandFloat(99, 0, 5),
      'days %': genRandFloat(99, 0, 2),
      exchange: randSelectionFrList(exchanges)
    });
  }
  return PortfolioData;
};

export const genPortfolioNewData = numRows => {
  const PortfolioData = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    PortfolioData.push({
      coin: randSelectionFrList(coins),
      size: genRandFloat(1, 9, 4),
      amount: genRandFloat(10, 100, 2),
      custodian: randSelectionFrList(custodians)
    });
  }
  return PortfolioData;
};

export const genRecentTradesData = numRows => {
  const recentTradesData = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    recentTradesData.push({
      price: genRandFloat(99, 0, 2),
      amount: genRandFloat(99, 0, 10),
      exchange: randSelectionFrList(exchanges),
      isBuy: randSelectionFrList([true, false])
    });
  }
  return recentTradesData;
};

export const genLowestPriceExchangeData = numRows => {
  const lowestPriceExchangeData = [];
  let i = 0;
  for (i; i < numRows; ++i) {
    lowestPriceExchangeData.push({
      exchange: randSelectionFrList(exchanges),
      toAmt: 1,
      toCoin: 'ETH',
      fromAmt: genRandFloat(0.14, 0.15, 2),
      fromCoin: 'USDT'
    });
  }
  return lowestPriceExchangeData;
};
