import React, { Component } from 'react';
import styled from 'styled-components/macro';

const valueThumbWidth = 70;
const valueThumbHeight = 16;
const thumbRadius = 12;
const MULTIPLIER = 10000;

const SliderWrapper = styled.div.attrs({ className: 'slider-input' })`
  position: relative;
  height: ${thumbRadius}px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding: 15px 0;
  overflow: hidden;
  margin: ${props => (props.ExpandingMargin ? '15px 0px' : '0px')};

  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    height: ${thumbRadius}px;
    background: transparent;
    padding: 0;
    margin: 0;
    cursor: pointer;
    z-index: 5;

    // At zero value, make thumb same color as emptry track
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
      -webkit-appearance: none;
      height: ${thumbRadius}px;
      width: ${thumbRadius}px;
      border-radius: 50%;
      border: 1px solid
        ${props => (props.colors && props.colors.ctrlSliderThumbBorder) || props.theme.palette.ctrlSliderThumbBorder};
      background: ${props => (props.colors && props.colors.ctrlSliderThumbBg) || props.theme.palette.ctrlSliderThumbBg};
      cursor: pointer;
    }

    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      width: 100%;
      height: ${thumbRadius}px;
      cursor: pointer;
      background: transparent;
    }

    &::-moz-range-thumb {
      //margin-top: -1px;
      height: ${thumbRadius}px;
      width: ${thumbRadius}px;
      border-radius: 50%;
      border: 1px solid
        ${props => (props.colors && props.colors.ctrlSliderThumbBorder) || props.theme.palette.ctrlSliderThumbBorder};
      background: ${props => (props.colors && props.colors.ctrlSliderThumbBg) || props.theme.palette.ctrlSliderThumbBg};
    }

    &::-moz-range-track {
      width: 100%;
      height: ${thumbRadius}px;
      cursor: pointer;
      background: transparent;
    }

    &::-moz-range-progress {
      background-color: transparent;
    }

    &::-ms-thumb {
      //margin-top: -1px;
      height: ${thumbRadius}px;
      width: ${thumbRadius}px;
      border-radius: 50%;
      border: 1px solid
        ${props => (props.colors && props.colors.ctrlSliderThumbBorder) || props.theme.palette.ctrlSliderThumbBorder};
      background: ${props => (props.colors && props.colors.ctrlSliderThumbBg) || props.theme.palette.ctrlSliderThumbBg};
      cursor: pointer;
    }

    &::-ms-track {
      width: 100%;
      height: ${thumbRadius}px;
      cursor: pointer;
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

    &.tooltip {
      &::-webkit-slider-thumb {
        width: ${valueThumbWidth}px !important;
        height: ${valueThumbHeight}px !important;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
      }

      &::-moz-range-thumb {
        width: ${valueThumbWidth}px !important;
        height: ${valueThumbHeight}px !important;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
      }

      &::-ms-thumb {
        width: ${valueThumbWidth}px !important;
        height: ${valueThumbHeight}px !important;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
      }
    }
  }

  &:hover {
    input[type='range'] {
      &::-webkit-slider-thumb {
        background: ${props =>
          (props.colors && props.colors.ctrlSliderThumbHoverBg) || props.theme.palette.ctrlSliderThumbHoverBg};
        border-color: ${props =>
          (props.colors && props.colors.ctrlSliderThumbHoverBorder) || props.theme.palette.ctrlSliderThumbHoverBorder};
      }

      &::-moz-range-thumb {
        background: ${props =>
          (props.colors && props.colors.ctrlSliderThumbHoverBg) || props.theme.palette.ctrlSliderThumbHoverBg};
        border-color: ${props =>
          (props.colors && props.colors.ctrlSliderThumbHoverBorder) || props.theme.palette.ctrlSliderThumbHoverBorder};
      }

      &::-ms-thumb {
        background: ${props =>
          (props.colors && props.colors.ctrlSliderThumbHoverBg) || props.theme.palette.ctrlSliderThumbHoverBg};
        border-color: ${props =>
          (props.colors && props.colors.ctrlSliderThumbHoverBorder) || props.theme.palette.ctrlSliderThumbHoverBorder};
      }

      &.tooltip {
        &::-webkit-slider-thumb {
          background: transparent;
          border-color: transparent;
        }

        &::-moz-range-thumb {
          background: transparent;
          border-color: transparent;
        }

        &::-ms-thumb {
          background: transparent;
          border-color: transparent;
        }
      }
    }
  }

  &:active {
    input[type='range'] {
      &::-webkit-slider-thumb {
        background: ${props =>
          (props.colors && props.colors.ctrlSliderThumbActiveBg) || props.theme.palette.ctrlSliderThumbActiveBg};
        border-color: ${props =>
          (props.colors && props.colors.ctrlSliderThumbActiveBorder) ||
          props.theme.palette.ctrlSliderThumbActiveBorder};
      }

      &::-moz-range-thumb {
        background: ${props =>
          (props.colors && props.colors.ctrlSliderThumbActiveBg) || props.theme.palette.ctrlSliderThumbActiveBg};
        border-color: ${props =>
          (props.colors && props.colors.ctrlSliderThumbActiveBorder) ||
          props.theme.palette.ctrlSliderThumbActiveBorder};
      }

      &::-ms-thumb {
        background: ${props =>
          (props.colors && props.colors.ctrlSliderThumbActiveBg) || props.theme.palette.ctrlSliderThumbActiveBg};
        border-color: ${props =>
          (props.colors && props.colors.ctrlSliderThumbActiveBorder) ||
          props.theme.palette.ctrlSliderThumbActiveBorder};
      }

      &.tooltip {
        &::-webkit-slider-thumb {
          background: transparent;
          border-color: transparent;
        }

        &::-moz-range-thumb {
          background: transparent;
          border-color: transparent;
        }

        &::-ms-thumb {
          background: transparent;
          border-color: transparent;
        }
      }
    }
  }
`;

const SliderTrackWrapper = styled.div.attrs({ className: 'slider-input__track-wrapper' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const SliderTrack = styled.div.attrs({ className: 'slider-input__slider-track' })`
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  right: 0;
  margin: 0;
  border: none;
  padding: 0;
  width: 100%;
  height: 2px;
  background: ${props => (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
  z-index: 1;
`;

const SliderTrackProgress = styled.div.attrs({ className: 'slider-input__slider-track-progress' })`
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  margin: 0;
  border: none;
  padding: 0;
  width: ${props => (Number.parseFloat(props.progress) <= 100 ? props.progress : 100)}%;
  height: 2px;
  background: ${props => (props.isBuy ? props.theme.palette.clrGreen : props.theme.palette.btnNegativeBg)};
  z-index: 2;
`;

const SliderTrackCurrentValue = styled.div`
  position: absolute;
  top: ${valueThumbHeight / 2 - 1}px;
  left: ${props => (Number.parseFloat(props.progress) <= 100 ? props.progress : 100)}%;
  transform: translateX(-${props => (Number.parseFloat(props.progress) <= 100 ? props.progress : 100)}%);
  ${props => props.isAnimate && `transition: 0.5s;`}
  bottom: 0;
  z-index: 4;
  min-width: ${valueThumbWidth}px;
  height: ${valueThumbHeight}px;
  margin: 0;
  padding: 0 5px;
  background: ${props => props.theme.palette.ctrlSliderTrackCurrentBg};
  border: 1px solid ${props => (props.isBuy ? props.theme.palette.clrGreen : props.theme.palette.btnNegativeBg)};
  border-radius: 3px;
  font-size: 11px;
  line-height: 14px;
  color: ${props => props.theme.palette.ctrlSliderTrackProgressBg};
  text-align: center;
  overflow: hidden;

  &:before,
  &:after {
    content: '';
    position: absolute;
    bottom: 3px;
    width: 0;
    border-style: solid;
    border-width: 4px;
    border-color: transparent
      ${props => (props.isBuy ? props.theme.palette.clrGreen : props.theme.palette.btnNegativeBg)} transparent
      transparent;
  }

  &:before {
    left: -9px;
    display: ${props => (Number.parseFloat(props.progress) > 0 ? 'block' : 'none')};
    border-color: transparent
      ${props => (props.isBuy ? props.theme.palette.clrGreen : props.theme.palette.btnNegativeBg)} transparent
      transparent;
  }

  &:after {
    right: -9px;
    display: ${props => (Number.parseFloat(props.progress) < 100 ? 'block' : 'none')};
    border-color: transparent transparent transparent
      ${props => (props.isBuy ? props.theme.palette.clrGreen : props.theme.palette.btnNegativeBg)};
  }
`;

const Delimeter = styled.div.attrs({ className: 'slider-input__slider-delimeter' })`
  position: absolute;
  top: calc(50% - 4px);
  left: ${props => (props.position === 0 ? 0 : `calc(${props.position}% - 8px)`)};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props =>
    (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg};
  border: 1px solid
    ${props =>
      (props.colors && props.colors.ctrlSliderDelimiterBorder) || props.theme.palette.ctrlSliderDelimiterBorder};
  z-index: 3;
  &.active {
    background: ${props => (props.isBuy ? props.theme.palette.clrGreen : props.theme.palette.btnNegativeBg)};
  }
`;

class SliderInput extends Component {
  onChange = e => {
    if (this.props.onChange) {
      this.props.onChange({
        target: {
          value: String(e.target.value / MULTIPLIER)
        }
      });
    }
  };

  render() {
    let { isBuy, max, value, colors, showTooltip, tooltipValue, isAnimate, ExpandingMargin } = this.props;

    max = Number.parseFloat(max) || 0;
    value = Number.parseFloat(value) || 0;
    if (value > max) {
      value = max;
    }

    const progress = value > 0 ? (value / max) * 100 : 0;
    const delimeters = [0, 100];

    return (
      <SliderWrapper className="range-slider" colors={colors} ExpandingMargin={ExpandingMargin}>
        <input
          type="range"
          className={`slider-control ${showTooltip ? 'tooltip' : value === 0 ? 'zero' : ''}`}
          min="0"
          max={max * MULTIPLIER}
          step={max}
          value={value * MULTIPLIER}
          onChange={this.onChange}
        />
        <SliderTrackWrapper colors={colors}>
          <SliderTrack colors={colors} />
          {showTooltip && (
            <SliderTrackCurrentValue
              isBuy={isBuy}
              progress={progress}
              tooltipValue={tooltipValue}
              isAnimate={isAnimate}
            >
              {tooltipValue}
            </SliderTrackCurrentValue>
          )}
          <SliderTrackProgress isBuy={isBuy} progress={progress} colors={colors} />
          {delimeters.map((val, key) => (
            <Delimeter
              isBuy={isBuy}
              position={val}
              key={key}
              className={progress > val ? 'active' : ''}
              colors={colors}
            />
          ))}
        </SliderTrackWrapper>
      </SliderWrapper>
    );
  }
}

export default SliderInput;
