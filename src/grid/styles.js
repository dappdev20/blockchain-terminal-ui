import styled from 'styled-components/macro';

export const RightTopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 12px;
  ${props => (props.isMobilePortrait || props.isSmallWidth ? 'display: none;' : 'flex: 1;')}
  height: 100%;
`;
