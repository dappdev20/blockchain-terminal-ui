import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components/macro';

const getAni = key => {
  const sizes = {
    dec_w: [100, 100, 0, 100],
    inc_w: [0, 100, 100, 100],
    dec_h: [100, 100, 100, 0],
    inc_h: [100, 0, 100, 100]
  }[key];
  return keyframes`
        0% { background-size: ${sizes[0]}% ${sizes[1]}%; }
        100% { background-size: ${sizes[2]}% ${sizes[3]}%; }
    `;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  margin-bottom: 25px;
  background: ${props => props.theme.palette.clrChartBackground};
  border: 1px solid ${props => props.theme.palette.clrSubBorder};
  border-radius: 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;

  [data-text] {
    display: flex;
    align-items: center;

    background-repeat: no-repeat;
    background-image: ${props =>
      props.isBuy
        ? `linear-gradient(${props.theme.palette.orderBookTableCellTextBuy}, ${props.theme.palette.orderBookTableCellTextBuy})`
        : `linear-gradient(${props.theme.palette.orderBookTableCellTextSell}, ${props.theme.palette.orderBookTableCellTextSell})`};
    background-color: ${props => props.theme.palette.ctrlSliderTrackProgressBg};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation-fill-mode: forwards;
  }

  [data-coin] {
    ${props => (props.isBuy ? 'padding-right: 4px' : 'padding-left: 4px')};
    background-size: 100% 100%;
  }

  [data-inputsection] {
    white-space: nowrap;
    overflow: hidden;
  }

  .slider {
    position: absolute;
    width: ${props => (props.progress === 0 ? '0%' : `calc(${props.progress}% - 24px)`)};
    height: 2px;
    left: 8px;
    bottom: -2px;
    background: ${props =>
      props.isBuy ? props.theme.palette.orderBookTableCellTextBuy : props.theme.palette.orderBookTableCellTextSell};
    transition: all 0.5s;
    &:after {
      content: ' ';
      position: absolute;
      display: block;
      width: 13px;
      height: 13px;
      top: -5px;
      right: -10px;
      border: 1px solid ${props => props.theme.palette.ctrlSliderDelimiterBorder};
      border-radius: 50%;
      background: ${props => {
        if (props.progress === 0) return props.theme.palette.ctrlSliderTrackProgressBg;
        return props.isBuy
          ? props.theme.palette.orderBookTableCellTextBuy
          : props.theme.palette.orderBookTableCellTextSell;
      }};
    }
  }

  &.buy_from {
    [data-inputsection] {
      background-position: top right;
      background-size: 100% 100%;
    }
    &.status_1 {
      [data-inputsection] {
        background-size: 0% 0%;
        animation: ${getAni('dec_h')} 2s linear;
      }
    }
    &.status_4 {
      [data-inputsection] {
        background-color: transparent;
        background-size: 100% 100%;
        animation: ${getAni('inc_w')} 2s linear;
      }
    }
  }

  &.buy_to {
    [data-inputsection] {
      background-position: bottom right;
      background-size: 0% 0%;
    }
    &.status_1 {
      [data-inputsection] {
        background-size: 100% 100%;
        animation: ${getAni('inc_h')} 2s linear;
      }
    }
    &.status_2 {
      [data-inputsection] {
        background-color: transparent;
        background-size: 0% 0%;
        animation: ${getAni('dec_w')} 2s linear;
      }
    }
  }

  &.sell_from {
    [data-inputsection] {
      background-position: bottom left;
      background-size: 100% 100%;
    }
    &.status_2 {
      [data-inputsection] {
        background-color: transparent;
        background-size: 100% 100%;
        animation: ${getAni('inc_w')} 2s linear;
      }
    }
    &.status_3 {
      [data-inputsection] {
        background-size: 0% 0%;
        animation: ${getAni('dec_h')} 2s linear;
      }
    }
  }

  &.sell_to {
    [data-inputsection] {
      background-position: top left;
      background-size: 0% 0%;
    }
    &.status_3 {
      [data-inputsection] {
        background-size: 100% 100%;
        animation: ${getAni('inc_h')} 2s linear;
      }
    }
    &.status_4 {
      [data-inputsection] {
        background-color: transparent;
        background-size: 0% 0%;
        animation: ${getAni('dec_w')} 2s linear;
      }
    }
  }
`;

const InputOrderCell = memo(({ coin, amount, isHideAmount, isBuy, progress, type, status }) => (
  <Wrapper isBuy={isBuy} progress={progress} className={`${type} ${status}`}>
    <div data-text data-inputsection placeholder={isHideAmount ? '' : '0'}>
      {isHideAmount ? '' : amount === 'NaN' ? 0 : amount}
    </div>
    <div data-text data-coin>
      {coin}
    </div>
    {(type === 'buy_from' || type === 'sell_from') && <span className="slider" />}
  </Wrapper>
));

export default InputOrderCell;
