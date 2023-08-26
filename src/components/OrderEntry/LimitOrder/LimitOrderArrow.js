import React from 'react';
import styled from 'styled-components/macro';

const Arrow = styled.svg`
    // fill: ${props => (props.isBuy ? '#01B067' : '#09f')} !important;
    height: 20px !important;
    margin: 0 5px;
    ${props => props.isBuy && 'transform: rotate(180deg);'} 
`;

const LimitOrderArrow = ({ isBuy }) => {
  return (
    <Arrow viewBox="0 0 4.7625 2.6458" role="img" aria-hidden="true" isBuy={isBuy}>
      <g transform="translate(0 -294.35)">
        <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
          <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
            <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
              <polygon points="204 306 -300 306 -300 102 204 102 204 0 458 204 204 408" />
            </g>
          </g>
        </g>
      </g>
    </Arrow>
  );
};

export default LimitOrderArrow;
