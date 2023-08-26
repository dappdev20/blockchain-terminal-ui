import React from 'react';
import { STORE_KEYS } from '@/stores';
import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import LeftLowerSectionGrid from '@/grid/LeftLowerSectionGrid';
import CoinSelect from '@/components/CoinSelect';
import { AdvancedDropdownGrid, OrderBookWrapper, ScanContainer, ScanIcon } from './styles';
import OrderBook from '@/components/OrderBook';
import DataLoader from '@/components-generic/DataLoader';
import { MODE_KEYS } from '@/config/constants';

const OrderBookRecentTradesContainer = ({
  isMobileDevice,
  isUserDropDownOpen,
  isLoggedIn,
  selectedBase,
  selectedQuote,
  rightBottomSectionOpenMode
}) => {
  const isDepthChart = rightBottomSectionOpenMode === MODE_KEYS.depthChartKey;
  return (
    <AdvancedDropdownGrid
      lowerSectionClosed={false}
      isMobileDevice={isMobileDevice}
      isUserDropDownOpen={isUserDropDownOpen}
      isLoggedIn={isLoggedIn}
    >
      {isLoggedIn && <CoinSelect />}

      {(!isLoggedIn || isDepthChart) && (
        <OrderBookWrapper>
          {selectedBase && selectedQuote ? <OrderBook /> : <DataLoader width={100} height={100} />}
        </OrderBookWrapper>
      )}

      <LeftLowerSectionGrid />

      {isMobileDevice && (
        <ScanContainer>
          <ScanIcon className="off" />
          <ScanIcon className="on" />
          <ScanIcon className="off" />
        </ScanContainer>
      )}
    </AdvancedDropdownGrid>
  );
};

export default withOrderFormToggleData(stores => {
  const {
    [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
    [STORE_KEYS.VIEWMODESTORE]: { rightBottomSectionOpenMode }
  } = stores;
  return {
    isLoggedIn,
    rightBottomSectionOpenMode
  };
})(OrderBookRecentTradesContainer);
