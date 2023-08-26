import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell)`
  padding-right: 8px;
  justify-content: flex-end;
  margin: -1px 0px;
`;

export const ResultNumber = styled.span`
  font-family: Roboto;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.05px;
  color: ${({ type, theme }) => {
    switch (type) {
      case 'buy':
        return theme.palette.clrLightGreen;
      case 'sell':
        return theme.palette.clrHighLightBlue;
      case 'header':
      default:
        return theme.palette.orderBookHeaderText2;
    }
  }};

  span::after {
    content: attr(data-end);
    color: ${({ type, theme }) => {
      switch (type) {
        case 'buy':
          return '#7bdb7a';
        case 'sell':
          return '#66cbff';
        case 'header':
        default:
          return theme.palette.orderBookHeaderText2;
      }
    }};
  }
`;

export const IntegerWrapper = styled.span`
  ${({ type }) => (type !== 'header' ? '' : 'opacity: 0.7;')}
  ${({ type, theme }) => {
    switch (type) {
      case 'buy':
        return `color: ${theme.palette.orderBookTableCellTextBuyPriceInteger};`;
      case 'sell':
        return `color: ${theme.palette.orderBookTableCellTextSellPriceInteger};`;
      case 'header':
      default:
        return `color: ${theme.palette.orderBookHeaderText2};`;
    }
  }}
`;

export const ZerosWrapper = styled.span`
  opacity: ${({ position }) => {
    switch (position) {
      case 'leading':
        return 0.2;
      case 'trailing':
      default:
        return 0.39;
    }
  }};
`;

export const AtSymbol = styled.span`
  opacity: 0.25;
`;
