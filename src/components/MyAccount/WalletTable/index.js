import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Tooltip } from 'react-tippy';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { sortBy } from 'lodash';

import { STORE_KEYS } from '@/stores';
import { formatString, customDigitFormatWithNoTrim, formatFiatString, customDigitFormat } from '@/utils';
import { currencySymbols } from '@/mock/currencies';
import AllocationSlider from '@/components/MyAccount/AllocationSlider';
import { Arrow, Item, StyleWrapper, TooltipValue, TooltipWrapper, Wrapper, TitleWrapper, Title } from './styles';

class WalletTable extends Component {
  onChangeActiveCoin = symbol => {
    this.props.setActiveCoin(symbol);
    this.props.setHoverPortfolio(true);
  };

  onMouseLeave = () => {
    this.props.setActiveCoin('F:USD');
    this.props.setHoverPortfolio(false);
  };

  onRowsRendered = () => {
    const { setWalletDataLoadStatus } = this.props;
    setWalletDataLoadStatus(true);
  };

  tokenRenderer = ({ rowData }) => {
    return (
      <Item>
        <div className="token-cell">{rowData.symbol === 'F:USD' ? 'U.S. Dollar' : rowData.name}</div>
      </Item>
    );
  };

  amountRenderer = ({ rowData }) => {
    const cellValue = customDigitFormat(rowData.position, 5);

    if (rowData.symbol === 'F:USD') {
      return (
        <Item>
          <div className="amount-cell">
            <div className="amount">{cellValue}</div>
            <div>{rowData.symbol.replace('F:', '').replace('S:', '')}</div>
          </div>
        </Item>
      );
    }
    return (
      <Item>
        <div className="amount-cell">
          <div className="amount">{`${cellValue}`}</div>
          <div>{rowData.symbol.replace('F:', '').replace('S:', '')}</div>
        </div>
      </Item>
    );
  };

  priceRenderer = ({ rowData }) => {
    const cellValue = customDigitFormat(rowData.usdRate, 5);
    return (
      <Item>
        <div className="value-cell">$&nbsp;{cellValue}</div>
      </Item>
    );
  };

  changeRenderer = ({ rowData }) => {
    const { price, priceChange24, symbol } = rowData;
    const rate = price > 0 ? (priceChange24 / price) * 100 : 0;
    const direction = rate < 0 ? 'down' : 'up';
    const rateString = `${direction === 'up' ? '+' : ''}${formatString(rate, 2)}`;
    return (
      <Item>
        <div className="change-cell">
          {symbol !== 'F:USD' && symbol !== 'USDT' && rate > 0 ? (
            <div className={`price_rate ${rate < 0 ? 'minus_change' : 'plus_change'}`}>
              <div className="rate">{rateString}%</div>
              <Arrow direction={direction} />
            </div>
          ) : (
            <Tooltip arrow title="Not Applicable" position="bottom" theme="bct">
              <div className="rate">NA</div>
            </Tooltip>
          )}
        </div>
      </Item>
    );
  };

  valueRenderer = ({ rowData }) => {
    const element = rowData;
    const symbolName = element.symbol.replace('F:', '').replace('S:', '');
    const symbol = currencySymbols[symbolName];
    const { unitValue, unitPrefix } = formatFiatString(element.usdValue, 2);
    const cellValue = customDigitFormat(element.usdValue, 5);

    return (
      <Item>
        <div className="price-cell">
          <Tooltip
            arrow
            html={
              <TooltipWrapper>
                {symbolName !== 'USD' && symbolName !== 'BTC' && (
                  <div>
                    <strong>{symbol}</strong>
                    <TooltipValue>{customDigitFormatWithNoTrim(element.position, 9, 9)}</TooltipValue>
                    {symbolName}
                  </div>
                )}
                <div>
                  <strong>$</strong>
                  <TooltipValue>{`${unitValue}${unitPrefix}`}</TooltipValue>
                  USD
                </div>
                <div>
                  <TooltipValue>{customDigitFormatWithNoTrim(element.btcValue, 9, 9)}</TooltipValue>
                  BTC
                </div>
              </TooltipWrapper>
            }
            position="top"
            theme="bct"
          >
            <div className="value-cell">$&nbsp;{cellValue}</div>
          </Tooltip>
        </div>
      </Item>
    );
  };

  allocationRenderer = ({ rowData }) => {
    const { totalUSDAmount } = this.props;
    const allocation = (rowData.usdValue / totalUSDAmount) * 100;

    return (
      <Item>
        <div className="token-cell">{allocation.toFixed(2)}% </div>
        <div className="slider-cell">
          <AllocationSlider amount={allocation} coin={rowData.symbol} disabled color={rowData.hex} />
        </div>
      </Item>
    );
  };

  emptyRender = () => {
    return <Item />;
  };

  getRowData = index => {
    const { data } = this.props;
    const sortedData = this.sortData(data);

    if (index > sortedData.length - 1 && sortedData.length) {
      const empty_data = data[1];
      empty_data.type = null;
      return empty_data;
    }

    return sortedData[index];
  };

  sortData = data => {
    const { totalUSDAmount } = this.props;
    if (!data.length) {
      return null;
    }
    const sortedData = sortBy(data, item => (item.usdValue / totalUSDAmount) * 100).reverse();
    return sortedData;
  };

  rowClassName = ({ index }) => {
    const { data, activeCoin, isHoverPortfolio } = this.props;
    if (!data.length) {
      return null;
    }

    const sortedData = this.sortData(data);
    if (index > -1) {
      if (isHoverPortfolio && sortedData[index].coin === activeCoin) {
        return 'hovering-item';
      }
    }
  };

  render() {
    const { data } = this.props;
    const emptyRowCount = 6 - data.length;
    const list = [{}, {}, {}, {}, {}, {}];

    return (
      <Wrapper>
        <TitleWrapper>
          <Title>ASSET</Title>
          <Title>AMOUNT</Title>
          <Title>PRICE</Title>
          <Title>CHANGE</Title>
          <Title>VALUE</Title>
          <Title>ALLOCATION</Title>
        </TitleWrapper>
        <AutoSizer>
          {({ width, height }) => {
            const rowHeight = height / 6;
            const emptyTableHeight = rowHeight * emptyRowCount;
            const tableHeight = rowHeight * data.length;
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
                    height={tableHeight}
                    disableHeader={true}
                    rowCount={data.length}
                    rowGetter={({ index }) => this.getRowData(index)}
                    rowClassName={this.rowClassName}
                    rowHeight={rowHeight}
                    overscanRowCount={0}
                    onRowsRendered={this.onRowsRendered}
                    onRowMouseOver={({ rowData }) => this.onChangeActiveCoin(rowData.symbol)}
                    onRowMouseOut={() => this.onMouseLeave()}
                  >
                    <Column width={width / 6} dataKey="token" cellRenderer={this.tokenRenderer} />
                    <Column width={width / 6} dataKey="amount" cellRenderer={this.amountRenderer} />
                    <Column width={width / 6} dataKey="price" cellRenderer={this.priceRenderer} />
                    <Column width={width / 6} dataKey="change" cellRenderer={this.changeRenderer} />
                    <Column width={width / 6} dataKey="value" cellRenderer={this.valueRenderer} />
                    <Column width={width / 6} dataKey="allocation" cellRenderer={this.allocationRenderer} />
                  </Table>
                  {data.length < 6 && (
                    <Table
                      width={width}
                      height={emptyTableHeight}
                      disableHeader={true}
                      rowHeight={rowHeight}
                      rowCount={emptyRowCount}
                      rowGetter={({ index }) => list[index]}
                    >
                      <Column width={width / 6} dataKey="token" cellRenderer={this.emptyRender} />
                      <Column width={width / 6} dataKey="allocation" cellRenderer={this.emptyRender} />
                      <Column width={width / 6} dataKey="amount" cellRenderer={this.emptyRender} />
                      <Column width={width / 6} dataKey="price" cellRenderer={this.emptyRender} />
                      <Column width={width / 6} dataKey="value" cellRenderer={this.emptyRender} />
                      <Column width={width / 6} dataKey="change" cellRenderer={this.emptyRender} />
                    </Table>
                  )}
                </PerfectScrollbar>
              </StyleWrapper>
            );
          }}
        </AutoSizer>
      </Wrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.PORTFOLIOSTORE, STORE_KEYS.CONVERSIONAUTOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.PORTFOLIOSTORE]: { data, totalUSDAmount, setWalletDataLoadStatus },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { setActiveCoin, setHoverPortfolio, activeCoin, isHoverPortfolio }
    }) => ({
      data,
      totalUSDAmount,
      setActiveCoin,
      setHoverPortfolio,
      activeCoin,
      isHoverPortfolio,
      setWalletDataLoadStatus
    })
  )
)(WalletTable);
