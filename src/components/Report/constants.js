export const timePeriodList = [
  'Today',
  'Yesterday',
  'This week',
  'This and previous week',
  'Previous week',
  'This month',
  'This and previous month',
  'Previous month',
  'Custom'
];

export const fileFormatList = ['.csv'];

export const instrumentList = ['All', 'XBTEUR_20180706', 'BCHEUR_20180706', 'ETHEUR_20180706'];

export const accountList = ['All', 'HFF828A01'];

export const orderTypeList = ['All', 'Limit', 'Market', 'Stop limit', 'Stop market'];

export const timeInForceList = ['All', 'Day', 'GTC', 'IOC', 'FOK', 'GTD'];

export const sideList = ['All', 'Buy', 'Sell'];

export const sourceList = ['All', 'ADM', 'WEB', 'FIX', 'REST'];

export const hasTradesList = ['All', 'Yes', 'No'];

export const orderStateList = [
  'All',
  'New',
  'Partially filled',
  'Filled',
  'Cancelled',
  'Expired',
  'Rejected',
  'Suspended'
];

export const rowsPerPageList = [25, 50, 100, 200, 500, 1000].map(count => `${count} rows per page`);

export const makerTakerList = ['All', 'Maker', 'Taker'];

export const directionList = ['All', 'Incoming', 'Outgoing'];

export const statusList = ['All', 'Cancelled', 'Completed', 'Pending', 'Rejected', 'Unconfirmed'];

export const typeList = ['All', 'Bank', 'Cryptocurrency', 'Other Globitex client account', 'Own Globitex account'];

export const reportTypeList = ['Cash account statement', 'Activity statement'];

export const outputTypeList = ['.pdf'];

export const currencyList = ['All', 'EURS', 'EUR', 'BSV', 'BCH', 'ETH', 'XBT', 'GBX'];

export const orderHistoryDropdowns = [
  'instrument',
  'account',
  'orderType',
  'timeInForce',
  'side',
  'source',
  'hasTrades',
  'orderState'
];

export const orderHistoryColumns = [
  'Placement Date',
  'Execution Date',
  'Order ID',
  'Client ORder ID',
  'Account',
  'Instr',
  'Type',
  'Side',
  'Order Quantity',
  'Executed Quantity',
  'Price',
  'Average Execution Price',
  'Stop Price',
  'TIF',
  'Source',
  'Order State'
];

export const tradeHistoryDropdowns = ['instrument', 'account', 'side', 'makerTaker', 'source'];

export const tradeHistoryColumns = [
  'Date',
  'Trade ID',
  'Order ID',
  'Client Order ID',
  'Account',
  'Instrument',
  'Side',
  'Executed Quality',
  'Price',
  'Value',
  'Currency',
  'Maker/Taker',
  'Commission',
  'Commission Currency'
];

export const gbxUtilizationDropdowns = ['account', 'direction', 'currency'];

export const gbxUtilizationColumns = ['Date', 'Details', 'Currency', '+In / -Out'];

export const paymentHistoryDropdowns = ['account', 'status', 'type', 'direction'];

export const paymentHistoryColumns = ['Payment Date', 'Payer / Payee', 'Details', 'Currency', '+ In / - Out', 'Status'];

export const navReportDropdowns = ['reportType', 'account', 'outputType'];
