import partial from 'lodash.partial';
import get from 'lodash.get';
import {
  CREATED_ORDER_STATUS_LABEL,
  FILLED_ORDER_STATUS_LABEL,
  OrderHistoryStoreLabels,
  PARTIALLY_FILLED_ORDER_STATUS_LABEL,
  UNKNOWN_ORDER_STATUS_LABEL
} from '../../config/constants';
import { getDateFormatted, getNewDateFormatted, getTimeFormatted, formatNumForDisplay } from './storeUtils';
import { sortObjectArray, customDigitFormat } from '../../utils';
import { currencies } from '../../mock/currencies';

export const makeOrderHistoryRequest = (ClientId, ProgramId, Skip, Limit, SentTime, { SubmitOrderHistoryRequest }) => {
  SubmitOrderHistoryRequest({
    ClientId,
    ProgramId,
    SentTime,
    Skip,
    Limit
  });
};

export const getOrderHistoryRequestPartial = ({ ClientId, ProgramId, Skip, PageSize, SentTime }) =>
  partial(makeOrderHistoryRequest, ClientId, ProgramId, Skip, PageSize, SentTime);

export const updateOrderHistoryError = e => console.log(e);

export const getStatus = ({ Message = '' }) => {
  if (Message === '') {
    return UNKNOWN_ORDER_STATUS_LABEL;
  }
  if (Message === 'Filled') {
    return FILLED_ORDER_STATUS_LABEL;
  }
  if (Message === 'FilledPartially') {
    return PARTIALLY_FILLED_ORDER_STATUS_LABEL;
  }
  if (Message === 'Created') {
    return CREATED_ORDER_STATUS_LABEL; // Not sure about this
  }
  return UNKNOWN_ORDER_STATUS_LABEL;
};

// Temporary until backend returns OriginalSize consistently instead of Amount
const getOriginalAmount = ({ Amount, OriginalSize }) => {
  return Number.isNaN(Amount) ? OriginalSize : Amount;
};

// Data used for Trade History OrderTabs
export const mapTradeHistoryForDisplay = Orders =>
  Orders.map(({ OriginalSize, Amount, Price, SentTime, Symbol, Side, Exchange, TicketId }) => {
    try {
      const [Base, Quote] = Side === 'Sell' ? Symbol.split('-').reverse() : Symbol.split('-');
      const OriginalAmount = getOriginalAmount({ Amount: Number(Amount), OriginalSize: Number(OriginalSize) });
      return {
        date: `${getDateFormatted(SentTime)}`,
        timeUnFormatted: SentTime,
        amountExchanged: `${formatNumForDisplay(OriginalAmount)} ${Base}`,
        amountReceived: `${formatNumForDisplay(OriginalAmount * Price)} ${Quote}`,
        exchange: Exchange,
        ticketId: TicketId,

        // Meta Data
        amount: OriginalAmount,
        price: Price,
        base: Base,
        quote: Quote
      };
    } catch (e) {
      return {};
    }
  });

export const getFirstTradeHistoryPair = ({ base = null, quote = null }) => [base, quote];

// export const formatOrderHistoryDataForDisplay = ({Tickets}) => {
//     return Tickets.reduce((accumulator, {Orders = []}) => accumulator.concat(mapOrdersForDisplay(Orders)), [])
// };

export const formatTradeHistoryDataForDisplay = (mapOrdersForDisplay, { Tickets }) => {
  return Tickets.reduce((accumulator, curr) => accumulator.concat(mapOrdersForDisplay([curr])), []);
};

export const formatTradeHistoryData = targetTickets =>
  sortObjectArray(
    'timeUnFormatted',
    formatTradeHistoryDataForDisplay(mapTradeHistoryForDisplay, { Tickets: targetTickets })
  ); // Todo: Bug Here on earliest times

export const getTotalTradeExchangedAndReceived = Orders =>
  Orders.reduce(
    (accumulator, { amount, price } = {}) => ({
      totalExchanged: accumulator.totalExchanged + amount,
      totalReceived: accumulator.totalReceived + amount * price
    }),
    { totalExchanged: 0, totalReceived: 0 }
  );

/**
 * Function returning an object full of meta data for orders for a ticketId.
 *
 * @param {Array} tradeHistory
 *      Expects a list of Orders for one ticketId.
 *
 * @return {object} {
 *      tradeHistory: {array} original unmodified array param
 *      exchangeCount: {number} length of tradeHistory array
 *      exchangeCount: {string} length of tradeHistory array
 *      basePair: {string} base pair of first element in tradeHistory array
 *      quotePair: {string} quote pair of first element in tradeHistory array
 *      totalExchanged: {number} total exchanged in tradeHistory array
 *      totalReceived: {number} total received in tradeHistory array
 * }
 */

export const createMetaDataForTradeHistoryTargetTicketId = tradeHistory => {
  const [base, quote] = getFirstTradeHistoryPair(get(tradeHistory, '[0]', []));

  return {
    tradeHistory,
    exchangeCount: tradeHistory.length,
    basePair: base,
    quotePair: quote,
    ...getTotalTradeExchangedAndReceived(tradeHistory)
  };
};

// Data used for both Open Orders and Order History OrderTabs
export const formatOrderHistoryDataForDisplay = (Bases, Tickets, countries) => {
  return Tickets.filter(ticket => Number(ticket.Price) !== 0 && Number(ticket.ConversionAmount) !== 0).map(
    ({
      Amount,
      AmountFilled,
      ConversionAmount,
      Exchange,
      Message,
      Price,
      SentTime,
      Side,
      Size,
      Status,
      Symbol,
      TicketId,
      Type,
      UserSettings
    }) => {
      const userCurrency = countries.find(country => country.currencyCode === UserSettings.defaultFiat.toUpperCase());
      const conversionRate = userCurrency ? userCurrency.price : 1;
      const userCurrencyInfo = currencies.find(
        currency => UserSettings.defaultFiat && currency.code === UserSettings.defaultFiat.toUpperCase()
      );
      const userCurrencySymbol = userCurrencyInfo
        ? userCurrencyInfo.symbol
          ? userCurrencyInfo.symbol
          : userCurrencyInfo.code
        : '';
      try {
        const [Base, Quote] = Symbol.split('-');
        const c1Index = Bases.findIndex(c => c === Base);
        const c2Index = Bases.findIndex(c => c === Quote);
        const isAdvanced = c1Index < c2Index;
        return {
          // Displayed
          advancedMode: isAdvanced,
          filled: !isAdvanced ? AmountFilled : ConversionAmount,
          price: customDigitFormat(!isAdvanced || Price === 0 ? Price : 1 / Price, 9),
          total: !isAdvanced ? Number(ConversionAmount * conversionRate) : Number(AmountFilled * conversionRate),
          sourceTotal: !isAdvanced ? Number(ConversionAmount) : Number(AmountFilled),
          sourceFilled: !isAdvanced ? Number(AmountFilled) : Number(ConversionAmount),
          size: Size, //
          time: `${getTimeFormatted(SentTime)} ago`,
          date: `${getNewDateFormatted(SentTime)}`,
          L1: !isAdvanced ? Quote : Base,
          L2: !isAdvanced ? Base : Quote,
          type: Type,
          side: Side,
          triggers: 'xxx',
          average: 'xxx',
          [OrderHistoryStoreLabels.Ticket.Status.Label]: Status,
          // Meta Data
          exchange: Exchange,
          timeUnFormatted: SentTime,
          orderId: TicketId,
          amount: Amount,
          message: Message,
          isFailed: Number(Price) === 0 || Number(ConversionAmount) === 0,
          symbol: Symbol,
          userDefaultFiat: UserSettings.defaultFiat,
          userCurrencySymbol
        };
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  );
};
