import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import { currencyList } from '@/mock/currencies';
import { connectedExchanges } from '../MainTable/data';
import { InfoWrapper, DetailWrapper, DetailItem } from './styles';
import DropMenu from './DropMenu';

function TopMenu(props) {
  const { selectedExchanges, onExchangeChange, marketExchanges, portfolioData } = props;
  // const totalCurrencyData = connectedExchanges.map(ex => ex.pair.split('-')[0]);
  // const currencyData = ['All currencies', ...totalCurrencyData];
  const exchangeData = ['All exchanges', ...connectedExchanges.map(ex => ex.name)];
  return (
    <InfoWrapper>
      {/* <DropMenu data={currencyData} selectedItems={selectedCurrencies} onChange={onCurrencyChange} />
            <span className="label">On</span> */}
      <DropMenu data={exchangeData} selectedItems={selectedExchanges} onChange={onExchangeChange} />

      {/* <DropMenu totalBalenceDropdown data={totalCurrencyData} selectedItems={selectedTotalCurrency} onChange={onTotalCurrencyChange} /> */}
      <DetailWrapper>
        <DetailItem>
          <span>{portfolioData.length}</span>
          <span className="label">Crypto currencies</span>
        </DetailItem>
        <DetailItem>
          <span>{currencyList.length}</span>
          <span className="label">Fiat currencies</span>
        </DetailItem>
        <DetailItem>
          <span>{marketExchanges.length}</span>
          <span className="label">Exchanges</span>
        </DetailItem>
      </DetailWrapper>
    </InfoWrapper>
  );
}

const withStore = compose(
  inject(STORE_KEYS.EXCHANGESSTORE, STORE_KEYS.YOURACCOUNTSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.EXCHANGESSTORE]: { exchanges, marketExchanges, setExchangeActive },
      [STORE_KEYS.YOURACCOUNTSTORE]: { portfolioData }
    }) => ({
      exchanges,
      marketExchanges,
      setExchangeActive,
      portfolioData
    })
  )
);

export default withStore(TopMenu);
