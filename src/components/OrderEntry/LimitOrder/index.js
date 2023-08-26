import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import partial from 'lodash.partial';

import { STORE_KEYS } from '../../../stores';
import LimitOrderContainer from './LimitOrderContainer';
import LimitOrderArrow from './LimitOrderArrow';

const withValueFromEvent = (fn, { target: { value = '' } }) => fn(value.trim());

const LimitOrderSideBySideContainer = ({
  [STORE_KEYS.ORDERENTRY]: {
    LimitOrderFormBuy: {
      amount: buyAmount,
      price: buyPrice,
      total: buyTotal,
      setAmount: setLimitBuyAmount,
      setUserEnteredPrice: setLimitBuyPrice,
      enabled: limitOrderFormBuyEnabled,
      sliderMax: buySliderMax
    },
    LimitOrderFormSell: {
      amount: sellAmount,
      price: sellPrice,
      total: sellTotal,
      setAmount: setLimitSellAmount,
      setUserEnteredPrice: setLimitSellPrice,
      enabled: limitOrderFormSellEnabled,
      sliderMax: sellSliderMax
    }
  },
  [STORE_KEYS.INSTRUMENTS]: { selectedBase, selectedQuote },
  [STORE_KEYS.SETTINGSSTORE]: {
    price: rate // local to usdt
  },
  [STORE_KEYS.VIEWMODESTORE]: { arbHFMode },
  showModal
}) => {
  const baseSymbol = (selectedBase || '').replace('S:', '').replace('F:', '');
  const quoteSymbol = (selectedQuote || '').replace('S:', '').replace('F:', '');
  return (
    <>
      <FormattedMessage id="order_entry.label_buy" defaultMessage="BUY">
        {value => (
          <LimitOrderContainer
            amount={buyAmount}
            sliderMax={buySliderMax}
            price={buyPrice}
            handleAmountChange={partial(withValueFromEvent, setLimitBuyAmount)}
            handlePriceChange={partial(withValueFromEvent, setLimitBuyPrice)}
            amountCoin={baseSymbol}
            priceCoin={quoteSymbol}
            total={buyTotal}
            totalCoin={quoteSymbol}
            rate={rate}
            sliderCurrency={quoteSymbol}
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
            orderButtonDisabled={!limitOrderFormBuyEnabled}
            handleOrder={showModal('BUY')}
          />
        )}
      </FormattedMessage>

      <FormattedMessage id="order_entry.label_sell" defaultMessage="SELL">
        {value => (
          <LimitOrderContainer
            amount={sellAmount}
            sliderMax={sellSliderMax}
            price={sellPrice}
            handleAmountChange={partial(withValueFromEvent, setLimitSellAmount)}
            handlePriceChange={partial(withValueFromEvent, setLimitSellPrice)}
            amountCoin={baseSymbol}
            priceCoin={quoteSymbol}
            total={sellTotal}
            totalCoin={quoteSymbol}
            rate={rate}
            sliderCurrency={baseSymbol}
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
            orderButtonDisabled={!limitOrderFormSellEnabled}
            handleOrder={showModal('SELL')}
          />
        )}
      </FormattedMessage>
    </>
  );
};

export default compose(
  inject(STORE_KEYS.ORDERENTRY, STORE_KEYS.INSTRUMENTS, STORE_KEYS.SETTINGSSTORE, STORE_KEYS.VIEWMODESTORE),
  observer
)(LimitOrderSideBySideContainer);
