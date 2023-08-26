import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  margin: 0;
  border: none;
  padding: 6px 10px 6px 30px;
  width: 100%;
  height: 100%;
`;

export const InputWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px 0 0;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-top-right-radius: 23px;
  border-bottom-right-radius: 23px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-height: 38px !important;
  padding: 5px 0;
  &:last-child {
    margin-right: 0 !important;
  }

  &.phone-number-input.enter-code,
  &.phone-number-input.verify-success {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
    margin: 0;
    flex: 2;

    input {
      padding: 5px 5px 5px 20px;
      color: white;
    }
  }

  &.code-input.enter-code,
  &.code-input.verify-success {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin: 0;
    flex: 1;

    input {
      padding: 5px 20px 5px 20px;
    }
  }

  &.code-valid input,
  &.code-input.verify-success input {
    color: white;
  }
`;

export const Input = styled.input`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  border: none;
  padding: 5px 0px 5px 40px;
  text-align: center;
  width: calc(100% - 55px);
  height: 100%;
  background: transparent;
  font-family: roboto;
  font-size: 40px;
  line-height: 1em;
  color: ${props => props.theme.palette.clrBorder};

  &::placeholder {
    color: ${props => props.theme.palette.clrBorder};
  }
`;

export const InputAddon = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: none;
  padding: 0;
  width: 44px;
  height: 100%;
  cursor: pointer;
  min-height: 33px;

  .sprite-icon.close {
    width: 20px;
    height: 20px;
  }

  &:hover {
    svg {
      .svg-stroke {
        stroke: ${props => props.theme.palette.clrHighContrast} !important;
      }

      .svg-fill {
        fill: ${props => props.theme.palette.clrHighContrast} !important;
      }
    }
  }
`;

const SendIconSvg = styled.svg`
  width: 37px;
  height: 37px;
  background-color: ${props => props.theme.palette.clrBorder};
  border-radius: 50%;

  & * {
    fill: ${props => props.theme.palette.clrBackground};
    stroke: transparent;
  }
`;

export const SendIcon = props => (
  <SendIconSvg {...props} viewBox="-5 -5 36.16 30.93">
    <path
      className="cls-1"
      cx="5"
      cy="5"
      d="M11.82.88a2.92,2.92,0,0,0,0,4.23L14.3,7.47l-11.21,0a3,3,0,0,0-3.09,3,3,3,0,0,0,3.11,3l11.21,0-2.45,2.38a2.92,2.92,0,0,0,0,4.23,3.17,3.17,0,0,0,4.38,0l9.9-9.62L16.2.87A3.17,3.17,0,0,0,11.82.88Z"
    />
  </SendIconSvg>
);

const SpinnerIconSvg = styled.svg`
  width: 18px;
  height: 18px;
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

const SendIcon2Svg = styled.svg`
  width: 37px;
  height: 37px;
  background-color: white;
  border-radius: 50%;

  & * {
    fill: ${props => props.theme.palette.clrBackground};
    stroke: transparent;
  }

  .svg-stroke {
    stroke: ${props => props.theme.palette.clrHighContrast};
    stroke-miterlimit: 10;
  }

  .svg-fill {
    fill: ${props => props.theme.palette.clrHighContrast};
  }

  &.disabled {
    .svg-stroke {
      stroke: ${props => props.theme.palette.clrBackground};
      stroke-miterlimit: 10;
    }

    .svg-fill {
      fill: ${props => props.theme.palette.clrBackground};
    }
  }
`;

export const SendIcon2 = props => (
  <SendIcon2Svg {...props} viewBox="-5 -5 36.16 30.93">
    <path
      className="cls-1"
      cx="5"
      cy="5"
      d="M11.82.88a2.92,2.92,0,0,0,0,4.23L14.3,7.47l-11.21,0a3,3,0,0,0-3.09,3,3,3,0,0,0,3.11,3l11.21,0-2.45,2.38a2.92,2.92,0,0,0,0,4.23,3.17,3.17,0,0,0,4.38,0l9.9-9.62L16.2.87A3.17,3.17,0,0,0,11.82.88Z"
    />
  </SendIcon2Svg>
);
