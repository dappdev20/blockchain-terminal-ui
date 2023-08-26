import styled from 'styled-components/macro';

import ArrowIcon from './ArrowIcon';

export const Price = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-left: 4px;
  color: ${props =>
    props.direction === 'up'
      ? props.theme.palette.orderBookTableCellTextSellBright
      : props.theme.palette.orderBookTableCellTextBuyBright};
  transition: all 0.2s;
`;

export const Arrow = styled(ArrowIcon)`
  transform: rotate(${props => (props.direction === 'up' ? 0 : 180)}deg);
  transition: all 0.1s;
  width: 16px;
  height: 16px;

  path {
    fill: ${props =>
      props.direction === 'up'
        ? props.theme.palette.orderBookTableCellTextSellBright
        : props.theme.palette.orderBookTableCellTextBuyBright};
  }
`;
