import styled, { css } from 'styled-components/macro';
import { slideFromTop, slideFromBottom } from '@/theme/animations';

export const DropdownWrapper = styled.div.attrs({ className: 'dropdown-wrapper' })`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  height: 30px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: transparent;

  &.close:hover {
    opacity: 0.8;
  }

  .dropdown_wrapper_space {
    position: absolute;
    right: -1px;
    bottom: 30px;
    width: 144px;
    height: 14px;
  }
`;

export const SelectedItemLabel = styled.span`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 1em;
  text-align: left;
  cursor: pointer;
  color: ${props => props.theme.palette.clrPurple};
  text-transform: uppercase;

  span {
    display: -webkit-box;
    line-height: 16px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  left: -1px;
  bottom: 43px;
  z-index: 100;
  margin: 0;
  padding: 0;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: ${props => props.theme.palette.clrMainWindow};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  transition: all 0.5s ease;

  ${props =>
    props.isHovered
      ? css`
          animation: ${slideFromBottom} 0.5s forwards;
        `
      : css`
          animation: ${slideFromTop} 0.5s forwards;
        `};

  .dropdown_arrow {
    position: absolute;
    bottom: -10px;
    left: calc(50% - 8px);
  }
`;

export const DropdownItem = styled.div`
  min-height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  padding: 0 15px;
  background: ${props => (props.isActive ? props.theme.palette.clrBackground : props.theme.palette.clrChartBackground)};
  color: ${props => (props.isActive ? 'white' : props.theme.palette.clrPurple)};
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: white;
    padding: 0px 13px 0px 17px;
    transition-duration: 0.3s;
  }
`;
