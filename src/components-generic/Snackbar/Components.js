import styled from 'styled-components/macro';

export const SnackbarTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;
export const SnackbarMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  span {
    font-size: 13px;
    font-weight: 600;
    margin-left: 10px;
    color: ${props => props.theme.palette.clrPurple};
  }
`;
