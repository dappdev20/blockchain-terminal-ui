import styled, { css } from 'styled-components/macro';
import { fadeIn, fadeOut } from '@/theme/animations';

export const Overlayer = styled.div`
  position: ${props => (props.fixed ? 'fixed' : 'absolute')};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.bg || 'rgba(0,0,0,0.3)'};
  z-index: 1;
  ${props =>
    props.show
      ? css`
          animation: ${fadeIn} 1.5s forwards;
        `
      : css`
          animation: ${fadeOut} 1.5s forwards;
        `};
`;
