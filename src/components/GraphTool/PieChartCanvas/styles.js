import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 20px;
  border: 1px solid ${props => props.theme.palette.orderBookHeaderBorder};
  border-radius: 3px;
`;
