import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { Tooltip } from 'react-tippy';

import { List, StyleWrapper, HeaderWrapper, Item } from './Components';
import { STORE_KEYS } from '../../stores';
import { customDigitFormat } from '../../utils';

const headerRenderer = coin => () => {
  return <HeaderWrapper>{coin}</HeaderWrapper>;
};

class ActiveTable extends Component {
  timeCellRenderer = ({ rowData }) => {
    return <Item>{rowData.time}</Item>;
  };

  orderIdCellRenderer = ({ rowData }) => {
    return (
      <Item>
        <Tooltip
          arrow={true}
          // animation="shift"
          position="bottom"
          // followCursor
          theme="bct"
          title={rowData.orderId}
          className="full-width"
        >
          <div className="text-overflow-ellipsis">{rowData.orderId}</div>
        </Tooltip>
      </Item>
    );
  };

  instrCellRenderer = ({ rowData }) => {
    return <Item>{rowData.symbol}</Item>;
  };

  accountCellRenderer = () => <Item />;

  sideCellRenderer = ({ rowData }) => {
    return <Item>{rowData.side}</Item>;
  };

  amountCellRenderer = ({ rowData }) => {
    return <Item>{rowData.filled ? customDigitFormat(rowData.filled) : ''}</Item>;
  };

  filledCellRenderer = ({ rowData }) => {
    return <Item>{rowData.filled ? customDigitFormat(rowData.filled) : ''}</Item>;
  };

  priceCellRenderer = ({ rowData }) => {
    return <Item>{rowData.price ? customDigitFormat(rowData.price) : ''}</Item>;
  };

  avgPriceCellRenderer = ({ rowData }) => {
    return <Item>{rowData.average}</Item>;
  };

  orderTypeCellRenderer = ({ rowData }) => {
    return <Item>{rowData.type}</Item>;
  };

  tifCellRenderer = () => <Item />;

  sourceCellRenderer = () => <Item />;

  stopPriceCellRenderer = () => <Item />;

  cancelCellRenderer = () => <Item />;

  render() {
    const { OrderHistoryData } = this.props;
    const data = OrderHistoryData.length ? [OrderHistoryData[0]] : [];
    return (
      <List>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <StyleWrapper width={width} height={height}>
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    minScrollbarLength: 50
                  }}
                >
                  <Table
                    width={width}
                    height={height}
                    headerHeight={32}
                    disableHeader={false}
                    rowCount={data.length}
                    rowGetter={({ index }) => data[index]}
                    rowHeight={27}
                    overscanRowCount={0}
                  >
                    <Column
                      width={width * 0.14}
                      headerStyle={{ margin: 0 }}
                      dataKey="Time"
                      headerRenderer={headerRenderer('Time')}
                      cellRenderer={this.timeCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      headerStyle={{ margin: 0 }}
                      dataKey="Order ID"
                      headerRenderer={headerRenderer('Order ID')}
                      cellRenderer={this.orderIdCellRenderer}
                    />

                    <Column
                      width={width * 0.08}
                      headerStyle={{ margin: 0 }}
                      dataKey="Instr."
                      headerRenderer={headerRenderer('Instr.')}
                      cellRenderer={this.instrCellRenderer}
                    />

                    <Column
                      width={width * 0.05}
                      headerStyle={{ margin: 0 }}
                      dataKey="Side"
                      headerRenderer={headerRenderer('Side')}
                      cellRenderer={this.sideCellRenderer}
                    />

                    <Column
                      width={width * 0.08}
                      headerStyle={{ margin: 0 }}
                      dataKey="Amount"
                      headerRenderer={headerRenderer('Amount')}
                      cellRenderer={this.amountCellRenderer}
                    />

                    <Column
                      width={width * 0.08}
                      headerStyle={{ margin: 0 }}
                      dataKey="Price"
                      headerRenderer={headerRenderer('Price')}
                      cellRenderer={this.priceCellRenderer}
                    />

                    <Column
                      width={width * 0.06}
                      dataKey="Account"
                      headerRenderer={headerRenderer('Account')}
                      cellRenderer={this.accountCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      headerStyle={{ margin: 0 }}
                      dataKey="Order Type"
                      headerRenderer={headerRenderer('Order Type')}
                      cellRenderer={this.orderTypeCellRenderer}
                    />
                  </Table>
                </PerfectScrollbar>
              </StyleWrapper>
            );
          }}
        </AutoSizer>
      </List>
    );
  }
}

export default compose(
  inject(STORE_KEYS.ORDERHISTORY),
  observer,
  withProps(({ [STORE_KEYS.ORDERHISTORY]: { OrderHistoryData } }) => ({ OrderHistoryData }))
)(ActiveTable);
