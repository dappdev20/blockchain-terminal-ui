import styled from 'styled-components/macro';

export const OuterWrapper = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
`;

export const BackgroundImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  object-fit: contain;
  z-index: -1;
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
`;
