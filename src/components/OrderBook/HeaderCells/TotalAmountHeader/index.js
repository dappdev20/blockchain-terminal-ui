import React, { memo } from 'react';

import HeaderCell from '../HeaderCell';
import TooltipText from './TooltipText';

const TotalAmountHeader = memo(({ coin, cellWidth, ...otherProps }) => {
  return (
    <HeaderCell
      tooltipText={<TooltipText {...otherProps} coin={coin} />}
      cellWidth={cellWidth}
      position="right"
      type="amount"
    >
      {coin.replace('S:', '').replace('F:', '')}
    </HeaderCell>
  );
});

export default TotalAmountHeader;
