import React from 'react';
import styled from 'styled-components/macro';

import DropMenu from '../DropMenu';

import { rowsPerPageList } from '../constants';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  padding: 5px 10px 5px 0;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrPurple};
  border-bottom: 1px solid #454c73;
  border-top: 1px solid #454c73;
`;

const Description = styled.div`
  font-size: 12px;
`;

const TableHeader = () => (
  <Wrapper>
    <DropMenu data={rowsPerPageList} />
    <Description>0 - 25 of 0</Description>
  </Wrapper>
);

export default TableHeader;
