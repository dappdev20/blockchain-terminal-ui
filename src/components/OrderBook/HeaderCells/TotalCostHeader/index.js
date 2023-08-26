import React, { memo } from 'react';

import HeaderCell from '../HeaderCell';
import TooltipText from '../TotalAmountHeader/TooltipText';
import { SwipArrowIconStyled } from './styles';

const TotalCostHeader = memo(({ coin, cellWidth, ...otherProps }) => {
  return (
    <HeaderCell
      tooltipText={<TooltipText {...otherProps} coin={coin} />}
      cellWidth={cellWidth}
      position="right"
      type="cost"
    >
      <SwipArrowIconStyled width="20px" />
      {coin.replace('S:', '').replace('F:', '')}
    </HeaderCell>
  );
});

export default TotalCostHeader;
