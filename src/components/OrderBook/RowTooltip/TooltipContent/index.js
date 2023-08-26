import React, { memo } from 'react';

import { customDigitFormatParts } from '@/utils';
import { ZerosWrapper } from '@/components/OrderBook/Cells/PriceCell/styles';

import { CellTooltipItem, StyledPerfectScrollbar } from './styles';

const TooltipContent = memo(({ isBuy, price, siblingPrice, exchange, ...formatDigitProps }) => {
  const exchanges = exchange.split(',');
  const diff = Math.abs(siblingPrice - price);
  const diffPerExchange = exchanges.length > 1 ? diff / (exchanges.length - 1) : diff;
  const direction = isBuy ? 1 : -1;
  const result = exchanges.map((exchName, idx) => {
    const isOwnPriceIdx = !idx;
    const exchangePrice = price + direction * diffPerExchange * idx;
    const digitParts = customDigitFormatParts(exchangePrice, formatDigitProps);

    return (
      exchanges.length > 1 && (
        <CellTooltipItem key={exchName} isBuy={isBuy} isOwnPriceIdx={isOwnPriceIdx}>
          <span className={`exchange-list-item ${isOwnPriceIdx && 'own-price'}`}>{exchName}</span>
          <span className={`right-value ${isOwnPriceIdx && 'own-price'}`}>
            {!!digitParts.leadingZeroes && <ZerosWrapper position="leading">{digitParts.leadingZeroes}</ZerosWrapper>}
            {digitParts.resultNumber}
            {!!digitParts.trailingZeros && <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>}
            {!!digitParts.suffix && digitParts.suffix}
          </span>
        </CellTooltipItem>
      )
    );
  });

  return (
    <StyledPerfectScrollbar
      option={{
        suppressScrollX: true,
        minScrollbarLength: 50
      }}
    >
      <ul className="advanced-tooltip orderbook-tooltip text-left">{isBuy ? result.reverse() : result}</ul>
    </StyledPerfectScrollbar>
  );
});

export default TooltipContent;
