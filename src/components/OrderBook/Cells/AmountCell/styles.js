import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell)`
  justify-content: flex-end;
  margin: -1px 0px;

  .wrapper_arrow {
    display: flex;
    align-items: center;
  }

  .arrow-icon {
    position: absolute;
    left: -8px;
    z-index: 100000;
  }
`;

export const Container = styled.span`
  font-family: Roboto;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.05px;
  white-space: nowrap;
  padding-right: ${({ type }) => (type === 'buy' || type === 'sell' ? '8px' : '0')};
  color: ${({ color }) => color};
`;

export const CoinName = styled.span`
  flex-grow: 1;
  padding-right: 6px;
  color: ${({ color }) => color};
`;
