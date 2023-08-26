import React from 'react';
import styled from 'styled-components/macro';

// use `attrs` for a frequently changed styles as suggested by `styled-components`
export const Container = styled.div.attrs(({ left }) => ({
  style: {
    left: `${left}px`
  }
}))`
  position: absolute;
  bottom: -${props => props.theme.palette.contentGap};
  transform: translateX(
    ${props => {
      switch (props.tooltipXPosition) {
        case 'right':
          return '0';
        case 'left':
          return '-100';
        case 'middle':
        default:
          return '-50';
      }
    }}%
  );
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => (props.datasetIndex ? '#20405d' : '#264535')};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ datasetIndex, theme: { palette } }) =>
    datasetIndex ? palette.orderBookTableCellTextSellBright : palette.orderBookTableCellTextBuyBright};
  border-radius: 6px;
  pointer-events: none;
  padding: 2px 3px;
  z-index: 1;
  transition: transform 0.5s ease;
`;

export const PriceWrapper = styled.div`
  font-size: 14px;
`;

const ArrowSvg = styled.svg`
  width: 20px;
  height: 12px;
  fill: #fff;
`;

export const ArrowIcon = () => (
  <ArrowSvg viewBox="0 0 100 100" x="0px" y="0px">
    <path d="M97.64,44.1,64.72,11.18a8.06,8.06,0,1,0-11.4,11.39L72.78,42H8.06a8.06,8.06,0,0,0,0,16.12H72.6L53.32,77.43a8.06,8.06,0,0,0,11.4,11.39L97.64,55.9A8,8,0,0,0,100,50.2a1.27,1.27,0,0,0,0-.2,1.41,1.41,0,0,0,0-.2A8.07,8.07,0,0,0,97.64,44.1Z" />
  </ArrowSvg>
);
