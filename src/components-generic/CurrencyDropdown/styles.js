import styled, { css } from 'styled-components/macro';

export const Dropdown = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  z-index: 100;
  width: 200%;
  height: 362px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.palette.clrBackground};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  box-shadow: 2px 0 0 2px rgba(0, 0, 0, 0.2);
  font-size: 18px;

  ${props =>
    props.isMobile &&
    css`
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: unset;
      height: unset;
      padding: 12px;
      font-size: 24px;

      &:before {
        content: '';
        position: absolute;
        left: 11px;
        top: 11px;
        right: 11px;
        bottom: 11px;
        border: 1px solid ${props => props.theme.palette.clrBorder};
        border-radius: ${props => props.theme.palette.borderRadius};
      }
    `};
`;
