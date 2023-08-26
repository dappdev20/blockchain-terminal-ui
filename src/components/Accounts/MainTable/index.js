import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import { Checkbox } from '@/components-generic/Icons';
import {
  ContentWrapper,
  LeftAccount,
  Main,
  MainTable,
  MainTableCon,
  CreateAccount,
  ExchangesWrapper,
  AccountCell,
  APICell,
  LogoWrapper,
  Logo,
  EmptyData
} from './styles';
import ActiveTable from './ActiveTable';

function MainContent(props) {
  const mockApiRenderer = rowData => {
    const { exchanges, setExchangeActive } = props;
    let isActive = false;
    if (exchanges && exchanges[rowData.name]) {
      isActive = exchanges[rowData.name].active;
    }

    return (
      <APICell className="api-cell">
        <Checkbox size={30} active={isActive} onClick={() => setExchangeActive(rowData.name, !isActive)} />
      </APICell>
    );
  };

  const { selectedTotalCurrency, marketExchanges, exchangeBalances } = props;
  const formattedExchangesData = exchangeBalances.map(ex => {
    const curEx = marketExchanges.find(marketEx => marketEx.name === ex.name);
    return {
      ...ex,
      ...curEx
    };
  });

  if (!formattedExchangesData.length) {
    return <EmptyData>There is no exchanges/balances data to display.</EmptyData>;
  }

  return (
    <ContentWrapper>
      <ActiveTable selectedTotalCurrency={selectedTotalCurrency} />
      <ExchangesWrapper>
        {formattedExchangesData.map((exchange, index) => (
          <Main key={index}>
            <LeftAccount>
              <AccountCell className="exchange-item">
                <LogoWrapper size={38}>
                  <Logo src={`/img/exchange/${exchange.icon}`} alt="" />
                </LogoWrapper>

                <span>{exchange.name}</span>
              </AccountCell>
              {mockApiRenderer(exchange)}
            </LeftAccount>
            <MainTable>
              {exchange.supportedTradingPair.map((tradingItem, index) => {
                const [base, quote] = tradingItem.pair.split('-');
                return (
                  <MainTableCon key={index}>
                    <div className="pair-base">{base}</div>
                    <div className="pair-quote">{quote}</div>
                    {/* 
                                            TODO: Might be added later from the BE
                                            <div className="RowNumber">{tradingItem.rate}</div>
                                            */}
                    <div className="RowNumber">{tradingItem.free}</div>
                    <div className="RowNumber">{tradingItem.reserved}</div>
                    <div className="RowNumber">{tradingItem.total}</div>
                    <div className="PayinImage">Trade</div>
                  </MainTableCon>
                );
              })}
            </MainTable>
          </Main>
        ))}
        <CreateAccount>
          <p className="CreateAccountCon">Create new account</p>
        </CreateAccount>
      </ExchangesWrapper>
    </ContentWrapper>
  );
}

const withStore = compose(
  inject(STORE_KEYS.EXCHANGESSTORE, STORE_KEYS.YOURACCOUNTSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.EXCHANGESSTORE]: { exchanges, marketExchanges, setExchangeActive },
      [STORE_KEYS.YOURACCOUNTSTORE]: { exchangeBalances }
    }) => ({
      exchanges,
      marketExchanges,
      setExchangeActive,
      exchangeBalances
    })
  )
);

export default withStore(MainContent);
