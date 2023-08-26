import styled from 'styled-components/macro';

export const OuterWrapper = styled.section`
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrHighContrast};
  border-radius: ${props => props.theme.palette.borderRadius};
  font-size: 12px;
  width: 420px;
  height: 360px;
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

export const ImgKey = styled.img`
  width: 280px;
  height: 140px;
  margin-bottom: 30px;
`;

export const TextDescription = styled.span`
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 25px;
  font-weight: normal;
`;
