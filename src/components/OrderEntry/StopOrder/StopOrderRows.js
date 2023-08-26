import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';
import Row from '../Row';

const Wrapper = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  line-height: 14px;
`;

export const StopOrderRows = ({
  isBuy,
  amount,
  amountCoin,
  price,
  stopPrice,
  priceCoin,
  total,
  totalCoin,
  handlePriceChange,
  handleStopPriceChange,
  handleAmountChange
}) => {
  return (
    <Wrapper>
      <FormattedMessage id="order_history.label_amount" defaultMessage="Amount">
        {value => <Row header={value} amount={amount} coin={amountCoin} onChange={handleAmountChange} darkBg={isBuy} />}
      </FormattedMessage>
      <FormattedMessage id="order_entry.label_stop_price" defaultMessage="Stop">
        {value => <Row header={value} amount={stopPrice} coin={priceCoin} onChange={handleStopPriceChange} darkBg />}
      </FormattedMessage>
      <FormattedMessage id="order_entry.label_price_limit" defaultMessage="Price">
        {value => <Row header={value} amount={price} coin={priceCoin} onChange={handlePriceChange} darkBg />}
      </FormattedMessage>
      <FormattedMessage id="order_history.label_total" defaultMessage="Total">
        {value => <Row header={value} readOnly={true} amount={total} coin={totalCoin} darkBg={!isBuy} />}
      </FormattedMessage>
    </Wrapper>
  );
};
