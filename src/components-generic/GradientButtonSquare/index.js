import React from 'react';
import styled from 'styled-components/macro';

const GradientButtonStyleWrapper = styled.button.attrs({ className: 'gradient-button' })`
  position: relative;
  overflow: hidden;
  padding: 0 10px;
  margin: 0 auto;
  width: ${props => (props.width ? props.width : '120px')};
  height: ${props => (props.height ? props.height : '53px')};
  border: none;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;

  .gradient-button__label {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1em;
    color: white;
    font-weight: 400;
    z-index: 2;
    transition: font-size 0.1s;
    text-transform: uppercase;

    svg {
      height: 30px;
      width: 30px;
      fill: white;
    }
  }

  @media only screen and (max-width: 1550px) {
    .gradient-button__label > span {
      font-size: 20px;
    }
  }

  @media only screen and (max-width: 550px) {
    .gradient-button__label > span {
      font-size: 18px;
    }
  }

  .gradient-button__content {
    position: absolute;
    top: -1px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    overflow: hidden;
    background: ${props =>
      props.header
        ? 'inherit'
        : props.red
        ? props.theme.palette.gradientBtnCloseBg
        : props.theme.palette.gradientBtnNextBg};
    border: none;
    border-radius: 3px;
    z-index: 1;

    .gradient-button__content__glow {
      position: absolute;
      opacity: 0.4;
      top: -40%;
      left: -15%;
      right: -15%;
      bottom: 50%;
      background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 100%);
      border-radius: 50%;
      transform-origin: bottom right;
      z-index: 3;
    }
  }

  &:hover,
  &:focus {
    .gradient-button__content {
      background: ${props =>
        props.header
          ? 'inherit'
          : props.red
          ? props.theme.palette.gradientBtnCloseHoverBg
          : props.theme.palette.gradientBtnNextHoverBg};
      .gradient-button__content__glow {
        opacity: 0.5;
      }
    }
  }

  &.exchange-progress {
    cursor: pointer;

    .gradient-button__content {
      background: transparent;
    }
    .gradient-button__content__glow {
      background: transparent;
    }
  }

  &.progress,
  &.completed {
    cursor: url('/img/not-allowed1.cur'), not-allowed !important;

    .gradient-button__label {
      &,
      & * {
        color: ${props => props.theme.palette.coinPairSelectText2} !important;

        svg {
          fill: ${props => props.theme.palette.coinPairSelectText2} !important;
        }
      }
    }

    .gradient-button__content {
      &:before {
        background: ${props => props.theme.palette.coinPairSelectBg};
      }

      &:after {
        background: ${props => props.theme.palette.coinPairSelectBg};
      }

      .gradient-button__content__glow {
        opacity: 0.05;
      }
    }
  }

  &.primary-solid {
    .gradient-button__label {
      &,
      & * {
        color: ${props => props.theme.palette.coinPairNextBtnText};

        svg {
          fill: ${props => props.theme.palette.coinPairNextBtnText};
        }
      }
    }

    .gradient-button__content {
      background: ${props => (props.header ? 'inherit' : props.theme.palette.coinPairNextBtnBg)};

      .gradient-button__content__glow {
        opacity: 0 !important;
      }
    }

    &:active,
    &.active {
      .gradient-button__label {
        &,
        & * {
          color: ${props => props.theme.palette.coinPairNextBtnActiveText};

          svg {
            fill: ${props => props.theme.palette.coinPairNextBtnActiveText};
          }
        }
      }

      .gradient-button__content {
        background: ${props => (props.header ? 'inherit' : props.theme.palette.coinPairNextBtnActiveBg)};
      }
    }

    &.completed {
      .gradient-button__label {
        &,
        & * {
          color: ${props => props.theme.palette.coinPairNextBtnText};

          svg {
            fill: ${props => props.theme.palette.coinPairNextBtnText};
          }
        }
      }

      .gradient-button__content {
        background: ${props => props.theme.palette.coinPairNextBtnText};
      }
    }

    &.progress {
      .gradient-button__label {
        &,
        & * {
          color: ${props => props.theme.palette.coinPairSelectText2} !important;

          svg {
            fill: ${props => props.theme.palette.coinPairSelectText2} !important;
          }
        }
      }

      .gradient-button__content {
        background: ${props => (props.header ? 'inherit' : props.theme.palette.coinPairSelectBg)};
      }
    }
  }

  &.positive-solid {
    background-image: ${props => props.theme.palette.btnPositiveGradientBg};
    border-radius: 3px;
    height: 60px;

    .gradient-button__label {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0;
      color: ${props => props.theme.palette.btnPositiveGradientText};
      text-shadow: 1px 1px ${props => props.theme.palette.btnPositiveGradientTextShadow};
      transition: font-size 0.1s;
      font-family: Roboto;
    }

    .gradient-button__content {
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      border-radius: 2px;
      background: transparent;

      .gradient-button__content__glow {
        opacity: 0 !important;
      }
    }

    &:not([disabled]) {
      &:hover {
        background-color: ${props => props.theme.palette.btnPositiveHoverBg};
        background-image: unset;
        .gradient-button__label {
          color: ${props => props.theme.palette.btnPositiveGradientText};
          text-shadow: 1px 1px ${props => props.theme.palette.btnPositiveGradientTextShadow};
        }

        .gradient-button__content {
          background-color: ${props => props.theme.palette.btnPositiveGradientHoverBg};
          box-shadow: inset 0 0 20px ${props => props.theme.palette.btnPositiveGradientText};
        }
      }

      &:active,
      &.active {
        .gradient-button__label {
          font-size: 22px;
        }

        .gradient-button__content {
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
        }
      }
    }
  }

  &.negative-solid {
    background-image: ${props => props.theme.palette.btnNegativeGradientBg};
    border-radius: 3px;
    height: 60px;

    .gradient-button__label {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0;
      color: ${props => props.theme.palette.btnNegativeGradientText};
      text-shadow: 1px 1px ${props => props.theme.palette.btnNegativeGradientTextShadow};
      transition: font-size 0.1s;
      font-family: Roboto;
    }

    .gradient-button__content {
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      border-radius: 2px;
      background: transparent;

      .gradient-button__content__glow {
        opacity: 0 !important;
      }
    }

    &:not([disabled]) {
      &:hover {
        background-color: ${props => props.theme.palette.btnNegativeHoverBg};
        background-image: unset;

        .gradient-button__label {
          color: ${props => props.theme.palette.btnNegativeGradientText};
          text-shadow: 1px 1px ${props => props.theme.palette.btnNegativeGradientTextShadow};
        }

        .gradient-button__content {
          background-color: ${props => props.theme.palette.btnNegativeGradientHoverBg};
          box-shadow: inset 0 0 20px ${props => props.theme.palette.btnNegativeGradientText};
        }
      }

      &:active,
      &.active {
        .gradient-button__label {
          font-size: 22px;
        }

        .gradient-button__content {
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
        }
      }
    }
  }

  &.search-btn .gradient-button__content {
    background: ${props => (props.header ? 'inherit' : props.theme.palette.clrBlue)};
  }
  &.search-btn:hover .gradient-button__content {
    background: ${props => (props.header ? 'inherit' : props.theme.palette.clrDarkBlue)};
  }
`;

const OrderGradientButton = ({ transparent, children, width, height, red, header, ...props }) => (
  <GradientButtonStyleWrapper
    width={width}
    height={height}
    red={red}
    header={header}
    transparent={transparent}
    {...props}
  >
    <div className="gradient-button__label">{children}</div>
    <div className="gradient-button__content">
      <div className="gradient-button__content__glow" />
    </div>
  </GradientButtonStyleWrapper>
);

export default OrderGradientButton;
