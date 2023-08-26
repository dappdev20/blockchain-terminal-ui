import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';
import Row from '../Row';

const Wrapper = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
`;

export const LimitOrderRows = ({
  isBuy,
  amount,
  amountCoin,
  price,
  priceCoin,
  total,
  totalCoin,
  handlePriceChange,
  handleAmountChange
}) => {
  return (
    <Wrapper>
      <FormattedMessage id="order_history.label_amount" defaultMessage="Amount">
        {value => <Row header={value} amount={amount} coin={amountCoin} onChange={handleAmountChange} darkBg={isBuy} />}
      </FormattedMessage>
      <FormattedMessage id="order_history.label_price" defaultMessage="Price">
        {value => <Row header={value} amount={price} coin={priceCoin} onChange={handlePriceChange} darkBg />}
      </FormattedMessage>
      <FormattedMessage id="order_history.label_total" defaultMessage="Total">
        {value => <Row header={value} amount={total} readOnly coin={totalCoin} darkBg={!isBuy} />}
      </FormattedMessage>
    </Wrapper>
  );
};
