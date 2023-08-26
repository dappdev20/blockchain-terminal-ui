import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  letter-spacing: -4px;
  color: ${props => props.theme.palette.clrBackground};
  background: ${props => props.theme.palette.clrBackground};

  &.phone-number-input {
    flex: 1;
    &.enter-code,
    &.verify-success {
      flex: 2;
    }

    input {
      width: 55%;
    }
  }

  &.code-input {
    flex: 1;
    input {
      width: 50%;
    }
  }
`;

export const InputLabel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${props => props.theme.palette.clrBorder};

  text-align: center;
  text-transform: uppercase;
  font-size: 40px;
  font-weight: bold;
  letter-spacing: 1.1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Input = styled.input`
  padding: 0 12px;
  width: 55%;
  border: none;
  text-align: center;
  height: 40px;
  background: transparent;
  font-family: 'open_sans', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 40px;
  font-weight: bold;
  line-height: normal !important;
  color: ${props => props.theme.palette.clrHighContrast};

  &::placeholder {
    color: ${props => props.theme.palette.clrOnBackDisabled};
  }
`;

const SpinnerIconSvg = styled.svg`
  margin-left: 5px;
  width: 30px;
  height: 30px;
`;

export const SpinnerIcon = props => (
  <SpinnerIconSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" {...props}>
    <g transform="rotate(0 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.9333333333333333s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(24 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.8666666666666667s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(48 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8s" repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(72 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.7333333333333333s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(96 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.6666666666666666s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(120 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6s" repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(144 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.5333333333333333s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(168 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.4666666666666667s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(192 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4s" repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(216 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.3333333333333333s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(240 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.26666666666666666s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(264 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.2s" repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(288 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.13333333333333333s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(312 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.06666666666666667s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g transform="rotate(336 50 50)">
      <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite" />
      </rect>
    </g>
  </SpinnerIconSvg>
);

const PhoneIconSvg = styled.svg`
  width: 17.84px;
  height: 29.42px;

  .svg-stroke {
    stroke: ${props => props.theme.palette.clrBackground};
  }

  .svg-fill {
    fill: ${props => props.theme.palette.clrBackground};
  }
`;

export const PhoneIcon = props => (
  <PhoneIconSvg {...props} viewBox="0 0 17.84 29.42">
    <path d="M15.49,0H2.35A2.35,2.35,0,0,0,0,2.35V27.07a2.35,2.35,0,0,0,2.35,2.35H15.49a2.35,2.35,0,0,0,2.35-2.35V2.35A2.35,2.35,0,0,0,15.49,0ZM16.9,22.85h-2a.47.47,0,1,0,0,.94h2v3.28a1.41,1.41,0,0,1-1.41,1.41H2.35A1.41,1.41,0,0,1,.94,27.07V23.79H13a.47.47,0,0,0,0-.94H.94V6.57h16Zm0-17.22H.94V2.35A1.41,1.41,0,0,1,2.35.94H15.49A1.41,1.41,0,0,1,16.9,2.35Z" />
    <path d="M8.92,24.72a1.41,1.41,0,1,0,1.41,1.41,1.41,1.41,0,0,0-1.41-1.41Zm0,1.88a.47.47,0,1,1,.47-.47.47.47,0,0,1-.47.47Z" />
    <path d="M10.8,2.82H7a.47.47,0,0,0,0,.94H10.8a.47.47,0,0,0,0-.94Z" />
  </PhoneIconSvg>
);
