import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';
import { STORE_KEYS } from '@/stores';
import Spinner from '@/components-generic/Spinner';
import {
  Wrapper,
  SelectWrapper,
  TitleText,
  Selector,
  SearchWrapper,
  DropdownWrapper,
  StyleWrapper,
  SelectItem,
  TxtNoMatch
} from './styles';
import { DEALERS_URL } from '@/config/constants';

const Dropdown = ({ marketExchanges }) => {
  const [dropdownShow, setDropdownShow] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState(marketExchanges);
  const [loading, setLoading] = useState(false);

  const [exchange, setExchange] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch(DEALERS_URL)
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setBrokers(data.data);
        setFilteredBrokers(data.data);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    setFilteredExchanges(marketExchanges);
  }, [marketExchanges]);

  const isSearched = (item, query) => {
    const lowerCaseQuery = query.toString().toLowerCase();
    const srcStr = item.toString().toLowerCase();

    return srcStr.includes(lowerCaseQuery);
  };

  const onSelect = () => {
    setDropdownShow(!dropdownShow);
    setExchange(null);
  };

  const onClickExchange = item => {
    setSearchValue(null);
    setExchange(item);
    setSelectedItem(`${item} -`);
  };
  const onClickBroker = item => {
    setSearchValue(null);
    setSelectedItem(`${exchange} - ${item}`);
    setDropdownShow(false);
  };

  const handleChangeSearchValue = e => {
    const strSearch = (e && e.target && e.target.value) || '';

    if (exchange) {
      const filteredBrokers = !strSearch ? brokers : brokers.filter(broker => isSearched(broker[0], strSearch));
      setSearchValue(strSearch);
      setFilteredBrokers(filteredBrokers);
    } else {
      const filteredExchanges = !strSearch
        ? marketExchanges
        : marketExchanges.filter(exchange => isSearched(exchange.name, strSearch));
      setSearchValue(strSearch);
      setFilteredExchanges(filteredExchanges);
    }
  };

  const handleScroll = ({ scrollTop }) => {
    setScrollTop(scrollTop);
  };

  const brokerCellRenderer = width => ({ rowIndex }) => {
    const broker = filteredBrokers[rowIndex];

    if (!broker) {
      return;
    }

    return (
      <SelectItem key={rowIndex} width={width} onClick={() => onClickBroker(broker[0])}>
        {broker[0]}
      </SelectItem>
    );
  };

  const exchangeCellRenderer = width => ({ rowIndex }) => {
    const exchange = filteredExchanges[rowIndex];

    if (!exchange) {
      return;
    }

    return (
      <SelectItem key={rowIndex} width={width} onClick={() => onClickExchange(exchange.name)}>
        {exchange.name}
      </SelectItem>
    );
  };

  return (
    <Wrapper>
      <SelectWrapper>
        <Selector onClick={onSelect}>
          <TitleText>{selectedItem || 'Select Exchange and Broker'}</TitleText>
          <CaretArrowIcon fillColor="#454c73" />
        </Selector>
        {dropdownShow && (
          <DropdownWrapper>
            {
              <AutoSizer>
                {({ width, height }) => {
                  return (
                    <StyleWrapper width={width} height={height}>
                      {loading ? (
                        <Spinner />
                      ) : (
                        <PerfectScrollbar onScrollY={handleScroll}>
                          {filteredBrokers.length === 0 && (
                            <TxtNoMatch>Your search - {searchValue} - did not match any brokers</TxtNoMatch>
                          )}
                          <SearchWrapper>
                            <input
                              placeholder={exchange ? 'Search Broker' : 'Search Exchange'}
                              value={searchValue}
                              onChange={handleChangeSearchValue}
                            />
                          </SearchWrapper>
                          {exchange ? (
                            <Table
                              autoHeight
                              width={width}
                              height={height}
                              headerHeight={0}
                              disableHeader
                              rowCount={filteredBrokers.length}
                              rowGetter={({ index }) => filteredBrokers[index]}
                              rowHeight={50}
                              overscanRowCount={0}
                              scrollTop={scrollTop}
                            >
                              <Column dataKey="name" width={width} cellRenderer={brokerCellRenderer(width)} />
                            </Table>
                          ) : (
                            <Table
                              autoHeight
                              width={width}
                              height={height}
                              headerHeight={0}
                              disableHeader
                              rowCount={filteredExchanges.length}
                              rowGetter={({ index }) => filteredExchanges[index]}
                              rowHeight={50}
                              overscanRowCount={0}
                              scrollTop={scrollTop}
                            >
                              <Column dataKey="name" width={width} cellRenderer={exchangeCellRenderer(width)} />
                            </Table>
                          )}
                        </PerfectScrollbar>
                      )}
                    </StyleWrapper>
                  );
                }}
              </AutoSizer>
            }
          </DropdownWrapper>
        )}
      </SelectWrapper>
    </Wrapper>
  );
};

export default compose(
  inject(STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(({ [STORE_KEYS.EXCHANGESSTORE]: { marketExchanges } }) => ({
    marketExchanges
  }))
)(Dropdown);
