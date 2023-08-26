import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'dropmenu-wrapper' })`
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  display: block;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 1px;
  padding: 8px;
  position: relative;
  user-select: none;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: 2px;

  ${props =>
    props.totalBalenceDropdown &&
    `
        margin-left: auto;   
    `}

  &:after {
    background-image: url(/img/icon_dp_back.svg);
    background-position-x: 50%;
    background-position-y: 50%;
    background-size: 20px;
    content: ' ';
    cursor: pointer;
    display: block;
    height: 10px;
    opacity: 0.6;
    position: absolute;
    right: 6px;
    top: 15px;
    width: 14px;
    z-index: 101;
  }
`;

export const Label = styled.div`
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  cursor: pointer;
  display: block;
  padding-right: 5px;
  user-select: none;
  min-width: 150px;

  .label {
    box-sizing: border-box;
    color: ${props => props.theme.palette.clrPurple};
    font-weight: 700;
    cursor: pointer;
    display: inline;
    user-select: none;
  }

  .value {
    box-sizing: border-box;
    color: ${props => props.theme.palette.clrHighContrast};
    font-weight: 700;
    cursor: pointer;
    display: inline;
    margin-left: 6px;
    user-select: none;
  }
`;

export const DropdownList = styled.div`
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  position: absolute;
  left: 0px;
  top: 40px;
  user-select: none;
  width: auto;
  z-index: 1000;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  max-height: 80vh;
  overflow: auto;
`;

export const DropdownItem = styled.div`
  background: ${props => props.theme.palette.clrMainWindow};
  box-sizing: border-box;
  color: ${props => props.theme.palette.clrPurple};
  cursor: pointer;
  display: block;
  padding: 5px 14px;
  position: relative;
  text-overflow: ellipsis;
  user-select: none;

  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
  }

  ${props => props.isActive && 'color: #fff;'}
`;
