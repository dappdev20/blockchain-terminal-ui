import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.section.attrs({ className: 'seed-words-modal' })`
  position: relative;
  width: 550px;
  height: 390px;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.palette.depositBackground};
  border: 1px solid ${props => props.theme.palette.depositBorder};
  border-radius: ${props =>
    props.submitted
      ? `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`
      : props.theme.palette.borderRadius};
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  color: ${props => props.theme.palette.depositText};

  .confirm-button:disabled {
    filter: drop-shadow(0px 0px 1px ${props => props.theme.palette.depositBorder}) !important;
  }
`;

export const Label = styled.div.attrs({ className: 'seed-words__label' })`
  width: 100%;
  min-height: 41px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  padding: 5px 15px;
  background: ${props => props.theme.palette.clrBackground};
  border-bottom: 1px solid ${props => props.theme.palette.clrBorderHover};
  border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.palette.clrHighContrast};

  span {
    display: flex;
    align-items: center;
  }

  .heading1 {
  }

  .heading2 {
    margin-top: 6px;
  }
`;

export const ModalBody = styled.div.attrs({ className: 'seed-words-modal__body' })`
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  flex: 1;
  border: none;

  .positive-solid,
  .negative-solid {
    margin-top: auto;

    .btn-text {
      font-size: 24px;
      font-weight: bold;
      line-height: 1em;
    }
  }
`;

export const Text = styled.div`
  width: 100%;
  max-width: 418px;
  margin: 20px auto;
  font-size: 16px;
  font-weight: normal;
  line-height: 19px;
  color: ${props => props.theme.palette.clrHighContrast};
  text-align: center;

  > span {
    font-weight: 600;
    color: ${props => props.theme.palette.clrLightRed};
  }
`;

export const Heading = styled.h2`
  margin: 0 auto;
  width: 100%;
  max-width: 418px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  color: ${props => props.theme.palette.clrHighContrast};
`;

const SvgWarningWrapper = styled.svg`
  margin-bottom: 15px;
  width: 110px;
  height: 110px;

  &,
  & * {
    fill: ${props => props.theme.palette.clrLightRed};
  }
`;

export const IconWarning = () => (
  <SvgWarningWrapper viewBox="0 0 109.1 109.1">
    <path d="M54.55,0A54.55,54.55,0,1,0,109.1,54.55,54.55,54.55,0,0,0,54.55,0Zm0,98.87A44.32,44.32,0,1,1,98.87,54.55,44.32,44.32,0,0,1,54.55,98.87Zm0-74.95c-3.9,0-6.86,2-6.86,5.34v30.2c0,3.3,3,5.33,6.86,5.33s6.87-2.11,6.87-5.33V29.26c0-3.22-3.05-5.34-6.87-5.34Zm0,47.68a6.81,6.81,0,1,0,6.81,6.81,6.81,6.81,0,0,0-6.81-6.81Z" />
  </SvgWarningWrapper>
);

export const Buttons = styled.div`
  width: 100%;
  margin: auto 0 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NumberWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px 0 0;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  width: 30px;
  height: 30px;
  background: ${props => props.theme.palette.clrBackground};
  color: ${props => props.theme.palette.clrPurple};
  font-size: 18px;
  font-weight: normal;
  line-height: 1em;
`;

export const WordInput = styled.input`
  flex: 1;
  margin: 0;
  border: none;
  border-bottom: 2px solid ${props => props.theme.palette.clrPurple};
  padding: 4px;
  background: transparent;
  width: 100%;
  height: 25px;
  font-size: 18px;
  font-weight: normal;
  color: ${props => props.theme.palette.clrHighContrast};
  text-align: center;
`;

export const WordInputWrapper = styled.div.attrs({ className: 'seed-word-modal__input-wrapper' })`
  width: 25%;
  margin: 0 0 25px 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  border: none;

  &:nth-of-type(4n) {
    margin-bottom: 0;
  }

  &:nth-of-type(n + 5) {
    margin-left: 50px;
  }
`;

export const InputValueWrapper = styled.div`
  flex: 1;
`;

export const InputRowWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: 220px;
  margin: 15px 0;
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  align-items: stretch;
  justify-content: space-between;
`;
