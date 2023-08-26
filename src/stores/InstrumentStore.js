import { observable, action, computed, reaction } from 'mobx';
import uniq from 'lodash/uniq';
import randomColor from 'randomcolor';
import { CoinsRequest } from '@/lib/bct-ws';
import COIN_DATA_MAP from '@/mock/coin-data-map';
import STOCKS from '@/mock/stocks';

const defaultBase = 'BTC';
const defaultQuote = 'F:USD';

const bigCryptos = [
  'BTC',
  'ETH',
  'XRP',
  'BCH',
  'LTC',
  'BNB',
  'USDT',
  'EOS',
  'BSV',
  'XMR',
  'XLM',
  'ADA',
  'LEO',
  'TRX',
  'LINK',
  'DASH',
  'XTZ',
  'NEO',
  'MIOTA',
  'ETC',
  'ATOM',
  'MKR',
  'XEM',
  'USDC',
  'CRO',
  'ONT',
  'VSYS',
  'ZEC',
  'DOGE',
  'DCR'
];

const bigFiats = [
  'F:CNY',
  'F:USD',
  'F:EUR',
  'F:JPY',
  'F:GBP',
  'F:KRW',
  'F:INR',
  'F:CAD',
  'F:HKD',
  'F:BRL',
  'F:AUD',
  'F:TWD',
  'F:CHF',
  'F:RUB',
  'F:THB',
  'F:MXN',
  'F:SAR',
  'F:SGD',
  'F:MYR',
  'F:AED',
  'F:IDR',
  'F:TRY',
  'F:PLN',
  'F:SEK',
  'F:VND',
  'F:CLP',
  'F:ILS',
  'F:NOK',
  'F:ZAR',
  'F:EGP'
];

const bigStocks = [
  'S:MSFT',
  'S:AAPL',
  'S:AMZN',
  'S:GOOG',
  'S:GOOGL',
  'S:FB',
  'S:BRK.A',
  'S:BRK.B',
  'S:BABA',
  'S:V',
  'S:JNJ',
  'S:JPM',
  'S:WMT',
  'S:PT',
  'S:XOM',
  'S:MA',
  'S:TBB',
  'S:TBC',
  'S:T',
  'S:BAC',
  'S:DIS',
  'S:VZ',
  'S:UNH',
  'S:KO',
  'S:HD',
  'S:RDS.B',
  'S:RDS.A',
  'S:CVX',
  'S:MRK',
  'S:TM'
];

const bigBonds = [
  'S:HYG',
  'S:JNK',
  'S:BKLN',
  'S:SHYG',
  'S:HYLB',
  'S:SJNK',
  'S:USHY',
  'S:SRLN',
  'S:FTSL',
  'S:HYS',
  'S:HYLS',
  'S:BSJK',
  'S:ANGL',
  'S:BSJL',
  'S:BSJJ',
  'S:PHB',
  'S:BSJM',
  'S:YLD',
  'S:HYZD',
  'S:BSJN'
];

const normalizeAllCoins = coinsEnabled => {
  const allCoins = coinsEnabled.map(coin => {
    const coinMap = {
      coin: coin[0],
      symbolId: coin[1],
      isEnabled: coin[2] === 1,
      price: coin[3],
      priceChange24: coin[4],
      marketVolume24: coin[5],
      marketCap: coin[6],
      amountUsd: 0,
      Coin: coin[0],
      position: 0,
      name: coin[9],
      symbol: coin[0]
    };

    if (COIN_DATA_MAP[coinMap.coin]) {
      return {
        ...coinMap,
        ...COIN_DATA_MAP[coinMap.coin]
      };
    }

    if (STOCKS[coinMap.coin]) {
      const stockName = (coinMap.coin || '').replace('S:', '');
      return {
        ...coinMap,
        ...STOCKS[coinMap.coin],
        file: `https://storage.googleapis.com/iex/api/logos/${stockName}.png`,
        rgb: '(250, 159, 50)',
        hex: randomColor(),
        social_info: []
      };
    }

    return coinMap;
  });

  return allCoins;
};

class InstrumentStore {
  @observable isLoaded = false;
  @observable.shallow normalizedCoins = [];
  @observable RouterCoin = '';
  @observable selectedBase = null;
  @observable selectedQuote = null;
  @observable.shallow baseCoinMap = {};
  @observable.shallow quoteCoinMap = {};
  @observable activePositions = [];
  @observable.shallow topCryptos = [];
  @observable.shallow topFiats = [];
  @observable.shallow topStocks = [];
  @observable.shallow topBonds = [];

  @observable recentQuotes = ['BTC', 'ETH', 'USDT'];

  constructor() {
    this.__setDefaultBasesQuotes();
  }

  async __setDefaultBasesQuotes() {
    const coinsEnabled = await CoinsRequest({ Coin: '*' });
    const coins = normalizeAllCoins(coinsEnabled);
    this.normalizedCoins = coins;
    this.setZeroCurrencies(coins);

    this.setBase(this.RouterCoin ? this.RouterCoin : defaultBase);
    this.setQuote(this.RouterCoin ? defaultBase : defaultQuote);

    this.isLoaded = true;
  }

  setZeroCurrencies(coins) {
    if (this.topCryptos.length === 0) {
      const cryptos = [];
      const fiats = [];
      const stocks = [];
      const bonds = [];

      for (let i = 0; i < bigCryptos.length; i++) {
        const crypto = coins.find(item => item.symbol === bigCryptos[i]);
        if (crypto) {
          cryptos.push(crypto);
        }
      }

      for (let i = 0; i < bigFiats.length; i++) {
        const fiat = coins.find(item => item.symbol === bigFiats[i]);
        if (fiat) {
          fiats.push(fiat);
        }
      }

      for (let i = 0; i < bigStocks.length; i++) {
        const stock = coins.find(item => item.symbol === bigStocks[i]);
        if (stock) {
          stocks.push(stock);
        }
      }

      for (let i = 0; i < bigStocks.length; i++) {
        const bond = coins.find(item => item.symbol === bigBonds[i]);
        if (bond) {
          bonds.push(bond);
        }
      }

      this.topCryptos = cryptos;
      this.topFiats = fiats;
      this.topStocks = stocks;
      this.topBonds = bonds;
    }
  }

  @computed({
    equals: ([prevBase, prevQuote], [nextBase, nextQuote]) => {
      if (!(nextBase && nextQuote) && !(prevBase && prevQuote)) return true;
      return nextBase === nextQuote;
    }
  })
  get selectedInstrumentPair() {
    return [this.selectedBase, this.selectedQuote];
  }

  @action.bound
  setRouterCoin(coin) {
    this.RouterCoin = coin;
  }

  @action.bound
  async setBase(base) {
    this.selectedBase = base;
    this.baseCoinMap = this.normalizedCoins.find(x => x.symbol === base);

    // --- We will not allow same coin for BASE AND QUOTE always ---//
    if (this.selectedBase === 'F:USD' || this.selectedBase === 'USDT') {
      this.setQuote('BTC');
    } else {
      this.setQuote('F:USD');
    }
  }

  @action.bound
  setQuote(quote) {
    this.selectedQuote = quote;

    this.quoteCoinMap = this.normalizedCoins.find(x => x.symbol === quote);

    // --- We will not allow same coin for BASE AND QUOTE always ---//
    if (this.selectedBase === this.selectedQuote) {
      if (this.selectedBase === 'BTC') {
        this.setBase('F:USD');
      } else {
        this.setBase('BTC');
      }
    }
  }

  @action.bound
  setDefaultBase() {
    this.setBase(defaultBase);
  }

  @action.bound
  addRecentQuote(quote) {
    this.recentQuotes.push(quote);
    this.recentQuotes = uniq(this.recentQuotes);
  }

  @action.bound
  setActivePostions(positions) {
    this.activePositions = [...positions];
  }

  instrumentsReaction = (reactionHandler, fireImmediately = false) => {
    return reaction(
      () => this.selectedInstrumentPair,
      ([base, quote]) => {
        if (base && quote) {
          reactionHandler(base, quote);
        }
      },
      { fireImmediately }
    );
  };

  baseCoinsReaction = (reactionHandler, fireImmediately = false) => {
    return reaction(
      () => this.normalizedCoins,
      bases => {
        reactionHandler(bases);
      },
      { fireImmediately }
    );
  };
}

export default () => {
  const store = new InstrumentStore();
  return store;
};
