import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'historyAdv-wrapper' })`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-weight: 700;
  letter-spacing: 1px;
`;

export const InnerWrapper = styled.div.attrs({ className: 'historyAdv-inner-wrapper' })`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Menu = styled.div`
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  height: 34px;
  min-width: 122px;
  padding: 0 30px;
  text-align: center;
  position: relative;

  background: ${props => (props.active ? props.theme.palette.clrMainWindow : '')};
  color: ${props => (props.active ? props.theme.palette.clrPurple : props.theme.palette.clrHighContrast)};

  ${props =>
    props.active
      ? `
        &:after {
            content: "";
            position: absolute;
            display: block;
            width: 80%;
            border-bottom: 2px solid ${props => props.theme.palette.clrHighContrast};
            bottom: 3px;
            left: 10%;
        }
    `
      : ''};
`;

export const List = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
`;

export const StyleWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  .scrollbar-container {
    height: min-content;
    max-height: 100%;
    overflow: hidden;

    &.d-flex {
      flex-wrap: wrap;
    }
  }

  .ps__rail-y {
    background-color: ${props => props.theme.palette.depositBackground} !important;
    border-left: 1px solid ${props => props.theme.palette.clrPurple};
    opacity: 1 !important;

    .ps__thumb-y {
      z-index: 9999;
      cursor: pointer;

      &:before {
        background-color: ${props => props.theme.palette.clrPurple};
      }
    }
  }

  .ReactVirtualized__Table__rowColumn {
    height: 100%;
    margin: 0;
    padding: 0 15px;

    &:not(:first-child) {
      border-left: 1px solid ${props => props.theme.palette.clrBorderLight};
    }
  }

  .ReactVirtualized__Table__row {
    padding-right: 15px !important;
    border-bottom: 1px solid ${props => props.theme.palette.clrBorderLight};

    &:hover {
      background-color: ${props => props.theme.palette.clrBorder};
      color: ${props => props.theme.palette.clrHighContrast} !important;
    }
  }

  .ReactVirtualized__Table__headerRow {
    background-color: ${props => props.theme.palette.clrMainWindow};
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};

    .ReactVirtualized__Table__headerColumn {
      &:last-child {
        min-width: 12px;
      }
    }
  }
`;

export const HeaderWrapper = styled.div`
  border-collapse: collapse;
  box-sizing: border-box;
  color: ${props => props.theme.palette.clrPurple};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  height: 28px;
  z-index: 3;
  -webkit-border-horizontal-spacing: 2px;
  -webkit-border-vertical-spacing: 2px;
  white-space: nowrap;
`;
export const ImgCancelSvg = styled.svg`
  fill: ${props => props.theme.palette.clrPurple};
  width: 12px;
  min-width: 12px;
  margin-top: 7px;
  margin-left: 7px;
  &:hover {
    fill: ${props => props.theme.palette.clrHighContrast};
  }
`;
export const ImgCancel = props => (
  <ImgCancelSvg viewBox="0 0 13.01 18" role="img" aria-hidden="true" {...props}>
    <path
      d="M5.34,16H5.36a0.41,0.41,0,0,0,.4-0.42V6.18a0.415,0.415,0,0,0-.83,0v9.41A0.41,0.41,0,0,0,5.34,16Z"
      transform="translate(-0.495 -0.5)"
    />
    <path
      d="M8.66,16H8.68a0.41,0.41,0,0,0,.4-0.42V6.18a0.415,0.415,0,0,0-.83,0v9.41A0.41,0.41,0,0,0,8.66,16Z"
      transform="translate(-0.495 -0.5)"
    />
    <path
      d="M13.09,2.72H9.35V1.81A1.31,1.31,0,0,0,8.04.5H5.96A1.31,1.31,0,0,0,4.67,1.82v0.9H0.91a0.415,0.415,0,0,0,0,.83h0.7V17.19A1.31,1.31,0,0,0,2.92,18.5H11.1a1.31,1.31,0,0,0,1.3-1.32V3.55h0.69A0.415,0.415,0,0,0,13.09,2.72ZM5.5,1.82a0.48,0.48,0,0,1,.46-0.48h2.1A0.48,0.48,0,0,1,8.5,1.86V2.72h-3V1.82Zm6.07,15.36a0.48,0.48,0,0,1-.48.48H2.92a0.48,0.48,0,0,1-.48-0.48V3.55h9.13V17.18Z"
      transform="translate(-0.495 -0.5)"
    />
  </ImgCancelSvg>
);

export const Item = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  color: #7f8bc2;
  font-size: 11px;
  .tooltipId {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
