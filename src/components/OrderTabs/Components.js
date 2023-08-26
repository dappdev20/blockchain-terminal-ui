import React from 'react';
import styled, { css } from 'styled-components/macro';
import MuiTabs from '@material-ui/core/Tabs/Tabs';
import MuiTab from '@material-ui/core/Tab/Tab';
import { slideFromTop, slideFromBottom } from '@/theme/animations';

export const ToggleBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.palette.orderBookAddonBorder};
  border-radius: ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0 0;
  padding: 0 5px;
  width: 100%;
  height: 15px;
  background-color: ${props => props.theme.palette.orderBookAddonBg};

  svg {
    width: 10px;
    height: 6px;

    &,
    & * {
      fill: ${props => props.theme.palette.orderBookAddonFill};
    }
  }

  &:hover {
    cursor: pointer;

    svg {
      &,
      & * {
        fill: ${props => props.theme.palette.orderBookAddonHoverFill} !important;
      }
    }
  }
`;

export const FormHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding-left: 14px;
  padding-right: 6px;
  border-bottom: 1px solid ${props => props.theme.palette.clrSubBorder};
  border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
  background: ${props => props.theme.palette.clrChartBackground};
`;

export const Label = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.palette.clrPurple};
  text-transform: uppercase;
  z-index: 4;

  span {
    margin-left: 4px;
    color: ${props => props.theme.palette.orderFormHeaderText};
  }

  ${props =>
    props.insideGraph &&
    css`
      position: absolute;
      left: 12px;
      top: 12px;
    `}

  ${props =>
    props.isOnTop &&
    css`
      position: absolute;
      left: 20px;
      top: -25px;
    `}

  ${props =>
    props.isRight &&
    css`
      left: auto;
      right: 12px;
    `}
`;

export const MarketStatusItem = styled.div`
  width: 46px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => (props.current ? props.theme.palette.sidebarIconOpenedBg : 'transparent')};
  cursor: pointer;

  &:hover {
    .tabs-header__icon {
      fill: ${props => props.theme.palette.clrHighContrast};
    }
  }

  .tabs-header__icon {
    fill: ${props => (props.current ? props.theme.palette.sidebarIconActive : props.theme.palette.sidebarIcon)};
  }
`;

export const TabsWrapper = styled.div`
  flex: 1;
  display: flex;
  margin: 0;
  padding: 0 5px;
  justify-content: flex-end;

  button {
    height: 56px;

    span {
      font-size: 14px;
    }
  }
`;

export const Tabs = styled(MuiTabs)`
  display: inline-block;
  border: 0;

  > div button {
    min-height: 42px !important;
    // width: 45px !important;
    min-width: 34px !important;

    & > span > span {
      padding: 0 5px;
    }
  }
`;

export const Tab = styled(MuiTab)`
  color: ${props =>
    props.selected ? props.theme.palette.orderFormHeaderTabActiveText : props.theme.palette.orderFormHeaderTabText};
  opacity: 1;
  font-weight: 400;

  &:hover {
    color: ${props => props.theme.palette.orderFormHeaderTabHoverText} !important;
  }

  & span {
    text-transform: none;
    font-size: 12px;
    line-height: 1.15;
  }
`;

export const Logo = styled.img`
  // width: 25px;
  height: 16px;
  margin-right: 4px;
  border-radius: 50%;
`;

export const DropdownWrapper = styled.div`
  position: relative;
  height: 100%;
  margin-left: 10px;
  font-size: 14px;
  color: ${props => props.theme.palette.orderFormHeaderTabText};

  .dropdown_wrapper_space {
    position: absolute;
    right: -10px;
    bottom: 31px;
    width: 110px;
    height: 13px;
  }
`;

export const SelectedItem = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.palette.clrPurple};
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.palette.orderFormHeaderTabTextHover};
    transition-duration: 0.3s;
  }
  .sub-item {
    font-weight: normal;
    margin-left: 2px;
  }
`;

const ArrowSvg = styled.svg`
    width: 10px;
    height: 14px;
    margin-left: 8px;
    // margin-top: ${props => (props.open ? 0 : '-5px')};
    fill: ${props => props.theme.palette.orderBookAddonFill};
    transform: rotate(${props => (props.isOpened ? 180 : 0)}deg);
`;

export const ArrowIcon = props => (
  <ArrowSvg viewBox="0 0 15 8.9" {...props}>
    <path d="M7.5 8.9L.3 1.7C-.1 1.3-.1.7.3.3s1-.4 1.4 0l5.8 5.8L13.3.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4L7.5 8.9z" />
  </ArrowSvg>
);

const GlobalSvg = styled.svg`
  width: ${props => (props.size ? props.size : 16)}px !important;
  height: ${props => (props.size ? props.size : 16)}px !important;
  margin-right: ${props => (props.marginRight !== undefined ? props.marginRight : 4)}px;
  fill: ${props =>
    props.isDisabled
      ? props.theme.palette.clrBorder
      : props.color
      ? props.color
      : props.theme.palette.orderFormHeaderText} !important;
`;

export const GlobalIcon = props => (
  <GlobalSvg viewBox="0 0 12.33 12.33" {...props}>
    <path d="M1.1,3.78a5.21,5.21,0,0,0,1.67.64A7.55,7.55,0,0,1,4.26.89l-.73.33-.23.13a.27.27,0,0,1-.4-.08c-.1-.15,0-.3.12-.41A5.9,5.9,0,0,1,5,.12,6.16,6.16,0,1,1,.19,7.63,6,6,0,0,1,1.65,2c.1-.12.21-.2.37-.12s.2.29.06.48c-.3.39-.57.79-.85,1.19C1.18,3.6,1.15,3.69,1.1,3.78Zm10.35.56c-.28.12-.55.25-.83.35S10,4.87,9.74,5c-.11,0-.1.1-.1.18,0,.59,0,1.18,0,1.76a.26.26,0,0,1-.35.28c-.18,0-.21-.18-.21-.35,0-.37,0-.75,0-1.12,0-.2,0-.4,0-.57l-2.64.23V8.59h.1a14.85,14.85,0,0,0,3.18-.37,5,5,0,0,0,1.64-.66A.63.63,0,0,0,11.69,7c0-.13,0-.26.05-.39A5.32,5.32,0,0,0,11.45,4.34ZM5.85,8.62V5.36L3.26,5.13a0,0,0,0,0,0,0A10.1,10.1,0,0,0,3.43,8.3a.22.22,0,0,0,.12.11c.22,0,.43.07.65.09C4.75,8.55,5.29,8.58,5.85,8.62ZM9,4.57A6.5,6.5,0,0,0,7.63,1.31,2.25,2.25,0,0,0,6.78.69L6.44.58V4.8ZM5.85,4.8V.6l-.09,0a2.39,2.39,0,0,0-1.27.94,6.21,6.21,0,0,0-1,2.32c0,.21-.09.43-.14.69Zm-5-.48a.93.93,0,0,0-.05.1A5.24,5.24,0,0,0,.59,6.61c.08.77,0,.78.88,1.24a5.24,5.24,0,0,0,1.36.42V8.16A10.48,10.48,0,0,1,2.69,5.1c0-.1,0-.13-.12-.15A6.1,6.1,0,0,1,.89,4.32ZM8,.91A7.13,7.13,0,0,1,9.56,4.42a5.3,5.3,0,0,0,1.66-.64A5.44,5.44,0,0,0,8,.91Zm-1.6,10.8c1-.1,1.94-1.47,2.25-2.68l-2.25.16Zm-.58,0V9.19L3.62,9a4.52,4.52,0,0,0,1.6,2.43A5.29,5.29,0,0,0,5.85,11.76Zm-1.57-.33s0-.06,0-.06A6.22,6.22,0,0,1,3,9a.2.2,0,0,0-.19-.16,6.36,6.36,0,0,1-.78-.2c-.36-.11-.71-.25-1.09-.38A5.72,5.72,0,0,0,4.28,11.43Zm7.09-3.19a7.64,7.64,0,0,1-1.93.63.34.34,0,0,0-.15.18c-.17.39-.29.81-.48,1.19s-.48.78-.72,1.18A5.73,5.73,0,0,0,11.37,8.24Z" />
  </GlobalSvg>
);

export const Dropdown = styled.div`
  position: absolute;
  bottom: 43px;
  right: -12px;
  z-index: 100;
  background: ${props => props.theme.palette.clrMainWindow};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  .dropdown_arrow {
    position: absolute;
    left: 48px;
    bottom: -11px;
  }
  .dropdown_space {
    position: absolute;
    right: -10px;
    bottom: 0;
    width: 8px;
    height: 100%;
  }

  transition: all 0.5s ease;

  ${props =>
    props.isHovered
      ? css`
          animation: ${slideFromBottom} 0.5s forwards;
        `
      : css`
          animation: ${slideFromTop} 0.5s forwards;
        `};
  z-index: ${props => (props.isHovered ? '1111' : 'auto')};
`;

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  [data-tooltipped] {
    width: 100%;
  }
`;
export const SubRowWrapper = styled.div`
  position: absolute;
  z-index: 999;
  left: calc(100% + 5px);
  bottom: -1px;
  display: flex;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  flex-direction: column;
`;
export const Item = styled.div`
  min-height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${props => (props.isActive ? props.theme.palette.clrBackground : props.theme.palette.clrChartBackground)};
  color: ${props => (props.isActive || props.isHovered ? 'white' : props.theme.palette.clrPurple)};
  cursor: pointer;
  white-space: nowrap;
  border-top: ${props => props.isBorder && `1px solid ${props.theme.palette.clrBorder}`};
  border-bottom: ${props => props.isBorder && `1px solid ${props.theme.palette.clrBorder}`};
  padding: 0 15px;
  width: 100%;
  font-weight: 500;

  ${props =>
    props.isDisabled
      ? css`
          cursor: url('/img/not-allowed1.cur'), not-allowed !important;
          color: ${props => props.theme.palette.clrtextCT};
        `
      : css`
          &:hover {
            color: white;
            padding: 0 13px 0 17px;
            transition-duration: 0.3s;
          }
        `}
`;
export const SubItem = styled.div`
  min-height: 40px;
  background: ${props => props.theme.palette.clrChartBackground};
  color: ${props => props.theme.palette.clrPurple};
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  padding: 0 15px;
  font-weight: 500;

  &:hover {
    color: white;
    padding: 0 13px 0 17px;
    transition-duration: 0.3s;
  }
`;

export const WrapperSwitcher = styled.div`
  color: ${props => props.theme.palette.clrPurple};
  font-weight: bold;
  display: flex;
  align-items: center;
`;

export const ValueLabel = styled.div`
  color: ${props => props.theme.palette.clrPurple};
  font-weight: bold;
`;

export const ValueLabelNormal = styled.div`
  color: ${props => props.theme.palette.clrPurple};
`;

export const TooltipWrapper = styled.div``;
