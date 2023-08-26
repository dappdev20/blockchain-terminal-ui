import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000000;
  ${props => props.hoverMode && 'pointer-events: none;'}
  ${props => props.inLineMode && 'display:none;'}
`;

export const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4000;
  background: rgba(0, 0, 0, 0.435);
  border-radius: ${props => props.theme.palette.borderRadius};
`;

export const InnerWrapper = styled.div`
  position: relative;
`;
