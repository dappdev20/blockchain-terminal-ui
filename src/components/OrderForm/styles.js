import styled, { css, keyframes } from 'styled-components/macro';

const heightIncAnimation = keyframes`
    0% { height: 0; }
    40% { height: 0; }
    100% { height: 100%; }
`;

const heightDecAnimation = keyframes`
    0% { height: 100%; }
    40% { height: 100%; }
    100% { height: 0; }
`;

const widthIncAnimation = keyframes`
	0% { width: 0; }
  100% { width: 100%; }
`;

const widthDecAnimation = keyframes`
  0% { width: 100%; }
  100% { width: 0; }
`;

const getAnimationStyle = (isBuy, isLeft, animation, theme, isHover) => {
  if (isBuy && isLeft) {
    switch (animation) {
      case 1:
        return isHover
          ? css`
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
            `
          : '';
      case 2:
        return css`
          height: 100%;
          left: unset;
          right: 0;
          width: 0;
          animation: ${widthDecAnimation} 3s linear;
          .content {
            left: unset;
            right: 0;
            * {
              color: ${theme.palette.orderBookTableCellTextBuy};
            }
          }
        `;
      case 3:
        return css`
          display: none;
        `;
      case 4:
        return css`
          height: 100%;
          left: unset;
          right: 0;
          width: 100%;
          animation: ${widthIncAnimation} 3s linear;
          .content {
            left: unset;
            right: 0;
          }
        `;
      default:
        return '';
    }
  }
  if (isBuy && !isLeft) {
    switch (animation) {
      case 1:
        return isHover
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
          : '';
      case 2:
        return css`
          height: 100%;
          left: unset;
          right: 0;
          width: 0;
          animation: ${widthDecAnimation} 3s linear;
          .content {
            left: unset;
            right: 0;
          }
        `;
      case 3:
        return css`
          display: none;
        `;
      case 4:
        return css`
          height: 100%;
          left: unset;
          right: 0;
          width: 100%;
          animation: ${widthIncAnimation} 3s linear;
          .content {
            left: unset;
            right: 0;
            * {
              color: ${theme.palette.orderBookTableCellTextBuy};
            }
          }
        `;
      default:
        return isHover
          ? css`
              height: 100%;
              top: 0;
              .content {
                top: 0;
                * {
                  color: ${theme.palette.orderBookTableCellTextBuy};
                }
              }
            `
          : '';
    }
  }
  if (!isBuy && isLeft) {
    switch (animation) {
      case 1:
        return css`
          display: none;
        `;
      case 2:
        return css`
          height: 100%;
          left: 0;
          width: 100%;
          animation: ${widthIncAnimation} 3s linear;
          .content {
            left: 0;
            * {
              color: ${theme.palette.orderBookTableCellTextSell};
            }
          }
        `;
      case 3:
        return isHover
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
          : '';
      case 4:
        return css`
          height: 100%;
          left: 0;
          width: 0;
          animation: ${widthDecAnimation} 3s linear;
          .content {
            left: 0;
          }
        `;
      default:
        return css`
          display: none;
        `;
    }
  }
  if (!isBuy && !isLeft) {
    switch (animation) {
      case 1:
        return css`
          display: none;
        `;
      case 2:
        return css`
          height: 100%;
          left: 0;
          width: 100%;
          animation: ${widthIncAnimation} 3s linear;
          .content {
            left: 0;
          }
        `;
      case 3:
        return isHover
          ? css`
              height: 100%;
              top: 0;
              animation: ${heightIncAnimation} 3s linear;
              .content {
                top: 0;
                * {
                  color: ${theme.palette.orderBookTableCellTextSell};
                }
              }
            `
          : '';
      case 4:
        return css`
          height: 100%;
          left: 0;
          width: 0;
          animation: ${widthDecAnimation} 3s linear;
          .content {
            left: 0;
            * {
              color: ${theme.palette.orderBookTableCellTextSell};
            }
          }
        `;
      default:
        return css`
          display: none;
        `;
    }
  }
};

export const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  ${props => getAnimationStyle(props.isBuy, props.isLeft, props.animation, props.theme, props.isHover)}
`;

export const Content = styled.div.attrs({ className: 'content' })`
  width: ${props => props.width - 2}px;
  height: 48px;
  background: ${props => props.theme.palette.clrBackground};
  color: ${props => props.theme.palette.clrBorder};
  position: absolute;
  padding: 5px 10px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .postValue {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.25;
    pointer-events: none;
    font-family: Roboto;
    span {
      font-size: 20px;
      vertical-align: super;
    }
  }
`;

export const InputValue = styled.input`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.palette.clrBackground};
  color: ${props => props.theme.palette.clrMouseClick};
  border: 0;
  font-size: 2rem;
  font-weight: 700;
`;

export const Symbol = styled.span`
  position: absolute;
  right: 12px;
  width: 100px;
  background: transparent;
  color: ${props => props.theme.palette.clrMouseClick};
  font-size: 2rem;
  font-weight: 700;
  text-align: right;
`;
