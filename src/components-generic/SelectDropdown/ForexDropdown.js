import React, { createRef } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSafeTimeout } from '@hocs/safe-timers';

import {
  DropdownWrapper,
  SelectedItemLabel,
  Dropdown,
  ItemList,
  ListStyleWrapper,
  ListItem3,
  DropMenuIcon
} from './Components';
import COIN_DATA_MAP from '../../mock/coin-data-map';

class ForexDropdown extends React.Component {
  state = {
    isOpen: false,
    scrollTop: 0,
    tableItems: []
  };

  wrapperRef = createRef();

  clearUpdateTableItemsTimeout = null;
  clearFocusTimeout = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.updateTableItems();
  }

  componentWillReceiveProps() {
    this.updateTableItems();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    if (this.clearUpdateTableItemsTimeout) {
      this.clearUpdateTableItemsTimeout();
    }
    if (this.clearFocusTimeout) {
      this.clearFocusTimeout();
    }
  }

  handleClickOutside = event => {
    const { current } = this.wrapperRef;
    if (this.state.isOpen && current && !current.contains(event.target)) {
      this.setState({
        isOpen: false
      });
    }
  };

  toggleDropDown = isOpen => {
    this.setState(prevState => ({
      isOpen: typeof isOpen === 'boolean' ? isOpen : !prevState.isOpen
    }));

    if (this.clearFocusTimeout) {
      this.clearFocusTimeout();
    }
  };

  handleScroll = ({ scrollTop }) => {
    this.setState({ scrollTop });
  };

  handleSelectItem = rowData => {
    if (this.props.onChange) {
      this.props.onChange(rowData);

      this.setState({
        scrollTop: 0
      });

      this.toggleDropDown(false);

      if (this.clearUpdateTableItemsTimeout) {
        this.clearUpdateTableItemsTimeout();
      }
      this.props.setSafeTimeout(() => {
        this.updateTableItems();
      });
    }

    if (this.props.onSelect) {
      this.props.onSelect(rowData);
    }
  };

  updateTableItems = () => {
    const tableItems = Object.values(COIN_DATA_MAP).filter(coin => coin.fiat);

    this.setState({
      tableItems
    });
  };

  itemCellRenderer = ({ rowData }) => {
    const symbol = (rowData.symbol || '').replace('S:', '').replace('F:', '');
    const isSelected = symbol === this.props.value;

    return (
      <ListItem3
        className={isSelected ? 'active' : ''}
        onClick={() => {
          this.handleSelectItem(symbol);
        }}
      >
        <span>{symbol}</span>
        <span>20%</span>
      </ListItem3>
    );
  };

  render() {
    const { width, value, alignTop = true } = this.props;

    const { isOpen, scrollTop, tableItems } = this.state;

    return (
      <DropdownWrapper
        width={width}
        ref={ref => {
          this.wrapperRef = ref;
        }}
        isOpen={isOpen}
        alignTop={alignTop}
        className={isOpen ? '' : 'close'}
      >
        <SelectedItemLabel onClick={this.toggleDropDown}>
          <span>{value}</span>
          <DropMenuIcon />
        </SelectedItemLabel>

        {isOpen && (
          <Dropdown alignTop={alignTop} height={Math.min(tableItems.length * 40 + 2, 202)}>
            <ItemList>
              <AutoSizer>
                {({ width, height }) => (
                  <ListStyleWrapper width={width} height={height} length={tableItems.length}>
                    <PerfectScrollbar
                      option={{
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
                        rowHeight={40}
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
        )}
      </DropdownWrapper>
    );
  }
}

export default withSafeTimeout(ForexDropdown);
