import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { orderFormToggleKeys } from '@/stores/MarketMaker';
import { getScreenInfo } from '@/utils';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import PriceChartCanvas from './PriceChartCanvas';
import TradingView from './TradingView';
import { BGraph, BGraphControls } from './styles';

const { isMobilePortrait: IS_MOBILE_PORTRAIT } = getScreenInfo();

class GraphTool extends Component {
  componentDidUpdate() {
    const { isDepthChartLoaded, showOrderFormWith, isFirstLoad, setIsFirstLoad } = this.props;

    // show depthChart & advanced Orderform by default when page is loaded
    if (isDepthChartLoaded && isFirstLoad) {
      if (!IS_MOBILE_PORTRAIT) {
        showOrderFormWith(orderFormToggleKeys.onToggleKey);
      }
      setIsFirstLoad(false);
    }
  }

  render() {
    const { base, quote, exchanges, tradingViewMode, rightBottomSectionFullScreenMode } = this.props;
    const baseSymbol = (base || '').replace('S:', '').replace('F:', '');
    const quoteSymbol = (quote || '').replace('S:', '').replace('F:', '');

    const exchangesKeys = Object.keys(exchanges);
    const hasExchanges =
      exchangesKeys.length &&
      exchangesKeys.some(name => exchanges[name].active) &&
      (!exchanges.Global || !exchanges.Global.active);

    const isTradingView = hasExchanges || tradingViewMode;

    return (
      <BGraph id="graph-chart-parent">
        {!rightBottomSectionFullScreenMode && (
          <BGraphControls id="graph-chart-content">
            {!isTradingView && <PriceChartCanvas />}
            {isTradingView && (
              <TradingView coinPair={baseSymbol && quoteSymbol ? `${baseSymbol}-${quoteSymbol}` : 'BTC-USDT'} />
            )}
            <ExchangesLabel insideGraph />
          </BGraphControls>
        )}
      </BGraph>
    );
  }
}

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.MARKETMAKER, STORE_KEYS.ORDERBOOKBREAKDOWN, STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { isDepthChartLoaded, base, quote },
      [STORE_KEYS.VIEWMODESTORE]: { tradingViewMode, isFirstLoad, setIsFirstLoad, rightBottomSectionFullScreenMode },
      [STORE_KEYS.MARKETMAKER]: { showOrderFormWith },
      [STORE_KEYS.EXCHANGESSTORE]: { exchanges }
    }) => {
      return {
        base,
        quote,
        isDepthChartLoaded,
        tradingViewMode,
        isFirstLoad,
        setIsFirstLoad,
        showOrderFormWith,
        exchanges,
        rightBottomSectionFullScreenMode
      };
    }
  )
)(GraphTool);
