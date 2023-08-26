import styled from 'styled-components/macro';
import ArrowIcon from '@/components/OrderBook/HeaderCells/PriceHeader/ArrowIcon';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
`;

export const StyleWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  .ps__thumb-y {
    opacity: 0 !important;
    z-index: 9999;
    cursor: pointer;
  }

  .ReactVirtualized__Table__Grid {
    overflow: visible !important;

    .ReactVirtualized__Grid__innerScrollContainer {
      overflow: visible !important;
    }
  }

  .ReactVirtualized__Table__headerRow {
    background-color: #0d112b;
    border-bottom: 1px solid #1e233e;

    .ReactVirtualized__Table__headerColumn {
      border-collapse: collapse;
      box-sizing: border-box;
      color: ${props => props.theme.palette.clrPurple};
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-transform: capitalize;
      height: 28px;
      z-index: 3;
      -webkit-border-horizontal-spacing: 2px;
      -webkit-border-vertical-spacing: 2px;
      white-space: nowrap;
    }
  }

  .ReactVirtualized__Table__rowColumn {
    height: 100%;
    margin-left: 0;
    margin-right: 0;
    text-overflow: inherit;
    overflow: initial !important;
  }

  .ReactVirtualized__Table__row {
    overflow: visible !important;
    pointer-events: none;

    .ReactVirtualized__Table__rowColumn {
      pointer-events: auto;
      &:last-child {
        margin-right: 0;
      }

      .bCQGbm {
      }
    }

    &.hovering-item,
    &:hover {
      background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};
    }

    &:focus {
      outline: none;
    }
  }

  .ReactVirtualized__Table__Grid {
    box-shadow: 7px 6px 11px rgba(0, 0, 0, 0.05);
  }
`;

export const Item = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  background: transparent;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.palette.orderFormBorder}7f;
  border-right: 1px solid ${props => props.theme.palette.orderFormBorder}7f;
  padding: 10px;
  font-size: 13px;
  font-weight: 400;

  .token-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slider-cell {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;

    .trade-slider {
      position: relative;
      top: 7px;
      left: 0;
      width: 100%;
    }
  }

  .amount-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .amount {
      padding-right: 5px;
    }
  }

  .change-cell {
    border-right: 0px;
    .price_rate {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.plus_change {
        color: ${props => props.theme.palette.exchBarItemPlusPrice};
      }

      &.minus_change {
        color: ${props => props.theme.palette.exchBarItemMinusPrice};
      }
    }
  }
`;

export const Arrow = styled(ArrowIcon)`
  transition: all 0.1s;
  width: 16px;
  height: 16px;
  transform: scaleY(1.2) ${props => props.direction === 'down' && `rotate(180deg)`};

  path {
    fill: ${props =>
      props.direction === 'up' ? props.theme.palette.exchBarItemPlusPrice : props.theme.palette.exchBarItemMinusPrice};
  }
`;

export const TooltipWrapper = styled.div`
  text-align: right;
`;

export const TooltipValue = styled.span`
  margin: 0 3px 0 2px;
`;

export const TitleWrapper = styled.div`
  position: absolute;
  left: -1px;
  top: -32px;
  display: flex;
  width: 100%;
  height: 31px;
  font-size: 14px;
  font-weight: 500;
`;

export const Title = styled.div`
  flex: 1;
  padding: 10px;
  padding-top: 5px;
  text-align: left;
  color: ${props => props.theme.palette.clrPurple};
  border-left: 1px solid #242845;
`;

export const AllocationBar = styled.span`
  margin-left: 10px;
  height: 7px;
  border-radius: 5px;
`;

export const Suffix = styled.span`
  top: -3px;
  left: -2px;
  display: inline-block;
  position: relative;
  font-size: 9px;
`;
