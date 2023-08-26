import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { AutoSizer, Table, Column } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSafeTimeout } from '@hocs/safe-timers';

import { highlightSearchDom } from '@/utils';
import { SearchInputWrapper, SearchInput, ItemList, ListStyleWrapper, ListItem } from '../SelectDropdown/Components';
import { GeneralSearchIcon } from '@/components-generic/SvgIcon';

const Dropdown = styled.div`
  position: absolute;
  top: ${props => (props.alignTop ? `-${props.height + 1}px` : props.isChild ? '80px' : '100%')};
  ${props => (props.alignLeft ? 'left: -1px' : '')};
  ${props => (props.alignRight ? 'right: -1px' : '')};
  z-index: 100;
  width: ${props => (!props.alignLeft || !props.alignRight ? `${props.width}px` : 'unset')};
  height: ${props => props.height}px;
  left: 12px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: ${props => props.theme.palette.clrChartBackground};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  ${props => (props.hasBorder ? '' : props.alignTop ? 'border-bottom: 0' : 'border-top: 0')};
  border-radius: ${props =>
    props.hasBorder
      ? props.theme.palette.borderRadius
      : props.alignTop
      ? `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`
      : `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
  box-shadow: 2px 0 0 2px rgba(0, 0, 0, 0.2);
  font-size: 18px;

  &.mobile {
    position: ${props => (props.isMobileAbsolute ? 'absolute' : 'fixed')};
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: unset;
    height: unset;
    padding: 12px;
    font-size: 24px;

    &:before {
      content: '';
      position: absolute;
      left: 11px;
      top: 11px;
      right: 11px;
      bottom: 11px;
      border: 1px solid ${props => props.theme.palette.clrBorder};
      border-radius: ${props => props.theme.palette.borderRadius};
    }
  }

  &.fullscreen {
    position: fixed;
    left: 12px;
    top: 15px;
    bottom: 16px;
    width: calc(33% - 4px);
    min-width: 390px;
    height: unset !important;
  }
`;

class LanguageDropdown extends Component {
  state = {
    searchValue: '',
    tableItems: [],
    scrollTop: 0
  };

  searchValueRef = null;
  clearUpdateTableItemsTimeout = null;

  componentDidMount() {
    this.updateTableItems(this.props);

    this.props.setSafeTimeout(() => {
      if (this.searchValueRef) {
        this.searchValueRef.focus();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.updateTableItems(nextProps);
  }

  componentWillUnmount() {
    if (this.clearUpdateTableItemsTimeout) {
      this.clearUpdateTableItemsTimeout();
    }
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

  handleSelectItem = lang => {
    if (this.props.onChange) {
      this.props.onChange(lang);

      this.setState({
        searchValue: '',
        scrollTop: 0
      });

      this.props.toggleDropDown(false);

      if (this.clearUpdateTableItemsTimeout) {
        this.clearUpdateTableItemsTimeout();
      }
      this.clearUpdateTableItemsTimeout = this.props.setSafeTimeout(() => {
        this.updateTableItems();
      });
    }
  };

  isSearched = (item, query) => {
    const lowerCaseQuery = query.toString().toLowerCase();
    const srcStr = item.toString().toLowerCase();

    if (!query) {
      return 999;
    }

    const srcContains = srcStr.includes(lowerCaseQuery);
    const srcWeight = Math.abs(lowerCaseQuery.length - srcStr.length);

    return srcContains ? srcWeight : -1;
  };

  updateTableItems = propsInput => {
    const props = propsInput || this.props;
    let tableItems = [];
    if (props && props.items && props.items.length) {
      const items = props.items;
      for (let i = 0; i < items.length; i++) {
        const weight = this.isSearched(items[i].name, this.state.searchValue);

        if (weight >= 0) {
          tableItems.push({
            weight,
            value: items[i]
          });
        }
      }

      tableItems = sortBy(tableItems, item => item.weight).map(item => item.value);
    }

    this.setState({
      tableItems
    });
  };

  itemCellRenderer = ({ rowData }) => {
    const { value, isMobile } = this.props;
    const { searchValue } = this.state;

    const isSelected = rowData.name === value;
    return (
      <ListItem
        className={isSelected ? 'active' : ''}
        isMobile={isMobile}
        onClick={() => this.handleSelectItem(rowData.name)}
      >
        <img src={`/img/flags/${rowData.flag}`} alt="" />
        <div className="bigger">{highlightSearchDom(rowData.name, searchValue)}</div>
      </ListItem>
    );
  };

  render() {
    const { searchValue, tableItems, scrollTop } = this.state;
    const {
      w,
      h,
      isChild,
      hasBorder,
      alignTop,
      alignLeft,
      alignRight,
      isDisabled,
      isMobile,
      isMobileAbsolute
    } = this.props;

    return (
      <Dropdown
        width={w || 350}
        height={h}
        isChild={isChild}
        hasBorder={hasBorder}
        alignTop={alignTop}
        alignLeft={alignLeft}
        alignRight={alignRight}
        className={`${isMobile ? 'mobile' : 'fullscreen'}`}
        isMobileAbsolute={isMobileAbsolute}
      >
        <SearchInputWrapper isMobile={isMobile} isBigger>
          <GeneralSearchIcon isMobile={isMobile} />

          <FormattedMessage id="settings.search_placeholder" defaultMessage="Search...">
            {placeholder => (
              <SearchInput
                isBigger
                ref={ref => (this.searchValueRef = ref)}
                value={searchValue}
                readOnly={isDisabled}
                onChange={this.handleChangeSearchValue}
                isMobile={isMobile}
                placeholder={placeholder}
              />
            )}
          </FormattedMessage>
        </SearchInputWrapper>

        <ItemList>
          <AutoSizer>
            {({ width, height }) => (
              <ListStyleWrapper width={width} height={height} isMobile={isMobile} length={tableItems.length}>
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    minScrollbarLength: 50
                  }}
                  onScrollY={this.handleScroll}
                >
                  <Table
                    autoHeight
                    width={width}
                    height={height}
                    headerHeight={0}
                    disableHeader
                    rowCount={tableItems.length}
                    rowGetter={({ index }) => tableItems[index]}
                    rowHeight={isMobile ? 80 : 60}
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
      </Dropdown>
    );
  }
}

export default withSafeTimeout(LanguageDropdown);
