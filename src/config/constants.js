export const randomCoolPerson = 'rui';
export const InstanceId =
  window.REACT_APP_InstanceId ||
  process.env.REACT_APP_InstanceId ||
  Math.random()
    .toString(36)
    .replace('0.', '')
    .substring(0, 5);
export const CurrentUser = randomCoolPerson;
export const ProgramId =
  window.REACT_APP_ProgramId || process.env.REACT_APP_ProgramId || `bctui.${CurrentUser}.${InstanceId}`;
export const Symbols = window.REACT_APP_Symbols || process.env.REACT_APP_Symbols || ['BTC-USDT']; // We are splitting on the "-" here, if that changes the UI will break
export const ClientId = randomCoolPerson;
export const Route = window.REACT_APP_Route || process.env.REACT_APP_Route || 'Aggregated';
export const ORDER_ENTRY_ROUTE = window.REACT_APP_Route || process.env.REACT_APP_Route || 'Aggregated';
export const WhitelableTitle = window.REACT_APP_Whitelabel_Title || process.env.REACT_APP_Whitelabel_Title || '';

// Order Side
export const BUY_SIDE = 'Buy';
export const SELL_SIDE = 'Sell';

// Order Type
export const STOP_ORDER_TYPE = 'STOP';
export const LIMIT_ORDER_TYPE = 'LIMIT';
export const MARKET_ORDER_TYPE = 'MARKET';

// OrderTicket Message Attributes
export const ORDER_TICKET_TICKET_ID = 'TicketId';
export const ORDER_TICKET_CLIENT_ID = 'ClientId';
export const ORDER_TICKET_PROGRAM_ID = 'ProgramId';
export const ORDER_TICKET_SYMBOL = 'Symbol';
export const ORDER_TICKET_PRICE = 'Price';
export const ORDER_TICKET_SIZE = 'Size';
export const ORDER_TICKET_SIDE = 'Side';
export const ORDER_TICKET_ROUTE = 'Route';

// OrderCreated Message Attributes
export const ORDER_CREATED_ORDER_ID = 'OrderId';
export const ORDER_CREATED_TICKET_ID = 'TicketId';
export const ORDER_CREATED_AMOUNT = 'Amount';
export const ORDER_CREATED_PRICE = 'Price';
export const ORDER_CREATED_SENT_TIME = 'SentTime';
export const ORDER_CREATED_EXCHANGE = 'Exchange';
export const ORDER_CREATED_SYMBOL = 'Symbol';
export const ORDER_CREATED_SIDE = 'Side';

// OrderCreated Message Attributes mapped to corresponding react component attributes

export const ORDER_CREATED_TICKET_ID_MAPPED = 'ticketId';
export const ORDER_CREATED_AMOUNT_MAPPED = 'size';
export const ORDER_CREATED_SYMBOL_MAPPED = 'product';
export const ORDER_CREATED_PRICE_MAPPED = 'price';
export const ORDER_CREATED_FEE_MAPPED = 'fee';
export const ORDER_CREATED_EXCHANGE_MAPPED = 'exchange';
export const ORDER_CREATED_SENT_TIME_MAPPED = 'time';
export const ORDER_CREATED_SIDE_MAPPED = 'side';

// OrderEvent Message Attributes
export const ORDER_EVENT_ORDER_ID = 'OrderId';
export const ORDER_EVENT_ORDER_ID_MAPPED = 'orderId';
export const ORDER_EVENT_RESULT = 'Result';
export const ORDER_EVENT_EXCHANGE = 'Exchange';
export const ORDER_EVENT_MESSAGE = 'Message';
export const ORDER_EVENT_SENT_TIME = 'SentTime';
export const ORDER_EVENT_FILL_PRICE = 'FillPrice';
export const ORDER_EVENT_FILL_SIZE = 'FilledSize';

// OrderEvent Message Attributes mapped to corresponding react component attributes
export const ORDER_EVENT_SIZE_MAPPED = 'size';
export const ORDER_EVENT_PRICE_MAPPED = 'price';
export const ORDER_EVENT_RESULT_MAPPED = 'result';
export const ORDER_EVENT_FILL_PRICE_MAPPED = 'fillPrice';

// Order Statuses
export const FILLED_ORDER_STATUS = 1;
export const FILLED_ORDER_STATUS_LABEL = 'FILLED';
export const PARTIALLY_FILLED_ORDER_STATUS = 2;
export const PARTIALLY_FILLED_ORDER_STATUS_LABEL = 'PARTIAL FILL';
export const PENDING_ORDER_STATUS = 3;
export const PENDING_ORDER_STATUS_LABEL = 'PENDING';
export const ERROR_ORDER_STATUS = 4;
export const ERROR_ORDER_STATUS_LABEL = 'ERROR';
export const CANCELED_ORDER_STATUS = 5;
export const CANCELED_ORDER_STATUS_LABEL = 'CANCELED';
export const PENDINGCANCEL_ORDER_STATUS = 6;
export const PENDINGCANCEL_ORDER_STATUS_LABEL = 'PENDINGCANCEL';
export const UNKNOWN_ORDER_STATUS_LABEL = 'UNKNOWN';
export const CREATED_ORDER_STATUS_LABEL = 'CREATED';
export const ORDER_EVENT_COMPLETED_RESULT = FILLED_ORDER_STATUS;
export const ORDER_EVENT_PARTIAL_FILL_RESULT = PARTIALLY_FILLED_ORDER_STATUS;

export const ORDER_STATUS = {
  [FILLED_ORDER_STATUS]: FILLED_ORDER_STATUS_LABEL,
  [PARTIALLY_FILLED_ORDER_STATUS]: PARTIALLY_FILLED_ORDER_STATUS_LABEL,
  [PENDING_ORDER_STATUS]: PENDING_ORDER_STATUS_LABEL,
  [ERROR_ORDER_STATUS]: ERROR_ORDER_STATUS_LABEL,
  [CANCELED_ORDER_STATUS]: CANCELED_ORDER_STATUS_LABEL,
  [PENDINGCANCEL_ORDER_STATUS]: PENDINGCANCEL_ORDER_STATUS_LABEL
};

export const PORTFOLIO_LABEL_POSITIONS = 'Positions';
export const PORTFOLIO_LABEL_AMOUNT = 'Amount';
export const PORTFOLIO_LABEL_PRICE = 'Price';
export const PORTFOLIO_LABEL_CHANGE = 'Change';
export const PORTFOLIO_LABEL_POSITION = 'Position';
export const PORTFOLIO_LABEL_EXCHANGE = 'Exchange';
export const PORTFOLIO_LABEL_COIN = 'Coin';
export const PORTFOLIO_LABEL_NAME = 'Name';
export const PORTFOLIO_LABEL_MKTCAP = 'Marketcap';
export const PORTFOLIO_LABEL_TOTALVOLUME24H = 'Volume24h';
export const PORTFOLIO_LABEL_CLIENTID = 'ClientId';
export const PORTFOLIO_LABEL_PROGRAMID = 'ProgramId';
export const PORTFOLIO_LABEL_SENTTIME = 'SentTime';
export const PORTFOLIO_LABEL_ISWALLETENABLED = 'IsWalletEnabled';

export const OrderHistoryStoreLabels = {
  Ticket: {
    Status: {
      Label: 'Status',
      Values: {
        Filled: 'FILLED',
        Cancelled: 'CANCELLED',
        Rejected: 'REJECTED',
        Open: 'OPEN'
      }
    },
    Orders: {
      Label: 'Orders',
      Values: {}
    }
  }
};

export const RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_GLOBAL_LIQUIDITY = 'Advanced';
export const RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_YOUR_WALLET = 'Wallet';
export const RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_ORDER_HISTORY = 'History';
export const RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_OPEN_ORDERS = 'Open Orders';
export const RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_PORTFOLIO = 'Portfolio';

export const RIGHT_LOWER_SECTION_GRID_SELECT_OPTIONS = [
  RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_YOUR_WALLET,
  RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_GLOBAL_LIQUIDITY,
  RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_PORTFOLIO,
  RIGHT_LOWER_SECTION_GRID_SELECT_OPTION_YOUR_ORDER_HISTORY
];

// Video ID for Welcome page
export const VIDEOID = '303370757';

// Candles Data
export const CANDLE_TIMESTAMP = 'Timestamp';
export const PERIOD = 'Period';
// all is not supported
export const ALL = 'All';
export const YEAR = 'Year';
export const MONTH = 'Month';
export const WEEK = 'Week';
export const DAY = 'Day';
export const HOUR = 'Hour';
export const SENT_TIME = 'SentTime';
export const SYMBOL = 'Symbol';
export const VERSION = '';

export const WS = {
  PUBLIC: {
    HOST: window.REACT_APP_WS_PUBLIC_HOST || process.env.REACT_APP_WS_PUBLIC_HOST,
    PORT: window.REACT_APP_WS_PUBLIC_PORT || process.env.REACT_APP_WS_PUBLIC_PORT
  },
  MARKET: {
    HOST: window.REACT_APP_WS_MARKET_HOST || process.env.REACT_APP_WS_MARKET_HOST,
    PORT: window.REACT_APP_WS_MARKET_PORT || process.env.REACT_APP_WS_MARKET_PORT
  },
  PRIVATE: {
    HOST: window.REACT_APP_WS_PRIVATE_HOST || process.env.REACT_APP_WS_PRIVATE_HOST,
    PORT: window.REACT_APP_WS_PRIVATE_PORT || process.env.REACT_APP_WS_PRIVATE_PORT
  }
};

export const WS_MARKET_URL = window.REACT_APP_WS_MARKET_URL || process.env.REACT_APP_WS_MARKET_URL;

// market endpoint serves rest end points also
// keeping the default value in line what was hardcoded in existing code.
let rest_market = 'https://market-data.bct.trade';
if (WS_MARKET_URL) {
  let marketURL = '';
  // just in case, a wrong URL set in env
  try {
    marketURL = new URL(WS_MARKET_URL);
  } catch (wrongUrlPat) {
    console.log(wrongUrlPat);
  }
  if (marketURL) {
    // map wss -> https, ws -> http
    const marketRestProtocol = marketURL.protocol && marketURL.protocol === 'wss:' ? 'https:' : 'http:';
    // host will have any custom port numbers also, just in case a developer is using a custom port
    rest_market = `${marketRestProtocol}//${marketURL.host}`;
  }
}
export const REST_MARKET = rest_market;

export const HISTORICAL_DATA_URL = window.REACT_APP_HISTORICAL_DATA_URL || process.env.REACT_APP_HISTORICAL_DATA_URL;

export const AUTH_SERVER_URL = window.REACT_APP_AUTH_SERVER_URL || process.env.REACT_APP_AUTH_SERVER_URL;

export const REACT_APP_PUBLIC_QR_CODE_URL =
  window.REACT_APP_PUBLIC_QR_CODE_URL || process.env.REACT_APP_PUBLIC_QR_CODE_URL;

export const REACT_APP_PRIVATE_QR_CODE_URL =
  window.REACT_APP_PRIVATE_QR_CODE_URL || process.env.REACT_APP_PRIVATE_QR_CODE_URL;

export const TELEGRAM_AUTH_URL = window.REACT_APP_TELEGRAM_AUTH_URL || process.env.REACT_APP_TELEGRAM_AUTH_URL;

export const TELEGRAM_AUTH_BOT = window.REACT_APP_TELEGRAM_AUTH_BOT || process.env.REACT_APP_TELEGRAM_AUTH_BOT;

export const DEALERS_URL = window.REACT_APP_DEALERS_URL || process.env.REACT_APP_DEALERS_URL;

export const TV_CONFIG = {
  disableLogo: true,

  height: '100%',
  width: '100%',
  theme: 'dark',
  debug: false,
  toolbar_bg: '#0d112b',
  custom_css_url: 'css/trading_view_override.css',
  disabled_features: [
    // 'header_widget',
    // 'header_symbol_search',
    // 'delete_button_in_legend',
    // 'header_compare',
    'adaptive_logo',
    // 'show_logo_on_all_charts',
    // 'compare_symbol',
    // 'go_to_date',
    // 'edit_buttons_in_legend',
    // 'left_toolbar',
    // 'timeframes_toolbar',
    // 'border_around_the_chart',
    // 'right_bar_stays_on_scroll',
    'volume_force_overlay',
    'use_localstorage_for_settings'
  ],
  enabled_features: [
    'side_toolbar_in_fullscreen_mode',
    'header_saveload_to_the_right',
    'narrow_chart_enabled',
    'create_volume_indicator_by_default'
  ],
  drawings_access: {
    type: 'black',
    tools: [{ name: 'Regression Trend' }]
  },
  time_frames: [
    { text: '1min', resolution: '1' },
    { text: '5min', resolution: '5' },
    { text: '15min', resolution: '15' },
    // { text: '30min', resolution: '30' },
    { text: '1h', resolution: '60' },
    { text: '6h', resolution: '360' },
    { text: '1day', resolution: 'D' }
  ],
  studies_overrides: {
    // 'volume.volume.transparency': 30,
    'volume.volume.color.0': '#68B168',
    'volume.volume.color.1': '#09f'
    // 'volume.show ma': true
    // 'Overlay.style': 2,
    // 'Overlay.lineStyle.linewidth': 2
  },
  overrides: {
    'paneProperties.background': '#020517',
    'paneProperties.vertGridProperties.color': '#020517',
    'paneProperties.horzGridProperties.color': '#020517',
    'paneProperties.crossHairProperties.color': '#020517',
    'paneProperties.gridProperties.color': '#ffffff',

    'paneProperties.topMargin': 6,
    'paneProperties.bottomMargin': 5,

    'paneProperties.legendProperties.showStudyArguments': true,
    'paneProperties.legendProperties.showStudyTitles': true,
    'paneProperties.legendProperties.showStudyValues': true,
    'paneProperties.legendProperties.showSeriesTitle': true,
    'paneProperties.legendProperties.showSeriesOHLC': true,
    'paneProperties.legendProperties.showLegend': true,

    // 'scalesProperties.lineColor' : "#0D112B",
    // 'scalesProperties.textColor' : "#0D112B",
    'scalesProperties.lineColor': 'rgba(127, 139, 194, 0.5)',
    'scalesProperties.textColor': 'rgba(127, 139, 194, 0.5)',
    'scalesProperties.showLeftScale': false,
    'scalesProperties.showRightScale': true,
    'scalesProperties.backgroundColor': '#020518',
    'scalesProperties.showSeriesLastValue': false,

    'mainSeriesProperties.style': 3,
    'mainSeriesProperties.minTick': '1',
    // Candles styles
    'mainSeriesProperties.candleStyle.upColor': '#08620a',
    'mainSeriesProperties.candleStyle.downColor': '#bb080a',
    'mainSeriesProperties.candleStyle.drawWick': true,
    'mainSeriesProperties.candleStyle.drawBorder': true,
    'mainSeriesProperties.candleStyle.borderColor': '#767E83',
    'mainSeriesProperties.candleStyle.borderUpColor': '#066b06',
    'mainSeriesProperties.candleStyle.borderDownColor': '#e01b1c',
    'mainSeriesProperties.candleStyle.wickUpColor': '#767E83',
    'mainSeriesProperties.candleStyle.wickDownColor': '#767E83',
    'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
    'mainSeriesProperties.showPriceLine': false,

    // Hollow Candles styles
    'mainSeriesProperties.hollowCandleStyle.upColor': '#08620a',
    'mainSeriesProperties.hollowCandleStyle.downColor': '#bb080a',

    // Heiken Ashi styles
    'mainSeriesProperties.haStyle.upColor': '#08620a',
    'mainSeriesProperties.haStyle.downColor': '#bb080a',

    // Bars styles
    'mainSeriesProperties.barStyle.upColor': '#08620a',
    'mainSeriesProperties.barStyle.downColor': '#bb080a',

    // Line styles
    'mainSeriesProperties.lineStyle.color': '#FFFFFF',

    //	Area styles
    'mainSeriesProperties.areaStyle.color1': '#060824',
    'mainSeriesProperties.areaStyle.color2': '#060824',
    // 'mainSeriesProperties.areaStyle.color1': 'rgba(36, 34, 156, 0.3)',
    // 'mainSeriesProperties.areaStyle.color2': 'rgba(70, 14, 203, 0.3)',
    'mainSeriesProperties.areaStyle.linecolor': '#d4d4d4',
    'mainSeriesProperties.areaStyle.linewidth': 1,
    'mainSeriesProperties.areaStyle.priceSource': 'close',
    'mainSeriesProperties.hollowCandleStyle.drawWick': false,
    'mainSeriesProperties.haStyle.drawWick': false,

    'symbolWatermarkProperties.transparency': 90,
    'timeScale.rightOffset': 0,
    volumePaneSize: 'large'
  }
};

export const RANGE_OPTIONS = [
  {
    label: '1H',
    value: 'Hour',
    endpoint: 'histominute',
    aggregate: 1,
    limit: 120,
    interval: 60000
  },
  {
    label: '1D',
    value: 'Day',
    endpoint: 'histominute',
    aggregate: 12,
    limit: 120,
    interval: 720000
  },
  {
    label: '1W',
    value: 'Week',
    endpoint: 'histohour',
    aggregate: 2,
    limit: 110,
    interval: 7200000
  },
  {
    label: '1M',
    value: 'Month',
    endpoint: 'histohour',
    aggregate: 6,
    limit: 124,
    interval: 21600000
  },
  {
    label: '1Y',
    value: 'Year',
    endpoint: 'histoday',
    aggregate: 3,
    limit: 122,
    interval: 259200000
  }
];

export const ORDER_BOOK_ROWS_COUNT = 10;

export const PortfolioChartMarker = {
  enabled: true,
  lineWidth: 2,
  lineColor: '#263583',
  radius: 3,
  states: {
    hover: {
      animation: {
        duration: 0
      },
      enabled: true,
      lineWidthPlus: 0,
      lineColor: 'rgba(255, 255, 255, 0.2)',
      fillColor: 'rgba(255, 255, 255, 0.5)',
      radiusPlus: 2
    }
  }
};

export const SETTING_TIPPY_INFO = {
  ARBITRAGE_MODE:
    'Turn On to automate selection of the lowest buy price and highest sell price from your approved exchanges.',
  MARKET_MAKER_MODE: 'Market Maker Mode',
  HEDGE_FUND_MODE: 'Hedge Fund Mode (Arbitrage)',
  FOREX_TRADER_MODE: 'Forex Trader Mode',
  GOOGLE_2FA: 'Turn On to enable Google 2-factor-authentication on login.',
  EMAIL_2FA: 'Turn On to enable Email 2-factor-authentication on login. (This option is not working at the moment.)',
  PRIVATE_VPN: 'Turn On to login using a VPN (Virtual Privacy Network).',
  BALANCE_CREDIT: 'Turn On to see Store Credit included in your balance.',
  STORE_CREDIT: 'Credits that can be used to pay for in-app purchases or sent to other users.',
  DEMO_MODE: 'Select to Reset your Demo balance to 1 BTC.',
  WORD12_PHRASE: 'Enter the 12-word phrase from your hardware device to recover your account.',
  REAL_TREADING: 'Turn On to switch from Demo Mode to Real Trading Mode.',
  ACCESS_LEVEL: 'Select your preferred Access Level.',
  DEMO_MODE_TOOLTIP: 'System goes into live trading mode after you connect at least one exchange',
  LANGUAGE: 'Select your preferred language.',
  DEFAULT_FIAT: 'Select the default fiat currency used to display your Portfolio Balance.',
  DEFAULT_CRYPTO: 'Select a default Crypto for trading pairs.',
  DEFAULT_CURRENCY: 'Changing this will affect what to use by C1 in trade.',
  DEFAULT_URL: 'Enter your whitelabel URL.',
  REFERRED_BY: 'Enter the name of who referred you.',
  YOU_REFERRED: 'The count you referred',
  AFFILIATE_LINK: 'Referr Other users to this site to increase your Level and earn a referral fee.',
  TIMER: 'Set count timer.',
  TIMER_AFTER: 'Initiate timer.',
  FOREX_PROFIT_MARGIN: 'Select the default forex profit margin used to display in forex app.',
  REFINED_ADDRESS: 'Input the refined address.'
};

export const ORDER_BOOK_THROTTLE = process.env.REACT_APP_ORDER_BOOK_THROTTLE || 500;

// Magic Numbers
// Bill background image  Ratio
export const BILL_IMG_RATIO = 1024 / 577;
export const BILL_RIGHT_GAP_RATIO = 0.166015625;
export const BILL_QR_RATIO = 0.3812824956672444;

export const MODE_KEYS = {
  depthChartKey: 'depth-chart',
  coldStorage: 'cold-storage',
  myPortfolioModeKey: 'my-portfolio',
  accountsModeKey: 'accounts',
  orderHistoryModeKey: 'order-history',
  tradeHistoryModeKey: 'trade-history',
  paymentHistoryModeKey: 'payment-history',
  navReportModeKey: 'nav-report',
  myTradesModeKey: 'trades',
  activeModeKey: 'active',
  filledModeKey: 'filled',
  reportsModeKey: 'reports'
};

export const MODE_INFO = {
  [MODE_KEYS.myPortfolioModeKey]: {
    label: 'My Portfolio'
  },
  [MODE_KEYS.accountsModeKey]: {
    label: 'Accounts',
    comment: 'Your Exchange Balances',
    tooltip: 'View Accounts'
  },
  [MODE_KEYS.orderHistoryModeKey]: {
    label: 'Order History',
    tooltip: 'Click to view Order History'
  },
  [MODE_KEYS.tradeHistoryModeKey]: {
    label: 'Trade History',
    tooltip: 'Click to view Trade History'
  },
  [MODE_KEYS.paymentHistoryModeKey]: {
    label: 'Payment History',
    tooltip: 'Click to view Payment History'
  },
  [MODE_KEYS.navReportModeKey]: {
    label: 'NAV Report',
    tooltip: 'Click to view NAV Report'
  },
  [MODE_KEYS.myTradesModeKey]: {
    label: 'My Trades',
    tooltip: 'View your Trades'
  },
  [MODE_KEYS.depthChartKey]: {
    label: 'Depth Chart',
    tooltip: 'View Market Depth Chart'
  },
  [MODE_KEYS.activeModeKey]: {
    label: 'Active',
    comment: 'Active Orders',
    tooltip: 'View Active Orders'
  },
  [MODE_KEYS.filledModeKey]: {
    label: 'Filled and Cancelled',
    comment: 'Filled and Cancelled Orders',
    tooltip: 'View Filled and Cancelled Orders'
  },
  [MODE_KEYS.coldStorage]: {
    label: 'ColdStorage',
    tooltip: 'View Filled and Cancelled Orders'
  },
  [MODE_KEYS.reportsModeKey]: {
    label: 'Reports'
  }
};

export const DEFAULT_FIAT_VALUES = {
  fiat: 'USD',
  symbol: '$',
  price: 0
};
