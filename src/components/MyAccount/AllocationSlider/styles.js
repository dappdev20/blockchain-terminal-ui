import styled from 'styled-components/macro';

export const TradeSlider = styled.div.attrs({ className: 'trade-slider' })`
  position: absolute;
  left: 65px;
  top: 55px;
  width: calc(100% - 65px);

  .rc-slider {
    width: 100%;

    &.rc-slider-disabled {
      background-color: transparent;

      .rc-slider-rail,
      .rc-slider-track {
        // background-color: transparent !important;
      }
    }
  }
`;

export const RailStyle = {
  top: 6,
  height: 2,
  backgroundColor: 'rgba(0, 0, 0, 0)'
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
  }
};

export const TrackStyle = {
  top: 6,
  height: 2,
  backgroundColor: 'rgba(0, 0, 0, 0)'
};
