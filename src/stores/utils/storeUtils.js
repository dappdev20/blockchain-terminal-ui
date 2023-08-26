import distanceInWords from 'date-fns/distance_in_words';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import moment from 'moment';

import { roundToFixedNum } from '@/utils';

export const isDiffArr = (a = [], b = []) => {
  let i = -1;
  const alen = a.length;

  while (++i < alen) {
    if (a[i] !== b[i]) {
      return true;
    }
  }
  return false;
};

export const transformOrderBookData = (data, noise) => {
  // allways from smaller to bigger
  const size = data.length;
  const result = [];
  let cumulativeAmount = 0;
  for (let i = 0; i < size; i++) {
    const [price, amount, exchanges] = data[i];
    cumulativeAmount += amount;

    result.push({
      price: price + noise,
      amount,
      cost: price * amount,
      exchange: exchanges ? exchanges.toUpperCase() : '',
      total: i < size - 1 ? data[i + 1][0] : price,
      cumulativeAmount
    });
  }

  return result;
};

export const processOrderBookData = data => {
  let totalAmount = 0;
  let totalCost = 0;
  let maxAmount = 0;
  let maxCost = 0;
  let maxPrice = 0;

  data.forEach(([price, amount]) => {
    const cost = price * amount;

    totalAmount += amount;
    totalCost += cost;

    maxAmount = Math.max(maxAmount, amount);
    maxPrice = Math.max(maxPrice, price);
    maxCost = Math.max(maxCost, cost);
  });

  return {
    totalAmount,
    totalCost,
    maxAmount,
    maxCost,
    maxPrice
  };
};

export const reverseOrderBookPrices = (data, spotPrice) => {
  const reversedRate = 1 / spotPrice;
  return data.map(([price, amount, exchanges]) => [
    (price / spotPrice) * reversedRate,
    amount / reversedRate,
    exchanges
  ]);
};

export const convertOrderBookPrices = (data, priceRate, amountRate) => {
  return data.map(([price, amount, exchanges]) => [price * priceRate, amount * amountRate, exchanges]);
};

export const shiftMapStoreFromArray = (mapStore = new Map(), updateArr = [], maxRows = 0) => {
  const updateArrLen = updateArr.length;

  if (updateArrLen >= maxRows) {
    let i = -1;
    while (updateArr[++i] && i < maxRows) {
      mapStore.set(i, updateArr[i]);
    }
  } else {
    const tmp = new Map();
    const carryLimit = maxRows - updateArrLen;
    let i = -1;
    let j = updateArrLen - 1;

    // cache old indices
    while (++i < carryLimit && mapStore.has(i) && ++j < maxRows) {
      tmp.set(j, mapStore.get(i));
    }

    // then prepend incoming updateArr to mapStore
    i = -1;
    while (++i < updateArrLen) {
      mapStore.set(i, updateArr[i]);
    }

    /* eslint-disable-next-line */
    for (let [k, v] of tmp) {
      mapStore.set(k, v);
    }
  }
};

export const formatNumForDisplay = num => roundToFixedNum(num, 2);

export const calculateFee = (size, price, precision) => formatNumForDisplay(size * price * 0.001, precision);

export const getTimeFormatted = time => distanceInWords(parse(time), new Date(), { includeSeconds: true });

export const scheduleVisualDOMUpdate = fn => {
  requestAnimationFrame(fn);
};

export const getDateFormatted = time => format(new Date(time), 'MM.DD.YYYY');

export const getNewDateFormatted = time => {
  return moment(time).format('MMM D');
};
