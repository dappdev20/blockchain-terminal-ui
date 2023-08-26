import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'dropmenu-wrapper' })`
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  display: block;
  float: left;
  font-weight: 400;
  font-size: 14px;
  height: 35px;
  letter-spacing: 1px;
  padding: 10px;
  position: relative;
  user-select: none;
  margin-left: auto;

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
  height: 14px;
  padding-right: 27px;
  user-select: none;

  .label {
    box-sizing: border-box;
    color: ${props => props.theme.palette.clrPurple};
    cursor: pointer;
    display: inline;
    user-select: none;
  }

  .value {
    box-sizing: border-box;
    color: ${props => props.theme.palette.clrPurple};
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
  right: 0px;
  top: 30px;
  user-select: none;
  width: auto;
  z-index: 1000;
  border: 1px solid ${props => props.theme.palette.clrBorder};
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

  ${props =>
    props.isActive
      ? `
        color: #fff;
    `
      : ''}
`;
