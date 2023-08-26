/* eslint-disable */
import findIndex from 'lodash/findIndex';
import {
  PORTFOLIO_LABEL_AMOUNT,
  PORTFOLIO_LABEL_COIN,
  PORTFOLIO_LABEL_POSITION,
  PORTFOLIO_LABEL_PRICE,
  PORTFOLIO_LABEL_CHANGE,
  PORTFOLIO_LABEL_NAME,
  PORTFOLIO_LABEL_MKTCAP,
  PORTFOLIO_LABEL_TOTALVOLUME24H,
  PORTFOLIO_LABEL_ISWALLETENABLED
} from '../../config/constants';

export const normalizeYourAccountPositionDataWithAllCoins = (Positions, allCoins) => {
  let finalPositions = [];
  let newPositions = [...Positions];
  let newAllCoins = [...allCoins];

  const isLoggedIn = localStorage.getItem('authToken');

  for (let i = 0; i < newPositions.length; i++) {
    let position = { ...newPositions[i] };

    const index = findIndex(newAllCoins, { coin: position[PORTFOLIO_LABEL_COIN] });

    const {
      price: cryptoCompareCoinValue,
      priceChange24: cryptoCompareChangeValue,
      marketCap: cryptoCompareMarketcap,
      marketVolume24: cryptoCompareVolume,
      fullName: coinFullName,
      isEnabled: isWalletEnabled
    } = newAllCoins[index] || {};
    const coinValue = !!cryptoCompareCoinValue ? cryptoCompareCoinValue : 0;
    position[PORTFOLIO_LABEL_AMOUNT] = position[PORTFOLIO_LABEL_POSITION] * coinValue;
    position[PORTFOLIO_LABEL_PRICE] = coinValue;
    position[PORTFOLIO_LABEL_CHANGE] = cryptoCompareChangeValue || 0;
    position[PORTFOLIO_LABEL_MKTCAP] = cryptoCompareMarketcap;
    position[PORTFOLIO_LABEL_TOTALVOLUME24H] = cryptoCompareVolume;
    position[PORTFOLIO_LABEL_ISWALLETENABLED] = isWalletEnabled;
    const symbol = position[PORTFOLIO_LABEL_COIN];
    position[PORTFOLIO_LABEL_NAME] = coinFullName || ''; //(symbol in coindata && 'name' in coindata[symbol]) ? coindata[symbol].name : '';

    finalPositions.push(position);
    newAllCoins.splice(index, 1);
  }

  for (let i = 0; i < newAllCoins.length; i++) {
    let position = newAllCoins[i];

    // if (!isShortSell && position[PORTFOLIO_LABEL_COIN] === 'BCT') {
    //     continue;
    // }

    const {
      price: cryptoCompareCoinValue,
      priceChange24: cryptoCompareChangeValue,
      marketCap: cryptoCompareMarketcap,
      marketVolume24: cryptoCompareVolume,
      fullName: coinFullName,
      isEnabled: isWalletEnabled
    } = position || {};
    const coinValue = !!cryptoCompareCoinValue ? cryptoCompareCoinValue : 0;
    position[PORTFOLIO_LABEL_AMOUNT] = position[PORTFOLIO_LABEL_POSITION] * coinValue;
    position[PORTFOLIO_LABEL_PRICE] = coinValue;
    position[PORTFOLIO_LABEL_CHANGE] = cryptoCompareChangeValue || 0;
    position[PORTFOLIO_LABEL_MKTCAP] = cryptoCompareMarketcap;
    position[PORTFOLIO_LABEL_TOTALVOLUME24H] = cryptoCompareVolume;
    position[PORTFOLIO_LABEL_ISWALLETENABLED] = isWalletEnabled;
    const symbol = position[PORTFOLIO_LABEL_COIN];
    position[PORTFOLIO_LABEL_NAME] = coinFullName || ''; //(symbol in coindata && 'name' in coindata[symbol]) ? coindata[symbol].name : '';

    if (!isLoggedIn) {
      position[PORTFOLIO_LABEL_POSITION] = 1; // it is for unauthorized user's every 1 balance.
      if (symbol !== 'BCT') {
        finalPositions.push(position);
      }
    } else {
      position[PORTFOLIO_LABEL_POSITION] = 0; // it is for authorized user's balance.
      finalPositions.push(position);
    }
  }
  if (finalPositions.length > 0) {
    const index = finalPositions.findIndex(x => x && x.Coin && x.Coin === 'USDT');
    const usdtItem = finalPositions[index];
    finalPositions.splice(index, 1);
    finalPositions.unshift(usdtItem);
  }
  return finalPositions;
};

export const registerForPositionReplies = (PositionReply, ClientId, next, error) => {
  return PositionReply({ ClientId }).subscribe({
    next,
    error
  });
};

export const updatePositionError = e => console.log(e);

export const updatePosition = (updateYourAccountStoreData, portfolioData) => {
  if (portfolioData === undefined) return;
  const { event, data: { body: { messages } = {} } = {} } = portfolioData;
  if (messages === undefined || messages.length === 0) {
    return;
  }

  let [{ Positions }] = messages;

  // skip fetching prices from cryptocompare, reserving original code =========================================
  if (!!Positions) {
    updateYourAccountStoreData(Positions, null, event);
  }
};
