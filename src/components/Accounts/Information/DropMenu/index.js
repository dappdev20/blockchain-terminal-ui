import React, { Component } from 'react';

import { Wrapper, Label, DropdownList, DropdownItem } from './styles';

class DropMenu extends Component {
  state = {
    opened: false
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleDropMenu = () => {
    this.setState(prevState => ({
      opened: !prevState.opened
    }));
  };

  handleClickOutside = event => {
    if (this.state.opened && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleDropMenu();
    }
  };

  handleClickItem = item => e => {
    e.stopPropagation();
    const { onChange } = this.props;
    onChange && onChange(item);
    this.toggleDropMenu();
  };

  render() {
    const { opened } = this.state;
    const { selectedItems, data, totalBalenceDropdown } = this.props;

    const label = selectedItems || data[0];

    return (
      <Wrapper
        ref={ref => {
          this.wrapperRef = ref;
        }}
        onClick={this.toggleDropMenu}
        totalBalenceDropdown={totalBalenceDropdown}
      >
        <Label>
          <span className="label">{(totalBalenceDropdown ? 'Total balence in ' : '') + label}</span>
        </Label>
        {opened && (
          <DropdownList onClick={this.toggleDropMenu}>
            {data.map((item, i) => (
              <DropdownItem key={i} isActive={selectedItems === item} onClick={this.handleClickItem(item)}>
                {item}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </Wrapper>
    );
  }
}

export default DropMenu;
