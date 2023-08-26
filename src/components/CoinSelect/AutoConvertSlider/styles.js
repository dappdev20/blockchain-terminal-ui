import styled from 'styled-components/macro';
import { darkTheme } from '@/theme/core';

const { palette } = darkTheme;

export const TradeSlider = styled.div.attrs({ className: 'trade-slider' })`
  position: absolute;
  left: 75px;
  top: 55px;
  width: calc(100% - 75px);

  .rc-slider {
    width: calc(100% - 75px);

    &.rc-slider-disabled {
      background-color: transparent;

      .rc-slider-rail,
      .rc-slider-track {
        // background-color: transparent !important;
      }
    }
  }
`;

export const ProgressValue = styled.div`
  position: absolute;
  right: 15px;
  bottom: 3px;
  z-index: 10;
  font-size: 15px;
  font-weight: bold;
  color: ${props => props.theme.palette.coinPairDropDownBorder};
`;

export const RailStyle = {
  default: {
    top: 6,
    height: 2,
    backgroundColor: palette.coinPairDropDownBorder
  },
  search: {
    top: 2,
    height: 4,
    backgroundColor: 'rgba(13, 17, 43)',
    borderRadius: 2,
    zIndex: 5
  }
};

const defaultHandleStyle = {
  top: 2,
  zIndex: 11,
  backgroundColor: 'white',
  border: '1px solid rgba(13, 17, 43)',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)'
};

export const HandleStyle = {
  hide: {
    display: 'none'
  },
  default: {
    top: 8,
    zIndex: 11,
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)'
  },
  buy: {
    ...defaultHandleStyle
    // backgroundColor: palette.orderBookTableCellTextBuy
  },
  sell: {
    ...defaultHandleStyle
    // backgroundColor: palette.orderBookTableCellTextSell
  },
  hover: {
    top: 6,
    borderWidth: 0,
    height: 10,
    width: 10,
    borderRadius: 4,
    zIndex: 11
  },
  selected: {
    top: 2,
    backgroundColor: 'white',
    border: '1px solid rgba(13, 17, 43)',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)',
    // boxShadow: '0px 0px 0px 12px rgba(255, 255, 255, 0.16)',
    zIndex: 11
  }
};

export const TrackStyle = {
  default: {
    top: 6,
    height: 2,
    backgroundColor: palette.clrMouseClick
  },
  buy: {
    top: 6,
    height: 2,
    backgroundColor: palette.orderBookTableCellTextBuy
  },
  sell: {
    top: 6,
    height: 2,
    backgroundColor: palette.orderBookTableCellTextSell
  }
};
