import styled, { css } from 'styled-components/macro';
import { Content } from '../Wrappers';
import { popIn, popOut } from '@/theme/animations';

export const AnitmatedContent = styled(Content)`
  ${props =>
    props.show
      ? css`
          animation: ${popIn} 0.5s forwards;
        `
      : css`
          animation: ${popOut} 0.5s forwards;
        `};
`;
