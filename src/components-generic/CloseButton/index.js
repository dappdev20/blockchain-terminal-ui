import React, { memo } from 'react';
import styled from 'styled-components/macro';

import x from './x.svg';

const Close = styled.button`
  border-radius: 50%;
  border: 0;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  background-color: ${props => props.theme.palette.modalCloseBackground};
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21px;
  height: 21px;
  z-index: 50;
  box-shadow: -1px 1px 5px 0px rgba(0, 0, 0, 0.75);

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
`;

const Icon = styled.img`
  width: ${props => props.size || '50%'};
  height: ${props => props.size || '50%'};
`;

const CloseButton = memo(({ onClose, size }) => (
  <Close onClick={onClose}>
    <Icon src={x} size={size} />
  </Close>
));

export default CloseButton;
