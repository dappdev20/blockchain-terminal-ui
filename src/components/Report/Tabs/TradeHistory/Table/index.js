import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { List, StyleWrapper, HeaderWrapper, Item } from './Components';

const headerRenderer = coin => () => {
  return <HeaderWrapper>{coin}</HeaderWrapper>;
};

class ReportTable extends Component {
  createdCellRenderer = ({ rowData }) => {
    return <Item>{rowData.created_at}</Item>;
  };

  updatedCellRenderer = ({ rowData }) => {
    return <Item>{rowData.updated_at}</Item>;
  };

  idCellRenderer = ({ rowData }) => {
    return <Item>{rowData.id}</Item>;
  };

  instrCellRenderer = ({ rowData }) => {
    return <Item>{rowData.symbol}</Item>;
  };

  exchangeCellRenderer = ({ rowData }) => {
    return <Item>{rowData.exchange.name}</Item>;
  };

  sideCellRenderer = ({ rowData }) => {
    return <Item>{rowData.side}</Item>;
  };

  amountCellRenderer = ({ rowData }) => {
    return <Item>{rowData.amount}</Item>;
  };

  costCellRenderer = ({ rowData }) => {
    return <Item>{rowData.cost}</Item>;
  };

  priceCellRenderer = ({ rowData }) => {
    return <Item>{rowData.price}</Item>;
  };

  feeCellRenderer = ({ rowData }) => {
    return <Item>{`${rowData.fee.cost} ${rowData.fee.currency}`}</Item>;
  };

  render() {
    const data = this.props.columns;

    return (
      <List>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <StyleWrapper width={width} height={height} myTradesHeaderAbove>
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    minScrollbarLength: 50
                  }}
                >
                  <Table
                    width={width}
                    height={height}
                    headerHeight={27}
                    rowCount={data.length}
                    rowGetter={({ index }) => data[index]}
                    rowHeight={27}
                    // overscanRowCount={0}
                    scrollToAlignment="end"
                  >
                    <Column
                      width={width * 0.14}
                      dataKey="Created"
                      headerRenderer={headerRenderer('Created')}
                      cellRenderer={this.createdCellRenderer}
                    />

                    <Column
                      width={width * 0.14}
                      dataKey="Updated"
                      headerRenderer={headerRenderer('Updated')}
                      cellRenderer={this.updatedCellRenderer}
                    />

                    <Column
                      width={width * 0.04}
                      dataKey="Trade ID"
                      headerRenderer={headerRenderer('ID')}
                      cellRenderer={this.idCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      dataKey="Instr."
                      headerRenderer={headerRenderer('Instr.')}
                      cellRenderer={this.instrCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      dataKey="Exchange"
                      headerRenderer={headerRenderer('Exchange')}
                      cellRenderer={this.exchangeCellRenderer}
                    />

                    <Column
                      width={width * 0.04}
                      dataKey="Side"
                      headerRenderer={headerRenderer('Side')}
                      cellRenderer={this.sideCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      dataKey="Amount"
                      headerRenderer={headerRenderer('Amount')}
                      cellRenderer={this.amountCellRenderer}
                    />
                    <Column
                      width={width * 0.07}
                      dataKey="Cost"
                      headerRenderer={headerRenderer('Cost')}
                      cellRenderer={this.costCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      dataKey="Price"
                      headerRenderer={headerRenderer('Best Price')}
                      cellRenderer={this.priceCellRenderer}
                    />

                    <Column
                      width={width * 0.07}
                      dataKey="Fee"
                      headerRenderer={headerRenderer('Fee')}
                      cellRenderer={this.feeCellRenderer}
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

export default ReportTable;
