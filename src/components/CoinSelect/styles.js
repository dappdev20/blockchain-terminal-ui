import styled from 'styled-components/macro';

export const StyledWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  flex-grow: 1;
  min-height: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
  width: 100%;
  transition: all 0.5s;
  z-index: 101;
`;

export const EqualSymbol = styled.div`
  height: 60px;
  line-height: 60px;
  font-size: 40px;
  font-weight: 700;
  color: ${props => props.theme.palette.clrBorder};
`;
