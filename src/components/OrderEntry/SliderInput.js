import React from 'react';
import styled from 'styled-components';

const MULTIPLIER = 10000;

const SliderWrapper = styled.div`
    position: absolute;
    left: 3px;
    right: 3px;
    bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: stretch;
    height: 13px;

    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        height: 13px;
        background: transparent;
        padding: 0;
        margin: 0;
        cursor: ${props => (props.readOnly ? 'initial' : 'pointer')};
        z-index: 5;
        box-shadow: none;

        &.zero {
            &::-webkit-slider-thumb {
                background: ${props => props.theme.palette.ctrlSliderTrackBg};
            }
            
            &::-moz-range-thumb {
                background: ${props => props.theme.palette.ctrlSliderTrackBg};
            }
            
            &::-ms-thumb {
                background: ${props => props.theme.palette.ctrlSliderTrackBg};
            }
        }

        &::-webkit-slider-thumb {
            width: 70px;
            height: 14px;
            background: transparent !important;
            cursor: ${props => (props.readOnly ? 'initial' : 'pointer')};
            -webkit-appearance: none;
        }

        &::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            width: 100%;
            height: 13px;
            background: transparent;               
        }

        &::-moz-range-thumb {
            width: 70px;
            height: 14px;
            background: transparent !important;
            cursor: ${props => (props.readOnly ? 'initial' : 'pointer')};
        }

        &::-moz-range-track {
            width: 100%;
            height: 13px;            
            background: transparent;
        } 

        &::-moz-range-progress {
            background-color: transparent; 
        }

        &::-ms-thumb {
            width: 70px;
            height: 14px;
            background: transparent !important;
            cursor: ${props => (props.readOnly ? 'initial' : 'pointer')};
        }

        &::-ms-track {
            width: 100%;
            height: 13px;
            background: transparent; 
            border-color: transparent;
            color: transparent;
        }

        &::-ms-fill-lower {
            background: transparent;
        }

        &::-ms-fill-upper {
            background: transparent;
        }
    }

    &:hover {
        input[type=range] {
            &::-webkit-slider-thumb {
                // background: ${props => props.theme.palette.ctrlSliderThumbHoverBg} !important;
                // border-color: ${props => props.theme.palette.ctrlSliderThumbHoverBorder} !important;
            }

            &::-moz-range-thumb {
                // background: ${props => props.theme.palette.ctrlSliderThumbHoverBg} !important;
                // border-color: ${props => props.theme.palette.ctrlSliderThumbHoverBorder} !important;
            }

            &::-ms-thumb {
                // background: ${props => props.theme.palette.ctrlSliderThumbHoverBg} !important;
                // border-color: ${props => props.theme.palette.ctrlSliderThumbHoverBorder} !important;
            }
        }
    }
`;

const SliderTrackWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  right: 0;
  margin: 0;
  border: none;
  padding: 0;
  width: 100%;
  height: 2px;
  background: ${props => props.theme.palette.ctrlSliderTrackBg};
  z-index: 1;
`;

const SliderTrackProgress = styled.div`
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  margin: 0;
  border: none;
  padding: 0;
  width: ${props => (Number.parseFloat(props.progress) <= 100 ? props.progress : 100)}%;
  height: 2px;
  background: ${props =>
    props.isDisabled
      ? props.theme.palette.ctrlsliderTrackDisabledBg
      : props.isBuy
      ? props.theme.palette.clrGreen
      : props.theme.palette.dodgerBlue};
  z-index: 2;
`;

const SliderTrackCurrentValue = styled.div`
  position: absolute;
  top: -1px;
  left: ${props =>
    Number.parseFloat(props.progress) <= 100
      ? `calc(${props.progress}% - ${(70 * props.progress) / 100}px)`
      : 'calc(100% - 70px)'};
  bottom: 0;
  z-index: 4;
  width: 70px;
  height: 16px;
  margin: 0;
  padding: 0;
  background: ${props =>
    props.isDisabled ? props.theme.palette.clrBackground : props.theme.palette.ctrlSliderTrackCurrentBg};
  border: 1px solid
    ${props =>
      props.isDisabled ? props.theme.palette.ctrlsliderTrackDisabledBg : props.theme.palette.ctrlSliderTrackProgressBg};
  border-radius: 3px;
  font-size: 11px;
  line-height: 14px;
  color: ${props =>
    props.isDisabled ? props.theme.palette.ctrlsliderTrackDisabledBg : props.theme.palette.ctrlSliderTrackProgressBg};
  text-align: center;
  clip: rect(-3px, 71px, 18px, -5px);

  &:before,
  &:after {
    content: '';
    position: absolute;
    bottom: 3px;
    width: 0;
    border-style: solid;
    border-width: 4px;
    border-color: transparent
      ${props =>
        props.isDisabled
          ? props.theme.palette.ctrlsliderTrackDisabledBg
          : props.theme.palette.ctrlSliderTrackProgressBg}
      transparent transparent;
  }

  &:before {
    left: -9px;
    display: ${props => (Number.parseFloat(props.progress) > 0 ? 'block' : 'none')};
    border-color: transparent
      ${props =>
        props.isDisabled
          ? props.theme.palette.ctrlsliderTrackDisabledBg
          : props.theme.palette.ctrlSliderTrackProgressBg}
      transparent transparent;
  }

  &:after {
    right: -9px;
    display: ${props => (Number.parseFloat(props.progress) < 100 ? 'block' : 'none')};
    border-color: transparent transparent transparent
      ${props =>
        props.isDisabled
          ? props.theme.palette.ctrlsliderTrackDisabledBg
          : props.theme.palette.ctrlSliderTrackProgressBg};
  }
`;

const Delimeter = styled.div`
  position: absolute;
  top: calc(50% - 2px);
  left: ${props => `calc(${props.position}% - ${props.position === 0 ? 1 : props.position === 50 ? 0 : 2}px)`};
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${props =>
    props.isDisabled
      ? props.theme.palette.ctrlsliderTrackDisabledBg
      : props.position <= props.progress
      ? props.theme.palette.ctrlSliderDelimiterActiveBg
      : props.theme.palette.ctrlSliderDelimiterBg};
  box-sizing: border-box;
  z-index: 3;
`;

const SliderInput = ({
  max,
  currentValue,
  value,
  // progress,
  onChange,
  readOnly,
  isDisabled,
  isBuy
}) => {
  const handleChange = e => {
    if (!readOnly) {
      onChange(e.target.value / MULTIPLIER);
    }
  };

  const progress = value > 0 ? (value / max) * 100 : 0;

  return (
    <SliderWrapper className="range-slider" readOnly={readOnly}>
      <input
        type="range"
        className={`slider-control${Number.parseFloat(value) === 0 ? ' zero' : ''}`}
        readOnly={readOnly}
        min="0"
        max={max * MULTIPLIER}
        step={max}
        value={value * MULTIPLIER}
        onChange={handleChange}
      />

      <SliderTrackWrapper isDisabled={isDisabled}>
        <SliderTrack />
        <SliderTrackProgress isDisabled={isDisabled} progress={progress} isBuy={isBuy} />
        <SliderTrackCurrentValue isDisabled={isDisabled} progress={progress}>
          {currentValue}
        </SliderTrackCurrentValue>
        <Delimeter position={0} isDisabled={isDisabled} progress={progress} />
        <Delimeter position={100} isDisabled={isDisabled} progress={progress} />
      </SliderTrackWrapper>
    </SliderWrapper>
  );
};

export default SliderInput;
