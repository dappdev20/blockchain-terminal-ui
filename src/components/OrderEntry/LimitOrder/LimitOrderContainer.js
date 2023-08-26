import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../../stores';
import { LimitOrderRows } from './LimitOrderRows';
import OrderButton from '../OrderButton';
import SliderInput from '../SliderInputWithColor';
import { customDigitFormat } from '../../../utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 14px;
  padding-bottom: 0;
  width: 100%;

  &:last-of-type {
    border-left: 1px solid ${props => props.theme.palette.clrSubBorder};
  }

  .gradient-button {
    margin-bottom: 14px;
  }
`;

const LimitOrderContainer = ({
  [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
  amount,
  sliderMax,
  amountCoin,
  price,
  priceCoin,
  total,
  totalCoin,
  sliderCurrency,
  isBuy,
  orderButtonText,
  handleOrder,
  handleAmountChange,
  handlePriceChange,
  orderButtonDisabled
}) => {
  const currentBalance = isBuy ? total : amount;

  return (
    <Wrapper>
      <LimitOrderRows
        isBuy={isBuy}
        amount={amount}
        amountCoin={amountCoin}
        handleAmountChange={handleAmountChange}
        price={price}
        priceCoin={priceCoin}
        handlePriceChange={handlePriceChange}
        total={total}
        totalCoin={totalCoin}
      />

      <SliderInput
        isBuy={isBuy}
        value={amount}
        max={sliderMax}
        showTooltip={true}
        tooltipValue={`${customDigitFormat(currentBalance)} ${sliderCurrency}`}
        onChange={handleAmountChange}
      />

      {isLoggedIn && (
        <OrderButton
          isBuy={isBuy}
          onClick={handleOrder}
          orderButtonText={orderButtonText}
          disabled={orderButtonDisabled}
        />
      )}

      {!isLoggedIn && (
        <FormattedMessage id="order_entry.label_buy" defaultMessage="Please login with Telegram">
          {value => (
            <Tooltip
              arrow={true}
              // animation="shift"
              position="top"
              // followCursor
              theme="bct"
              title={value}
              className="full-width"
            >
              <OrderButton isBuy={isBuy} orderButtonText={orderButtonText} disabled={true} />
            </Tooltip>
          )}
        </FormattedMessage>
      )}
    </Wrapper>
  );
};

export default compose(
  inject(STORE_KEYS.TELEGRAMSTORE),
  observer
)(LimitOrderContainer);
