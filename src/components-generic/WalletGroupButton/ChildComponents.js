import styled, { keyframes } from 'styled-components/macro';

const arbExecFrame = isBuy => keyframes`
    0% { background-position-x: ${isBuy ? 0 : 100}%; }
    100% { background-position-x: 50%; }
`;

const fillAnim = (start, isBuy) => keyframes`
    0% { background-position-x: 50%; }
    ${start}% { background-position-x: 50%; }
    ${start + 20}% { background-position-x: ${isBuy ? 100 : 0}%; }
    100% { background-position-x: ${isBuy ? 100 : 0}%; }
`;

export const WalletGroupButtonWrapper = styled.div`
  position: relative;
  width: ${props => (props.isChartLabel ? 330 : props.width || 260)}px;
  height: 100%;
  ${({ isMobileLandscape, isChartLabel }) => {
    if (isChartLabel) {
      return;
    }
    if (isMobileLandscape) {
      return `
                @media (max-width: 1400px) {
                    width: 600px;
                }
                @media (max-width: 1100px) {
                    width: 500px;
                }
                @media (max-width: 900px) {
                    width: 360px;
                }
                @media (max-width: 700px) {
                    width: 300px;
                }
                @media (max-width: 600px) {
                    width: 260px;
                }
            `;
    }
    return `
            @media (max-width: 1200px) {
                width: 620px;
            }

            @media (max-width: 800px) {
                width: 440px;
            }

            @media (max-width: 450px) {
                width: 320px;
            }

            @media (max-width: 380px) {
                width: 280px;
            }

            @media (max-width: 350px) {
                 width: 320px;
            }
        `;
  }};
`;

export const WalletButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: ${props => (props.isOverFlow ? 'visible' : 'hidden')};
  display: flex;
  align-items: ${props => (props.isBuy ? 'flex-start' : 'flex-end')};
  padding-bottom: ${props => !props.isBuy && props.isHistory && '15px'};
  padding-top: ${props => props.isBuy && props.isHistory && '15px'};
  justify-content: center;
`;

const getThemeColor = (type, masterColor, theme) => {
  switch (type) {
    case 'inactive':
      return theme.palette.clrMouseClick;
    case 'active':
      return masterColor || theme.palette.clrHighContrast;
    case 'buy':
      return masterColor || theme.palette.btnPositiveBg;
    default:
      return masterColor || theme.palette.btnNegativeBg;
  }
};

const getBgPosition = (isBuy, isLeft, isWhite) => {
  if (isWhite) {
    return isBuy ? 100 : 0;
  }

  if ((isBuy && !isLeft) || (!isBuy && isLeft)) {
    return 50;
  }

  return isBuy ? 0 : 100;
};

export const AniWalletButton = styled.div`
  width: ${props => (props.isChartLabel ? 330 : props.width || 220)}px;
  margin: 0 ${props => (props.isChartLabel ? 0 : 20)}px;
  position: absolute;
  left: 0;
  display: flex;
  align-items: ${props => (props.isChartLabel ? 'flex-start' : 'center')};
  justify-content: center;
  border: 2px solid ${({ type, masterColor, theme }) => getThemeColor(type, masterColor, theme)};
  border-radius: 7px;
  border-right: 4px solid ${({ type, masterColor, theme }) => getThemeColor(type, masterColor, theme)};
  outline: 2px dashed ${({ type, masterColor, theme }) => getThemeColor(type, masterColor, theme)};
  outline-offset: -10px;
  padding: 5px 12px;
  height: ${props => (props.isChartLabel ? '100%' : '65px')};
  color: ${props => props.theme.palette.clrPurple};
  font-size: 33px;
  text-align: right;
  opacity: 1;
  white-space: nowrap;
  background: ${props => props.theme.palette.clrBackground};

  > span {
    font-size: ${props => (props.isChartLabel ? 50 : 27)}px;
    ${props => props.isChartLabel && 'letter-spacing: -3px; margin-top: 5px;'}
    font-weight: 600;
    ${props => (props.isChartLabel ? 'margin-left: 35px' : 'margin-right: -12px')};
    &.failed {
      font-size: 20px;
      color: ${props => props.theme.palette.clrDarkRed};
    }
  }

  > span {
    color: ${({ type, masterColor, theme }) => getThemeColor(type, masterColor, theme)};
    background-image: ${props =>
      `linear-gradient(to ${props.isBuy ? 'right' : 'left'}, ${props.theme.palette.clrMouseClick} 33.33%, ${
        props.isBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg
      } 33.33%, ${props.isBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg} 66.66%, ${
        props.theme.palette.clrHighContrast
      } 66.66%)`};
    background-size: 300% 100%;
    background-position-x: ${props => getBgPosition(props.isBuy, props.isLeft, props.isWhite)}%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &.progress {
    > span {
      animation: ${props => arbExecFrame(props.isBuy)} 2s linear;
      animation-fill-mode: forwards;
    }
  }

  &.filled {
    > span {
      animation: ${props => fillAnim(props.start, props.isBuy)} 3s linear;
      animation-fill-mode: forwards;
    }
  }

  .infoIcon {
    position: absolute;
    left: 9px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      filter: ${props =>
        props.type === 'active'
          ? props.theme.palette.coinActiveFilter
          : props.type === 'inactive'
          ? props.theme.palette.coinInactiveFilter
          : props.type === 'buy'
          ? props.theme.palette.coinBuyFilter
          : props.theme.palette.coinSellFilter};
    }
  }

  &:active {
    background: ${props => props.theme.palette.clrBackground};
    color: ${props => props.theme.palette.clrHighContrast};
  }
  ${({ isMobileLandscape, isChartLabel }) => {
    if (isChartLabel) {
      return;
    }
    if (isMobileLandscape) {
      return `
                @media (max-width: 1400px) {
                    width: 560px;
                    height: 150px;
                    & > svg {
                        top: calc(50% - 30px);
                        height: 60px;
                    }
                    .infoIcon {
                        width: 70px;
                        height: 70px;
                    }
                    .infoIcon svg {
                        width: 50px;
                        height: 50px;
                    }
                }
                @media (max-width: 1100px) {
                    width: 460px;
                    height: 150px;
                    & > svg {
                        top: calc(50% - 30px);
                        height: 60px;
                    }
                    .infoIcon {
                        width: 70px;
                        height: 70px;
                    }
                    .infoIcon svg {
                        width: 50px;
                        height: 50px;
                    }
                }
                @media (max-width: 900px) {
                    width: 320px;
                    height: 80px;
                    & > svg {
                        top: calc(50% - 15px);
                        height: 30px;
                    }
                    .infoIcon {
                        width: 40px;
                        height: 40px;
                    }
                    .infoIcon svg {
                        width: 25px;
                        height: 25px;
                    }
                }
                @media (max-width: 700px) {
                    width: 260px;
                }
                @media (max-width: 600px) {
                    width: 220px;
                    height: 65px;
                }
            `;
    }
    return `
             @media (max-width: 1200px) {
                width: 580px;
                height: 90px;
             }
             @media (max-width: 800px) {
                 width: 400px;
                 height: 90px;
             }
             @media (max-width: 450px) {
                 width: 280px;
                 height: 80px;
             }
             @media (max-width: 380px) {
                 width: 240px;
                 height: 80px;
             }
             @media (max-width: 350px) {
                  width: 280px;
                  height: 90px;
             }
        `;
  }};
`;

export const WalletButton = styled.div`
  width: ${props => props.width || 220}px;
  ${props => (props.direction === 'Left' ? 'left: 0;' : 'right: 0;')}
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 5px 12px;
  color: ${props => props.theme.palette.clrMouseClick};
  font-size: 33px;
  font-family: Roboto;
  text-align: right;
  cursor: pointer;
  opacity: 1 !important;
  word-break: break-all;
  white-space: nowrap;

  div {
    overflow: hidden;
    white-space: initial;
    word-break: break-word;
  }

  .symbol {
    color: ${props => (props.selected ? props.theme.palette.clrBlue : props.theme.palette.coinPairDropDownItemText)};

    margin-right: 0.3em;
  }

  .value {
    color: ${props => (props.selected ? props.theme.palette.clrBlue : props.theme.palette.coinPairDropDownItemText)};
  }

  ${props =>
    !props.isHoverDisable &&
    `
        &:hover {
            background: ${props => props.theme.palette.clrWalletHover};
            color: ${props => props.theme.palette.clrHighContrast};
        }
    `};

  &:active {
    background: ${props => props.theme.palette.clrBackground};
    color: ${props => props.theme.palette.clrHighContrast};
  }
`;
