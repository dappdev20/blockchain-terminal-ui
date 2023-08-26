import styled, { css } from 'styled-components/macro';
import { SwipArrowIconStyled } from '../HeaderCells/TotalCostHeader/styles';
import RowTooltip from '../RowTooltip';

export const Table = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.palette.orderBookTableCellText};
`;

const RowStyles = css`
  position: relative;
  display: flex;
  flex-grow: 1;
  border-color: ${props => props.theme.palette.orderBookHeaderInnerBorder};
  border-style: inset;
  border-width: 0 0 0.01rem 0;
`;

export const Row = styled(RowTooltip)`
  ${RowStyles}
  width: 100%;

  &:hover {
    cursor: pointer;

    & > div:nth-child(2),
    & > div:nth-child(3),
    & > div:nth-child(4) {
      span:not(.coin-symbol) {
        color: ${props => props.theme.palette.clrWhite};
      }
    }
  }
`;

export const HeaderRow = styled.div`
    ${RowStyles}

    background: ${props => props.theme.palette.orderBookHeaderBg};
    color: ${props => props.theme.palette.orderBookHeaderText2};
    margin: -1px 0px;

    &:hover ${SwipArrowIconStyled} {
        display: initial;
    }
`;
