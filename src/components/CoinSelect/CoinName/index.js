import React, { memo } from 'react';
import COIN_DATA_MAP from '@/mock/coin-data-map';

import { highlightSearchDom } from '@/utils';

import { CoinTitle, SymbolName, CustomWrapper } from './styles';

const getSuffix = value => {
  const isStock = (value || '').includes('S:');
  const isFiat = (value || '').includes('F:');
  const isAUM = value === 'AUM';
  const isCrypto = !isStock && !isFiat && !isAUM;
  let suffix = '';
  if (isStock) {
    suffix = `(Security${'\u00A0'}Stock)`;
  } else if (isFiat) {
    suffix = `(Fiat${'\u00A0'}Currency)`;
  } else if (isCrypto) {
    suffix = `(Crypto${'\u00A0'}Currency)`;
  }
  return suffix;
};

const CoinName = memo(
  ({
    value,
    map,
    search,
    defaultFiat,
    coinSymbolMaxLength = 0,
    isSearch,
    noLeftPadding,
    hideSymbol,
    width,
    isShowFull = true
  }) => {
    if (typeof value === 'string') {
      // header items
      let symbol = (value || '').replace('S:', '').replace('F:', '');
      symbol = symbol === 'USDT' ? (defaultFiat === 'USD' ? 'USDT' : defaultFiat) : symbol;
      let coinName = map ? map.name : COIN_DATA_MAP[value] && COIN_DATA_MAP[value].name;
      coinName = (coinName || '').replace('S:', '');
      if (isSearch) {
        return (
          <CoinTitle header isSearch noLeftPadding={noLeftPadding}>
            {symbol}
          </CoinTitle>
        );
      }
      const text = `${coinName || symbol} ${getSuffix(value)}`;
      return (
        <CoinTitle header textLength={text.length} noLeftPadding={noLeftPadding}>
          {text}
        </CoinTitle>
      );
    }

    const symbol = (value && value.symbol ? value.symbol : '').replace('S:', '').replace('F:', '');
    const symbolName = highlightSearchDom(symbol, search);
    const isSymbolNameHighlighted = typeof symbolName !== 'string';

    // items for dropdown list
    let coinName = '';
    if (value && value.name) {
      if (!isSymbolNameHighlighted) {
        coinName = highlightSearchDom(value.name, search);
      } else {
        coinName = value.name;
      }
    }

    if (!value || !value.name) {
      return <CoinTitle>{symbolName}</CoinTitle>;
    }

    const symbolWidth = 22 * coinSymbolMaxLength;

    return (
      <CoinTitle search={`${search}`} noLeftPadding={noLeftPadding}>
        <CustomWrapper width={`${symbolWidth}`}>
          <SymbolName hideSymbol={hideSymbol} width={width}>
            {(!search || (search && isSymbolNameHighlighted)) && <span className="symbol-name">{symbolName}</span>}
            {isShowFull ? <span className="coin-name">{coinName}</span> : ''}
            {search && !isSymbolNameHighlighted && <span className="symbol-name-right">&nbsp;({symbolName})</span>}
          </SymbolName>
        </CustomWrapper>
      </CoinTitle>
    );
  }
);

export default CoinName;
