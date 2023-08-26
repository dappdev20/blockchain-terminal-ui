import React, { Component } from 'react';
import styled from 'styled-components/macro';

const thumbRadius = 12;
const MULTIPLIER = 10000;

const SliderWrapper = styled.div`
    position: relative;    
    height: ${thumbRadius}px;
    display: flex;
    align-items: center;
    justify-content: stretch;

    input[type=range] {
        width: 100%;
        height: ${thumbRadius}px;
        background: transparent;
        padding: 0;
        margin: 0;
        z-index: 5;
        cursor: ${props => (props.readOnly ? 'initial' : 'pointer')};
        box-shadow: none;
        -webkit-appearance: none;

        // At zero value, make thumb same color as empty track
        &.zero {
            &::-webkit-slider-thumb {
                background: ${props =>
                  (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
            }
            
            &::-moz-range-thumb {
                background: ${props =>
                  (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
            }
            
            &::-ms-thumb {
                background: ${props =>
                  (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
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
            width: 100%;
            height: ${thumbRadius}px;
            background: transparent;  
            -webkit-appearance: none;             
        }

        &::-moz-range-thumb {
            width: 70px;
            height: 14px;
            background: transparent !important;
            cursor: ${props => (props.readOnly ? 'initial' : 'pointer')};
        }

        &::-moz-range-track {
            width: 100%;
            height: ${thumbRadius}px;
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
            height: ${thumbRadius}px;
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
                // background: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbHoverBg) ||
                  props.theme.palette.ctrlSliderThumbHoverBg} !important;
                // border-color: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbHoverBorder) ||
                  props.theme.palette.ctrlSliderThumbHoverBorder} !important;
            }

            &::-moz-range-thumb {
                // background: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbHoverBg) ||
                  props.theme.palette.ctrlSliderThumbHoverBg} !important;
                // border-color: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbHoverBorder) ||
                  props.theme.palette.ctrlSliderThumbHoverBorder} !important;
            }

            &::-ms-thumb {
                // background: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbHoverBg) ||
                  props.theme.palette.ctrlSliderThumbHoverBg} !important;
                // border-color: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbHoverBorder) ||
                  props.theme.palette.ctrlSliderThumbHoverBorder} !important;
            }
        }
    }

    &:active {
        input[type=range] {
            &::-webkit-slider-thumb {
                // background: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbActiveBg) ||
                  props.theme.palette.ctrlSliderThumbActiveBg} !important;
                // border-color: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbActiveBorder) ||
                  props.theme.palette.ctrlSliderThumbActiveBorder} !important;
            }

            &::-moz-range-thumb {
                // background: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbActiveBg) ||
                  props.theme.palette.ctrlSliderThumbActiveBg} !important;
                // border-color: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbActiveBorder) ||
                  props.theme.palette.ctrlSliderThumbActiveBorder} !important;
            }

            &::-ms-thumb {
                // background: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbActiveBg) ||
                  props.theme.palette.ctrlSliderThumbActiveBg} !important;
                // border-color: ${props =>
                  (props.colors && props.colors.ctrlSliderThumbActiveBorder) ||
                  props.theme.palette.ctrlSliderThumbActiveBorder} !important;
            }
        }
    }
`;

const SliderTrackWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 6px;
  right: 6px;
  bottom: 0;
  width: calc(100% - 12px);
  height: 100%;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 2px;
  background: ${props => (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
  border: none;
  z-index: 1;
`;

const SliderTrackProgress = styled.div`
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  margin: 0;
  padding: 0;
  width: ${props => (Number.parseFloat(props.progress) <= 100 ? props.progress : 100)}%;
  height: 2px;
  background: ${props =>
    (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg};
  border: none;
  z-index: 2;
`;

const SliderTrackCurrentValue = styled.div`
  position: absolute;
  top: calc(50% - 8px);
  left: ${props =>
    Number.parseFloat(props.progress) <= 100
      ? `calc(${props.progress}% - ${(58 * props.progress) / 100 + 6}px)`
      : 'calc(100% - 64px)'};
  bottom: 0;
  z-index: 4;
  width: 70px;
  height: 16px;
  margin: 0;
  padding: 0;
  background: ${props =>
    (props.colors && props.colors.ctrlSliderTrackCurrentBg) || props.theme.palette.ctrlSliderTrackCurrentBg};
  border: 1px solid
    ${props =>
      (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg};
  border-radius: 3px;
  font-size: 11px;
  line-height: 14px;
  color: ${props =>
    (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg};
  text-align: center;

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
        (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg}
      transparent transparent;
  }

  &:before {
    left: -9px;
    display: ${props => (Number.parseFloat(props.progress) > 1 ? 'block' : 'none')};
    border-color: transparent
      ${props =>
        (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg}
      transparent transparent;
  }

  &:after {
    right: -9px;
    display: ${props => (Number.parseFloat(props.progress) < 99 ? 'block' : 'none')};
    border-color: transparent transparent transparent
      ${props =>
        (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg};
  }
`;

const Delimeter = styled.div`
  position: absolute;
  top: calc(50% - 2px);
  left: ${props => `calc(${props.position}% - ${props.position === 0 ? 4 : 0}px)`};
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${props =>
    props.position < props.progress
      ? (props.colors && props.colors.ctrlSliderDelimiterActiveBg) || props.theme.palette.ctrlSliderDelimiterActiveBg
      : (props.colors && props.colors.ctrlSliderDelimiterBg) || props.theme.palette.ctrlSliderDelimiterBg};
  z-index: 3;
`;

class SliderInput extends Component {
  onChange = e => {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange({
        target: {
          value: String(e.target.value / MULTIPLIER)
        }
      });
    }
  };

  render() {
    let { max, value, colors, readOnly, currentValue } = this.props;

    max = Number.parseFloat(max) || 0;
    value = Number.parseFloat(value) || 0;
    if (value > max) {
      value = max;
    }

    const progress = value > 0 ? (value / max) * 100 : 0;
    const delimeters = [0, 50, 100];

    return (
      <SliderWrapper className="range-slider" colors={colors} readOnly={readOnly}>
        <input
          type="range"
          className={`slider-control ${value === 0 ? 'zero' : ''}`}
          readOnly={readOnly}
          min="0"
          max={max * MULTIPLIER}
          step={max}
          value={value * MULTIPLIER}
          onChange={this.onChange}
        />
        <SliderTrackWrapper colors={colors}>
          <SliderTrack colors={colors} />
          <SliderTrackProgress progress={progress} colors={colors} />
          <SliderTrackCurrentValue progress={progress}>${currentValue}</SliderTrackCurrentValue>
          {delimeters.map((val, key) => (
            <Delimeter position={val} progress={progress} colors={colors} key={key} />
          ))}
        </SliderTrackWrapper>
      </SliderWrapper>
    );
  }
}

export default SliderInput;
