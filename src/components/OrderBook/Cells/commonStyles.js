import styled from 'styled-components/macro';
import { Tooltip } from 'react-tippy';

export const Cell = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  ${props => props.cellWidth && `width: ${props.cellWidth}%;`}
  flex-shrink: 0;
  flex-grow: 0;
`;

export const HeaderCellStyled = styled(Tooltip)`
  display: flex;
  position: relative;
  align-items: center;
  ${props => props.cellWidth && `width: ${props.cellWidth}%;`}
  flex-shrink: 0;
  flex-grow: 0;
  justify-content: center;
  font-family: Roboto;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.05px;
  margin: -1px 0px;
  ${props => (props.type === 'amount' || props.type === 'cost') && 'padding-left: 15px;'}

  @media (max-width: 1600px) {
    ${props => (props.type === 'amount' || props.type === 'cost') && 'padding-left: 8px;'}
  }
`;
