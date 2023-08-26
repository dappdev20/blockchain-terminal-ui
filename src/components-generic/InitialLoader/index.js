import React from 'react';
import styled from 'styled-components/macro';
import lock from './lock.png';
import DataLoader from '../DataLoader';

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999;
  background: ${props => props.theme.palette.clrBackground};
`;

const LockImg = styled.img`
  position: absolute;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
`;

const InitialLoader = () => (
  <LoaderWrapper>
    <DataLoader width={150} height={150} />
    <LockImg src={lock} alt="" />
  </LoaderWrapper>
);

export default InitialLoader;
