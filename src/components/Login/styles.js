import React from 'react';
import styled from 'styled-components/macro';

export const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  transition: all 0.2s ease;
`;

export const CoinPairWrapper = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: ${props => props.width || 0}px;
  height: 100%;
  padding-top: 3px;
  text-align: center;
  border-left: 1px solid ${props => props.theme.palette.coinPairSelectBorder};
  cursor: pointer;

  .login-title {
    position: absolute;
    text-overflow: ellipsis;
    left: 30px;
    bottom: 0;
    z-index: 99;
    padding: 2px;
    background-color: ${props => (props.isLoggedIn ? props.theme.palette.clrRed : '#444872')};
    border: 1px solid ${props => (props.isLoggedIn ? props.theme.palette.clrRed : '#444872')};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 9px;
    line-height: 8px;
    letter-spacing: 0.2px;
    color: ${props => props.theme.palette.clrHighContrast};
    text-transform: uppercase;
    text-align: center;
    pointer-events: none;
    overflow: hidden;
    transform: translateX(calc(-50% + 1px));
  }
`;

export const LoginTextWrapper = styled.div`
  height: 6px;
  position: relative;

  .loader {
    background: transparent;
  }
`;

const AvatarSvg = styled.svg.attrs({ className: 'avatar-icon' })`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.palette.clrBorder};
  border-radius: 50%;

  &:hover {
    box-shadow: 0px 0px 15px 3px ${props => props.theme.palette.clrBorder};
    cursor: pointer;
  }

  &:active {
    box-shadow: 0px 0px 15px 3px ${props => props.theme.palette.clrBorder};
  }

  .cls-1 {
    stroke: #7881ae;
    fill: white;
  }

  .cls-2 {
    stroke: none;
    fill: ${props => props.theme.palette.clrBorder};
  }
`;

export const AvatarIcon = props => (
  <AvatarSvg {...props} viewBox="0 0 43.71 43.71">
    <circle className="cls-2" cx="21.855" cy="21.855" r="21.855" strokeWidth="2" />
    <path
      className="cls-1"
      d="M15.35,34.27,8.83,37.82a6.06,6.06,0,0,0-1,.75,21.83,21.83,0,0,0,28.06.07,6,6,0,0,0-1.14-.77l-7-3.49A2.66,2.66,0,0,1,26.24,32V29.26a9.14,9.14,0,0,0,.66-.85A16.22,16.22,0,0,0,29.07,24,2.2,2.2,0,0,0,30.63,22V19a2.22,2.22,0,0,0-.73-1.63V13.18s.87-6.58-8-6.58-8,6.58-8,6.58V17.4A2.19,2.19,0,0,0,13.08,19V22a2.2,2.2,0,0,0,1,1.84,14.64,14.64,0,0,0,2.65,5.47v2.67a2.69,2.69,0,0,1-1.39,2.34Z"
    />
  </AvatarSvg>
);
