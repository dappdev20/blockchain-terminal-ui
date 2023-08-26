import styled from 'styled-components';

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

export const ButtonWrappers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 32px 0;
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
  outline: none !important;
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
