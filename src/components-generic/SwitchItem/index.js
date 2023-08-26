import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { injectIntl } from 'react-intl';

const SwitchStyleWrapper = styled.div.attrs({ className: 'switch-item-component' })`
  margin: 0 18px;
  display: flex;
  align-items: center;
  .switch {
    display: inline-block;
    height: 20px;
    position: relative;
    width: 41px;
  }

  .switch input {
    display: none;
  }

  input:checked + .slider {
    background-color: #566190;
  }

  input:checked + .slider:before {
    transform: translateX(21px);
    background-color: #00c6c0;
  }
`;

const SwitchSlider = styled.div`
  background-color: #a2aace;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.4s;

  &:before {
    background-color: #141b44;
    bottom: 4px;
    content: '';
    height: 12px;
    left: 4px;
    position: absolute;
    transition: 0.4s;
    width: 12px;
  }

  &.round {
    border-radius: 34px;
  }

  &.round:before {
    border-radius: 50%;
  }
`;

const SwitchItem = memo(({ isChecked, handleChange, ...restProps }) => {
  return (
    <SwitchStyleWrapper {...restProps}>
      <label className="switch">
        <input type="checkbox" onChange={() => handleChange()} checked={isChecked} />
        <SwitchSlider className="slider round" />
      </label>
    </SwitchStyleWrapper>
  );
});

export default injectIntl(SwitchItem);
