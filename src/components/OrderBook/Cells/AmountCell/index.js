import React, { memo } from 'react';

import { customDigitFormatParts } from '@/utils';
import { darkTheme } from '@/theme/core';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon';
import CoinIcon from '@/components-generic/CoinIcon';

import { ZerosWrapper } from '@/components/OrderBook/Cells/PriceCell/styles';
import { Container, Wrapper, CoinName } from './styles';

const COIN_COLORS = {
  buy: darkTheme.palette.orderBookBuyIconFilter,
  sell: darkTheme.palette.orderBookSellIconFilter
};

const DIGIT_COLORS = {
  buy: darkTheme.palette.orderBookTableCellTextAmount,
  sell: darkTheme.palette.orderBookTableCellTextAmount,
  headerSell: darkTheme.palette.orderBookTableCellTextSellBright,
  headerBuy: darkTheme.palette.orderBookTableCellTextBuyBright
};

const AmountCell = memo(
  ({ children, type, cellWidth, coin, isHovered, showArrow, showCoinName, ...formatDigitProps }) => {
    const digitParts = customDigitFormatParts(children, formatDigitProps);

    const isBuy = type === 'buy';

    let ArrowComponent;
    if (isHovered) {
      ArrowComponent = isBuy ? BuyArrowIcon : SellArrowIcon;
    }

    return (
      <Wrapper cellWidth={cellWidth} isHovered={isHovered} type={type}>
        {isHovered && (
          <>
            {showArrow && <ArrowComponent className="arrow-icon" size={14} />}
            <CoinIcon filter={COIN_COLORS[type]} fontIcon size={13} value={coin} />
          </>
        )}
        {showCoinName && <CoinName color={DIGIT_COLORS[type]}>{coin.replace('S:', '').replace('F:', '')}</CoinName>}
        <Container color={DIGIT_COLORS[type]} type={type}>
          <span>
            {!!digitParts.leadingZeroes && <ZerosWrapper position="leading">{digitParts.leadingZeroes}</ZerosWrapper>}
            {digitParts.resultNumber}
            {!!digitParts.trailingZeros && <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>}
            {!!digitParts.suffix && digitParts.suffix}
          </span>
        </Container>
      </Wrapper>
    );
  }
);

export default AmountCell;
