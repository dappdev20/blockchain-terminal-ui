import React, { Component, createRef } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { withSafeTimeout } from '@hocs/safe-timers';
import SettingsMenu from '@/components/SettingsMenu';
import CoinIcon from '@/components-generic/CoinIcon';
import { RightExchDropdownSearchIcon, SearchCloseIcon } from '@/components-generic/SvgIcon';
import AutoConvertSlider from '../AutoConvertSlider';
import CoinName from '../CoinName';
import { XIGNITE_DATA } from '@/mock/xignite-data';
import DonutChart from '../DonutChart';
import DataLoader from '@/components-generic/DataLoader';
import OrderBook from '@/components/OrderBook';
import {
  Wrapper,
  Dropdown,
  ExchDropdownList,
  ItemButtonWrapper,
  NoMatch,
  RightExchDropdownWrapper,
  Search,
  SearchIconWrapper,
  CloseIconWrapper,
  SelectedIconWrapper,
  SearchInput,
  StyleWrapper,
  PopoverWrapper,
  TopMenu,
  MenuItem,
  MenuDivider,
  DropdownMenu,
  CoinsWrapper,
  OrderBookWrapper,
  Coins,
  CoinLabel,
  CoinWrapper
} from './styles';
import { STORE_KEYS } from '@/stores';
import { MODE_KEYS } from '@/config/constants';
import { getTableItems } from './utils';

const ROW_HEIGHT = 62;
const filterInfo = XIGNITE_DATA.slice(0);
filterInfo.unshift({ name: 'All' });

class CoinsList extends Component {
  state = {
    searchInputValue: '',
    storedInputValue: '',
    tableItems: [],
    isTableLoaded: false,
    scrollTop: 0,
    selectedValue: '',
    coinSymbolMaxLength: 4,
    isFilterOpened: true,
    selectedCoinData: undefined,
    isEditing: true,
    filterItem: 'All',
    isTrading: false,
    isFocused: false,
    isFirstLoad: true,
    isOrderBookTimedOut: false
  };

  wrapperRef = createRef();
  searchInputRef = createRef();

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {
      timestamp: nextProps.timestamp
    };

    if (nextProps.isOrderBookTimedOut !== prevState.isOrderBookTimedOut && nextProps.isOrderBookTimedOut) {
      newState.searchInputValue = '';
      newState.storedInputValue = '';
      newState.selectedValue = '';
      newState.isFocused = false;
      newState.isEditing = false;
      newState.isFilterOpened = false;
      newState.selectedCoinData = undefined;
      newState.isOrderBookTimedOut = true;
    }

    if (prevState.timestamp !== nextProps.timestamp) {
      newState.tableItems = getTableItems(nextProps, prevState);
    }

    return newState;
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    if (this.clearScrollTopTimeout) {
      this.clearScrollTopTimeout();
    }
  }

  onChangeSearchInputValue = e => {
    const { filterItem, selectedValue } = this.state;
    const searchInputValue = e.target.value;
    const tableItems = getTableItems(this.props, {
      searchInputValue,
      filterItem,
      selectedValue
    });
    this.setState(
      {
        searchInputValue,
        scrollTop: 0,
        tableItems,
        isFilterOpened: false
      },
      () => {
        if (searchInputValue && this.overscanStopIndex) {
          this.onRowsRendered({
            overscanStartIndex: this.overscanStartIndex,
            overscanStopIndex: this.overscanStopIndex
          });
        }
      }
    );

    if (this.scrollRef) {
      this.scrollRef.scrollTop = 0;
    }
  };

  onSelectItem = value => {
    const { setSelectedCoin, onChange, setStockMode } = this.props;

    let symbol = '';

    if (value && value.stock) {
      symbol = value.symbol;
      setStockMode(true);
    } else {
      symbol = value && value.fiat ? value.symbol : value;
      setStockMode(false);
    }

    onChange(symbol);

    this.setState({
      selectedValue: symbol,
      searchInputValue: '',
      storedInputValue: '',
      isOrderBookTimedOut: false
    });

    setSelectedCoin(symbol);
    this.setState({ isEditing: false });
    this.toggleDropdown();
  };

  handleScroll = ({ scrollTop }) => {
    this.setState({ scrollTop });
  };

  handleClickOutside = event => {
    if (this.props.isOpen && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      const qrCodePortal = document.getElementById('qr-code-portal');
      if (qrCodePortal && qrCodePortal.contains(event.target)) {
        return;
      }

      if (!this.props.isMyPortfolio) {
        this.toggleDropdown();
      }
    }
  };

  scrollTop = (duration = 300) => {
    if (duration > 0) {
      const difference = this.state.scrollTop;
      const perTick = (difference / duration) * 50;

      if (this.clearScrollTopTimeout) {
        this.clearScrollTopTimeout();
      }
      this.clearScrollTopTimeout = this.props.setSafeTimeout(() => {
        this.setState(prevState => ({ scrollTop: prevState.scrollTop - perTick }));
        if (this.scrollRef) {
          this.scrollRef.scrollTop = this.state.scrollTop;
        }

        this.scrollTop(duration - 10);
      }, 10);
    }
  };

  toggleDropdown = () => {
    const { setCoinListOpen, openDropList, closeDropList, isOpen } = this.props;

    setCoinListOpen(!isOpen);
    if (isOpen) {
      closeDropList();
    } else {
      openDropList();
    }

    if (isOpen) {
      if (this.scrollRef) {
        this.scrollRef.scrollTop = 0;
      }
      this.setState({
        scrollTop: 0
      });
    }

    this.closeFilterDropDown();
  };

  onMouseEnterItem = rowData => {
    const { setActiveCoin, setHoverPortfolio } = this.props;
    const symbol = rowData && rowData.symbol ? rowData.symbol : '';

    if (rowData.position > 0) {
      setActiveCoin(symbol);
      setHoverPortfolio(true);
    }
  };

  onMouseLeaveItem = () => {
    this.props.setActiveCoin('F:USD');
    this.props.setHoverPortfolio(false);
  };

  onCellClick = data => () => {
    this.setState({ selectedCoinData: data });
    this.onSelectItem(data && (data.fiat || data.stock) ? data : data.symbol);
  };

  cellRenderer = ({ /* rowIndex, */ rowData }) => {
    const { defaultFiat, selectedCoin } = this.props;
    const { searchInputValue, coinSymbolMaxLength, isFocused, selectedCoinData } = this.state;
    const { position, symbol, enabled } = rowData;
    if (!rowData) {
      return;
    }
    const className = `${!enabled ? 'disabled' : ''}`;
    const isReadableActive = position > 0.01;

    // const balanceAmount = rowData.fiat ? rowData.position : rowData.usdValue;
    // const balance = balanceAmount ? formatString(rowData.position, 2) : '';

    return (
      <ItemButtonWrapper
        className={className}
        isReadableActive={isReadableActive}
        selected={symbol === selectedCoin}
        isFocused={isFocused}
        selectedCoinData={selectedCoinData}
        onClick={this.onCellClick(rowData)}
      >
        <CoinIcon value={rowData} defaultFiat={defaultFiat} size={37} />
        <CoinName
          value={rowData}
          search={searchInputValue}
          defaultFiat={defaultFiat}
          coinSymbolMaxLength={coinSymbolMaxLength}
          // isShowFull={isFocused}
          noLeftPadding
        />
      </ItemButtonWrapper>
    );
  };

  onRowsRendered = ({ overscanStartIndex, overscanStopIndex }) => {
    // Save values to use when search changes
    this.overscanStartIndex = overscanStartIndex;
    this.overscanStopIndex = overscanStopIndex;

    const { tableItems } = this.state;

    const visibleItems = tableItems.slice(overscanStartIndex, overscanStopIndex + 1);
    const maxLength = visibleItems.reduce((maxLength, item) => {
      if (item && item.symbol && item.symbol.length > maxLength) {
        return item.symbol.length;
      }
      return maxLength;
    }, 0);

    this.setState({
      coinSymbolMaxLength: maxLength,
      isTableLoaded: true
    });
  };

  openFilterDropDown = () => {
    this.setState({ isFilterOpened: true });
  };

  closeFilterDropDown = () => {
    this.setState({ isFilterOpened: false });
  };

  clearSearchInput = () => {
    const { closeDropList } = this.props;
    closeDropList();
    this.setState({
      searchInputValue: '',
      isFocused: false,
      selectedValue: '',
      selectedCoinData: undefined
    });
  };

  hideCurrencyInfo = () => {
    this.setState({ isEditing: true });
    if (this.searchInputRef && this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
    this.toggleDropdown();
  };

  handleFilter = filterItem => {
    const { searchInputValue, selectedValue } = this.state;
    const tableItems = getTableItems(this.props, {
      searchInputValue,
      filterItem,
      selectedValue
    });
    this.setState({
      tableItems,
      filterItem,
      isFilterOpened: false
    });
  };

  openLogoutModal = () => {
    this.props.setLogoutModalOpen(true);
    this.closeFilterDropDown();
  };

  onFocusInput = () => {
    const { openDropList } = this.props;
    const { storedInputValue } = this.state;
    openDropList();
    this.setState({
      isFocused: true,
      searchInputValue: storedInputValue
    });
  };

  onBlurInput = () => {
    const { closeDropList, rightBottomSectionOpenMode } = this.props;
    if (rightBottomSectionOpenMode !== MODE_KEYS.depthChartKey) {
      closeDropList();
    }

    setTimeout(() => {
      this.setState({
        isFocused: false
      });
    }, 300);
  };

  handleMouseLeaveSettings = e => {
    // IF related target is tooltip, it became window object otherwise it is dom element.
    if (e && e.relatedTarget !== window) {
      this.closeFilterDropDown();
    }
  };

  getCoinView = coin => {
    const { defaultFiat } = this.props;
    return (
      <Tooltip
        arrow
        animation="shift"
        position="top"
        theme="bct"
        title={`${coin.symbol.replace('F:', '').replace('S:', '')} (${coin.name})`}
        key={coin.symbol}
      >
        <CoinWrapper size={37} onClick={this.onCellClick(coin)}>
          <CoinIcon value={coin} defaultFiat={defaultFiat} size={37} />
        </CoinWrapper>
      </Tooltip>
    );
  };

  getCoinList = (coins, label) => (
    <CoinsWrapper>
      <CoinLabel>{label}</CoinLabel>
      <Coins>{coins.slice(0, 8).map(this.getCoinView)}</Coins>
      <Coins>{coins.slice(8, 16).map(this.getCoinView)}</Coins>
    </CoinsWrapper>
  );

  getDropdownList = () => {
    const { searchInputValue, tableItems, scrollTop, isFocused, isTableLoaded, filterItem } = this.state;
    const { isOpen, topCryptos, topFiats, topStocks, topBonds } = this.props;

    const filteredTableItems = filterItem === 'All' && !isFocused ? [] : tableItems;
    const cryptos = topCryptos; // _differenceBy(topCryptos, coinsInMyWallet, 'symbol');
    const fiats = topFiats; // _differenceBy(topFiats, coinsInMyWallet, 'symbol');
    const stocks = topStocks; // _differenceBy(topStocks, coinsInMyWallet, 'symbol');
    const bonds = topBonds; // _differenceBy(topBonds, coinsInMyWallet, 'symbol');

    return (
      <ExchDropdownList
        itemCount={filteredTableItems.length + 1}
        isSearching={searchInputValue}
        className="exch-dropdown__list"
        isOpen={isOpen}
      >
        <div
          className={`scroll__scrollup${scrollTop > 1 ? '' : ' hide'}`}
          onClick={() => this.scrollTop(300)}
          role="button"
          tabIndex={0}
        >
          <button className="scroll-up-button">
            <svg className="sprite-icon" role="img" aria-hidden="true">
              <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#arrow-up" />
            </svg>
          </button>
        </div>

        <AutoSizer>
          {({ width, height }) => (
            <StyleWrapper width={width - 2} height={height - 2}>
              <PerfectScrollbar
                containerRef={ref => {
                  this.scrollRef = ref;
                }}
                options={{ suppressScrollX: true, minScrollbarLength: 50 }}
                onScrollY={this.handleScroll}
              >
                {isFocused && isTableLoaded && filteredTableItems.length === 0 && (
                  <NoMatch>your search - {searchInputValue} - did not match any currencies</NoMatch>
                )}

                <Table
                  autoHeight={true}
                  width={width}
                  height={height}
                  headerHeight={0}
                  disableHeader={true}
                  rowCount={filteredTableItems.length}
                  rowGetter={({ index }) => filteredTableItems[index]}
                  rowHeight={ROW_HEIGHT}
                  overscanRowCount={0}
                  id="wallet-table"
                  scrollTop={scrollTop}
                  onRowsRendered={this.onRowsRendered}
                  onRowMouseOver={({ rowData }) => this.onMouseEnterItem(rowData)}
                  onRowMouseOut={() => this.onMouseLeaveItem()}
                >
                  <Column dataKey="name" width={width} cellRenderer={this.cellRenderer} />
                </Table>

                {filterItem === 'All' && !isFocused && (
                  <>
                    {cryptos.length > 0 && this.getCoinList(cryptos, 'Coins')}
                    {fiats.length > 0 && this.getCoinList(fiats, 'Forex')}
                    {stocks.length > 0 && this.getCoinList(stocks, 'Stocks')}
                    {bonds.length > 0 && this.getCoinList(bonds, 'Bonds')}
                  </>
                )}
              </PerfectScrollbar>
            </StyleWrapper>
          )}
        </AutoSizer>
      </ExchDropdownList>
    );
  };

  handleTrading = isTrading => {
    this.setState({ isTrading });
  };

  renderFilterItem = ({ item, isDisable }) => (
    <MenuItem
      onClick={() => this.handleFilter(item.name)}
      isActive={this.state.filterItem === item.name}
      isDisable={isDisable}
    >
      {item.name}
    </MenuItem>
  );

  getSearchInput = () => {
    const {
      searchInputValue,
      isFilterOpened,
      selectedCoinData,
      isEditing,
      isTrading,
      isFocused,
      isFirstLoad
    } = this.state;
    const { slidersHash, arbMode } = this.props;
    const coinSymbol = selectedCoinData ? selectedCoinData.symbol.replace('F:', '').replace('S:', '') : '';
    const coinName = selectedCoinData ? selectedCoinData.name : '';

    const coin = selectedCoinData ? selectedCoinData.symbol : '';
    const maxSlide = slidersHash[coin] ? slidersHash[coin].maxSlider : 0;
    const amount = slidersHash[coin] ? slidersHash[coin].valueSlider : 0;

    const percentage = maxSlide ? ((amount / maxSlide) * 100).toFixed(2) : 0;

    const { selectedBase, selectedQuote } = this.props;
    const { bids, asks } = this.props;

    if (selectedBase && selectedQuote && bids.length && asks.length && isFirstLoad) {
      setTimeout(() => {
        this.setState({
          isFirstLoad: false,
          isFilterOpened: false
        });
      }, 2000);
    }

    const FilterItem = this.renderFilterItem;

    return (
      <Search onMouseLeave={this.handleMouseLeaveSettings}>
        {selectedCoinData && !isEditing && (
          <SelectedIconWrapper isOpen onClick={this.hideCurrencyInfo}>
            {coinSymbol}
            <span>{coinName}</span>
          </SelectedIconWrapper>
        )}

        <SearchInput
          id="search-input"
          type="text"
          value={searchInputValue}
          onChange={this.onChangeSearchInputValue}
          onFocus={this.onFocusInput}
          onBlur={this.onBlurInput}
          ref={this.searchInputRef}
          isFocused={isFocused}
          placeholder="SEARCH ALL EXCHANGES"
          onMouseEnter={this.closeFilterDropDown}
        />

        {selectedCoinData && !isEditing && isTrading && <DonutChart percentage={percentage} />}

        <SearchIconWrapper>
          <RightExchDropdownWrapper isFocused={isFocused} onMouseEnter={this.openFilterDropDown}>
            <RightExchDropdownSearchIcon />
          </RightExchDropdownWrapper>
          <PopoverWrapper isOpen={isFilterOpened} isFirstLoad={isFirstLoad}>
            <TopMenu>
              <FilterItem item={filterInfo[0]} />
              <FilterItem item={filterInfo[1]} />
              <FilterItem item={filterInfo[2]} />
              <FilterItem item={filterInfo[3]} />
              <Dropdown>
                <MenuItem>•••</MenuItem>
                <DropdownMenu>
                  <FilterItem item={filterInfo[4]} isDisable />
                  <FilterItem item={filterInfo[5]} isDisable />
                  <FilterItem item={filterInfo[6]} isDisable />
                  <FilterItem item={filterInfo[7]} isDisable />
                </DropdownMenu>
              </Dropdown>
              <MenuDivider />
              <MenuItem onClick={this.openLogoutModal}>Logout</MenuItem>
            </TopMenu>
            {isFirstLoad ? (
              <OrderBookWrapper>
                {selectedBase && selectedQuote ? <OrderBook /> : <DataLoader width={100} height={100} />}
              </OrderBookWrapper>
            ) : (
              <SettingsMenu onClose={this.closeFilterDropDown} isOpen={isFilterOpened} />
            )}
          </PopoverWrapper>
        </SearchIconWrapper>

        {(selectedCoinData || isFocused) && (
          <CloseIconWrapper
            onClick={() => this.clearSearchInput()}
            isEmpty={(amount === 0 && selectedCoinData) || isFocused}
          >
            <SearchCloseIcon />
          </CloseIconWrapper>
        )}

        {selectedCoinData && !isEditing && !arbMode && (
          <AutoConvertSlider
            coin={coin}
            disabled={false}
            color={selectedCoinData.hex}
            handleTrading={this.handleTrading}
          />
        )}
      </Search>
    );
  };

  render() {
    const { isOpen } = this.props;

    return (
      <Wrapper isOpen={isOpen} ref={this.wrapperRef} role="button" tabIndex={0}>
        {this.getSearchInput()}
        {this.getDropdownList()}
      </Wrapper>
    );
  }
}

const enhanced = compose(
  withSafeTimeout,
  inject(
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.FIATCURRENCYSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.TRADINGVIEWSTORE,
    STORE_KEYS.AUTOSLIDERSTORE,
    STORE_KEYS.CONVERSIONAUTOSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.ORDERBOOKBREAKDOWN
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, isShortSell },
      [STORE_KEYS.VIEWMODESTORE]: { setLogoutModalOpen, arbMode, rightBottomSectionOpenMode },
      [STORE_KEYS.FIATCURRENCYSTORE]: { setStockMode },
      [STORE_KEYS.YOURACCOUNTSTORE]: { setSelectedCoin, selectedCoin, coinsInMyWallet },
      [STORE_KEYS.TRADINGVIEWSTORE]: { setCoinListOpen },
      [STORE_KEYS.AUTOSLIDERSTORE]: { slidersHash },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { setActiveCoin, setHoverPortfolio },
      [STORE_KEYS.INSTRUMENTS]: { selectedBase, selectedQuote, topCryptos, topFiats, topStocks, topBonds },
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { bids, asks, isOrderBookTimedOut }
    }) => ({
      setStockMode,
      setSelectedCoin,
      selectedCoin,
      coinsInMyWallet,
      setCoinListOpen,
      defaultFiat,
      isShortSell,
      rightBottomSectionOpenMode,
      setActiveCoin,
      setHoverPortfolio,
      setLogoutModalOpen,
      arbMode,
      slidersHash,
      selectedBase,
      selectedQuote,
      bids,
      asks,
      isOrderBookTimedOut,
      topCryptos,
      topFiats,
      topStocks,
      topBonds
    })
  )
);
export default enhanced(CoinsList);
