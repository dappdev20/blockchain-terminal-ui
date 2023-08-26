import { action, observable, reaction } from 'mobx';
import debounce from 'lodash/debounce';

import { GetSettingsRequest, UpdateSettingsRequest } from '../lib/bct-ws';
import { languages } from '../lib/translations/languages';
import { capitalizeFirstLetter } from '../utils';
import { mockCountries } from '../mock/countries';
import { currencyList } from '@/mock/currencies';
import { MODE_KEYS, DEFAULT_FIAT_VALUES } from '@/config/constants';

export const autoConvertOptions = {
  Off: 'Off',
  Partial: 'Partial',
  All: 'All'
};

class SettingsStore {
  @observable isRealTrading = true;
  @observable portfolioIncludesBct = false;
  @observable privateVpn = false;
  @observable isShortSell = false;
  @observable tradingHistory = false;
  @observable accessLevel = 'Level 1';
  @observable language = '';

  @observable defaultFiat = '';
  @observable defaultFiatSymbol = '';
  @observable currentFiatPrice = 1;
  @observable defaultCrypto = '';
  @observable defaultCryptoSymbol = '';
  @observable defaultCryptoPrice = 0;
  @observable isDefaultCrypto = false;

  @observable defaultTelegram = '';
  @observable defaultURL = '';
  @observable referredBy = 'shaunmacdonald';
  @observable referCount = 0;
  @observable affiliateLink = '';
  @observable countries = [];
  @observable currencies = [];
  @observable historyData = [];
  @observable price = 1;
  @observable refinedAddress = '';

  @observable defaultCryptoAmount = 0.33;
  @observable marginTrading = 0;
  @observable autoPaybackBct = false;

  @observable isExporting = false;

  @observable isAutoConvert = autoConvertOptions.Off;
  @observable swap = 'Convert';
  @observable c1 = 'All Coins';
  @observable c2 = 'USDT';
  @observable autoFlip = 'Auto Flip';
  @observable slider = 'Best Execution';
  @observable timer = 30;
  @observable withdrawAddress = '';
  @observable defaultForex = '';
  @observable.shallow activeReports = [MODE_KEYS.myPortfolioModeKey, MODE_KEYS.depthChartKey, MODE_KEYS.coldStorage];

  isLoggedIn = false;
  PortfolioData = null;
  isHistoryUpdate = false;

  constructor(telegramStore, yourAccountStore) {
    this.isLoggedIn = localStorage.getItem('authToken');

    reaction(
      () => telegramStore.isLoggedIn,
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (this.isLoggedIn) {
          this.setShortSell(false);
          // Get settings from backend after login
          this.getSettingsFromWs();
        }
      }
    );

    reaction(
      () => yourAccountStore.PortfolioData,
      PortfolioData => {
        this.PortfolioData = PortfolioData;
        this.updateDefaultCryptoPrice();
      }
    );

    const language = (
      (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language
    ).toLowerCase();
    languages.forEach(lang => {
      if (language === (lang.code || lang.key)) {
        this.language = lang.value;
      }
    });
    if (!this.language) {
      this.language = 'English';
    }

    // Load LocalStorage first
    this.loadLocalStorage();

    // Get settings from backend when app starts
    if (this.isLoggedIn) {
      this.getSettingsFromWs();
    }

    this.mustConditions();

    this.fetchPrice();

    setInterval(this.fetchPrice, 2 * 60 * 60 * 1000);
  }

  updateDefaultCryptoPrice() {
    if (this.PortfolioData) {
      this.updateCurrencies();
      for (let i = 0; i < this.PortfolioData.length; i++) {
        if (this.PortfolioData[i] && this.PortfolioData[i].Name === this.defaultCrypto) {
          this.defaultCryptoSymbol = (this.PortfolioData[i].Coin || '').replace('F:', '');
          this.defaultCryptoPrice = this.PortfolioData[i].Price || 0;
          break;
        }
      }
    }
  }

  fetchPrice = async () => {
    // Todo: We will use FiatCurrencyStore instead of direct access here
    if (process.env.NODE_ENV === 'production') {
      const url = '/price';

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.countries = data;

          this.updatePrice();
        })
        .catch(console.log);
    } else {
      this.countries = mockCountries;

      this.updatePrice();
    }
  };

  updateCurrencies = () => {
    const currencies_coin = [];
    const currencies_country = [];
    const currencies_stock = [];

    if (this.PortfolioData) {
      this.PortfolioData.forEach(item => {
        if (item.Coin.indexOf('F:') < 0 && item.Coin.indexOf('S:') < 0) {
          currencies_coin.push({
            type: 'crypto',
            currency: item.Name,
            currencyCode: item.Coin,
            price: item.Price,
            symbol: item.Coin,
            position: item.Position,
            amountUsd: item.AmountUsd
          });
        } else if (item.Coin.indexOf('S:') === 0) {
          currencies_stock.push({
            type: 'stock',
            currency: (item.Name || '').replace('S:', ''),
            currencyCode: (item.coin || '').replace('S:', ''),
            price: item.Price,
            symbol: (item.coin || '').replace('S:', ''),
            position: item.Position,
            amountUsd: item.AmountUsd
          });
        } else if (item.Coin.indexOf('F:') === 0) {
          const symbolItem = currencyList.find(c => c.code === item.Coin.replace('F:', ''));
          const countryItem = this.countries.find(c => c.currencyCode === item.Coin.replace('F:', ''));
          if (countryItem) {
            currencies_country.push({
              type: 'country',
              currency: countryItem.currency,
              currencyCode: countryItem.currencyCode,
              price: 1 / countryItem.price,
              symbol: symbolItem.symbol,
              position: item.Position,
              amountUsd: (item.Position * 1) / countryItem.price
            });
          }
        }
      });
    }

    const currencies_other = currencies_country.concat(currencies_coin).concat(currencies_stock);
    currencies_other.sort((a, b) => {
      return a.currencyCode.toLowerCase() < b.currencyCode.toLowerCase() ? -1 : 1;
    });
    this.currencies = currencies_other;
  };

  updateFiatInfo = (fiat, country) => {
    this.currentCountry = country || this.countries.find(c => c.currencyCode === fiat);
    const currency = currencyList.find(c => c.code === fiat);
    this.price = this.currentCountry ? this.currentCountry.price : DEFAULT_FIAT_VALUES.price;
    this.defaultFiatSymbol = currency ? currency.symbol : DEFAULT_FIAT_VALUES.symbol;
  };

  updatePrice = () => {
    if (this.countries && this.countries.length > 0) {
      this.updateCurrencies();
      if (!this.defaultFiat) {
        const language = languages.find(lang => lang.value === this.language);
        const langCode = language ? language.code || language.key : 'en-us';
        this.currentCountry = this.countries.find(country => langCode === country.langCode);
        this.defaultFiat = this.currentCountry ? this.currentCountry.currencyCode : DEFAULT_FIAT_VALUES.fiat;
        this.updateFiatInfo(this.defaultFiat, this.currentCountry);

        // exception
        if (this.defaultFiat === 'BMD') {
          this.price = 1;
        }
      }
    }
  };

  mustConditions = () => {
    if (this.isRealTrading) {
      this.setShortSell(false);
    }
    this.setIsDefaultCrypto(false);
  };

  getSettingsFromWs = () => {
    GetSettingsRequest()
      .then(data => {
        if (data && data.Settings) {
          this.isRealTrading = data.Settings.realTrading != null ? data.Settings.realTrading : this.isRealTrading;
          localStorage.setItem('isRealTrading', this.isRealTrading.toString());
          this.portfolioIncludesBct =
            data.Settings.portfolioIncludesBct != null ? data.Settings.portfolioIncludesBct : this.portfolioIncludesBct;
          localStorage.setItem('portfolioIncludesBct', this.portfolioIncludesBct.toString());
          this.isGoogle2FA = data.Settings.isGoogle2FA != null ? data.Settings.isGoogle2FA : this.isGoogle2FA;
          localStorage.setItem('isGoogle2FA', this.isGoogle2FA.toString());
          this.isEmail2FA = data.Settings.isEmail2FA != null ? data.Settings.isEmail2FA : this.isEmail2FA;
          localStorage.setItem('isEmail2FA', this.isEmail2FA.toString());
          this.privateVpn = data.Settings.privateVpn != null ? data.Settings.privateVpn : this.privateVpn;
          localStorage.setItem('privateVpn', this.privateVpn.toString());
          this.isShortSell = data.Settings.shortSelling != null ? data.Settings.shortSelling : this.isShortSell;
          localStorage.setItem('isShortSell', this.isShortSell.toString());
          this.tradingHistory =
            data.Settings.tradingHistory != null ? data.Settings.tradingHistory : this.tradingHistory;
          localStorage.setItem('tradingHistory', this.tradingHistory.toString());
          this.language =
            data.Settings.language != null ? capitalizeFirstLetter(data.Settings.language) : this.language;
          localStorage.setItem('language', this.language.toString());
          this.defaultFiat =
            data.Settings.defaultFiat != null ? data.Settings.defaultFiat.toUpperCase() : this.defaultFiat;
          this.updateFiatInfo(this.defaultFiat);
          localStorage.setItem('defaultFiat', this.defaultFiat.toString());
          this.defaultForex =
            data.Settings.defaultForex != null ? data.Settings.defaultForex.toUpperCase() : this.defaultForex;
          localStorage.setItem('defaultForex', this.defaultForex.toString());
          this.defaultCrypto = data.Settings.defaultCrypto != null ? data.Settings.defaultCrypto : this.defaultCrypto;
          localStorage.setItem('defaultCrypto', this.defaultCrypto.toString());
          this.isDefaultCrypto =
            data.Settings.isDefaultCrypto != null ? data.Settings.isDefaultCrypto : this.isDefaultCrypto;
          if (this.isDefaultCrypto) {
            this.updateDefaultCryptoPrice();
          }
          localStorage.setItem('isDefaultCrypto', this.isDefaultCrypto.toString());
          this.defaultTelegram =
            data.Settings.defaultTelegram != null ? data.Settings.defaultTelegram : this.defaultTelegram;
          localStorage.setItem('defaultTelegram', this.defaultTelegram.toString());
          // this.defaultURL = data.Settings.defaultURL != null
          //     ? data.Settings.defaultURL
          //     : this.defaultURL;
          // localStorage.setItem('defaultURL', this.defaultURL.toString());
          this.referredBy = data.Settings.referredBy != null ? data.Settings.referredBy : this.referredBy;
          localStorage.setItem('referredBy', this.referredBy.toString());
          this.affiliateLink = data.Settings.affiliateLink != null ? data.Settings.affiliateLink : this.affiliateLink;
          localStorage.setItem('affiliateLink', this.affiliateLink.toString());
          this.defaultCryptoAmount =
            data.Settings.defaultCryptoAmount != null ? data.Settings.defaultCryptoAmount : this.defaultCryptoAmount;
          localStorage.setItem('defaultCryptoAmount', this.defaultCryptoAmount.toString());
          this.marginTrading = data.Settings.marginTrading != null ? data.Settings.marginTrading : this.marginTrading;
          localStorage.setItem('marginTrading', this.marginTrading.toString());
          this.autoPaybackBct =
            data.Settings.autoPaybackBct != null ? data.Settings.autoPaybackBct : this.autoPaybackBct;
          localStorage.setItem('autoPaybackBct', this.autoPaybackBct.toString());
          this.isExporting = data.Settings.isExporting != null ? data.Settings.isExporting : this.isExporting;
          localStorage.setItem('isExporting', this.isExporting.toString());
          this.isAutoConvert = data.Settings.isAutoConvert != null ? data.Settings.isAutoConvert : this.isAutoConvert;
          if (Object.values(autoConvertOptions).indexOf(this.isAutoConvert.toString()) === -1) {
            if (this.isAutoConvert.toString() === 'true') {
              this.isAutoConvert = autoConvertOptions.Partial;
            } else {
              this.isAutoConvert = autoConvertOptions.Off;
            }
          }
          localStorage.setItem('isAutoConvert', this.isAutoConvert.toString());
          this.timer = data.Settings.timer != null ? data.Settings.timer : this.timer;
          localStorage.setItem('timer', this.timer.toString());
          this.swap = data.Settings.swap != null ? data.Settings.swap : this.swap;
          localStorage.setItem('swap', this.swap.toString());
          this.c1 = data.Settings.c1 != null ? data.Settings.c1 : this.c1;
          localStorage.setItem('c1', this.c1.toString());
          this.c2 = data.Settings.c2 != null ? data.Settings.c2 : this.c2;
          localStorage.setItem('c2', this.c2.toString());
          this.autoFlip = data.Settings.autoFlip != null ? data.Settings.autoFlip : this.autoFlip;
          localStorage.setItem('autoFlip', this.autoFlip.toString());
          this.slider = data.Settings.slider != null ? data.Settings.slider : this.slider;
          localStorage.setItem('slider', this.slider.toString());
        }

        this.mustConditions();
      })
      .catch(e => console.log('can not get settings from ws', e));
  };

  loadLocalStorage = () => {
    this.isRealTrading = localStorage.getItem('isRealTrading') === 'true';
    this.portfolioIncludesBct = localStorage.getItem('portfolioIncludesBct') === 'true';
    this.isGoogle2FA = localStorage.getItem('isGoogle2FA') === 'true';
    this.isEmail2FA = localStorage.getItem('isEmail2FA') === 'true';
    this.privateVpn = localStorage.getItem('privateVpn') === 'true';
    this.isShortSell = localStorage.getItem('isShortSell') === 'true';
    this.tradingHistory = localStorage.getItem('tradingHistory') === 'true';
    this.language = localStorage.getItem('language') || this.language;
    this.defaultFiat = localStorage.getItem('defaultFiat') || this.defaultFiat;
    this.defaultFiatSymbol = localStorage.getItem('defaultFiatSymbol') || this.defaultFiatSymbol;
    this.defaultForex = localStorage.getItem('defaultForex') || this.defaultForex;
    this.defaultCrypto = localStorage.getItem('defaultCrypto') || 'Bitcoin';
    this.isDefaultCrypto = localStorage.getItem('isDefaultCrypto') === 'true';
    if (this.isDefaultCrypto) {
      this.updateDefaultCryptoPrice();
    }
    this.defaultTelegram = localStorage.getItem('defaultTelegram') || '';
    // this.defaultURL = localStorage.getItem('defaultURL') || '';
    this.defaultURL = window.location.hostname || '';
    this.referredBy = localStorage.getItem('referredBy') || 'shaunmacdonald';
    this.affiliateLink = localStorage.getItem('affiliateLink') || '';
    this.defaultCryptoAmount = localStorage.getItem('defaultCryptoAmount') || 0.33;
    this.marginTrading = localStorage.getItem('marginTrading') || 0;
    this.autoPaybackBct = localStorage.getItem('autoPaybackBct') === 'true';
    this.isExporting = localStorage.getItem('isExporting') === 'true';
    this.isAutoConvert = localStorage.getItem('isAutoConvert') || autoConvertOptions.Partial;
    this.timer = localStorage.getItem('timer') || 30;
    this.swap = localStorage.getItem('swap') || 'Convert';
    this.c1 = localStorage.getItem('c1') || 'All Coins';
    this.c2 = localStorage.getItem('c2') || 'USDT';
    this.autoFlip = localStorage.getItem('autoFlip') || 'Auto Flip';
    this.slider = localStorage.getItem('slider') || 'Best Execution';
    this.activeReports = JSON.parse(localStorage.getItem('activeReports')) || [
      MODE_KEYS.myPortfolioModeKey,
      MODE_KEYS.depthChartKey,
      MODE_KEYS.coldStorage
    ];
    this.sortActionReports();
    if (Object.values(autoConvertOptions).indexOf(this.isAutoConvert) === -1) {
      this.isAutoConvert = autoConvertOptions.Partial;
    }
  };

  updateSettingsToWs = () => {
    localStorage.setItem('isRealTrading', this.isRealTrading.toString());
    localStorage.setItem('portfolioIncludesBct', this.portfolioIncludesBct.toString());
    localStorage.setItem('isGoogle2FA', this.isGoogle2FA.toString());
    localStorage.setItem('isEmail2FA', this.isEmail2FA.toString());
    localStorage.setItem('privateVpn', this.privateVpn.toString());
    localStorage.setItem('isShortSell', this.isShortSell.toString());
    localStorage.setItem('tradingHistory', this.tradingHistory.toString());
    localStorage.setItem('language', this.language.toString());
    localStorage.setItem('defaultFiat', this.defaultFiat.toString());
    localStorage.setItem('defaultFiatSymbol', this.defaultFiatSymbol.toString());
    localStorage.setItem('defaultForex', this.defaultForex.toString());
    localStorage.setItem('defaultCrypto', this.defaultCrypto.toString());
    localStorage.setItem('isDefaultCrypto', this.isDefaultCrypto.toString());
    localStorage.setItem('defaultTelegram', this.defaultTelegram.toString());
    localStorage.setItem('defaultURL', this.defaultURL.toString());
    localStorage.setItem('referredBy', this.referredBy.toString());
    localStorage.setItem('affiliateLink', this.affiliateLink.toString());
    localStorage.setItem('defaultCryptoAmount', this.defaultCryptoAmount.toString());
    localStorage.setItem('marginTrading', this.marginTrading.toString());
    localStorage.setItem('autoPaybackBct', this.autoPaybackBct.toString());
    localStorage.setItem('isAutoConvert', this.isAutoConvert.toString());
    localStorage.setItem('timer', this.timer.toString());
    localStorage.setItem('swap', this.swap.toString());
    localStorage.setItem('c1', this.c1.toString());
    localStorage.setItem('c2', this.c2.toString());
    localStorage.setItem('autoFlip', this.autoFlip.toString());
    localStorage.setItem('slider', this.slider.toString());
    localStorage.setItem('activeReports', JSON.stringify(this.activeReports));

    this.updateFiatInfo(this.defaultFiat);

    if (!this.isLoggedIn) {
      // console.log('Not logged in, skipping ws update');
      return;
    }

    UpdateSettingsRequest({
      Settings: {
        realTrading: this.isRealTrading,
        portfolioIncludesBct: this.portfolioIncludesBct,
        isGoogle2FA: this.isGoogle2FA,
        isEmail2FA: this.isEmail2FA,
        arbitrageMode: this.isArbitrageMode,
        privateVpn: this.privateVpn,
        shortSelling: this.isShortSell,
        tradingHistory: this.tradingHistory,
        language: this.language,
        defaultFiat: this.defaultFiat,
        defaultCrypto: this.defaultCrypto,
        defaultForex: this.defaultForex,
        isDefaultCrypto: this.isDefaultCrypto,
        defaultTelegram: this.defaultTelegram,
        defaultURL: this.defaultURL,
        referredBy: this.defaultURL,
        affiliateLink: this.affiliateLink,
        defaultCryptoAmount: this.defaultCryptoAmount,
        marginTrading: this.marginTrading,
        autoPaybackBct: this.autoPaybackBct,
        isExporting: this.isExporting,
        isAutoConvert: this.isAutoConvert,
        timer: this.timer,
        swap: this.swap,
        c1: this.c1,
        c2: this.c2,
        autoFlip: this.autoFlip,
        slider: this.slider,
        activeReports: this.activeReports
      }
    })
      .then(() => {})
      .catch(e => console.log('Can not update settings to ws!', e));
  };

  sortActionReports = () => {
    const activeReports = [];
    Object.values(MODE_KEYS).forEach(key => {
      if (this.activeReports.includes(key)) {
        activeReports.push(key);
      }
    });
    this.activeReports = activeReports;
  };

  updateSettingsToWsDebounced = debounce(this.updateSettingsToWs, 250, {
    trailing: true
  });

  @action.bound setWithdrawAddress(withdrawAddress) {
    this.withdrawAddress = withdrawAddress;
  }

  @action.bound setShortSell(forceMode = undefined) {
    if (this.isShortSell === forceMode) return;
    this.isShortSell = typeof forceMode !== 'undefined' ? forceMode : !this.isShortSell;
    this.setIsAutoConvert(this.isShortSell ? autoConvertOptions.Off : autoConvertOptions.Partial);
    this.updateSettingsToWs();
  }

  @action.bound setIsAutoConvert(mode) {
    // this.isAutoConvert = (typeof isAutoConvert === 'boolean') ? isAutoConvert : !this.isAutoConvert;
    this.isAutoConvert = mode;

    if (this.isAutoConvert !== autoConvertOptions.Off) {
      this.setShortSell(false);
      this.setSwap('Convert');
    } else {
      // this.setSwap('Swap');
      this.setSwap('Convert');
      if (!this.isShortSell) {
        this.setC1('My Coins');
      }
    }

    this.updateSettingsToWs();
  }

  @action.bound setExportTrading() {
    this.isExporting = !this.isExporting;
    this.updateSettingsToWs();
  }

  /**
   * @description Set User Settings of Reports can be shown in RightLowerSection
   * @param {string} name Report Name to be active. should be one of MODE_KEYS
   */
  @action.bound setActiveReports(name) {
    const idx = this.activeReports.indexOf(name);

    if (idx !== -1) {
      this.activeReports.splice(idx, 1);
      this.activeReports = this.activeReports.slice(0);
    } else {
      this.activeReports.push(name);
      this.sortActionReports();
    }

    this.updateSettingsToWs();
  }

  @action.bound setGoogle2FA() {
    this.isGoogle2FA = !this.isGoogle2FA;
    this.updateSettingsToWs();
  }

  @action.bound setEmail2FA() {
    this.isEmail2FA = !this.isEmail2FA;
    this.updateSettingsToWs();
  }

  @action.bound setRealTrading() {
    this.isRealTrading = !this.isRealTrading;
    this.setShortSell(!this.isRealTrading);
    this.updateSettingsToWs();
  }

  @action.bound setDefaultCrypto(value = 'Bitcoin') {
    this.defaultCrypto = value;
    this.updateSettingsToWsDebounced();
    this.updateDefaultCryptoPrice();
  }

  @action.bound setDefaultTelegram(e) {
    this.defaultTelegram = e.target.value || '';
    this.defaultURL = this.defaultTelegram !== '' ? `${this.defaultTelegram}.ucraft.net` : '';
    this.updateSettingsToWsDebounced();
  }

  @action.bound setDefaultURL(e) {
    this.defaultURL = e.target.value || '';
    this.updateSettingsToWsDebounced();
  }

  @action.bound setReferredBy(e) {
    this.referredBy = e.target.value || '';
    this.updateSettingsToWsDebounced();
  }

  @action.bound setReferCount(e) {
    this.referredBy = e.target.value || '';
    this.updateSettingsToWsDebounced();
  }

  @action.bound setRefinedAddress(e) {
    this.refinedAddress = e.target.value || '';
    this.updateSettingsToWsDebounced();
  }

  @action.bound setPortfolioIncludesBct() {
    this.portfolioIncludesBct = !this.portfolioIncludesBct;
    this.updateSettingsToWs();
  }

  @action.bound setPrivateVpn() {
    this.privateVpn = !this.privateVpn;
    this.updateSettingsToWs();
  }

  @action.bound setAccessLevel(accessLevel) {
    this.accessLevel = accessLevel;
    this.updateSettingsToWs();
  }

  @action.bound setDefaultCurrencySetting(currency) {
    this.isDefaultCrypto = currency === 'Crypto';
    this.updateSettingsToWs();
  }

  @action.bound setLanguage(language) {
    this.language = language;
    this.updateSettingsToWs();
  }

  @action.bound setFiatCurrency(currency) {
    this.defaultFiat = currency;
    const selectedCurrency = currencyList.find(c => c.code === this.defaultFiat);
    if (selectedCurrency) {
      this.defaultFiatSymbol = selectedCurrency.symbol;
    }
    this.isDefaultCrypto = false;

    this.updateSettingsToWs();
  }

  @action.bound setDefaultForex(currency) {
    this.defaultForex = currency;

    this.updateSettingsToWs();
  }

  @action.bound setDefaultCurrency(currency, symbol, price, isDefaultCrypto) {
    this.isDefaultCrypto = isDefaultCrypto;

    if (isDefaultCrypto) {
      this.defaultCrypto = currency;
      this.defaultCryptoSymbol = symbol;
      this.defaultCryptoPrice = price;
    } else {
      this.defaultCrypto = 'Bitcoin';
      this.defaultCryptoSymbol = 'BTC';
      this.defaultCryptoPrice = price;
      this.setFiatPrice(price);

      this.defaultFiat = currency;
      this.defaultFiatSymbol = symbol;
    }

    this.updateSettingsToWs();
  }

  @action.bound setFiatPrice(price) {
    this.currentFiatPrice = price;
  }

  @action.bound getLocalPrice(dPrice, symbol) {
    if (symbol === 'USDT') {
      return dPrice * this.price;
    }
    return dPrice;
  }

  @action.bound getDefaultPrice(usdPrice) {
    if (!this.isDefaultCrypto) {
      return usdPrice * this.price;
    }
    return this.defaultCryptoPrice !== 0 ? usdPrice / this.defaultCryptoPrice : 0;
  }

  @action.bound getLocalCurrency(symbol) {
    if (!this.isDefaultCrypto && symbol === 'USDT') {
      return this.defaultFiat;
    }
    if (this.isDefaultCrypto) {
      return this.defaultCryptoSymbol;
    }
    return symbol;
  }

  @action.bound getUSDPrice(fiatPrice) {
    if (!this.isDefaultCrypto) {
      return this.price > 0 ? fiatPrice / this.price : 0;
    }
    return fiatPrice;
  }

  @action.bound getCoinPrice(coin) {
    if (this.PortfolioData) {
      for (let i = 0; i < this.PortfolioData.length; i++) {
        if (this.PortfolioData[i] && this.PortfolioData[i].Coin === coin) {
          return this.PortfolioData[i].Price || 0;
        }
      }
    }
    return 0;
  }

  getFiatPrice = selectedFiat => {
    const country = this.countries.find(country => country.currencyCode === selectedFiat);
    if (country) {
      return country.price;
    }
  };

  @action.bound getLocalFiatPrice(usdPrice, defaultCurrency) {
    return usdPrice * (this.getFiatPrice(defaultCurrency) || 1);
  }

  @action.bound setIsDefaultCrypto(isDefaultCrypto) {
    this.isDefaultCrypto = isDefaultCrypto;

    if (!isDefaultCrypto) {
      this.defaultCrypto = 'Bitcoin';
      this.defaultCryptoSymbol = 'BTC';
      this.defaultCryptoPrice = 1;
    }
  }

  @action.bound setTimer(value) {
    this.timer = value;
    this.updateSettingsToWs();
  }

  @action.bound setSwap(swap) {
    this.swap = swap;

    if (this.swap === 'Convert') {
      this.setAutoFlip('Disabled');
      // this.setSlider('Arbitrage(1 year back testing)');
    } else if (this.swap === 'Swap') {
      this.setAutoFlip('Auto Flip');
    }

    this.updateSettingsToWs();
  }

  @action.bound setC1(c1) {
    this.c1 = c1;
    this.updateSettingsToWs();
  }

  @action.bound setC2(c2) {
    this.c2 = c2;
    this.updateSettingsToWs();
  }

  @action.bound setAutoFlip(autoFlip) {
    this.autoFlip = autoFlip;
    this.updateSettingsToWs();
  }

  @action.bound setSlider(slider) {
    this.slider = slider;
    this.updateSettingsToWs();
  }

  @action.bound resetBalance() {
    this.setIsAutoConvert(autoConvertOptions.Off);
    this.setAutoFlip('Auto Flip');
  }

  @action.bound getSymbolFrom(curr) {
    const currency = currencyList.find(c => c.code === curr);
    if (currency) {
      return currency.symbol;
    }
    return '$';
  }
}

export default (telegramStore, yourAccountStore) => new SettingsStore(telegramStore, yourAccountStore);
