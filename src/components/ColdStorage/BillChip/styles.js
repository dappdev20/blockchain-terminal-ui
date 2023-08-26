import styled from 'styled-components/macro';

export const ChipWrapper = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  margin-top: 12px;
  overflow: hidden;
  cursor: pointer;
  opacity: ${props => (props.disabled ? 0.7 : 1)};

  &:first-child {
    margin-top: 0;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(2, 5, 18, 0);
    transition: 0.2s;
  }

  ${props =>
    props.disabled
      ? `
      &::after {
          background-color: rgba(2, 5, 18, 0.7);
      }
  `
      : `
      &:hover {
          &::after {
              background-color: rgba(255, 0, 0, 0.3);
          }
      }`};
`;

export const ChipBGImg = styled.img`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
`;
