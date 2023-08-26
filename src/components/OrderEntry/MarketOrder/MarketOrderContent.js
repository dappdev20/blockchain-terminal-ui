import React from 'react';
import { AutoSizer } from 'react-virtualized';
import { ContentWrapper, Content } from '../styles';
import InputCell from '../InputCell';

export const MarketOrderContent = ({
  value,
  handleInputChange,
  symbol,
  isBuy,
  max,
  type,
  isLeft,
  animation,
  isFiat
}) => (
  <ContentWrapper>
    <AutoSizer>
      {({ width, height }) => (
        <Content width={width} height={height}>
          <InputCell
            width={width}
            height={height}
            value={value}
            handleInputChange={handleInputChange}
            symbol={symbol}
            isBuy={isBuy}
            max={max}
            type={type}
            isLeft={isLeft}
            animation={animation}
            isFiat={isFiat}
          />
          <InputCell
            width={width}
            height={height}
            value={value}
            handleInputChange={handleInputChange}
            symbol={symbol}
            isBuy={isBuy}
            max={max}
            type={type}
            isLeft={isLeft}
            isHover
            animation={animation}
            isFiat={isFiat}
          />
        </Content>
      )}
    </AutoSizer>
  </ContentWrapper>
);
