import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.palette.clrBackground};
  display: block;
  font-weight: 700;
  font-family: 'open_sans', sans-serif;
  border-radius: 3px;
`;
