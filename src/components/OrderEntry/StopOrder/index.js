import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import partial from 'lodash.partial';
import StopOrderContainer from './StopOrderContainer';
import { STORE_KEYS } from '@/stores';
import LimitOrderArrow from '@/components/OrderEntry/LimitOrder/LimitOrderArrow';

const withValueFromEvent = (fn, { target: { value = '' } }) => fn(value.trim());

const StopOrderSideBySideContainer = ({
  [STORE_KEYS.ORDERENTRY]: {
    StopOrderFormBuy: {
      amount: buyAmount,
      price: buyPrice,
      stopPrice: buyStopPrice,
      total: buyTotal,
      setAmount: setBuyAmount,
      setUserEnteredPrice: setBuyPrice,
      setStopPrice: setBuyStopPrice,
      enabled: orderFormBuyEnabled,
      sliderMax: buySliderMax
    },
    StopOrderFormSell: {
      amount: sellAmount,
      price: sellPrice,
      stopPrice: sellStopPrice,
      total: sellTotal,
      setAmount: setSellAmount,
      setUserEnteredPrice: setSellPrice,
      setStopPrice: setSellStopPrice,
      enabled: orderFormSellEnabled,
      sliderMax: sellSliderMax
    }
  },
  [STORE_KEYS.INSTRUMENTS]: { selectedBase, selectedQuote },
  [STORE_KEYS.VIEWMODESTORE]: { arbHFMode },
  showModal
}) => {
  const baseSymbol = (selectedBase || '').replace('S:', '').replace('F:', '');
  const quoteSymbol = (selectedQuote || '').replace('S:', '').replace('F:', '');
  return (
    <>
      <FormattedMessage id="order_entry.label_buy" defaultMessage="BUY">
        {value => (
          <StopOrderContainer
            amount={buyAmount}
            sliderMax={buySliderMax}
            price={buyPrice}
            stopPrice={buyStopPrice}
            handleAmountChange={partial(withValueFromEvent, setBuyAmount)}
            handlePriceChange={partial(withValueFromEvent, setBuyPrice)}
            handleStopPriceChange={partial(withValueFromEvent, setBuyStopPrice)}
            amountCoin={baseSymbol}
            priceCoin={quoteSymbol}
            total={buyTotal}
            totalCoin={quoteSymbol}
            orderButtonText={
              arbHFMode ? (
                <div>
                  {quoteSymbol} <LimitOrderArrow isBuy /> {baseSymbol}
                </div>
              ) : (
                `${value} ${baseSymbol}`
              )
            }
            isBuy={true}
            sliderCurrency={quoteSymbol}
            orderButtonDisabled={!orderFormBuyEnabled}
            handleOrder={showModal}
          />
        )}
      </FormattedMessage>

      <FormattedMessage id="order_entry.label_sell" defaultMessage="SELL">
        {value => (
          <StopOrderContainer
            amount={sellAmount}
            sliderMax={sellSliderMax}
            price={sellPrice}
            stopPrice={sellStopPrice}
            handleAmountChange={partial(withValueFromEvent, setSellAmount)}
            handlePriceChange={partial(withValueFromEvent, setSellPrice)}
            handleStopPriceChange={partial(withValueFromEvent, setSellStopPrice)}
            amountCoin={baseSymbol}
            priceCoin={quoteSymbol}
            total={sellTotal}
            totalCoin={quoteSymbol}
            orderButtonText={
              arbHFMode ? (
                <div>
                  {baseSymbol} <LimitOrderArrow /> {quoteSymbol}
                </div>
              ) : (
                `${value} ${baseSymbol}`
              )
            }
            isBuy={false}
            sliderCurrency={baseSymbol}
            orderButtonDisabled={!orderFormSellEnabled}
            handleOrder={showModal}
          />
        )}
      </FormattedMessage>
    </>
  );
};

export default compose(
  inject(STORE_KEYS.ORDERENTRY, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.INSTRUMENTS),
  observer
)(StopOrderSideBySideContainer);
