import styled from 'styled-components/macro';

export const DefaultWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0 15px 40px;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.735);
  border-radius: ${props =>
    props.additionalVerticalSpace
      ? `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`
      : `${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0 0`};
`;

export const RightSectionWrapper = styled(DefaultWrapper)`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const LeftLowerSectionModalWrapper = styled(DefaultWrapper)`
  padding: 0 !important;
  border-radius: 0;
`;

export const InnerWrapper = styled.div`
  position: relative;
  z-index: 9999999;
`;

export const VerticalSpace = styled(DefaultWrapper)`
  width: 100%;
  height: 55%;
  top: 100%;
  border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
`;

export const VerticalSpaceTop = styled(DefaultWrapper)`
  width: 100%;
  height: 55%;
  top: -55%;
  border-radius: ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0 0;
`;
