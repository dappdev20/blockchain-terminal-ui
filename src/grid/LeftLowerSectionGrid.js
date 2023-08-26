import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';
import { STORE_KEYS } from '@/stores';
import MarketOrderEntryForm from '@/components/OrderEntry/MarketOrder';
import LimitOrderEntryForm from '@/components/OrderEntry/LimitOrder';
import StopOrderEntryForm from '@/components/OrderEntry/StopOrder';
import SpotOrderEntryForm from '@/components/OrderEntry/SpotOrder';
import OrderTabs from '@/components/OrderTabs';
import OrderForm from '@/components/OrderForm';

const StyledLeftLowerSectionGrid = styled.div`
  grid-area: leftlowersection;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  border-radius: ${props => props.theme.palette.borderRadius};
  background: ${props => props.theme.palette.orderFormBg};
  border: 1px solid ${props => props.theme.palette.orderFormBorder};
`;

const BuySellOrderWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  height: calc(100% - 38px);
  width: 100%;

  & > * {
    width: 50%;
  }
`;

const ArbOrderWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  height: calc(100% - 38px);
  width: 100%;

  & > * {
    width: 100%;
  }
`;

const MARKET_LIST = [
  [
    <FormattedMessage id="grid.label_spot_price" defaultMessage="Spot Price" />,
    <FormattedMessage id="grid.label_market" defaultMessage="Market" />,
    <FormattedMessage id="grid.label_limit" defaultMessage="Limit" />,
    <FormattedMessage id="grid.label_stop" defaultMessage="Stop" />,
    <FormattedMessage id="grid.label_stop_limit" defaultMessage="Stop Limit" />
  ]
];

const MARKET_SUB_LIST = [
  <FormattedMessage id="grid.immediate_or_cancel" defaultMessage="Immediate or Cancel" />,
  <FormattedMessage id="grid.good_till_canceled" defaultMessage="Good Till Canceled" />,
  <FormattedMessage id="grid.good_till_date" defaultMessage="Good Till Date" />,
  <FormattedMessage id="grid.fill_or_kill" defaultMessage="Fill or Kill" />,
  <FormattedMessage id="grid.day_valid_till_utc" defaultMessage="Day (Valid till 00:00 UTC)" />
];

const LeftLowerSectionGrid = ({
  buyAmount,
  sellAmount,
  setUserDropDownOpen,
  setSettingsExchangeViewMode,
  setArbMode,
  setTradingViewMode,
  requestMarketTrading
}) => {
  // TODO refactoring: move to a separate method
  const showModal = side => () => {
    const amount = side === 'BUY' ? buyAmount : sellAmount;
    requestMarketTrading({ side, amount });
    setUserDropDownOpen(true);
    setSettingsExchangeViewMode(true);
  };

  const MarketTabs = () => {
    return (
      <OrderTabs
        tabs={MARKET_LIST}
        subtabs={MARKET_SUB_LIST}
        setArbMode={setArbMode}
        setTradingViewMode={setTradingViewMode}
      >
        <BuySellOrderWrapper id="buy-sell-wrapper-spot">
          <SpotOrderEntryForm showModal={showModal} />
        </BuySellOrderWrapper>

        <BuySellOrderWrapper id="buy-sell-wrapper-market">
          <MarketOrderEntryForm showModal={showModal} />
        </BuySellOrderWrapper>

        <BuySellOrderWrapper id="buy-sell-wrapper-limit">
          <LimitOrderEntryForm showModal={showModal} />
        </BuySellOrderWrapper>

        <BuySellOrderWrapper id="buy-sell-wrapper-stop">
          <StopOrderEntryForm showModal={showModal} />
        </BuySellOrderWrapper>

        <BuySellOrderWrapper id="buy-sell-wrapper-limit">
          <StopOrderEntryForm showModal={showModal} />
        </BuySellOrderWrapper>

        <ArbOrderWrapper id="buy-sell-wrapper-arb2">
          <OrderForm />
        </ArbOrderWrapper>
      </OrderTabs>
    );
  };

  return <StyledLeftLowerSectionGrid id="left-lower-section">{MarketTabs()}</StyledLeftLowerSectionGrid>;
};

export default compose(
  inject(STORE_KEYS.ORDERENTRY, STORE_KEYS.VIEWMODESTORE, [STORE_KEYS.MARKETMAKER]),
  observer,
  withProps(
    ({
      [STORE_KEYS.ORDERENTRY]: {
        LimitOrderFormBuy: { amount: buyAmount },
        LimitOrderFormSell: { amount: sellAmount }
      },
      [STORE_KEYS.VIEWMODESTORE]: { setUserDropDownOpen, setSettingsExchangeViewMode, setArbMode, setTradingViewMode },
      [STORE_KEYS.MARKETMAKER]: { requestMarketTrading }
    }) => ({
      buyAmount,
      sellAmount,
      setUserDropDownOpen,
      setSettingsExchangeViewMode,
      setArbMode,
      setTradingViewMode,
      requestMarketTrading
    })
  )
)(LeftLowerSectionGrid);
