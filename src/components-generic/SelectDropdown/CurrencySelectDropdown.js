import React from 'react';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../stores';
import { DropdownWrapper, DropMenuIcon, SelectedItemLabel } from './Components';
import CurrencyDropdown from '../CurrencyDropdown';

class CurrencySelectDropdown extends React.Component {
  state = {
    isOpen: false
  };

  wrapperRef = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.state.isOpen && this.wrapperRef && this.wrapperRef.contains && !this.wrapperRef.contains(event.target)) {
      this.setState({
        isOpen: false
      });
    }
  };

  toggleDropDown = isOpen => {
    this.setState(prevState => ({
      isOpen: typeof isOpen === 'boolean' ? isOpen : !prevState.isOpen
    }));
  };

  render() {
    const { isOpen } = this.state;
    const { width, type, onClick, disableCrypto } = this.props;
    const { isDefaultCrypto, defaultFiat, defaultFiatSymbol, defaultCrypto, defaultCryptoSymbol } = this.props[
      STORE_KEYS.SETTINGSSTORE
    ];

    const isFiat = type === 'fiat' || (type === 'currency' && !isDefaultCrypto);
    const value = isFiat ? defaultFiat : defaultCrypto;

    return (
      <DropdownWrapper
        width={width}
        ref={ref => (this.wrapperRef = ref)}
        isOpen={isOpen}
        className={isOpen ? '' : 'close'}
      >
        <SelectedItemLabel
          onClick={() => {
            this.toggleDropDown();

            if (onClick) {
              onClick();
            }
          }}
        >
          <span>
            {isFiat ? defaultFiatSymbol : defaultCryptoSymbol} - {value}
          </span>
          <DropMenuIcon />
        </SelectedItemLabel>

        {isOpen && (
          <CurrencyDropdown
            type={type}
            value={value}
            toggleDropDown={this.toggleDropDown}
            disableCrypto={disableCrypto}
          />
        )}
      </DropdownWrapper>
    );
  }
}

export default inject(STORE_KEYS.SETTINGSSTORE)(observer(CurrencySelectDropdown));
