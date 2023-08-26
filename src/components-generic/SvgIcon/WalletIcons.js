import React from 'react';
import styled from 'styled-components/macro';
import { WalletButton } from '@/components-generic/WalletGroupButton/ChildComponents';

const SvgSide = styled.svg`
  position: absolute;
  right: -5px;
  top: calc(50% - 15px);
  height: 30px;
  fill: ${props => props.theme.palette.clrBackground};
  stroke: ${props => props.theme.palette.clrInnerBorder};
  stroke-miterlimit: 10;
  stroke-width: 1px;
  left: initial;

  ${props =>
    props.small &&
    `
        top: calc(50% - 10px);
        width: 23px;
        height: 20px;
        stroke-width: 2px;
    `}
  ${WalletButton}:hover & {
    fill: ${props => props.theme.palette.clrWalletHover};
  }
  ${WalletButton}:active & {
    fill: ${props => props.theme.palette.clrBackground};
  }
`;

export const WalletSideIcon = props => (
  <SvgSide viewBox="0 0 22.47 19.27" {...props}>
    <path d="M9.63,1h8.83a3,3,0,0,1,3,3V15.27a3,3,0,0,1-3,3H9.63A8.63,8.63,0,0,1,1,9.63v0A8.63,8.63,0,0,1,9.63,1Z" />
    <circle cx="9.68" cy="9.63" r="3.11" />
  </SvgSide>
);

const SvgTop = styled.svg`
  position: absolute;
  left: -2px;
  right: -2px;
  top: -4px;
  width: 130px;
  height: 12px;
  fill: ${props => props.theme.palette.clrBackground};
  stroke: ${props => props.theme.palette.clrInnerBorder};
  stroke-miterlimit: 10;
  stroke-width: 2px;
`;

export const WalletTopIcon = () => (
  <SvgTop viewBox="0 0 178.06 11.95">
    <path d="M174.06,1H6A5,5,0,0,0,1,6H1a5,5,0,0,0,5,5H177.06V4A3,3,0,0,0,174.06,1Z" />
    <line x1="167.29" y1="5.97" x2="172.34" y2="5.97" />
    <line x1="6.03" y1="5.97" x2="162.85" y2="5.97" />
  </SvgTop>
);
