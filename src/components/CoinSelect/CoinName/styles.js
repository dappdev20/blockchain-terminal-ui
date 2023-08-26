import styled from 'styled-components';

const getFontSize = textLength => {
  if (textLength >= 60) {
    return 16;
  }
  if (textLength >= 50 && textLength < 60) {
    return 20;
  }
  if (textLength >= 40 && textLength < 50) {
    return 22;
  }
  if (textLength >= 30 && textLength < 40) {
    return 26;
  }
  if (textLength >= 20 && textLength < 30) {
    return 30;
  }
  return 40;
};

export const CoinTitle = styled.div.attrs({ className: 'exch-dropdown__title' })`
  display: flex;
  align-items: baseline;
  padding-left: ${props => (props.noLeftPadding ? 0 : '12px')};
  line-height: 1;
  font-weight: 500;
  font-size: 2rem;
  white-space: nowrap;
  color: ${props => (props.isReadableActive ? props.theme.palette.clrHighContrast : props.theme.palette.clrMouseClick)};
  min-width: 0;
  font-family: Roboto;

  ${props =>
    props.header &&
    `
      position: relative;
      text-transform: ${props.isSearch ? 'uppercase' : 'none'};
      color: ${props.theme.palette.clrMouseClick};
      font-size: ${props.isSearch ? 40 : getFontSize(props.textLength)}px;
      white-space: ${props.isSearch ? 'nowrap' : 'pre-line'};
      padding-left: ${props.isSearch ? 12 : 0}px;
      font-weight: 600;
      color: ${props.isSearch ? props.theme.palette.coinPairSelectHoverText2 : props.theme.palette.clrBorder};
    `}

  .coin-name {
    font-size: 16px;
    font-family: Roboto;
    margin-left: 4px;
  }
`;

export const SymbolName = styled.div`
  width: ${props => (props.width ? `${props.width}px` : 'auto')};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  font-size: 2rem;

  .coin-name {
    font-size: ${props => (props.hideSymbol ? '26px' : '16px')};
    margin-left: 4px;
  }

  .symbol-name {
    visibility: ${props => (props.hideSymbol ? 'hidden' : 'visible')};
  }

  .symbol-name-right {
    font-size: 16px;
  }

  .highlight {
    font-weight: 300;
  }
`;

export const CustomWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const CustomCoinNameWrapper = styled.div`
  font-size: ${props => (props.search ? '1.2rem' : '2rem')};
  width: ${props => (props.width ? `${props.width}` : 'auto')};
  display: flex;
`;
