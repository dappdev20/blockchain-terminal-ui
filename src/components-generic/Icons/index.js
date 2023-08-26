import React from 'react';
import styled from 'styled-components/macro';

import checkboxImg from './checkbox.png';
import checkboxCheckedImg from './checkbox_checked.png';
import apiImg from './api.png';
import apiActiveImg from './api_active.png';
import apiSyncedImg from './api_synced.png';
import apiSyncedActiveImg from './api_synced_active.png';
import closeButtonImg from './close_button.png';

const ImageWrapper = styled.div`
  position: relative;
  width: ${props => props.size || 28}px;
  height: ${props => props.size || 28}px;
  margin-left: ${props => props.marginLeft || 0}px;
  margin-right: ${props => props.marginRight || 0}px;
  margin-top: ${props => props.marginRight || 0}px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

  .label {
    position: absolute;
    top: 100%;
    left: 50%;
    display: ${props => (props.active ? 'block' : 'none')};
    font-size: 13px !important;
    font-weight: normal !important;
    color: ${props => props.theme.palette.clrHighContrast};
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .close-button {
    filter: invert(1);
  }

  .active {
    display: none;
  }

  &:hover {
    cursor: pointer;
  }

  ${props =>
    props.active
      ? `
        .active {
            display: block;
        }

        .inactive {
            display: none;
        }
    `
      : ''};
`;

export const Checkbox = props => (
  <ImageWrapper {...props}>
    <img src={checkboxImg} className="inactive" alt="" />
    <img src={checkboxCheckedImg} className="active" alt="" />
  </ImageWrapper>
);

export const CloseButton = props => (
  <ImageWrapper {...props}>
    <img src={closeButtonImg} className="close-button" alt="" />
  </ImageWrapper>
);

export const ApiIcon = props => (
  <ImageWrapper {...props}>
    <img src={props.isApiSynced === true ? apiSyncedImg : apiImg} className="inactive" alt="" />
    <img src={props.isApiSynced === true ? apiSyncedActiveImg : apiActiveImg} className="active" alt="" />
  </ImageWrapper>
);

const InfoSvg = styled.svg`
  width: ${props => (props.size ? props.size : 16)}px;
  height: ${props => (props.size ? props.size : 16)}px;
  margin-left: ${props => props.marginLeft || 0}px;
  margin-top: 7px;
  fill: ${props => props.theme.palette.clrPurple};

  .cls-2 {
    font-size: 13px;
    fill: ${props => props.theme.palette.clrMainWindow};
  }
`;

export const InfoIcon = props => (
  <InfoSvg {...props} viewBox="0 0 16.21 16.77">
    <path
      d="M16.21,8.11a8.37,8.37,0,0,1-.15,1.58,8.88,8.88,0,0,1-.46,1.52,9,9,0,0,1-.75,1.4,9.18,9.18,0,0,1-1,1.23,9.18,9.18,0,0,1-1.23,1,9,9,0,0,1-1.4.75,8.88,8.88,0,0,1-1.52.46,8.37,8.37,0,0,1-1.58.15,8.48,8.48,0,0,1-1.59-.15A9.16,9.16,0,0,1,5,15.6a9.42,9.42,0,0,1-1.4-.75,9.18,9.18,0,0,1-1.23-1,8.4,8.4,0,0,1-1-1.23,7.54,7.54,0,0,1-.75-1.4A7.4,7.4,0,0,1,.16,9.69,7.63,7.63,0,0,1,0,8.11,7.73,7.73,0,0,1,.16,6.52,7.59,7.59,0,0,1,.62,5a7.88,7.88,0,0,1,.75-1.4,8.4,8.4,0,0,1,1-1.23,8.4,8.4,0,0,1,1.23-1A7.88,7.88,0,0,1,5,.62,7.59,7.59,0,0,1,6.52.16,7.73,7.73,0,0,1,8.11,0,7.63,7.63,0,0,1,9.69.16a7.4,7.4,0,0,1,1.52.46,7.54,7.54,0,0,1,1.4.75,8.4,8.4,0,0,1,1.23,1,9.18,9.18,0,0,1,1,1.23A9.42,9.42,0,0,1,15.6,5a9.16,9.16,0,0,1,.46,1.52A8.48,8.48,0,0,1,16.21,8.11Z"
      transform="translate(0 0)"
    />
    <text className="cls-2" transform="translate(6.51 13.06)">
      i
    </text>
  </InfoSvg>
);
