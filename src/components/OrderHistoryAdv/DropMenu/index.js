import React, { Component } from 'react';

import { Wrapper, Label, DropdownList, DropdownItem } from './Components';

class DropMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      activeItem: ''
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps(props) {
    const { data } = props;
    this.setState({
      activeItem: data[0]
    });
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

  render() {
    const { opened, activeItem } = this.state;
    const { label, data } = this.props;
    const droplist = [];
    for (let i = 0; i < data.length; i++) {
      droplist.push(
        <DropdownItem key={i} isActive={activeItem === data[i]}>
          {data[i]}
        </DropdownItem>
      );
    }

    return (
      <Wrapper
        ref={ref => {
          this.wrapperRef = ref;
        }}
        onClick={this.toggleDropMenu}
      >
        <Label>
          <span className="label">{label}</span>
          <span className="value">{activeItem}</span>
        </Label>
        {opened && <DropdownList>{droplist}</DropdownList>}
      </Wrapper>
    );
  }
}

export default DropMenu;
