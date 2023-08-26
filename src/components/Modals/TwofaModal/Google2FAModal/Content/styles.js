import styled from 'styled-components';

export const OuterWrapper = styled.section`
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrHighContrast};
  border-radius: ${props => props.theme.palette.borderRadius};
  font-size: 12px;
  width: 400px;
  height: auto;
  box-shadow: 0 3px 10px 5px rgba(0, 0, 0, 0.52);
`;

export const SpinnerWrapper = styled.div`
  position: relative;
  height: 80px;
`;

export const ErrorDescription = styled.div`
  color: red;
  font-size: 20px;
  text-align: center;
  padding: 1em;
`;
