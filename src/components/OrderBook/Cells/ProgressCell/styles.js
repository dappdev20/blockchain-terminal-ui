import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs(props => ({
  style: {
    width: `${props.width}%`,
    background: props.isBuy
      ? props.theme.palette.orderBookTableCellBuyProgress
      : props.theme.palette.orderBookTableCellSellProgress
  }
}))`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0.1;
  pointer-events: none;
`;
