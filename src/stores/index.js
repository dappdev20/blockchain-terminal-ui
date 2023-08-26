import once from 'lodash.once';

import AutoSliderStore from './AutoSliderStore';
import CoinAddressStore from './CoinAddressStore';
import CoinHistoryStore from './CoinHistoryStore';
import ConversionAutoStore from './ConversionAutoStore';
import ConversionEntryStore from './ConversionEntryStore';
import ConvertStore from './ConvertStore';
import ExchangesStore from './ExchangesStore';
import FiatCurrencyStore from './FiatCurrencyStore';
import HistoricalPricesStore from './HistoricalPricesStore';
import InstrumentsStore from './InstrumentStore';
import LowestExchangeStore from './LowestExchangeStore';
import MarketMaker from './MarketMaker';
import MarketOrderStore from './MarketOrderStore';
import MarketsStore from './MarketsStore';
import ModalStore from './ModalStore';
import NetworkStore from './NetworkStore';
import OrderBookStore from './OrderBook';
import OrderBookBreakDownStore from './OrderBookBreakDown';
import OrderEntryStore from './OrderEntryStore';
import OrderHistory from './OrderHistory';
import PortfolioStore from './PortfolioStore';
import PriceChartStore from './PriceChartStore';
import RouterStore from './Router';
import SettingsStore from './SettingsStore';
import SMSAuthStore from './SMSAuthStore';
import SnackbarStore from './SnackbarStore';
import TelegramStore from './TelegramStore';
import TradesStore from './TradesStore';
import TradingViewStore from './TradingViewStore';
import ViewModeStore from './ViewModeStore';
import YourAccountStore from './YourAccountStore';

const ORDERBOOK = 'OrderBook';
const ORDERBOOKBREAKDOWN = 'OrderBookBreakDown';
const SNACKBARSTORE = 'SnackbarStore';
const YOURACCOUNTSTORE = 'YourAccountStore';
const MODALSTORE = 'ModalStore';
const TRADESSTORE = 'TradesStore';
const ORDERHISTORY = 'OrderHistory';
const INSTRUMENTS = 'Instruments';
const VIEWMODESTORE = 'ViewModeStore';
const ORDERENTRY = 'OrderEntry';
const CONVERTSTORE = 'ConvertStore';
const COINHISTORYSTORE = 'CoinHistoryStore';
const ROUTER = 'RouterStore';
const MARKETMAKER = 'MarketMaker';
const LOWESTEXCHANGESTORE = 'LowestExchangeStore';
const COINADDRESSSTORE = 'CoinAddressStore';
const TELEGRAMSTORE = 'TelegramStore';
const CONVERSIONENTRYSTORE = 'ConversionEntryStore';
const MARKETORDERSTORE = 'MarketOrderStore';
const CONVERSIONAUTOSTORE = 'ConversionAutoStore';
const AUTOSLIDERSTORE = 'AutoSliderStore';
const SETTINGSSTORE = 'SettingsStore';
const TRADINGVIEWSTORE = 'TradingViewStore';
const EXCHANGESSTORE = 'ExchangesStore';
const PRICECHARTSTORE = 'PriceChartStore';
const HISTORICALPRICESSTORE = 'HistoricalPricesStore';
const SMSAUTHSTORE = 'SMSAuthStore';
const NETWORKSTORE = 'NetworkStore';
const FIATCURRENCYSTORE = 'FiatCurrencyStore';
const PORTFOLIOSTORE = 'PortfolioStore';

export const STORE_KEYS = {
  ORDERBOOK,
  ORDERBOOKBREAKDOWN,
  YOURACCOUNTSTORE,
  SNACKBARSTORE,
  TRADESSTORE,
  ORDERHISTORY,
  INSTRUMENTS,
  MODALSTORE,
  VIEWMODESTORE,
  ORDERENTRY,
  CONVERTSTORE,
  ROUTER,
  MARKETMAKER,
  LOWESTEXCHANGESTORE,
  COINADDRESSSTORE,
  COINHISTORYSTORE,
  TELEGRAMSTORE,
  CONVERSIONAUTOSTORE,
  SETTINGSSTORE,
  CONVERSIONENTRYSTORE,
  MARKETORDERSTORE,
  TRADINGVIEWSTORE,
  EXCHANGESSTORE,
  AUTOSLIDERSTORE,
  PRICECHARTSTORE,
  HISTORICALPRICESSTORE,
  SMSAUTHSTORE,
  NETWORKSTORE,
  FIATCURRENCYSTORE,
  PORTFOLIOSTORE
};

export default once(() => {
  const modalStore = ModalStore();
  const snackbarStore = SnackbarStore();
  const viewModeStore = ViewModeStore();
  const instrumentStore = InstrumentsStore();

  const smsAuthStore = SMSAuthStore(snackbarStore.Snackbar);
  const convertStore = ConvertStore(snackbarStore.Snackbar);
  const yourAccountStore = YourAccountStore(instrumentStore);
  const telegramStore = TelegramStore(yourAccountStore, snackbarStore.Snackbar);
  const settingsStore = SettingsStore(telegramStore, yourAccountStore);
  const fiatCurrencyStore = FiatCurrencyStore(yourAccountStore);
  const exchangesStore = ExchangesStore(
    instrumentStore,
    settingsStore,
    snackbarStore.Snackbar,
    viewModeStore,
    smsAuthStore
  );
  const coinAddressStore = CoinAddressStore(instrumentStore);
  const marketsStore = MarketsStore();
  const orderBookBreakDownStore = OrderBookBreakDownStore(
    instrumentStore,
    exchangesStore,
    viewModeStore,
    fiatCurrencyStore,
    snackbarStore.Snackbar
  );
  const orderBookStore = OrderBookStore(instrumentStore, viewModeStore, marketsStore);
  const historicalPricesStore = HistoricalPricesStore(orderBookBreakDownStore);
  const networkStore = NetworkStore();
  const portfolioStore = PortfolioStore(
    yourAccountStore,
    fiatCurrencyStore,
    viewModeStore,
    instrumentStore.instrumentsReaction,
    orderBookBreakDownStore
  );
  const priceChartStore = PriceChartStore(
    instrumentStore,
    settingsStore,
    marketsStore,
    yourAccountStore,
    fiatCurrencyStore,
    orderBookBreakDownStore,
    viewModeStore
  );
  const tradesStore = TradesStore(settingsStore, smsAuthStore);
  const orderHistoryStore = OrderHistory(instrumentStore, settingsStore);
  const conversionEntryStore = ConversionEntryStore(
    yourAccountStore,
    instrumentStore.instrumentsReaction,
    orderBookBreakDownStore,
    fiatCurrencyStore,
    snackbarStore
  );
  const marketOrderStore = MarketOrderStore(
    yourAccountStore,
    instrumentStore.instrumentsReaction,
    orderBookBreakDownStore,
    fiatCurrencyStore,
    snackbarStore
  );
  const conversionAutoStore = ConversionAutoStore(
    yourAccountStore,
    instrumentStore.instrumentsReaction,
    snackbarStore,
    viewModeStore,
    fiatCurrencyStore
  );
  const orderEntryStore = OrderEntryStore(
    orderBookBreakDownStore,
    () => orderBookBreakDownStore.highestBidPrice,
    () => orderBookBreakDownStore.lowestAskPrice,
    instrumentStore.instrumentsReaction,
    snackbarStore.Snackbar,
    orderHistoryStore.setTargetTradeHistoryTicket
  );
  const autoSliderStore = AutoSliderStore(yourAccountStore, snackbarStore, fiatCurrencyStore, portfolioStore);
  const lowestExchangeStore = LowestExchangeStore(
    orderEntryStore.CoinsPairSearchMarketOrderBuyForm,
    orderBookStore,
    snackbarStore.Snackbar,
    telegramStore,
    convertStore,
    viewModeStore
  );
  const marketMaker = MarketMaker(snackbarStore.Snackbar);

  return {
    [STORE_KEYS.TRADESSTORE]: tradesStore,
    [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
    [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
    [STORE_KEYS.INSTRUMENTS]: instrumentStore,
    [STORE_KEYS.ORDERBOOK]: orderBookStore,
    [STORE_KEYS.ORDERBOOKBREAKDOWN]: orderBookBreakDownStore,
    [STORE_KEYS.SNACKBARSTORE]: snackbarStore,
    [STORE_KEYS.MODALSTORE]: modalStore,
    [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
    [STORE_KEYS.ORDERENTRY]: orderEntryStore,
    [STORE_KEYS.CONVERTSTORE]: convertStore,
    [STORE_KEYS.ROUTER]: RouterStore(),
    [STORE_KEYS.MARKETMAKER]: marketMaker,
    [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
    [STORE_KEYS.COINADDRESSSTORE]: coinAddressStore,
    [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
    [STORE_KEYS.COINHISTORYSTORE]: CoinHistoryStore(),
    [STORE_KEYS.SETTINGSSTORE]: settingsStore,
    [STORE_KEYS.TRADINGVIEWSTORE]: TradingViewStore(),
    [STORE_KEYS.EXCHANGESSTORE]: exchangesStore,
    [STORE_KEYS.PRICECHARTSTORE]: priceChartStore,
    [STORE_KEYS.CONVERSIONENTRYSTORE]: conversionEntryStore,
    [STORE_KEYS.MARKETORDERSTORE]: marketOrderStore,
    [STORE_KEYS.CONVERSIONAUTOSTORE]: conversionAutoStore,
    [STORE_KEYS.HISTORICALPRICESSTORE]: historicalPricesStore,
    [STORE_KEYS.SMSAUTHSTORE]: smsAuthStore,
    [STORE_KEYS.AUTOSLIDERSTORE]: autoSliderStore,
    [STORE_KEYS.NETWORKSTORE]: networkStore,
    [STORE_KEYS.FIATCURRENCYSTORE]: fiatCurrencyStore,
    [STORE_KEYS.PORTFOLIOSTORE]: portfolioStore
  };
});
