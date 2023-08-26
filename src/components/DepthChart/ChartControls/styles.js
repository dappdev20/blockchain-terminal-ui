import styled, { css } from 'styled-components/macro';
import minus from './icons/minus.svg';
import plus from './icons/plus.svg';

export const Container = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ZoomButton = styled.img.attrs(props => ({
  src: props.type === 'in' ? plus : minus
}))`
  width: ${props => (props.isMobile ? '22px' : '36px')};
  height: ${props => (props.isMobile ? '22px' : '36px')};
  border: 2px solid ${props => props.theme.palette.clrBorder};
  background-color: ${props => props.theme.palette.clrBackground};
  padding: ${props => (props.isMobile ? '3px' : '8px')};
  border-radius: 50%;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  filter: ${props => (props.disabled ? 'brightness(70%)' : '')};
  opacity: ${props => (props.disabled ? '0.9' : '1')};
  margin-left: ${props => (props.type === 'in' ? '2px' : '0')};
  ${props =>
    !props.disabled &&
    css`
      &:hover {
        filter: brightness(150%);
      }
    `}
`;

export const Row = styled.div`
  display: flex;
`;
