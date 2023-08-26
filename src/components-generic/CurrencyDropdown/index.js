import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { compose, withProps } from 'recompose';
import sortBy from 'lodash/sortBy';
import { AutoSizer, Table, Column } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSafeTimeout } from '@hocs/safe-timers';
import { STORE_KEYS } from '@/stores';
import { highlightSearchDom } from '@/utils';
import { SearchInputWrapper, SearchInput, ItemList, ListStyleWrapper, ListItem } from '../SelectDropdown/Components';
import CoinIcon from '@/components-generic/CoinIcon';
import { GeneralSearchIcon } from '@/components-generic/SvgIcon';
import KeyModal from '@/components/Modals/KeyModal';
import { currencyList } from '../../mock/currencies';
import { Dropdown } from './styles';

class CurrencyDropdown extends Component {
  state = {
    searchValue: '',
    tableItems: [],
    scrollTop: 0,
    isKeyModalOpen: false
  };

  searchValueRef = null;

  dropdownScrollRef = null;

  clearUpdateTableItemsTimeout = null;

  componentDidMount() {
    this.updateTableItems();

    this.props.setSafeTimeout(() => {
      if (this.searchValueRef) {
        this.searchValueRef.focus();
      }
    });
  }

  handleScroll = ({ scrollTop }) => {
    this.setState({ scrollTop });
  };

  handleChangeSearchValue = e => {
    this.setState({
      searchValue: (e && e.target && e.target.value) || ''
    });

    if (this.clearUpdateTableItemsTimeout) {
      this.clearUpdateTableItemsTimeout();
    }
    this.clearUpdateTableItemsTimeout = this.props.setSafeTimeout(this.updateTableItems);
  };

  handleSelectItem = (currency, symbol, price, isDefaultCrypto, disableCrypto) => () => {
    if (isDefaultCrypto && symbol !== 'BTC') {
      this.toggleKeyModal(true);
      return;
    }

    if (!disableCrypto) {
      const { setDefaultCurrency, onChange } = this.props;

      if (onChange) {
        onChange(currency, symbol, price, isDefaultCrypto);
      }

      setDefaultCurrency(currency, symbol, price, isDefaultCrypto);

      this.setState({ searchValue: '' });
    }

    this.props.toggleDropDown(false);
  };

  toggleKeyModal = isKeyModalOpen => {
    this.setState(prevState => ({
      isKeyModalOpen: typeof isKeyModalOpen === 'boolean' ? isKeyModalOpen : !prevState.isKeyModalOpen
    }));
  };

  isCryptoSearched = (item, query) => {
    const lowerCaseQuery = query.toLowerCase();
    let symbolSrcStr;
    let nameSrcStr;

    try {
      symbolSrcStr = (item.Coin && item.Coin.length ? item.Coin : '')
        .replace('S:', '')
        .replace('F:', '')
        .toLowerCase();
      nameSrcStr = (item.Name && item.Name.length ? item.Name : '').toLowerCase();
    } catch (e) {
      return -1;
    }

    if (!query) {
      return 999;
    }

    const symbolContains = symbolSrcStr.includes(lowerCaseQuery);
    const nameContains = nameSrcStr.includes(lowerCaseQuery);

    const symbolWeight = Math.abs(lowerCaseQuery.length - symbolSrcStr.length);
    const nameWeight = Math.abs(lowerCaseQuery.length - nameSrcStr.length);

    let weight = -1;

    if (symbolContains) {
      weight = symbolWeight;
    }

    if (nameContains) {
      weight = weight < nameWeight && weight !== -1 ? weight : nameWeight;
    }

    return weight;
  };

  isSearched = (item, query) => {
    const lowerCaseQuery = query.toLowerCase();
    let codeSrcStr;
    let nameSrcStr;

    try {
      codeSrcStr = (item.code && item.code.length ? item.code : '').toLowerCase();
      nameSrcStr = (item.name && item.name.length ? item.name : '').toLowerCase();
    } catch (e) {
      return -1;
    }

    if (!query) {
      return 999;
    }

    const symbolContains = codeSrcStr.includes(lowerCaseQuery);
    const nameContains = nameSrcStr.includes(lowerCaseQuery);

    const symbolWeight = Math.abs(lowerCaseQuery.length - codeSrcStr.length);
    const nameWeight = Math.abs(lowerCaseQuery.length - nameSrcStr.length);

    let weight = -1;

    if (symbolContains) {
      weight = symbolWeight;
    }

    if (nameContains) {
      weight = weight < nameWeight && weight !== -1 ? weight : nameWeight;
    }

    return weight;
  };

  updateTableItems = () => {
    const { searchValue } = this.state;
    const { type } = this.props;

    let activeOptionIdx = 0;
    let tableItems = [];
    if (type !== 'crypto' && currencyList && currencyList.length) {
      const items = currencyList;
      for (let i = 0; i < items.length; i++) {
        const weight = this.isSearched(items[i], searchValue);

        if (weight >= 0) {
          tableItems.push({
            weight,
            isCrypto: false,
            value: items[i]
          });
        }
      }

      tableItems = sortBy(tableItems, item => item.weight).map(item => ({
        ...item.value,
        isCrypto: false
      }));

      activeOptionIdx = tableItems.findIndex(item => item.code === this.props.value);
    }

    let cryptoTable = [];
    if (type !== 'fiat' && this.props.portfolioData && this.props.portfolioData.length) {
      const portfolioData = this.props.portfolioData;
      for (let i = 0; i < portfolioData.length; i++) {
        try {
          const weight = this.isCryptoSearched(portfolioData[i], searchValue);
          const obj = {
            weight,
            isCrypto: true,
            value: portfolioData[i]
          };
          if (weight >= 0) {
            cryptoTable.push(obj);
          }
        } catch (e) {
          console.log(e);
        }
      }
      activeOptionIdx = 0;

      // Move BTC to the front
      const BTCRecord = cryptoTable.find(item => item.value.Coin === 'BTC');
      cryptoTable = cryptoTable.filter(item => item.value.Coin !== 'BTC');
      cryptoTable.unshift(BTCRecord);
    }

    this.setState({ tableItems: cryptoTable.concat(tableItems) }, () => {
      this.dropdownScrollRef.scrollTop = activeOptionIdx * 60;
    });
  };

  itemCellRenderer = ({ rowData: row }) => {
    let rowData = row;
    const { value, disableCrypto } = this.props;
    const { searchValue } = this.state;

    if (rowData.isCrypto) {
      rowData = rowData.value;
      const isSelected = rowData.Name === value;
      const coinSymbol = rowData.Coin.replace('S:', '').replace('F:', '');
      return (
        <ListItem
          className={isSelected ? 'active' : ''}
          onClick={this.handleSelectItem(rowData.Name, coinSymbol, rowData.Price || 0, true, disableCrypto)}
          onMouseLeave={() => this.toggleKeyModal(false)}
        >
          <CoinIcon value={coinSymbol} size={28} />
          &nbsp;&nbsp;
          <div className="bigger">
            {highlightSearchDom(rowData.Coin.replace('S:', '').replace('F:', ''), searchValue)} -{' '}
            {highlightSearchDom(rowData.Name, searchValue)}
          </div>
        </ListItem>
      );
    }

    const isSelected = rowData.code === value;
    const STRING_LENGTH_THRESHOLD = 30;
    const itemString = `${rowData.symbol} - ${rowData.code} ${rowData.name}`;
    const isStringOverThreshold = itemString.length > STRING_LENGTH_THRESHOLD;

    return (
      <ListItem
        className={isSelected ? 'active' : ''}
        isLongString={isStringOverThreshold}
        onClick={this.handleSelectItem(rowData.code, rowData.symbol, 1, false, false)}
      >
        <img src={`/img/icons-coin/${rowData.code.toLowerCase()}.png`} className="flag" alt="" />
        <div className="bigger">
          <span className="list-item">
            {highlightSearchDom(rowData.symbol, searchValue)} - {highlightSearchDom(rowData.code, searchValue)} (
            {highlightSearchDom(rowData.name, searchValue)})
          </span>
        </div>
      </ListItem>
    );
  };

  render() {
    const { searchValue, tableItems, scrollTop, isKeyModalOpen } = this.state;
    const { type } = this.props;

    return (
      <Dropdown>
        {type !== 'crypto' && (
          <SearchInputWrapper isBigger>
            <GeneralSearchIcon />
            <FormattedMessage id="settings.search_placeholder" defaultMessage="Search...">
              {placeholder => (
                <SearchInput
                  isBigger
                  ref={ref => (this.searchValueRef = ref)}
                  value={searchValue}
                  onChange={this.handleChangeSearchValue}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </SearchInputWrapper>
        )}

        <ItemList>
          <AutoSizer>
            {({ width, height }) => (
              <ListStyleWrapper width={width} height={height} length={tableItems.length}>
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    minScrollbarLength: 50
                  }}
                  onScrollY={this.handleScroll}
                  containerRef={ref => (this.dropdownScrollRef = ref)}
                >
                  <Table
                    autoHeight
                    width={width}
                    height={height}
                    headerHeight={0}
                    disableHeader
                    rowCount={tableItems.length}
                    rowGetter={({ index }) => tableItems[index]}
                    rowHeight={60}
                    overscanRowCount={0}
                    scrollTop={scrollTop}
                  >
                    <Column width={width} dataKey="Dropdown" cellRenderer={this.itemCellRenderer} />
                  </Table>
                </PerfectScrollbar>
              </ListStyleWrapper>
            )}
          </AutoSizer>
        </ItemList>
        <KeyModal toggleModal={this.toggleKeyModal} hoverMode inLineMode isModalOpen={isKeyModalOpen} />
      </Dropdown>
    );
  }
}

const enhanced = compose(
  withSafeTimeout,
  inject(STORE_KEYS.YOURACCOUNTSTORE, STORE_KEYS.SETTINGSSTORE),
  observer,
  withProps(
    ({ [STORE_KEYS.YOURACCOUNTSTORE]: { portfolioData }, [STORE_KEYS.SETTINGSSTORE]: { setDefaultCurrency } }) => ({
      portfolioData,
      setDefaultCurrency
    })
  )
);

export default enhanced(CurrencyDropdown);
