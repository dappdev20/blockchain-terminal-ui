import React, { memo } from 'react';

import { Wrapper, Inner } from './styles';

const ExchangeCell = memo(({ isBuy, exchange, cellWidth }) => {
  return (
    <Wrapper isBuy={isBuy} cellWidth={cellWidth}>
      <Inner>{exchange.replace(/,/g, ' ● ')}</Inner>
    </Wrapper>
  );
});

export default ExchangeCell;
