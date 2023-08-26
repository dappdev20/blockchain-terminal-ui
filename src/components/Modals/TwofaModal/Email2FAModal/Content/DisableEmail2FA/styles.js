import styled from 'styled-components';

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export const TextTitle = styled.span`
  margin: 32px 0;
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 20px;
  font-weight: bold;
`;

export const ButtonWrappers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 32px 0;
`;
