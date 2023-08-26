import React from 'react';

import {
  ProgramId,
  ORDER_ENTRY_ROUTE,
  ORDER_TICKET_TICKET_ID,
  ORDER_TICKET_CLIENT_ID,
  ORDER_TICKET_PROGRAM_ID,
  ORDER_TICKET_SYMBOL,
  ORDER_TICKET_SIZE,
  ORDER_TICKET_PRICE,
  ORDER_TICKET_SIDE,
  ORDER_TICKET_ROUTE
} from '../../config/constants';
import { customDigitFormat } from '../../utils';

export const TicketId = (() => {
  let orderCount = 0;
  return () => `${ProgramId}-${++orderCount}`;
})();

const orderTicketDefaults = {
  [ORDER_TICKET_ROUTE]: ORDER_ENTRY_ROUTE
};

export const OrderTicketPayload = (baseSymbol, quoteSymbol, amount, price, side, clientIdForOrder, programId) => ({
  ...orderTicketDefaults,
  [ORDER_TICKET_CLIENT_ID]: clientIdForOrder,
  [ORDER_TICKET_TICKET_ID]: TicketId(),
  [ORDER_TICKET_PROGRAM_ID]: programId,
  [ORDER_TICKET_SYMBOL]: [`${baseSymbol}-${quoteSymbol}`],
  [ORDER_TICKET_SIZE]: Number(amount),
  [ORDER_TICKET_PRICE]: price,
  [ORDER_TICKET_SIDE]: side
});

const onlyFloatChars = (s = '') => s.toString().replace(/[^\d.]/g, '');
const wasPercentage = ([zero, dot]) => dot === '.' || zero === '.';
const shouldBePercentage = (s = '') => s.length >= 2 && s[0] === '0' && s[1] !== '.';
const asPercentage = ([zero, ...s]) => `${zero}.${s.join('')}`;
const only1Dot = (s = '') =>
  s
    .replace(/[.]/, '{dot}')
    .replace(/[.]/, '')
    .replace('{dot}', '.');
const cleanNumToStr = (s = '') =>
  Number(s)
    .toString()
    .trim();

export const valueNormalized = (prevInput, input = '') => {
  const inputStr = String(input);
  const prevInputStr = String(prevInput);

  const num = onlyFloatChars(inputStr);
  const shouldBePc = shouldBePercentage(num);
  const wasPercent = wasPercentage(prevInputStr);

  if (inputStr.length < 1) return inputStr;
  if (wasPercent && shouldBePc) return cleanNumToStr(only1Dot(num.slice(1)));
  return shouldBePc ? asPercentage(num) : only1Dot(num);
};

export const postSubmissionSnackbarHandler = (
  type,
  snackbar,
  { [ORDER_TICKET_SIDE]: side, [ORDER_TICKET_SIZE]: amount, [ORDER_TICKET_PRICE]: price, [ORDER_TICKET_SYMBOL]: symbol }
) => {
  let baseSymbol = '';
  if (symbol && symbol.length > 0) {
    const symbols = symbol[0].split('-');
    if (symbols && symbols.length > 0) {
      baseSymbol = symbols[0];
    }
  }

  snackbar({
    message: () => (
      <>
        <span>
          <b>{type} Order Submitted!</b>
        </span>{' '}
        <br />
        <br />
        <span>
          <b>Side:</b> {side} {baseSymbol}
        </span>{' '}
        <br />
        <span>
          <b>Amount:</b> {customDigitFormat(amount)} {baseSymbol}
        </span>{' '}
        <br />
        <span>
          <b>Price:</b> {customDigitFormat(price)} USDT
        </span>{' '}
        <br />
        <span>
          <b>Total Price:</b> {customDigitFormat(amount * price)} USDT
        </span>
      </>
    )
  });
};

export const getOrderPrice = order => order[ORDER_TICKET_PRICE];
export const getOrderAmount = order => order[ORDER_TICKET_SIZE];
export const getOrderSymbol = order => order[ORDER_TICKET_SYMBOL];
export const getOrderSide = order => order[ORDER_TICKET_SIDE];
