import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import { noop } from '@/utils';
import { MODE_KEYS, MODE_INFO } from '@/config/constants';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';
import { Dropdown, DropdownItem, DropdownWrapper, SelectedItemLabel } from './styles';

class ModeSwitchMenu extends Component {
  wrapperRef = React.createRef();

  state = {
    isOpen: false,
    activeReportsLength: this.props.activeReports.length
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.activeReports.length !== prevState.activeReportsLength) {
      return {
        activeReportsLength: nextProps.activeReports.length,
        isOpen: true
      };
    }
    return null;
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (
      this.state.isOpen &&
      this.wrapperRef.current &&
      this.wrapperRef.current.contains &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.setState({ isOpen: false });
    }
  };

  openDropdown = () => {
    this.setState({ isOpen: true });
  };

  closeDropdown = () => {
    this.setState({ isOpen: false });
  };

  onSelectItem = mode => {
    const { setArbMode, setRightBottomSectionOpenMode, setTradingViewMode, autoConversionId } = this.props;
    if (mode === MODE_KEYS.coldStorage && autoConversionId === 0) return; // do not open before auto conversion ID is set
    setRightBottomSectionOpenMode(mode);
    if (mode === MODE_KEYS.myPortfolioModeKey) {
      setTradingViewMode(false);
    }
    setArbMode(mode === MODE_KEYS.coldStorage);
    this.closeDropdown();
  };

  render() {
    const { isOpen } = this.state;
    const { activeReports, rightBottomSectionFullScreenMode, rightBottomSectionOpenMode, isLoggedIn } = this.props;

    if (!isLoggedIn || rightBottomSectionFullScreenMode) {
      return null;
    }

    return (
      <DropdownWrapper ref={this.wrapperRef}>
        <SelectedItemLabel
          onClick={this.openDropdown}
          onMouseEnter={!!activeReports.length ? this.openDropdown : noop}
          onMouseLeave={!!activeReports.length ? this.closeDropdown : noop}
        >
          <span>{MODE_INFO[rightBottomSectionOpenMode].label}</span>
          <CaretArrowIcon borderColor="#020518" className="dropdown_arrow" fillColor="#454c73" />
          <div className="dropdown_wrapper_space" />
        </SelectedItemLabel>

        {!!activeReports.length && (
          <Dropdown
            activeReportLength={activeReports.length}
            isHovered={isOpen}
            onMouseEnter={this.openDropdown}
            onMouseLeave={this.closeDropdown}
          >
            {activeReports.map(key => (
              <DropdownItem
                isActive={rightBottomSectionOpenMode === key}
                key={key}
                onClick={() => this.onSelectItem(key)}
              >
                {MODE_INFO[key].label}
              </DropdownItem>
            ))}
            <CaretArrowIcon borderColor="#020518" className="dropdown_arrow" fillColor="#454c73" />
          </Dropdown>
        )}
      </DropdownWrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.SETTINGSSTORE, STORE_KEYS.TELEGRAMSTORE, STORE_KEYS.CONVERSIONAUTOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: {
        rightBottomSectionFullScreenMode,
        rightBottomSectionOpenMode,
        setArbMode,
        setRightBottomSectionOpenMode,
        setTradingViewMode
      },
      [STORE_KEYS.SETTINGSSTORE]: { activeReports },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { autoConversionId }
    }) => ({
      rightBottomSectionFullScreenMode,
      rightBottomSectionOpenMode,
      setArbMode,
      setRightBottomSectionOpenMode,
      setTradingViewMode,
      activeReports,
      isLoggedIn,
      autoConversionId
    })
  )
)(ModeSwitchMenu);
