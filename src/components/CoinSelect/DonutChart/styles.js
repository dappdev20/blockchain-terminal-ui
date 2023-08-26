import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  position: absolute;
  left: -8px;
  top: -11px;
  z-index: 5;
  width: 80px;
  height: 80px;
`;

export const BalanceLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  bottom: 20px;
  right: 20px;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  font-size: 12px;
  text-align: center;
  // font-weight: bold;
  color: ${props => props.theme.palette.clrMouseClick};
`;

export const InnerWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;
