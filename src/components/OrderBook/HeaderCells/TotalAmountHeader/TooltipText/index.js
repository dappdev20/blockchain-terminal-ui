import React, { memo } from 'react';

import AmountCell from '@/components/OrderBook/Cells/AmountCell';

const TooltipText = memo(({ totalAsks, totalBids, ...amountProps }) => {
  return (
    <>
      <AmountCell showCoinName type="headerBuy" {...amountProps}>
        {totalBids}
      </AmountCell>
      <AmountCell showCoinName type="headerSell" {...amountProps}>
        {totalAsks}
      </AmountCell>
    </>
  );
});

export default TooltipText;
