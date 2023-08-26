import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'wrapper-tradingview' })`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.isCoinListOpen ? 'none' : 'all')};
  z-index: 2;
  .settings-tooltip {
    position: absolute;
    z-index: 10;
    width: 38px;
    height: 38px;
    top: 12px;
    left: 12px;

    .settings-icon {
      width: 38px;
      height: 38px;
    }
  }
`;

export const ChartContainer = styled.div`
  position: relative;
  flex: 1;
`;

export const ApTradingViewChart = styled.div.attrs({ className: 'apTradingViewChart' })`
  position: relative;
  width: ${props => (props.width ? `${props.width}px` : '100%')};
  height: 100%;

  iframe {
    height: 100% !important;
    border-radius: ${props => props.theme.palette.borderRadius};
  }
`;
