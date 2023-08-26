import styled from 'styled-components/macro';

export const OuterWrapper = styled.section`
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrHighContrast};
  border-radius: ${props => props.theme.palette.borderRadius};
  font-size: 12px;
  width: calc(100vw - 30px);
  max-width: 360px;
  height: 200px;
  box-shadow: 0 3px 10px 5px rgba(0, 0, 0, 0.52);
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const TextDescription = styled.span`
  margin-top: 20px;
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 25px;
  font-weight: normal;
`;

export const ButtonWrappers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 40px;
  width: 100%;

  button {
    &:first-child {
      margin: 0 10px 0 auto;
    }
    &:last-child {
      margin: 0 auto 0 10px;
    }
  }
`;
