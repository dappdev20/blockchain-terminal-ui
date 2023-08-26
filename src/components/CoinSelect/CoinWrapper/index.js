import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import CoinIcon from '@/components-generic/CoinIcon';
import { AumCustomImg } from '../CoinsList/styles';
import { Wrapper, InfoIcon, CoinIconWrapper, SearchPlaceholder } from './styles';
import { RightExchDropdownSearchIcon } from '@/components-generic/SvgIcon';

import IcAUM from '../CoinsList/icon-aum.svg';

class CoinWrapper extends React.Component {
  state = {
    isOpened: false,
    isIconOver: false
  };

  openCoinInfo = mode => evt => {
    evt.preventDefault();
    evt.stopPropagation();
    this.toggleCoinInfo(mode);
  };

  toggleCoinInfo = isOpen => {
    this.setState({ isOpened: isOpen, isIconOver: isOpen });
  };

  getCoinIcon = () => {
    const { isIconOver } = this.state;
    const { isAUMSelected, value, stockMode, defaultFiat } = this.props;

    if (isIconOver) {
      return <InfoIcon className="info-icon-wrapper" />;
    }
    if (isAUMSelected) {
      return <AumCustomImg src={IcAUM} alt="ic-aum" />;
    }
    if ((value && value.stock) || !stockMode) {
      return <CoinIcon size={38} value={value} defaultFiat={defaultFiat} />;
    }
    return (
      <img
        src={`https://storage.googleapis.com/iex/api/logos/${(value || '').replace('S:', '')}.png`}
        className="icon_stock"
        alt=""
      />
    );
  };

  render() {
    const { isOpened } = this.state;
    const { width, height, isLeft, baseSymbol: selectedBase, RouterCoin, toggleDropdown, isSearch } = this.props;

    let isForceOpened = false;
    if (selectedBase === RouterCoin && isLeft) {
      isForceOpened = true;
    }

    const coinMetaOpened = isForceOpened || isOpened;
    const SearchPlaceholderText = 'Search for assets';

    return (
      <Wrapper
        width={width}
        height={height}
        onClick={toggleDropdown}
        coinMetaOpened={coinMetaOpened}
        isSearch={isSearch}
      >
        <CoinIconWrapper isLeft={isLeft}>
          <SearchPlaceholder>{SearchPlaceholderText}</SearchPlaceholder>
          <RightExchDropdownSearchIcon />
        </CoinIconWrapper>
      </Wrapper>
    );
  }
}

export default compose(
  inject(
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.FIATCURRENCYSTORE,
    STORE_KEYS.VIEWMODESTORE
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.INSTRUMENTS]: {
        selectedInstrumentPair: [baseSymbol, quoteSymbol],
        RouterCoin
      },
      [STORE_KEYS.SETTINGSSTORE]: { getDefaultPrice },
      [STORE_KEYS.FIATCURRENCYSTORE]: { stockMode },
      [STORE_KEYS.VIEWMODESTORE]: { setArbMode, setRightBottomSectionOpenMode }
    }) => ({
      baseSymbol,
      quoteSymbol,
      RouterCoin,
      getDefaultPrice,
      stockMode,
      setArbMode,
      setRightBottomSectionOpenMode
    })
  )
)(CoinWrapper);
