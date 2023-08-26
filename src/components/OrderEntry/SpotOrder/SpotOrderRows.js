import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { SpotOrderContent } from './SpotOrderContent';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 50px);
`;

export const SpotOrderRows = memo(
  ({
    isBuy,
    amount,
    total,
    max,
    handleAmountChange,
    handleTotalChange,
    baseSymbol,
    quoteSymbol,
    animation,
    isFiat
  }) => (
    <Wrapper>
      <SpotOrderContent
        value={amount}
        handleInputChange={handleAmountChange}
        symbol={baseSymbol}
        isBuy={isBuy}
        max={max}
        type={`${isBuy ? 'buy_to' : 'sell_from'}`}
        isLeft
        animation={animation}
        isFiat={isFiat}
      />
      <SpotOrderContent
        value={total}
        handleInputChange={handleTotalChange}
        symbol={quoteSymbol}
        isBuy={isBuy}
        max={max}
        type={`${isBuy ? 'buy_from' : 'sell_to'}`}
        animation={animation}
        isFiat={false}
      />
    </Wrapper>
  )
);
