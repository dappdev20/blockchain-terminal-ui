import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';
import { STORE_KEYS } from '../../stores';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border: 3px solid ${props => props.theme.palette.clrRed};
  z-index: 1000000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  color: ${props => props.theme.palette.clrRed};
  padding: 20px;
  border: 1px solid ${props => props.theme.palette.clrRed};
  border-radius: 7px;
  font-size: 30px;
  font-weight: 600;
`;

const ConnectionLost = ({ [STORE_KEYS.NETWORKSTORE]: { showConnectionLost }, isMobileDevice }) => {
  if (isMobileDevice) {
    return null;
  }

  if (!showConnectionLost) {
    return null;
  }

  return (
    <Wrapper>
      <Label>Connection Lost...</Label>
    </Wrapper>
  );
};

export default inject(STORE_KEYS.NETWORKSTORE)(observer(ConnectionLost));
