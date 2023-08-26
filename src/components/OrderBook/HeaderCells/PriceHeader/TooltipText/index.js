import React, { memo } from 'react';

import { customDigitFormatParts } from '@/utils';
import { ZerosWrapper } from '@/components/OrderBook/Cells/PriceCell/styles';

import { PriceRow } from './styles';

const TooltipText = memo(({ avgPrice, midPrice, ...formatDigitProps }) => {
  const avgDigitParts = customDigitFormatParts(avgPrice, formatDigitProps);
  const midDigitParts = customDigitFormatParts(midPrice, formatDigitProps);

  return (
    <>
      <PriceRow>
        <span>Average Price:</span>
        <span>
          {!!avgDigitParts.leadingZeroes && (
            <ZerosWrapper position="leading">{avgDigitParts.leadingZeroes}</ZerosWrapper>
          )}
          {avgDigitParts.resultNumber}
          {!!avgDigitParts.trailingZeros && (
            <ZerosWrapper position="trailing">{avgDigitParts.trailingZeros}</ZerosWrapper>
          )}
          {!!avgDigitParts.suffix && avgDigitParts.suffix}
        </span>
      </PriceRow>
      <PriceRow>
        <span>Median Price:</span>
        <span>
          {!!midDigitParts.leadingZeroes && (
            <ZerosWrapper position="leading">{midDigitParts.leadingZeroes}</ZerosWrapper>
          )}
          {midDigitParts.resultNumber}
          {!!midDigitParts.trailingZeros && (
            <ZerosWrapper position="trailing">{midDigitParts.trailingZeros}</ZerosWrapper>
          )}
          {!!midDigitParts.suffix && midDigitParts.suffix}
        </span>
      </PriceRow>
    </>
  );
});

export default TooltipText;
