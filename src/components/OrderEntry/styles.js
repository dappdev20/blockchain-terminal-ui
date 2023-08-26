import styled from 'styled-components/macro';
import { TextField } from '@material-ui/core';

export const ContentWrapper = styled.div.attrs({ className: 'order-row' })`
  height: 50%;
`;

export const Content = styled.div`
  width: ${props => props.width}px;
  height: 50px;
  margin: 1px 1px ${props => props.height - 50}px 1px;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  // border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  overflow: visible;
`;

export const InputField = styled(TextField)`
  margin: 12px 0;
  color: ${props =>
    props.isbuy ? props.theme.palette.orderBookTableCellTextBuy : props.theme.palette.orderBookTableCellTextSell};
  label {
    color: ${props =>
      props.isbuy ? props.theme.palette.orderBookTableCellTextBuy : props.theme.palette.orderBookTableCellTextSell};
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${props =>
        props.isbuy ? props.theme.palette.orderBookTableCellTextBuy : props.theme.palette.orderBookTableCellTextSell};
    }
    input {
      color: ${props =>
        props.isbuy ? props.theme.palette.orderBookTableCellTextBuy : props.theme.palette.orderBookTableCellTextSell};
      height: 0.5rem;
    }
  }
`;
