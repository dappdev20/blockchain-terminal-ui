import Snackbar from '@material-ui/core/Snackbar';
import styled from 'styled-components/macro';

export const CustomStyle = () => ({
  default: {
    bottom: '298px',
    width: '350px',
    'min-width': '300px',
    'margin-left': '0 !important',
    left: '34%'
  },
  buyPosition: {
    bottom: '298px',
    width: '350px',
    'min-width': '300px',
    'margin-left': '0 !important',
    left: '34%'
  },
  sellPosition: {
    left: '34%',
    width: '350px',
    'min-width': '300px',
    bottom: '298px',
    'margin-left': '0 !important'
  }
});

export const StyledSnackbar = styled(Snackbar)`
  margin-left: 50px;
  color: ${props => props.theme.palette.contrastText};

  @media (max-width: 1500px) {
    transform: scale(0.75);
    transform-origin: left bottom;
  }

  @media (max-width: 1080px) {
    transform: scale(0.65);
    transform-origin: left bottom;
  }

  @media (max-width: 940px) {
    transform: scale(0.55);
    transform-origin: left bottom;
  }

  @media (max-width: 790px) {
    transform: scale(0.45);
    transform-origin: left bottom;
  }

  @media (max-width: 700px) {
    transform: scale(0.35);
    transform-origin: left bottom;
  }

  .MuiSnackbarContent-root {
    width: 100%;
    color: ${props => props.theme.palette.contrastText};
    background: ${props => props.theme.palette.clrBackground};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    box-shadow: 0 0 19px 6px #000;
    border-radius: 1px;
    font-family: 'open_sans', sans-serif;
  }
  .MuiSnackbarContent-action {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
  }
  .MuiSnackbarContent-message {
    width: 100%;
    & > span {
      display: flex;
      justify-content: space-between;
    }
  }
  .MuiIconButton-root {
    padding: 5px;
    margin: 7px;
  }
`;
