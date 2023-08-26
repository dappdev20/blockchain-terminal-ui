import styled from 'styled-components';

export const SpinnerWrapper = styled.div`
  position: relative;
  height: 80px;
`;

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

export const TextDescription = styled.span`
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 16px;
  font-weight: normal;
`;

export const TextHighlight = styled.span`
  color: grey;
  font-size: 16px;
`;

export const ButtonWrappers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 32px 0;
`;

export const QRImgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 13px;
  margin-bottom: 13px;

  img {
    width: 200px;
    height: 200px;
  }
`;

export const QRKeyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 50px;
  margin: 0;
  padding: 0 !important;
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1em;
  font-weight: normal;
  font-family: 'Exo 2', sans-serif;
  color: ${props => props.theme.palette.clrHighContrast};
  transition: 0.5s;

  &::placeholder {
    color: ${props => props.theme.palette.clrLightGray};
  }
`;

export const InputWrapper = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  overflow: visible;
  border: 1px solid rgb(39, 128, 255);
  border-radius: 2em;
  padding: 0 10px;
  max-width: 300px;

  input {
    font-size: 16px;
    height: 100%;
  }

  @keyframes enter-code-input-animation {
    0% {
      height: 0;
    }

    100% {
      height: 60px;
    }
  }

  &.code-input {
    display: none;
    margin-top: 2px;
    height: 0;

    &.enter-code {
      animation-name: enter-code-input-animation;
      animation-duration: 0.5s;
      animation-fill-mode: both;
    }
  }
`;

export const Google2FAInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
`;

export const AppStoreLink = styled.a`
  background: url('/img/app_store.svg');
  width: 124px;
  height: 38px;
  display: inline-block;
  background-size: contain;
  margin-right: 16px;
`;

export const GooglePlayLink = styled.a`
  background: url('/img/google_play.png');
  width: 124px;
  height: 38px;
  display: inline-block;
  background-size: contain;
`;
