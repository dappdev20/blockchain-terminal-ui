import React from 'react';
import styled from 'styled-components/macro';

const GeneralSearchIconSvg = styled.svg`
  margin: 0 2px 0 10px;
  width: ${props => (props.isMobile ? '30px' : '22.5px')};
  height: ${props => (props.isMobile ? '25px' : '18.75px')};

  &,
  & * {
    fill: ${props => props.theme.palette.clrPurple} !important;
  }
`;

export const GeneralSearchIcon = ({ isMobile }) => {
  return (
    <GeneralSearchIconSvg isMobile={isMobile}>
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#search" />
    </GeneralSearchIconSvg>
  );
};

const ExchDropdownSearchIconSvg = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 30px;
  z-index: 1;
  fill: ${props => props.theme.palette.clrHighContrast};
  margin: 0 12px 0 0;
  &,
  & * {
    fill: ${props => props.theme.palette.clrHighContrast};
  }
`;
export const ExchDropdownSearchIcon = () => (
  <ExchDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px">
    <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z" />
    <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)" />
  </ExchDropdownSearchIconSvg>
);

const RightExchDropdownSearchIconSvg = styled.svg`
  width: 2rem;
  fill: ${props => props.theme.palette.clrBorder};

  .cls-1 {
    fill: none;
    stroke: #454c73;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 4px;
  }
  .cls-2 {
    fill: #454c73;
  }
`;

export const RightExchDropdownSearchIcon = () => (
  <RightExchDropdownSearchIconSvg viewBox="0 0 34.38 34.02">
    <circle className="cls-1" cx="13.82" cy="13.82" r="11.82" />
    <line className="cls-1" x1="21.55" y1="22.75" x2="30.82" y2="32.02" />
    <polygon className="cls-2" points="26.77 0.55 30.58 6.96 34.38 0.55 26.77 0.55" />
  </RightExchDropdownSearchIconSvg>
);

const SideBarSearchIconSvg = styled.svg`
  width: 27px;
  height: 27px;
`;
export const SideBarSearchIcon = () => (
  <SideBarSearchIconSvg viewBox="0 0 20.89 20.88" role="img" aria-hidden="true">
    <path d="M20.3,17.51l-4-4a8.79,8.79,0,1,0-2.78,2.79l4,4a2,2,0,1,0,2.78-2.78Zm-6.94-4.16a6.44,6.44,0,1,1,0-9.1,6.45,6.45,0,0,1,0,9.1Z" />
  </SideBarSearchIconSvg>
);

const ExchangesDropdownSearchIconSvg = styled.svg`
  width: 32px;
  height: 27px;
  fill: ${props => props.theme.palette.clrHighContrast};
`;

export const ExchangesDropdownSearchIcon = () => (
  <ExchangesDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px">
    <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z" />
    <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)" />
  </ExchangesDropdownSearchIconSvg>
);

const SearchCloseIconSVG = styled.svg`
  width: 21.08px;
  height: 21.08px;
  cursor: pointer;

  .cls-1 {
    fill: none;
    stroke: #454c73;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 4px;
  }
`;

export const SearchCloseIcon = () => (
  <SearchCloseIconSVG viewBox="0 0 21.08 21.08" role="img" aria-hidden="true">
    <line className="cls-1" x1="2" y1="2" x2="19.08" y2="19.08" />
    <line className="cls-1" x1="2" y1="19.08" x2="19.08" y2="2" />
  </SearchCloseIconSVG>
);
