import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { MarketOrderRows } from './MarketOrderRows';
import OrderButton from '../OrderButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px 12px 12px 12px;
  width: 100%;

  &:last-of-type {
    border-left: 1px solid ${props => props.theme.palette.clrSubBorder};
  }
`;

export const MarketOrderContainer = memo(
  ({
    amount,
    total,
    sliderMax,
    handleAmountInputChange,
    handleTotalInputChange,
    orderButtonDisabled,
    handleOrder,
    orderButtonText,
    baseSymbol,
    quoteSymbol,
    isBuy,
    animation,
    isFiat
  }) => {
    const max = Number.parseFloat(sliderMax) || 0;
    return (
      <Wrapper>
        <MarketOrderRows
          isBuy={isBuy}
          amount={amount}
          total={total}
          max={max}
          handleAmountChange={handleAmountInputChange}
          handleTotalChange={handleTotalInputChange}
          baseSymbol={baseSymbol}
          quoteSymbol={quoteSymbol}
          animation={animation}
          isFiat={isFiat}
        />
        <OrderButton
          isBuy={isBuy}
          onClick={handleOrder}
          orderButtonText={orderButtonText}
          disabled={orderButtonDisabled}
        />
      </Wrapper>
    );
  }
);
