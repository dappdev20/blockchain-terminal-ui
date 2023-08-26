export const coinIconOptionDropdowns = [
  { coin: 'ETH', icon: 'icon-eth' },
  { coin: 'BTC', icon: 'icon-btc' },
  { coin: 'DASH', icon: 'icon-dash' },
  { coin: 'LTC', icon: 'icon-ltc' }
];

const randExchange = () => {
  const exchanges = ['BITFINEX', 'BINANCE', 'COINBASE', 'KRAKEN', 'COINSQUARE', 'GEMINI'];
  return exchanges[Math.floor(Math.random() * exchanges.length)];
};

const randOrderStatus = () => {
  const orderStatuses = ['FILLED', 'CANCELED'];
  return orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
};

export const custodians = ['Fidelity', 'Kingdom Trust Co.', 'Custodian #1', 'Custodian #2', 'Custodian #3'];

export const exchanges = [
  'BITFINEX',
  'BINANCE',
  'COINBASE',
  'KRAKEN',
  'COINSQUARE',
  'GEMINI',
  'OKEX',
  'HUOBI',
  'BIGONE',
  'ZB.COM',
  'HITBTC',
  'BITHUMB',
  'BIBOX',
  'BCEX',
  'LBANK'
];
export const coinIcons = ['icon-btc', 'icon-dash', 'icon-eth', 'icon-ltc', 'icon-zec'];
export const coins = ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple', 'Zcash', 'Dash', 'EOS', 'Monero'];

export const yourFilledOpenOrderData = [
  [randExchange(), 'Test', 'Filled', 'Price', '0.0000', 'Time', randOrderStatus()],
  [randExchange(), 'Test2', 'Filled2', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test3', 'Filled3', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test4', 'Filled4', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test5', 'Filled5', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test6', 'Filled6', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test3', 'Filled3', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test4', 'Filled4', 'Price', '0.0000', '1M AGO', randOrderStatus()],
  [randExchange(), 'Test5', 'Filled5', 'Price', '0.0000', '1M AGO', randOrderStatus()]
];

export const blueShades = [
  '#0D47A1',
  '#1565C0',
  '#1976D2',
  '#1E88E5',
  '#2196F3',
  '#42A5F5',
  '#64B5F6',
  '#90CAF9',
  '#BBDEFB',
  '#2962FF',
  '#2979FF',
  '#448AFF'
];
