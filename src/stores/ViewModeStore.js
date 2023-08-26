import { observable, action } from 'mobx';
import { darkTheme } from '../theme/core';
import { MODE_KEYS } from '@/config/constants';

export const viewModeKeys = {
  basicModeKey: 'basic', // Wallet Table view mode
  friendModeKey: 'friend', // Telegram Friend list view mode
  publicChatModeKey: 'chat', // Telegram Public Coin's channel view mode
  advancedModeKey: 'advanced', // Global Order Book view mode
  settingsModeKey: 'settings', // Settings view mode
  historyModeKey: 'history', // History view mode
  depositModeKey: 'deposit' // Deposit view mode
};

export const settingsViewModeKeys = {
  privacyList: 'privacyList',
  affiliateList: 'affiliateList',
  advancedList: 'advancedList',
  appStoreList: 'appStoreList'
};

const StateSequence = new Set([
  viewModeKeys.basicModeKey,
  viewModeKeys.friendModeKey,
  viewModeKeys.publicChatModeKey,
  viewModeKeys.advancedModeKey,
  viewModeKeys.settingsModeKey,
  viewModeKeys.historyModeKey,
  viewModeKeys.depositModeKey
]);

export const graphViewModeKeys = {
  valueMode: 'valueMode',
  numberMode: 'numberMode',
  unfixedMode: 'unfixedMode'
};

class ViewModeStore {
  @observable viewMode;
  @observable theme = darkTheme;
  @observable tradingViewMode = false;
  @observable isSearchEnabled = false;
  @observable isGBExistMonitor = false; // TRUE: state of checking if data stream exists; FALSE: state of unchecking.
  @observable depositActiveCoin = null;
  @observable isUserDropDownOpen = false;
  @observable isSettingsOpen = false;
  @observable isLogoutModalOpen = false;
  @observable isAppStoreDropDownOpen = false;
  @observable settingsViewMode = settingsViewModeKeys.advancedList; // Which group of settings items to show
  @observable graphSwitchMode = false; // false: donut, true: portfolio
  @observable isFirstLoad = true; // true: first-loading
  @observable isAdvancedAPIMode = false;
  @observable rightBottomSectionOpenMode = MODE_KEYS.myPortfolioModeKey; // default is my trades mode
  @observable rightBottomSectionFullScreenMode = false;
  @observable masterSwitchMode = false;
  @observable isExchangeViewMode = false;
  @observable isSettingsExchangeViewMode = false;
  @observable pageIndexOfSmart = 1;
  @observable isLoaded = false;
  @observable arbMode = false;
  @observable arbHFMode = false;
  @observable isArbDetailMode = true;
  @observable portPriceGraphViewMode = graphViewModeKeys.valueMode;

  @observable isPreferenceMyTradesON = true;
  @observable isPreferenceDepthChartON = false;
  @observable isPreferenceActiveOrdersON = false;
  @observable isPreferenceFilledOrdersON = false;

  statesSequence = null;

  constructor() {
    this.gotoFirstState();
  }

  /**
   *  ViewMode State Control
   */
  @action.bound gotoFirstState() {
    this.__initStateSequence();
    this.viewMode = this.__nextState();
  }

  @action.bound progressState() {
    this.viewMode = this.__nextState();
  }

  __initStateSequence() {
    this.statesSequence = StateSequence.values();
  }

  __nextState() {
    const nextState = this.statesSequence.next();

    if (nextState.done) {
      this.__initStateSequence();
      return this.statesSequence.next().value;
    }

    return nextState.value;
  }

  /**
   *  Observable actions
   */
  @action.bound setViewMode(viewMode) {
    this.isSearchEnabled = false;

    if (viewMode === this.viewMode) {
      return;
    }
    this.viewMode = viewMode;

    let state = '';
    do {
      state = this.__nextState();
    } while (state !== viewMode);
  }

  @action.bound setTradingViewMode(mode) {
    this.tradingViewMode = mode;
  }

  @action.bound setRightBottomSectionOpenMode(mode) {
    const oldFullScreenMode = this.rightBottomSectionFullScreenMode;
    if (this.rightBottomSectionOpenMode !== mode) {
      const dontGoFullScreenModes = [
        MODE_KEYS.depthChartKey,
        MODE_KEYS.activeModeKey,
        MODE_KEYS.filledModeKey,
        MODE_KEYS.myTradesModeKey,
        MODE_KEYS.myPortfolioModeKey,
        MODE_KEYS.coldStorage
      ];
      this.rightBottomSectionFullScreenMode = !dontGoFullScreenModes.includes(mode);

      if (oldFullScreenMode && !this.rightBottomSectionFullScreenMode) {
        setTimeout(() => {
          this.rightBottomSectionOpenMode = mode;
        }, 500);
      } else {
        this.rightBottomSectionOpenMode = mode;
      }
    }
  }

  @action.bound setRightBottomSectionFullScreenMode(mode) {
    this.rightBottomSectionFullScreenMode = mode;
    this.rightBottomSectionOpenMode = MODE_KEYS.depthChartKey;
  }

  @action.bound toggleSearchEnabled(isSearchEnabled) {
    this.isSearchEnabled = typeof isSearchEnabled === 'boolean' ? isSearchEnabled : !this.isSearchEnabled;
  }

  @action.bound setGBExistMonitor(mode) {
    this.isGBExistMonitor = mode;
  }

  @action.bound openDepositView(coin) {
    this.depositActiveCoin = coin;
  }

  @action.bound setUserDropDownOpen(mode) {
    this.isUserDropDownOpen = mode;
  }

  @action.bound setSettingsOpen(mode) {
    this.isSettingsOpen = mode;
  }

  @action.bound setLogoutModalOpen(mode) {
    this.isLogoutModalOpen = mode;
  }

  @action.bound setAppStoreDropDownOpen(mode) {
    this.isAppStoreDropDownOpen = mode;
  }

  @action.bound openSettingsView(mode) {
    this.isUserDropDownOpen = false;
    this.isSettingsOpen = true;
    this.settingsViewMode = mode;
    this.setViewMode(viewModeKeys.settingsModeKey);
  }

  @action.bound setGraphSwitchMode(mode) {
    if (this.masterSwitchMode === false) {
      this.graphSwitchMode = mode;
    }
  }

  @action.bound setMasterSwitchMode(mode) {
    this.masterSwitchMode = mode;
    this.graphSwitchMode = mode;
  }

  @action.bound setIsFirstLoad(mode) {
    this.isFirstLoad = mode;
  }

  @action.bound setAdvancedAPIMode(mode) {
    this.isAdvancedAPIMode = mode;
  }

  @action.bound setSettingsExchangeViewMode(mode) {
    this.isSettingsExchangeViewMode = mode;
  }

  @action.bound toggleExchangeViewMode() {
    this.isExchangeViewMode = !this.isExchangeViewMode;
  }

  @action.bound setPageIndexOfSmart(idx) {
    this.pageIndexOfSmart = idx;
  }

  @action.bound setIsLoaded() {
    this.isLoaded = true;
  }

  @action.bound setArbMode(mode) {
    this.arbMode = mode;
  }

  @action.bound setArbDetailMode(mode) {
    this.isArbDetailMode = mode;
  }

  @action.bound setArbHFMode(mode) {
    this.arbHFMode = mode;
  }

  @action.bound setPortPriceGraphViewMode(mode) {
    this.portPriceGraphViewMode = mode;
  }

  @action.bound togglePreferenceActiveOrders() {
    this.isPreferenceActiveOrdersON = !this.isPreferenceActiveOrdersON;
  }

  @action.bound togglePreferenceFilledOrders() {
    this.isPreferenceFilledOrdersON = !this.isPreferenceFilledOrdersON;
  }

  @action.bound togglePreferenceMyTrades() {
    this.isPreferenceMyTradesON = !this.isPreferenceMyTradesON;
  }

  @action.bound togglePreferenceDepthChart() {
    this.isPreferenceDepthChartON = !this.isPreferenceDepthChartON;
  }
}

export default () => {
  const store = new ViewModeStore();
  return store;
};
