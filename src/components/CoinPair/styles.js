import React from 'react';
import styled, { css } from 'styled-components/macro';

export const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const CoinItemWrapper = styled.div`
  position: relative;
  width: calc(50% - 12px);
  height: 100%;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.1s;
  font-size: 13px;
  color: ${props => props.theme.palette.coinPairSelectText2};
  z-index: 8;

  [role='button'] {
    cursor: pointer;
  }
`;

export const WrapperSlider = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0;
  width: ${props => (props.isRight ? '100%' : 'calc(100% - 63px)')};
`;

export const CurrencyName = styled.div`
  font-size: 2rem;
  font-weight: 700;
  font-family: Roboto;
  color: ${props => props.theme.palette.coinPairSelectText2};
  background: transparent;
  border: 0;
  padding: 0 12px;

  ${props =>
    props.isLeft &&
    css`
      margin-left: 12px;
      border-left: 1px solid ${props.theme.palette.coinPairSelectBorder};
    `}
`;

export const DataLoaderWrapper = styled.div`
  position: relative;
  min-width: 150px;
  margin-left: auto;
`;

export const EqualSymbol = styled.div`
  height: 60px;
  line-height: 60px;
  font-size: 40px;
  font-weight: 700;
  color: ${props => props.theme.palette.clrBorder};
  margin-left: -3px;
`;

export const SettingsWrapper = styled.div`
  position: relative;
  height: 100%;
`;

export const ToggleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${props => props.theme.palette.coinPairSelectBorder};
  &:hover {
    color: #fff;
    background-color: ${props => props.theme.palette.coinPairSelectHoverBorder};
  }
  cursor: pointer;
`;

export const SettingsIcon = () => (
  <svg viewBox="0 0 17 17" width="17" height="17" fill="currentColor">
    <rect x="0" y="0" width="5" height="5" />
    <rect x="6" y="0" width="5" height="5" />
    <rect x="12" y="0" width="5" height="5" />
    <rect x="0" y="6" width="5" height="5" />
    <rect x="6" y="6" width="5" height="5" />
    <rect x="12" y="6" width="5" height="5" />
    <rect x="0" y="12" width="5" height="5" />
    <rect x="6" y="12" width="5" height="5" />
    <rect x="12" y="12" width="5" height="5" />
  </svg>
);

export const PopupWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: ${props => (props.isOpen ? '0' : '-450')}px;
  width: 450px;
  height: 100vh;
  ${props => props.isOpen && 'box-shadow: 0 0 34px 26px rgba(0, 0, 0, 0.6);'}
  background: ${props => props.theme.palette.settingsBackgroundColor};
  font-family: Roboto;
  transition: left 0.3s;

  &:before {
    content: ' ';
    position: absolute;
    top: -7px;
    right: 16px;
    border: 7px solid transparent;
    border-top: none;
    border-bottom-color: ${props => props.theme.palette.coinPairSelectBorder};
  }
`;

export const CoinIconWrapper = styled.div`
  height: 100%;
  padding-top: 10px;

  .dropdown_wrapper_space {
    position: absolute;
    bottom: -13px;
    width: 40px;
    height: 25px;
  }
`;

export const CustomMetaDropdownWrapper = styled.div`
  display: flex;
`;
