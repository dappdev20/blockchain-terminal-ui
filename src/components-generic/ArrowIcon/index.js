import React from 'react';
import styled from 'styled-components/macro';

const SwipArrowIconSvg = styled.svg`
  width: ${props => props.width || '45px'};
  height: ${props => props.width || '32px'};
  cursor: pointer;
  fill: none;
  stroke: ${props => props.theme.palette.coinPairSwitchBtnHoverFill};
  stroke-width: 0.2px;
  margin-top: 1px;
`;
export const SwipArrowIcon = props => (
  <SwipArrowIconSvg {...props} viewBox="0 0 170 120">
    <g transform="matrix(5.917159557342529, 0, 0, 5.7143874168396, -16.454240798950195, 4.012722492218018)">
      <path d="M18,11h-7.244l1.586-1.586c0.781-0.781,0.781-2.049,0-2.828c-0.781-0.781-2.047-0.781-2.828,0L3.1,13l6.414,6.414  C9.904,19.805,10.416,20,10.928,20s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.049,0-2.828L10.756,15H18c1.104,0,2-0.896,2-2  C20,11.895,19.104,11,18,11z" />
    </g>
    <g transform="matrix(1, 0, 0, 1, 68.43225860595703, 1.6870756149291992)">
      <g transform="matrix(5.917160511016846, 0, 0, 5.7143874168396, -18.269579891363605, -34.31955695719665)">
        <path d="M10.586,6.586c-0.781,0.779-0.781,2.047,0,2.828L12.172,11H4.928c-1.104,0-2,0.895-2,2c0,1.104,0.896,2,2,2h7.244  l-1.586,1.586c-0.781,0.779-0.781,2.047,0,2.828C10.977,19.805,11.488,20,12,20s1.023-0.195,1.414-0.586L19.828,13l-6.414-6.414  C12.633,5.805,11.367,5.805,10.586,6.586z" />
      </g>
    </g>
  </SwipArrowIconSvg>
);

const ArrowIconSvg = styled.svg`
  width: ${props => props.size || 20}px;
  height: ${props => props.size || 20}px;
  fill: ${props =>
    props.white
      ? props.theme.palette.clrWhite
      : props.isBuy
      ? props.theme.palette.coinPairBuyArrow
      : props.theme.palette.coinPairSellArrow};
  text {
    font-weight: bold;
    font-size: 16px;
    text-anchor: start;
    fill: white;
  }
  ${props =>
    props.tradingArrow &&
    `
        width: 30px;
        flex-shrink: 0;
    `}
`;
export const BuyArrowIcon = props => (
  <ArrowIconSvg {...props} isBuy viewBox="0 0 102 82">
    <g>
      <path d="m86.281865,28.685335l-40.750525,0l8.921912,-8.921912c4.393451,-4.393451 4.393451,-11.526481 0,-15.908681c-4.393451,-4.393451 -11.51523,-4.393451 -15.908681,0l-36.081429,36.081429l36.081429,36.081429c2.193913,2.199538 5.074127,3.296495 7.954341,3.296495s5.754802,-1.096956 7.954341,-3.296495c4.393451,-4.393451 4.393451,-11.526481 0,-15.908681l-8.921912,-8.921912l40.750525,0c6.210461,0 11.250835,-5.040374 11.250835,-11.250835c0,-6.216086 -5.040374,-11.250835 -11.250835,-11.250835z" />
      {props.withText && (
        <text y="45.007112" x="52.328387">
          BUY
        </text>
      )}
    </g>
  </ArrowIconSvg>
);

export const SellArrowIcon = props => (
  <ArrowIconSvg {...props} viewBox="0 0 102 82">
    <g>
      <path d="m45.504862,3.998886c-4.391072,4.379828 -4.391072,11.508995 0,15.900068l8.917082,8.917082l-40.728462,0c-6.207099,0 -11.244744,5.032023 -11.244744,11.244744c0,6.207099 5.037645,11.244744 11.244744,11.244744l40.728462,0l-8.917082,8.917082c-4.391072,4.379828 -4.391072,11.508995 0,15.900068c2.198347,2.198347 5.071379,3.29471 7.950034,3.29471s5.751686,-1.096363 7.950034,-3.29471l36.061893,-36.061893l-36.061893,-36.061893c-4.391072,-4.391072 -11.508995,-4.391072 -15.900068,0z" />
      {props.withText && (
        <text y="45.64057" x="10.692575">
          SELL
        </text>
      )}
    </g>
  </ArrowIconSvg>
);

const CaretArrowIconSvg = styled.svg`
  width: ${props => props.width || '16px'};
  height: ${props => props.width || '16px'};
  cursor: pointer;
  fill: none;
  stroke: ${props => (props.borderColor ? props.borderColor : props.theme.palette.coinPairSwitchBtnHoverFill)};
  stroke-width: 1px;
  margin-top: 1px;
  transform: rotate(${props => (props.degree ? props.degree : 0)}deg);
`;
export const CaretArrowIcon = props => (
  <CaretArrowIconSvg {...props} viewBox="0 0 320 512">
    <g>
      <path
        fill={props.fillColor ? props.fillColor : 'white'}
        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
      />
    </g>
  </CaretArrowIconSvg>
);
