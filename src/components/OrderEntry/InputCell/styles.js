import styled, { css, keyframes } from 'styled-components/macro';
import { Slider } from '@material-ui/core';

const heightIncAnimation = keyframes`
  0% { height: 0; }
  100% { height: 100%; }
`;

const heightDecAnimation = keyframes`
  0% { height: 100%; }
  100% { height: 0; }
`;

const getAnimationStyle = (isBuy, isLeft, animation, theme, hover, isDisabled) => {
  if (isBuy && isLeft && animation === 1 && hover) {
    return css`
      height: 100%;
      top: unset;
      bottom: 0;
      animation: ${heightIncAnimation} 3s linear;
      .content {
        top: unset;
        bottom: 0;
        * {
          color: ${theme.palette.orderBookTableCellTextBuy};
        }
      }
    `;
  }
  if (isBuy && !isLeft) {
    if (animation === 1) {
      return hover
        ? css`
            height: 0;
            top: 0;
            animation: ${heightDecAnimation} 3s linear;
            .content {
              top: 0;
              * {
                color: ${theme.palette.orderBookTableCellTextBuy};
              }
            }
          `
        : css`
            .content {
              * {
                color: ${theme.palette.clrMainWindow};
              }
              .MuiSlider-thumb,
              .MuiSlider-track {
                color: ${props => props.theme.palette.clrBorder};
              }
            }
          `;
    }
    return css`
      height: 100%;
      top: 0;
      .content {
        top: 0;
        ${!isDisabled &&
          css`
            * {
              color: ${theme.palette.orderBookTableCellTextBuy};
            }
          `}
      }
    `;
  }
  if (!isBuy && isLeft) {
    if (animation === 2) {
      return hover
        ? css`
            height: 0;
            top: unset;
            bottom: 0;
            animation: ${heightDecAnimation} 3s linear;
            .content {
              top: unset;
              bottom: 0;
              * {
                color: ${theme.palette.orderBookTableCellTextSell};
              }
            }
          `
        : css`
            .content {
              * {
                color: ${theme.palette.clrMainWindow};
              }
              .MuiSlider-thumb,
              .MuiSlider-track {
                color: ${props => props.theme.palette.clrBorder};
              }
            }
          `;
    }
    return css`
      width: 100%;
      left: 0;
      .content {
        ${!isDisabled &&
          css`
            * {
              color: ${theme.palette.orderBookTableCellTextSell};
            }
          `}
      }
    `;
  }
  if (!isBuy && !isLeft && animation === 2 && hover) {
    return css`
      height: 100%;
      top: 0;
      animation: ${heightIncAnimation} 3s linear;
      .content {
        top: 0;
        * {
          color: ${theme.palette.orderBookTableCellTextSell};
        }
      }
    `;
  }
};

export const Wrapper = styled.div`
  position: absolute;
  left: 0px;
  top: 0;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: flex-start;
  ${props => props.isHover && 'overflow: hidden;'}
  color: ${props => props.theme.palette.clrBorder};
  font-size: 2rem;
  font-weight: 700;

  input {
    flex: 1;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.palette.clrMainWindow};
    color: ${props => props.theme.palette.clrBorder};
    border: 0;
    font-size: 2rem;
    font-weight: 700;
    font-family: Roboto;
    ${props =>
      props.isDisabled &&
      css`
        cursor: url('/img/not-allowed1.cur'), not-allowed !important;
      `}
  }

  .postValue {
    flex: 1;
    position: absolute;
    left: 12px;
    right: 38px;
    pointer-events: none;
    line-height: 1;
    overflow: hidden;
    span {
      font-size: 20px;
      vertical-align: super;
    }
  }

  ${props =>
    getAnimationStyle(props.isBuy, props.isLeft, props.animation, props.theme, props.isHover, props.isDisabled)}
`;

export const Symbol = styled.span`
  line-height: 1;
  margin-left: 3px;
`;

export const Content = styled.div.attrs({ className: 'content' })`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: ${props => props.theme.palette.clrMainWindow};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 12px;

  [data-tooltipped] {
    display: flex !important;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

export const OrderSlider = styled(Slider)`
  &&& {
    position: absolute;
    width: 100%;
    top: 37px;
    left: 0;
    z-index: 10;
    &.Mui-disabled {
      .MuiSlider-thumb,
      .MuiSlider-track {
        color: ${props => props.theme.palette.clrBorder};
      }
    }
    .MuiSlider-rail {
      color: transparent;
    }
    .MuiSlider-thumb {
      width: 8px;
      height: 8px;
      margin-top: -3px;
    }
  }
`;
