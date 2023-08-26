import styled, { css } from 'styled-components/macro';
import { withElementWithIdDimensions } from '@/hocs/withElementWithIdDimensions';

export const Wrapper = styled.div`
  position: relative;
  z-index: 8;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 60px;

  .exch-dropdown__list {
    position: absolute;
    z-index: 4;
    left: 0;
    right: 0;
    top: 100%;
    list-style: none;
    background: ${props => props.theme.palette.clrPriceChartAreaBackground};
    border-radius: ${props => props.theme.palette.borderRadius};
    ${props => props.isOpen && `border: 1px solid ${props.theme.palette.clrBorder};`}
    margin-top: 12px;

    .scrollbar-container {
      max-height: 100%;
      height: ${props => (props.isOpen ? '100%' : 0)};
      overflow: hidden;

      .ps__rail-y {
        opacity: 0 !important;
        border-left: 1px solid ${props => props.theme.palette.clrInnerBorder};
        background: ${props => props.theme.palette.coinPairDropDownScrollBg};

        .ps__thumb-y {
          &:before {
            background: ${props => props.theme.palette.coinPairDropDownScrollThumb};
          }
          cursor: pointer;
        }
      }
    }
  }

  .ReactVirtualized__Table__row:last-child {
    .exch-dropdown__item {
      border-bottom: 0;
    }
  }
`;

export const ExchDropdownList = withElementWithIdDimensions(
  styled.div.attrs({ className: 'exch-drop-list' })`
    height: ${props => (props.isOpen ? `${props.itemCount === 0 ? 100 : props.objHeight + 1}px` : 0)};
    .scroll__scrollup {
      ${props => !props.isOpen && 'display: none;'}
    }
  `,
  'right-top'
);

export const NoMatch = styled.div`
  font-size: 25px;
  color: ${props => props.theme.palette.coinPairSelectText2};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 5px 0;
`;

export const StyleWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  .scrollbar-container {
    display: flex;
    flex-direction: column;
  }

  .ps__thumb-y {
    opacity: 0 !important;
    z-index: 9999;
    cursor: pointer;
  }

  .ReactVirtualized__Table__rowColumn {
    margin-left: 0;
    text-overflow: inherit;
    overflow: initial !important;
  }

  .ReactVirtualized__Table__row {
    overflow: visible !important;

    .ReactVirtualized__Table__rowColumn {
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .ReactVirtualized__Table__Grid {
    box-shadow: 7px 6px 11px rgba(0, 0, 0, 0.05);
  }
`;

export const AddonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const ItemButtonWrapper = styled.div`
  position: relative;
  min-height: 62px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  transition: background-color 0.3s;
  cursor: pointer;

  ${props => !props.selectedCoinData && `border-bottom: 1px solid ${props.theme.palette.coinPairDropDownBorder};`}

  .exch-dropdown__title {
    padding: 0 12px;
    color: ${props => (props.selected ? props.theme.palette.clrBlue : props.theme.palette.coinPairDropDownItemText)};
    transition: padding 0.3s;
  }

  &:hover {
    background-color: ${props => props.theme.palette.clrBackground};

    .exch-dropdown__title {
      padding-left: 20px;
    }

    .symbol-name,
    .coin-name {
      transition: color 0.3s;
      color: ${props =>
        props.isReadableActive && props.selected
          ? props.theme.palette.clrBlue
          : props.theme.palette.settingsHoverColor};
    }
  }
`;

export const CoinAmountInput = styled.input.attrs({ className: 'exch-dropdown__current' })`
  font-size: 40px;
  font-weight: 600;
  color: ${props => props.theme.palette.clrBorder};
  background: transparent;
  border: 0;
  text-align: right;
  max-width: 300px;
  cursor: ${props => (props.isAUMSelected ? 'default' : 'text')};

  &:hover {
    color: ${props => props.theme.palette.coinPairSelectHoverText2};
  }
`;

export const CoinItemWrapper = styled.div.attrs({ className: 'exch-dropdown__current' })`
  width: 100%;
  height: 60px;
  padding: 0 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: ${props => props.theme.palette.coinPairSelectText2};

  .exch-dropdown__title__wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const AumCustomImg = styled.img`
  width: 37px;
  height: 37px;
  object-fit: cover;
`;

export const Search = styled.div`
  display: flex;
  position: absolute;
  z-index: 5;
  left: 1px;
  right: 1px;
  top: 1px;
  bottom: 1px;

  .trade-slider {
    top: 45px;
  }
`;

export const SearchInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto 0;
  padding: 5px 12px 5px 60px;
  border: none;
  background: ${props => props.theme.palette.inputPlaceholderBgColor};
  border-radius: 2px;
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.palette.inputTxtColor};
  caret-color: black;
  transition: all 0.2s;

  &::placeholder {
    color: ${props => props.theme.palette.inputPlaceholderTxtColor};
  }

  &:focus {
    background: ${props => props.theme.palette.coinPairSelectText};

    &::placeholder {
      color: ${props => props.theme.palette.coinPairSelectText};
    }
  }
`;

export const SearchOptions = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchOption = styled.div`
  position: relative;
  margin-left: ${props => (props.mlAuto ? 'auto' : '16px')};
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  color: ${props => props.theme.palette.inputTxtColor};
  cursor: pointer;
  opacity: ${props => (props.isActive ? 1 : 0.3)};

  &:hover,
  &.active {
    opacity: 1;
  }

  &:first-child {
    margin-left: 0;
  }

  svg {
    margin-bottom: 2px;
    font-size: 17px;
  }
`;

export const SearchIconWrapper = styled.div`
  height: 100%;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const CloseIconWrapper = styled.div`
  position: absolute;
  right: 0;
  top: ${props => (props.isEmpty ? '15px' : '6px')};
  height: 100%;
  width: 60px;
  display: flex;
  justify-content: center;
  z-index: 2;
  padding-top: 4px;

  > svg {
    width: ${props => !props.isEmpty && '18px'};
  }
`;

export const FilterDropDownWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: 0 ${props => props.theme.palette.borderRadius} 0 ${props => props.theme.palette.borderRadius};
  background: ${props => props.theme.palette.clrMainWindow};
  opacity: ${props => (props.isHovered ? 1 : 0)};
  transform: translateY(${props => (props.isHovered ? '71px' : '20px')});
  visibility: ${props => (props.isHovered ? 'visible' : 'hidden')};
  z-index: ${props => (props.isHovered ? '1111' : 'auto')};
  right: -1px;

  .dropdown_space {
    position: absolute;
    right: -10px;
    bottom: 0;
    width: 8px;
    height: 100%;
  }

  .dropdown_arrow {
    position: absolute;
    top: -12px;
    left: calc(70% + 12px);
  }
`;

export const FilterItemWrapper = styled.div`
  min-height: 30px;
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props =>
    props.isDisable
      ? '#3d4f4f'
      : props.isActive
      ? props.theme.palette.orderFormHeaderTabActiveText
      : props.isHovered
      ? props.theme.palette.clrHighContrast
      : props.theme.palette.clrPurple};
  cursor: pointer;
  white-space: nowrap;
  padding-left: 14px;
  padding-right: 10px;

  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
    background: ${props => props.theme.palette.clrMouseClick};
  }
`;

export const RightExchDropdownWrapper = styled.div`
  ${props => (props.isFocused ? 'cursor: pointer;' : 'pointer-events: none;')}
  > img {
    width: 35px;
  }
`;

export const DownArrowIcon = styled.div`
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid;
  color: ${props => props.theme.palette.clrBorder};
  margin: 10px;
`;

export const SelectedIconWrapper = styled.p`
  width: 100%;
  color: ${props => props.theme.palette.clrBackground};
  position: absolute;
  line-height: 100%;
  font-size: 2rem;
  z-index: ${props => (props.isOpen ? 1 : 0)};
  cursor: pointer;
  margin: 0;
  padding-left: 65px;
  padding-right: 12px;
  padding-bottom: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: 600;
  background-color: #fff;
  border-radius: 3px;
  span {
    font-size: 1rem;
    padding-left: 10px;
    padding-right: 50px;
    padding-top: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const ZerosWrapper = styled.span`
  color: ${props => props.theme.palette.clrOnBackDisabled};
`;

export const PopoverWrapper = withElementWithIdDimensions(
  styled.div.attrs()`
    position: absolute;
    top: 71px;
    left: -1px;
    right: -1px;
    height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(100vh - 96px)')};
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    /* display: flex; */
    flex-direction: column;
    border: 1px solid ${props => props.theme.palette.coinPairSelectBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    background: ${props => props.theme.palette.clrChartBackground};
    z-index: 1;
    transition: all 0.5s ease-in-out;
    animation-name: slide-animation;
    animation-duration: 0.5s;
    animation-fill-mode: both;

    @keyframes slide-animation {
      0% {
        height: 0;
      }

      100% {
        height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(100vh - 96px)')};
      }
    }

    @media (max-width: 1600px) {
      @keyframes slide-animation {
        0% {
          height: 0;
        }

        100% {
          height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(100vh - 96px)')};
        }
      }
    }

    @media (max-width: 1500px) {
      @keyframes slide-animation {
        0% {
          height: 0;
        }

        100% {
          height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(133.33vh - 96px)')};
        }
      }
    }

    @media (max-width: 1080px) {
      @keyframes slide-animation {
        0% {
          height: 0;
        }

        100% {
          height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(153.84vh - 96px)')};
        }
      }
    }

    @media (max-width: 940px) {
      @keyframes slide-animation {
        0% {
          height: 0;
        }

        100% {
          height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(181.81vh - 96px)')};
        }
      }
    }

    @media (max-width: 790px) {
      @keyframes slide-animation {
        0% {
          height: 0;
        }

        100% {
          height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(222.22vh - 96px)')};
        }
      }
    }

    @media (max-width: 700px) {
      @keyframes slide-animation {
        0% {
          height: 0;
        }

        100% {
          height: ${props => (props.isFirstLoad ? `${props.objHeight + 1}px` : 'calc(285.71vh - 96px)')};
        }
      }
    }

    &:before {
      content: ' ';
      position: absolute;
      top: -15px;
      left: 0;
      right: 0;
      height: 15px;
    }

    &:after {
      content: ' ';
      position: absolute;
      top: -7px;
      left: 22px;
      border: 7px solid transparent;
      border-top: none;
      border-bottom-color: ${props => props.theme.palette.coinPairSelectBorder};
    }
  `,
  'right-top'
);

export const TopMenu = styled.div`
  display: flex;
  padding: 8px 15px;
`;

export const MenuItem = styled.div.attrs({ className: 'search-menu-item' })`
  margin: 0 18px;
  line-height: 2;
  color: ${props =>
    props.isActive ? props.theme.palette.orderFormHeaderTabActiveText : props.theme.palette.clrPurple};
  font-size: 13px;
  white-space: nowrap;
  transition: color 0.3s;
  cursor: pointer;

  ${props =>
    props.isDisable &&
    css`
      color: ${props => props.theme.palette.clrBorder};
      pointer-events: none;
    `}

  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
  }
`;

export const MenuDivider = styled.div`
  flex: 1;
  margin: 7px 15px;
  border-left: 1px solid ${props => props.theme.palette.clrPurple};
`;

export const Dropdown = styled.div`
  position: relative;
  &:hover {
    .search-dropdown-menu {
      display: block;
    }
  }
`;

export const DropdownMenu = styled.div.attrs({ className: 'search-dropdown-menu' })`
  display: none;
  /* display: block; */
  position: absolute;
  left: -3px;
  border: 1px solid ${props => props.theme.palette.coinPairSelectBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  background: ${props => props.theme.palette.clrChartBackground};
  z-index: 1;
  .search-menu-item {
    margin: 12px 20px;
  }
`;

export const CoinsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const OrderBookWrapper = styled.div.attrs({ className: 'order-book-wrapper' })`
  position: relative;
  grid-area: ordercontent;
  overflow: hidden;
  height: 100%;

  .wallet-header {
    border-top: 0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
  }
`;
export const Coins = styled.div`
  position: relative;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  > div {
    cursor: pointer;
  }
`;

export const CoinLabel = styled.div`
  margin: 4px 0 -12px 12px;
  font-size: 12px;
  color: ${props => props.theme.palette.clrHighContrast};
  text-transform: uppercase;
`;

export const CoinWrapper = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
`;
