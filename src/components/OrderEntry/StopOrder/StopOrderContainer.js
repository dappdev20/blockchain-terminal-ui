import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'react-tippy';

import { StopOrderRows } from './StopOrderRows';
import OrderButton from '../OrderButton';
import SliderInput from '../SliderInputWithColor';
import { customDigitFormat } from '../../../utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;

  &:last-of-type {
    border-left: 1px solid ${props => props.theme.palette.clrSubBorder};
  }
`;

const StopOrderContainer = ({
  amount,
  sliderMax,
  amountCoin,
  price,
  stopPrice,
  priceCoin,
  total,
  totalCoin,
  sliderCurrency,
  isBuy,
  orderButtonText,
  handleOrder,
  handleAmountChange,
  handlePriceChange,
  handleStopPriceChange,
  orderButtonDisabled
}) => {
  const currentBalance = isBuy ? total : amount;

  return (
    <Wrapper>
      <StopOrderRows
        isBuy={isBuy}
        amount={amount}
        amountCoin={amountCoin}
        handleAmountChange={handleAmountChange}
        price={price}
        priceCoin={priceCoin}
        handlePriceChange={handlePriceChange}
        stopPrice={stopPrice}
        handleStopPriceChange={handleStopPriceChange}
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
      <FormattedMessage
        id="order_entry.tooltip_access_restricted"
        defaultMessage="Your Access is Restricted to Level 1"
      >
        {value => (
          <Tooltip
            arrow={true}
            animation="shift"
            // position="bottom"
            followCursor
            theme="bct"
            title={value}
          >
            <OrderButton
              isBuy={isBuy}
              onClick={handleOrder}
              orderButtonText={orderButtonText}
              disabled={orderButtonDisabled}
            />
          </Tooltip>
        )}
      </FormattedMessage>
    </Wrapper>
  );
};

export default StopOrderContainer;
