import styled from 'styled-components/macro';

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: ${props => props.alignItems || 'center'};
`;

export const Wrapper = styled(FlexWrapper)`
  position: ${props => (props.fixed ? 'fixed' : 'absolute')};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${props => props.fixed && 'z-index: 1000000;'};
`;

export const Content = styled.div`
  position: relative;
  ${props => props.width && `width: ${props.width}px;`}
  ${props => props.height && `height: ${props.height}px;`}
  ${props => props.fullWidth && 'width: 100%;'}
  ${props => props.fullHeight && 'height: 100%;'}
  z-index: 10;
`;
