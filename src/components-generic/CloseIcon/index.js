import React from 'react';
import styled from 'styled-components/macro';
import { darkTheme } from '../../theme/core';

const CloseSvg = styled.svg`
  margin-right: ${props => (props.large ? '0' : '25px')};
  width: ${props => (props.large ? '25px' : '15px')};
  height: ${props => (props.large ? '25px' : '15px')};
  cursor: pointer;

  &,
  & * {
    fill: ${darkTheme.palette.userMenuPopupMenuItem} !important;
  }
`;

export default props => (
  <CloseSvg {...props} viewBox="0 0 9.38 9.38">
    <path transform="rotate(135 4.694 4.692)" d="M-1.38 4.13h12.14v1.13H-1.38z" />
    <path transform="rotate(45 4.687 4.691)" d="M-1.38 4.13h12.14v1.13H-1.38z" />
  </CloseSvg>
);
