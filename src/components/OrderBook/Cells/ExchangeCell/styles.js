import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell)`
  color: ${props => (props.isBuy ? props.theme.palette.clrLightGreen : props.theme.palette.clrHighLightBlue)};
  padding-right: 8px;
  padding-left: 8px;
`;

export const Inner = styled.div`
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  font-family: Roboto;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.05px;
  &:after {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    content: '';
    background: linear-gradient(to left, rgba(2, 5, 24, 1) 0, rgba(2, 5, 24, 0) 20%);
    pointer-events: none; /* so the text is still selectable */
  }
`;
