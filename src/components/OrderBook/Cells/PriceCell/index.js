import React, { memo } from 'react';

import { customDigitFormatParts } from '@/utils';
import { ResultNumber, Wrapper, ZerosWrapper } from './styles';

const PriceCell = memo(({ children, type, cellWidth, ...formatDigitProps }) => {
  const digitParts = customDigitFormatParts(children, formatDigitProps);

  return (
    <Wrapper cellWidth={cellWidth}>
      <ResultNumber type={type}>
        {type === 'header' && '@'}
        {!!digitParts.leadingZeroes && <ZerosWrapper position="leading">{digitParts.leadingZeroes}</ZerosWrapper>}
        {digitParts.resultNumber}
        {!!digitParts.trailingZeros && <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>}
        {!!digitParts.suffix && digitParts.suffix}
      </ResultNumber>
    </Wrapper>
  );
});

export default PriceCell;
