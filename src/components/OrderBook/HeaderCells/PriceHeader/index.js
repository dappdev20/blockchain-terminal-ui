import React from 'react';

import { customDigitFormatParts } from '@/utils';
import HeaderCell from '@/components/OrderBook/HeaderCells/HeaderCell';
import { ZerosWrapper } from '@/components/OrderBook/Cells/PriceCell/styles';
import { Price, Arrow } from './styles';
import TooltipText from './TooltipText';

const PriceHeader = ({ cellWidth, midPrice, avgPrice, price, priceDelta, ...formatDigitProps }) => {
  const digitParts = customDigitFormatParts(price, formatDigitProps);
  const direction = priceDelta < 0 ? 'down' : 'up';

  return (
    <HeaderCell
      tooltipText={<TooltipText avgPrice={avgPrice} midPrice={midPrice} {...formatDigitProps} />}
      cellWidth={cellWidth}
    >
      <Arrow direction={direction} />
      <Price direction={direction}>
        {!!digitParts.leadingZeroes && <ZerosWrapper position="leading">{digitParts.leadingZeroes}</ZerosWrapper>}
        {digitParts.resultNumber}
        {!!digitParts.trailingZeros && <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>}
        {!!digitParts.suffix && digitParts.suffix}
      </Price>
    </HeaderCell>
  );
};

export default PriceHeader;
