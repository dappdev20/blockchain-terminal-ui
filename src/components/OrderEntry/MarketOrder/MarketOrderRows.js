import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { MarketOrderContent } from './MarketOrderContent';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 50px);
`;

export const MarketOrderRows = memo(
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
      <MarketOrderContent
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
      <MarketOrderContent
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
