import styled from 'styled-components/macro';

export const Price = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  color: ${props => props.theme.palette.clrPurple};
`;

export const Label = styled.div`
  font-size: 12px;
  color: ${props => props.theme.palette.clrPurple};
  text-transform: uppercase;
`;
