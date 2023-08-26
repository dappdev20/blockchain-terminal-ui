import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import { STORE_KEYS } from '@/stores';
import { formatStringForMKTCAP, formatString } from '@/utils';
import COIN_DATA_MAP from '@/mock/coin-data-map';
import SocialLinkItems from './SocialLinkItems';
import PopupInput from './PopupInput';
import Dropdown from './Dropdown';
// import { DropdownWrapper, CurrentPopup, BaseCurrentInfo, CurrentInfo, InfoWrapper, InfoTab } from './styles';
import { DropdownWrapper, CurrentPopup, BaseCurrentInfo, CurrentInfo, InfoWrapper } from './styles';

class CoinMetaDropdown extends React.Component {
  state = {
    isOpenDelivery: false
  };

  hideCoinInfo = () => {
    this.setState({ isOpenDelivery: false });
  };

  openDeliveryInfo = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ isOpenDelivery: true });
  };

  render() {
    const { isOpenDelivery } = this.state;
    const {
      isLeft,
      baseSymbol: selectedBase,
      quoteSymbol: selectedQuote,
      getDefaultPrice,
      baseCoinMap,
      arbMode
    } = this.props;
    const activeCoin = isLeft ? selectedBase : selectedQuote;

    let marketCap = 0;
    let volume24h = 0;
    let priceChange24 = 0;

    if (baseCoinMap) {
      marketCap = baseCoinMap.marketCap;
      volume24h = baseCoinMap.marketVolume24;
      priceChange24 = baseCoinMap.priceChange24;
    }

    let socialInfo = [];
    if (!selectedBase || COIN_DATA_MAP[selectedBase] === undefined) {
      socialInfo = [];
    } else {
      socialInfo = COIN_DATA_MAP[selectedBase].social_info;
    }

    if (arbMode || !socialInfo.length) {
      return null;
    }
    return (
      <DropdownWrapper>
        <CurrentPopup onMouseLeave={this.hideCoinInfo}>
          <BaseCurrentInfo>
            {!arbMode && socialInfo.length > 0 && (
              <CurrentInfo>
                <InfoWrapper className="left-info-wrapper">
                  <div className="market-cap-info">
                    M.CAP: $
                    <span className="amount">{formatStringForMKTCAP(getDefaultPrice(marketCap, activeCoin))}</span>
                  </div>
                  <div>
                    | 24H VOL.: $
                    <span className="amount">{formatStringForMKTCAP(getDefaultPrice(volume24h, activeCoin))}</span>
                  </div>
                  <div>
                    <span className={`${priceChange24 < 0 ? 'minus_change' : 'plus_change'}`}>
                      {priceChange24 ? `${priceChange24 < 0 ? '' : '+'}${formatString(priceChange24, 2)}%` : '+0.00%'}
                    </span>
                  </div>
                </InfoWrapper>
                <div className="social-link-list">
                  <SocialLinkItems socialInfo={socialInfo} />
                </div>
              </CurrentInfo>
            )}
            {/* <InfoTab onClick={this.openDeliveryInfo} role="button" tabIndex={0}>
              <FormattedMessage id="currency_info_popup.physical_delivery" defaultMessage="PHYSICAL DELIVERY" />
            </InfoTab> */}
          </BaseCurrentInfo>
          {isOpenDelivery && (
            <div className="extra-info">
              <div className="tab-description">
                <p>
                  To arrange for the transfer of your bitcoin to your registered broker, please contact customer service
                  to assist with arranging the transfer of assets in your portfolio. Note: the transfer of your assets
                  must be prearranged and you will be required to enter a transaction number in order to complete the
                  authorized transfer. Your bitcoin wallet updates every 30 seconds, so the transfer of your portfolio
                  assets must occur within that time limitation. Our customer service department will assist you to
                  ensure your transfer occurs in a timely manner.
                </p>
              </div>
              <div className="delivery-actions">
                <Dropdown />
                <FormattedMessage
                  id="currency_info_popup.physical_delivery.placeholder_transaction_number"
                  defaultMessage="TRANSACTION NUMBER"
                >
                  {placeholder => <PopupInput className="transaction-input" placeholder={placeholder} />}
                </FormattedMessage>

                <div className="deliver-button">
                  <FormattedMessage id="currency_info_popup.physical_delivery.deliver" defaultMessage="DELIVER" />
                </div>
              </div>
            </div>
          )}
        </CurrentPopup>
      </DropdownWrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.INSTRUMENTS, STORE_KEYS.SETTINGSSTORE, STORE_KEYS.VIEWMODESTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.INSTRUMENTS]: {
        selectedInstrumentPair: [baseSymbol, quoteSymbol],
        baseCoinMap
      },
      [STORE_KEYS.SETTINGSSTORE]: { getDefaultPrice },
      [STORE_KEYS.VIEWMODESTORE]: { arbMode }
    }) => ({
      baseSymbol,
      quoteSymbol,
      getDefaultPrice,
      arbMode,
      baseCoinMap
    })
  )
)(CoinMetaDropdown);
