import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'dropmenu-wrapper' })`
  box-sizing: border-box;
  display: flex;
  font-weight: 700;
  font-size: 11px;
  font-family: 'open_sans', sans-serif;
  letter-spacing: 1px;
  padding: 10px;
  position: relative;
  user-select: none;
  align-items: center;

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
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    z-index: 101;
  }
`;

export const Label = styled.div`
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding-right: 13px;
  font-weight: 700;
  user-select: none;
  color: ${props => props.theme.palette.clrPurple};

  .label {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    user-select: none;
    color: ${props => props.theme.palette.clrPurple};
  }

  .value {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    user-select: none;
    color: ${props => props.theme.palette.clrPurple};
  }
`;

export const DropdownList = styled.div`
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  box-sizing: border-box;
  color: ${props => props.theme.palette.clrPurple};
  background-color: ${props => props.theme.palette.clrMainWindow};
  border: 1px solid ${props => props.theme.palette.clrPurple};
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  right: 0px;
  top: 60%;
  user-select: none;
  width: auto;
  z-index: 1000;
  text-align: left;
`;

export const DropdownItem = styled.div`
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 5px 14px;
  position: relative;
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background-color: #0057a3;
    color: #fff;
  }

  ${props =>
    props.isActive
      ? `
        color: #fff;
    `
      : ''}
`;
