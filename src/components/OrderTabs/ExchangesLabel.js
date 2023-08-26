import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../stores';
import { Label, GlobalIcon, Logo } from './Components';
import { customDigitFormatWithNoTrim } from '@/utils';

const ExchangesLabel = ({
  exchanges,
  marketExchanges,
  getActiveExchanges,
  id,
  className,
  insideGraph,
  arbMode,
  isOnTop,
  isRight,
  baseSymbol,
  quoteSymbol,
  isAUM,
  totalBalance
}) => {
  if (isAUM) {
    return (
      <Label id={id} className={className} insideGraph={insideGraph} isOnTop={isOnTop} isRight={isRight}>
        <Label>
          <span className="txt-currency">
            BTC:&nbsp;
            {`\u20BF${customDigitFormatWithNoTrim(totalBalance, 5)}`}
          </span>
        </Label>
      </Label>
    );
  }

  const activeExchanges = marketExchanges.filter(
    m => m.name !== 'Global' && exchanges[m.name] && exchanges[m.name].active
  );
  const isTradingView = activeExchanges.length > 0 || activeExchanges.length === marketExchanges.length;
  let selectedTableItem = activeExchanges[activeExchanges.length - 1];

  const selectedMarketExchanges = marketExchanges.filter(m => m.status === 'active');
  const countExchange = activeExchanges.length === 0 ? selectedMarketExchanges.length : activeExchanges.length;
  if (activeExchanges.length === 0 && selectedMarketExchanges.length === 1) {
    const activeMarketNotGlobalExchanges = marketExchanges.filter(m => m.name !== 'Global' && m.status === 'active');
    selectedTableItem = activeMarketNotGlobalExchanges[activeMarketNotGlobalExchanges.length - 1];
  }
  const selectedIcon = (selectedTableItem && selectedTableItem.icon) || null;
  const selectedBaseSymbol = (baseSymbol || '').replace('S:', '').replace('F:', '');
  const selectedQuoteSymbol = (quoteSymbol || '').replace('S:', '').replace('F:', '');

  return (
    <Label id={id} className={className} insideGraph={insideGraph} isOnTop={isOnTop} isRight={isRight}>
      {!arbMode && !isTradingView && (
        <Label>
          {countExchange !== 1 ? <GlobalIcon size={12} /> : <Logo src={`/img/exchange/${selectedIcon}`} alt="" />}
          <span className="txt-currency">{getActiveExchanges()}</span>
          <span className="txt-crypto">{` (${selectedBaseSymbol}/${selectedQuoteSymbol})`}</span>
        </Label>
      )}
      {arbMode && <Label>Rebalance (Portfolio/BTC)</Label>}
    </Label>
  );
};

export default compose(
  inject(STORE_KEYS.EXCHANGESSTORE, STORE_KEYS.ORDERBOOKBREAKDOWN, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.PORTFOLIOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.EXCHANGESSTORE]: { exchanges, marketExchanges, getActiveExchanges, validMarketExchanges },
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { baseSymbol, quoteSymbol },
      [STORE_KEYS.VIEWMODESTORE]: { arbMode },
      [STORE_KEYS.PORTFOLIOSTORE]: { totalBTCAmount: totalBalance }
    }) => {
      return {
        exchanges,
        marketExchanges,
        getActiveExchanges,
        validMarketExchanges,
        arbMode,
        baseSymbol,
        quoteSymbol,
        totalBalance
      };
    }
  )
)(ExchangesLabel);
