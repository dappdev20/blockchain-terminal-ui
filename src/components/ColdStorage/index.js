import React, { useState, Suspense } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import DataLoader from '@/components-generic/DataLoader';
import Bills from './Bills';
import BillDetailPop from './BillDetailPop';
import { OuterWrapper } from './styles';
import { STORE_KEYS } from '@/stores';

const ColdStorage = ({ getBTCBalanceOf, totalBTCAmount, withdrawAddress, isHoverPortfolio, activeCoin }) => {
  const balance = !isHoverPortfolio ? totalBTCAmount : getBTCBalanceOf(activeCoin);

  const [selectedBill, setSelectedBill] = useState(null);

  // Todo: Bill data is not coming from BE, showing UserID atm.
  const ownerId = localStorage.getItem('authClientId');

  function handleShowBillDetail(level, index, disabled) {
    setSelectedBill({ level, index, disabled });
  }

  function handleHideBillDetail() {
    setSelectedBill(null);
  }

  return (
    <Suspense fallback={null}>
      <OuterWrapper>
        <Bills balance={balance} onShowBillDetail={handleShowBillDetail} />
        {selectedBill && (
          <BillDetailPop
            disabled={selectedBill.disabled}
            level={selectedBill.level}
            withdrawAddress={withdrawAddress}
            ownerId={ownerId}
            onClose={handleHideBillDetail}
          />
        )}
        {balance === 0 && <DataLoader width={200} height={200} />}
      </OuterWrapper>
    </Suspense>
  );
};

const withStore = compose(
  inject(STORE_KEYS.PORTFOLIOSTORE, STORE_KEYS.SETTINGSSTORE, STORE_KEYS.CONVERSIONAUTOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.PORTFOLIOSTORE]: { getBTCBalanceOf, totalBTCAmount },
      [STORE_KEYS.SETTINGSSTORE]: { withdrawAddress },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { isHoverPortfolio, activeCoin }
    }) => ({
      getBTCBalanceOf,
      totalBTCAmount,
      withdrawAddress,
      isHoverPortfolio,
      activeCoin
    })
  )
);

export default withStore(ColdStorage);
