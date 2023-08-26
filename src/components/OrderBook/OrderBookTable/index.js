import React, { PureComponent } from 'react';

import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import { STORE_KEYS } from '@/stores';
import { getScreenInfo, getNumberParts } from '@/utils';
import { ORDER_BOOK_ROWS_COUNT } from '@/config/constants';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import DataLoader from '@/components-generic/DataLoader';

import ExchangeCell from '../Cells/ExchangeCell';
import AmountCell from '../Cells/AmountCell';
import PriceCell from '../Cells/PriceCell';
import ProgressCell from '../Cells/ProgressCell';
import ExchangeHeader from '../HeaderCells/ExchangeHeader';
import TotalAmountHeader from '../HeaderCells/TotalAmountHeader';
import TotalCostHeader from '../HeaderCells/TotalCostHeader';
import PriceHeader from '../HeaderCells/PriceHeader';

import { Table, Row, HeaderRow } from './styles';

const IS_MOBILE_PORTRAIT = getScreenInfo().isMobilePortrait;

const FIELDS = ['amount', 'cost', 'price'];

const DEFAULT_MAX_DECIMAL_DIGITS_LENGTH = {
  amount: 9,
  cost: 9,
  price: 9
};

class OrderBookTable extends PureComponent {
  state = {
    hoverMeta: { index: -1 }
  };

  onRowClick = (callback, data) => () => {
    if (IS_MOBILE_PORTRAIT) {
      return;
    }

    callback(data);
  };

  onMouseEnter = (type, index) => () => {
    this.setState({
      hoverMeta: {
        type,
        index
      }
    });
  };

  onMouseLeave = () => {
    this.setState({
      hoverMeta: { index: -1 }
    });
  };

  getCellsWidth = () => {
    return {
      exchangeWidth: 40,
      amountWidth: 20,
      amountQuoteWidth: 20,
      priceWidth: 20
    };
  };

  getBaseAmountCell = (amount, type, width, hovered, numberFormatMeta) => {
    const { baseSymbol } = this.props;
    const { amountIntLength, amountFractionDigits, amountDigitsGap } = numberFormatMeta;

    return this.getAmountCell(
      amount,
      type,
      width,
      amountIntLength,
      amountFractionDigits,
      amountDigitsGap,
      baseSymbol,
      hovered,
      false
    );
  };

  getCostCell = (amount, type, width, hovered, numberFormatMeta) => {
    const { quoteSymbol } = this.props;

    const { costIntLength, costFractionDigits, costDigitsGap } = numberFormatMeta;

    return this.getAmountCell(
      amount,
      type,
      width,
      costIntLength,
      costFractionDigits,
      costDigitsGap,
      quoteSymbol,
      hovered,
      true
    );
  };

  getAmountCell = (amount, type, width, intLength, fractionDigits, digitsGap, coin, isHovered, showArrow) => {
    // DON'T ADD ANY LOGIC HERE!
    // Add to the AmountCell component
    return (
      <AmountCell
        type={type}
        intLength={intLength}
        fractionDigits={fractionDigits}
        digitsGap={digitsGap}
        coin={coin}
        cellWidth={width}
        isHovered={isHovered}
        showArrow={showArrow}
      >
        {amount}
      </AmountCell>
    );
  };

  getPriceCell = (price, type, width, isHovered, numberFormatMeta) => {
    const { priceIntLength, priceFractionDigits, priceDigitsGap } = numberFormatMeta;

    // DON'T ADD ANY LOGIC HERE!
    // Add to the PriceCell component
    return (
      <PriceCell
        type={type}
        cellWidth={width}
        intLength={priceIntLength}
        fractionDigits={priceFractionDigits}
        digitsGap={priceDigitsGap}
        isHovered={isHovered}
      >
        {price}
      </PriceCell>
    );
  };

  getProgressCell = (cumulativeAmount, totalAmount, isBuy) => (
    <ProgressCell cumulativeAmount={cumulativeAmount} totalAmount={totalAmount} isBuy={isBuy} />
  );

  getRows = (type, items, cellWidth, numberFormatMeta) => {
    const { hoveredItem = {}, setOrderFormData, price: globalPrice } = this.props;

    const { priceFractionDigits, priceIntLength, priceDigitsGap } = numberFormatMeta;
    const { hoverMeta } = this.state;
    const hoverRowMeta = hoveredItem.type ? hoveredItem : hoverMeta;

    const { exchangeWidth, amountWidth, amountQuoteWidth, priceWidth } = cellWidth;
    const isBuy = type === 'buy';
    const totalAmount = items[isBuy ? 0 : items.length - 1].cumulativeAmount;

    return items.map(({ price, amount, cost, exchange, total, cumulativeAmount }, index) => {
      const hovered = hoverRowMeta && hoverRowMeta.index === index && hoverRowMeta.type === type;

      const props = {};
      if (isBuy) {
        const siblingIndex = index - 1;
        props.siblingPrice = items[siblingIndex] ? items[siblingIndex].price : globalPrice;
      } else {
        const siblingIndex = index + 1;
        props.siblingPrice = items[siblingIndex] ? items[siblingIndex].price : globalPrice;
      }

      return (
        <Row
          key={index}
          onClick={this.onRowClick(setOrderFormData, { amount, price })}
          onMouseEnter={this.onMouseEnter(type, index)}
          onMouseLeave={this.onMouseLeave}
          priceFractionDigits={priceFractionDigits}
          priceIntLength={priceIntLength}
          priceDigitsGap={priceDigitsGap}
          isBuy={isBuy}
          price={price}
          exchange={exchange}
          total={total}
          {...props}
        >
          <ExchangeCell isBuy={isBuy} exchange={exchange} cellWidth={exchangeWidth} />
          {this.getBaseAmountCell(amount, type, amountWidth, hovered, numberFormatMeta)}
          {this.getCostCell(cost, type, amountQuoteWidth, hovered, numberFormatMeta)}
          {this.getPriceCell(price, type, priceWidth, hovered, numberFormatMeta)}
          {this.getProgressCell(cumulativeAmount, totalAmount, isBuy)}
        </Row>
      );
    });
  };

  getHeader = (cellWidth, numberFormatMeta) => {
    const {
      setSettingsExchangeViewMode,
      baseSymbol,
      quoteSymbol,
      totalAsksAmount,
      totalBidsAmount,
      totalAsksCost,
      totalBidsCost,
      midPrice,
      avgPrice,
      price,
      priceDelta
    } = this.props;

    const {
      amountDigitsGap,
      amountFractionDigits,
      amountIntLength,
      costDigitsGap,
      costFractionDigits,
      costIntLength,
      priceDigitsGap,
      priceFractionDigits,
      priceIntLength
    } = numberFormatMeta;

    const { exchangeWidth, amountWidth, amountQuoteWidth, priceWidth } = cellWidth;

    return (
      <HeaderRow>
        <ExchangeHeader text={<ExchangesLabel />} onClick={setSettingsExchangeViewMode} cellWidth={exchangeWidth} />
        <TotalAmountHeader
          coin={baseSymbol}
          totalAsks={totalAsksAmount}
          totalBids={totalBidsAmount}
          intLength={amountIntLength}
          fractionDigits={amountFractionDigits}
          digitsGap={amountDigitsGap}
          cellWidth={amountWidth}
        />
        <TotalCostHeader
          coin={quoteSymbol}
          totalAsks={totalAsksCost}
          totalBids={totalBidsCost}
          intLength={costIntLength}
          fractionDigits={costFractionDigits}
          digitsGap={costDigitsGap}
          cellWidth={amountQuoteWidth}
        />
        <PriceHeader
          intLength={priceIntLength}
          fractionDigits={priceFractionDigits}
          digitsGap={priceDigitsGap}
          midPrice={midPrice}
          avgPrice={avgPrice}
          price={price}
          priceDelta={priceDelta}
          cellWidth={priceWidth}
        />
      </HeaderRow>
    );
  };

  getNumberFormatMeta = (buys, sells) => {
    const { maxBidPrice, maxAskPrice, totalAsksAmount, totalBidsAmount, totalAsksCost, totalBidsCost } = this.props;

    const maxValues = {
      amount: Math.max(totalAsksAmount, totalBidsAmount),
      cost: Math.max(totalAsksCost, totalBidsCost),
      price: Math.max(maxBidPrice, maxAskPrice)
    };

    return FIELDS.map(field => {
      const intLength = getNumberParts(maxValues[field]).integerPart.length;
      const items = [...buys.map(item => item[field]), ...sells.map(item => item[field])];

      const min = Math.min(...items);
      const max = Math.max(...items);

      let minValueDigits;
      if (min >= 1) {
        minValueDigits = getNumberParts(min).integerPart.length;
      } else {
        const leadingZerosRegex = min.toFixed(10).match(/^[0, .]+/);
        const leadingZeros = leadingZerosRegex && leadingZerosRegex[0];
        minValueDigits = leadingZeros ? leadingZeros.replace('.', '').length : 0;
      }

      let maxValueDigits;
      if (max >= 1) {
        maxValueDigits = getNumberParts(max).integerPart.length;
      } else {
        const leadingZerosRegex = max.toFixed(10).match(/^[0, .]+/);
        const leadingZeros = leadingZerosRegex && leadingZerosRegex[0];
        maxValueDigits = leadingZeros ? leadingZeros.replace('.', '').length : 0;
      }

      let digitsGap;
      if ((max > 1 && min > 1) || (max < 1 && min < 1)) {
        digitsGap = maxValueDigits - minValueDigits;
      } else {
        digitsGap = maxValueDigits + minValueDigits;
      }

      const realFractionDigits = items
        .map(getNumberParts)
        .map(parts => parts.fractionalPart.length)
        .reduce((result, current) => Math.max(result, current), 0);

      const fractionDigits = Math.min(
        Math.min(realFractionDigits, DEFAULT_MAX_DECIMAL_DIGITS_LENGTH[field]),
        Math.max(10 - intLength, 0)
      );

      return {
        [`${field}IntLength`]: intLength,
        [`${field}FractionDigits`]: fractionDigits,
        [`${field}DigitsGap`]: digitsGap
      };
    }).reduce((result, current) => ({ ...result, ...current }), {});
  };

  render() {
    const { bids, asks } = this.props;

    if (!asks.length || !bids.length) {
      return <DataLoader width={100} height={100} />;
    }

    const buys = bids.slice(-ORDER_BOOK_ROWS_COUNT).reverse();
    const sells = asks.slice(0, ORDER_BOOK_ROWS_COUNT).reverse();

    const cellWidth = this.getCellsWidth();

    const numberFormatMeta = this.getNumberFormatMeta(buys, sells);

    return (
      <Table>
        {this.getRows('sell', sells, cellWidth, numberFormatMeta)}
        {this.getHeader(cellWidth, numberFormatMeta)}
        {this.getRows('buy', buys, cellWidth, numberFormatMeta)}
      </Table>
    );
  }
}

export default withOrderFormToggleData(stores => {
  const {
    asks,
    bids,
    hoveredItem,
    totalAsksAmount,
    totalBidsAmount,
    totalAsksCost,
    totalBidsCost,
    maxBidPrice,
    maxAskPrice,
    baseSymbol,
    quoteSymbol,
    midPrice,
    avgPrice,
    price,
    priceDelta
  } = stores[STORE_KEYS.ORDERBOOKBREAKDOWN];

  const { setOrderFormData } = stores[STORE_KEYS.ORDERENTRY];

  return {
    asks,
    bids,
    setOrderFormData,
    totalAsksAmount,
    totalBidsAmount,
    totalAsksCost,
    totalBidsCost,
    hoveredItem,
    maxBidPrice,
    maxAskPrice,
    baseSymbol,
    quoteSymbol,
    midPrice,
    avgPrice,
    price,
    priceDelta
  };
})(OrderBookTable);
