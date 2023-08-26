import React from 'react';
import styled from 'styled-components/macro';

const Svg = styled.svg`
  width: 20px;
  height: 20px;
`;

export const SettingsExchangesIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
    <path d="M17.9,17.39A2,2,0,0,0,16,16H15V13a1,1,0,0,0-1-1H8V10h2a1,1,0,0,0,1-1V7h2a2,2,0,0,0,2-2V4.59a8,8,0,0,1,2.9,12.8M11,19.93a8,8,0,0,1-6.79-9.72L9,15v1a2,2,0,0,0,2,2M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" />
  </Svg>
);

export const SettingsPreferencesIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
    <path d="M12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5M19.43,13a7.77,7.77,0,0,0,.07-1,8.55,8.55,0,0,0-.07-1l2.11-1.63a.5.5,0,0,0,.12-.64l-2-3.46a.49.49,0,0,0-.61-.22l-2.49,1a7.25,7.25,0,0,0-1.69-1L14.5,2.42A.51.51,0,0,0,14,2H10a.51.51,0,0,0-.5.42L9.13,5.07a7.25,7.25,0,0,0-1.69,1L5,5.05a.49.49,0,0,0-.61.22l-2,3.46a.49.49,0,0,0,.12.64L4.57,11a8.55,8.55,0,0,0-.07,1,7.77,7.77,0,0,0,.07,1L2.46,14.63a.49.49,0,0,0-.12.64l2,3.46A.5.5,0,0,0,5,19l2.49-1a7,7,0,0,0,1.69,1l.37,2.65A.51.51,0,0,0,10,22h4a.51.51,0,0,0,.5-.42l.37-2.65a7.28,7.28,0,0,0,1.69-1l2.49,1a.5.5,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.64Z" />
  </Svg>
);

export const SettingsPrivacyIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
    <path d="M18,8.5H17v-2a5,5,0,0,0-10,0v2H6a2,2,0,0,0-2,2v10a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2v-10A2,2,0,0,0,18,8.5Zm-9-2a3,3,0,0,1,6,0v2H9Zm1.52,12.6L7.69,16.27,9,15l1.54,1.55L15,12l1.29,1.29Z" />
  </Svg>
);

export const SettingsAffiliateIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
    <path d="M5,4H23V16H5V4m9,3a3,3,0,1,1-3,3,3,3,0,0,1,3-3M9,6A2,2,0,0,1,7,8v4a2,2,0,0,1,2,2H19a2,2,0,0,1,2-2V8a2,2,0,0,1-2-2H9M1,8H3V18H19v2H1Z" />
  </Svg>
);

export const SettingsAdvancedIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
    <path d="M12,6a6,6,0,0,1,3,11.2V19a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V17.2A6,6,0,0,1,12,6m2,15v1a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V21h4m6-10h3v2H20V11M1,11H4v2H1V11M13,1V4H11V1h2M4.92,3.5,7.05,5.64,5.63,7.05,3.5,4.93,4.92,3.5M17,5.63,19.07,3.5,20.5,4.93,18.37,7.05Z" />
  </Svg>
);

export const SettingsReportsIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
    <path d="M13,9h5.5L13,3.5V9M6,2h8l6,6V20a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V4A2,2,0,0,1,6,2M7,20H9V14H7v6m4,0h2V12H11v8m4,0h2V16H15Z" />
  </Svg>
);

export const SettingsDemoTradeIcon = props => (
  <Svg className="top-bar__icon" viewBox="0 0 100 100" role="img" aria-hidden="true" {...props}>
    <svg height="100" width="100">
      <circle cx="50" cy="50" r="40" />
    </svg>
  </Svg>
);

const OpenArrowSvg = styled.svg`
  margin-right: 25px;
  width: 18px;
  height: 11px;
  transform: ${props => (props.isOpened ? 'rotateZ(0deg)' : 'rotateZ(-90deg)')};
  transition: all 0.25s;
  &,
  & * {
    fill: ${props => props.theme.palette.settingsHeaderFontColor} !important;
  }
`;

export const OpenArrow = props => (
  <OpenArrowSvg viewBox="0 0 15 8.9" {...props}>
    <path
      className="st0"
      d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
    />
  </OpenArrowSvg>
);
