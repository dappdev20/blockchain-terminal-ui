import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'react-tippy';
import Clipboard from 'clipboard';

import { STORE_KEYS } from '@/stores';
import { SETTING_TIPPY_INFO, MODE_KEYS, MODE_INFO } from '@/config/constants';
import { format7DigitString, formatNegativeNumber } from '@/utils';
import { animateButton } from '@/utils/CustomControls';
import { languages } from '@/lib/translations/languages';

import CoinIcon from '@/components-generic/CoinIcon';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon';
import SelectDropdown from '@/components-generic/SelectDropdown';
import { SearchInput } from '@/components-generic/SelectDropdown/Components';
import SwitchItem from '@/components-generic/SwitchItem';
import SwitchCustom from '@/components-generic/SwitchCustom';
import CurrencySelectDropdown from '@/components-generic/SelectDropdown/CurrencySelectDropdown';
import LanguageDropdown from '@/components-generic/SelectDropdown/LanguageDropdown';
import ForexDropdown from '@/components-generic/SelectDropdown/ForexDropdown';
import GradientButton from '@/components-generic/GradientButtonSquare';
import Spinner from '@/components-generic/Spinner';
import PerfectScrollWrapper from '@/components-generic/PerfectScrollWrapper';

import TermsModal from '@/components/Modals/TermsModal';
import KeyModal from '@/components/Modals/KeyModal';
import LogoutModal from '@/components/Modals/LogoutModal';
import SeedWordsModal from '@/components/Modals/SeedWordsModal';
import Google2FAModal from '@/components/Modals/TwofaModal/Google2FAModal';
import Email2FAModal from '@/components/Modals/TwofaModal/Email2FAModal';

import CollapseComponent from './CollapseComponent';
import { accessLevels, defaultCurrencies, timerList } from './mock';

import ExchangeListComponent from './ExchangeListComponent';

import {
  Wrapper,
  Footer,
  Code,
  DepositQRCode,
  MenuWrapper,
  DropdownMenuItemWrapper,
  FooterButtonsWrapper,
  TransferSection,
  InputTextCustom,
  Item,
  WithdrawDepositWrapper,
  DepositQRCodeWrapper,
  WithdrawTextarea,
  SwitchLabel
} from './Components';

import {
  SettingsExchangesIcon,
  SettingsPreferencesIcon,
  SettingsPrivacyIcon,
  SettingsAffiliateIcon,
  SettingsAdvancedIcon,
  SettingsReportsIcon,
  SettingsDemoTradeIcon,
  OpenArrow
} from './Icons';

const SETTINGS_ITEMS = {
  ADVANCED: 'setting-advanced',
  AFFILIATE: 'setting-affiliate',
  DEPOSIT_WITHDRAW: 'setting-deposit-withdraw',
  EXCHANGES: 'setting-exchanges',
  PREFERENCES: 'setting-preferences',
  PRIVACY: 'setting-privacy',
  REPORTS: 'setting-reports',
  MODE: 'setting-mode'
};

class SettingsMenu extends React.Component {
  state = {
    isGoogle2FAModalOpen: false,
    isEmail2FAModalOpen: false,
    isKeyModalOpen: false,
    openedSettings: null,
    page: null,
    searchValue: '',
    tooltipWidth: window.innerWidth,
    isCopied: false
  };

  searchValueRef = React.createRef();
  timeOutId = null;

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.coinDepositAddress) {
      /* eslint-disable-next-line */
      new Clipboard('.btn_normal', {
        text: () => nextProps.coinDepositAddress
      });
    }
    if (!nextProps.isOpen) {
      return { openedSettings: null };
    }

    return null;
  }

  componentDidMount() {
    this.props.getTwoFAStatus();
    this.props.createDepositAddress();
  }

  componentWillUnmount() {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId);
    }
  }

  handleHelpdeskOpen = () => {
    const whitelabel = window.location.hostname;
    const helpdeskLink = `http://nswebdev.us/helpdesk/?${whitelabel}`;
    window.open(helpdeskLink, '_blank');
  };

  handlePageOpen = (pageId = null) => () => this.handlePageToggle(pageId);

  handlePageToggle = (pageId = null) => {
    this.setState({ page: pageId });
  };

  toggleGoogle2FAModal = isForceOpen => {
    this.setState(prevState => ({
      isGoogle2FAModalOpen: isForceOpen || !prevState.isGoogle2FAModalOpen
    }));
  };

  handleToggleGoogle2FA = () => {
    this.toggleGoogle2FAModal(true);
  };

  toggleEmail2FAModal = isForceOpen => {
    this.setState(prevState => ({
      isEmail2FAModalOpen: isForceOpen || !prevState.isEmail2FAModalOpen
    }));
  };

  handleToggleEmail2FA = () => {
    this.toggleEmail2FAModal(true);
  };

  toggleKeyModal = isKeyModalOpen => {
    this.setState(prevState => ({
      isKeyModalOpen: typeof isKeyModalOpen === 'boolean' ? isKeyModalOpen : !prevState.isKeyModalOpen
    }));
  };

  handleLanguage = lang => {
    this.props.setLanguage(lang);
    this.props.onClose();
  };

  handleInputChange = key => event => {
    if (key === 'withdrawAddress') {
      this.props.setWithdrawAddress(event.target.value);
    }
  };

  handleViewSeedWords = () => {
    this.props.Modal({
      portal: 'graph',
      ModalComponentFn: () => <SeedWordsModal isShow isBackUp />
    });
  };

  /**
   * @description handler for settings menu
   * @param {string} name setting menu name e.g. Exchanges, Advacned, Affiliate.....
   */
  handleMenuCollapseClicked = name => () => {
    animateButton(name, this.state.openedSettings !== name);
    this.setState(prevState => ({
      openedSettings: prevState.openedSettings === name ? null : name,
      searchValue: ''
    }));
  };

  /**
   * @description handler for report settings switches.
   * @param {string} reportName name of report section to be switched
   */
  handleReportClick = reportName => () => {
    animateButton(reportName, !this.props.activeReports.includes(reportName));
    this.props.setActiveReports(reportName);
  };

  setRealTradingWith = () => {
    if (!this.props.isRealTrading) {
      this.props.createDepositAddress();
    }
    this.props.setRealTrading();
  };

  handleChangeSearchValue = e => {
    e.stopPropagation();
    this.setState({ searchValue: e.target.value }, () => {
      this.searchValueRef.current && this.searchValueRef.current.focus();
    });
  };

  handleResetBalance = e => {
    e.stopPropagation();
    this.props.setArbMode(false);
    this.props.setRightBottomSectionOpenMode(MODE_KEYS.myPortfolioModeKey);
    this.props.resetDemoBalances();
    this.props.requestPosition();
    this.props.onClose();
  };

  handleLogout = () => {
    this.props.forceCleanStorage();
    this.toggleLogoutModal();
    this.props.onClose();
  };

  toggleLogoutModal = () => {
    this.props.setLogoutModalOpen(!this.props.isLogoutModalOpen);
  };

  copyToClipboard = () => {
    this.setState({
      isCopied: true
    });

    this.timeOutId = setTimeout(() => {
      this.setState({
        isCopied: false
      });
      this.timeOutId = null;
    }, 3000);
  };

  onShowTooltip = ({ target }) => {
    const clientWidth = window.innerWidth;
    if (clientWidth > 768) return;

    const rect = target.getBoundingClientRect();
    this.setState({ tooltipWidth: clientWidth - rect.right - 10 });
  };

  getTooltip = (tooltipText, props = {}) => {
    const { tooltipWidth } = this.state;
    return (
      <Tooltip
        arrow
        animation="shift"
        position="right"
        theme="bct"
        useContext
        html={<div style={{ maxWidth: tooltipWidth }}>{tooltipText}</div>}
        popperOptions={{
          modifiers: {
            preventOverflow: { enabled: false },
            flip: { enabled: false },
            hide: { enabled: false }
          }
        }}
        {...props}
      >
        <span className="symbol_i" onClick={this.onShowTooltip} role="button" tabIndex={0}>
          i
        </span>
      </Tooltip>
    );
  };

  renderDropdownMenuItem = ({ menuId, icon: Icon, labelId, defualtLabel, contentRenderer: Content }) => {
    const isOpened = this.state.openedSettings === menuId;
    return (
      <DropdownMenuItemWrapper isColumn opened={isOpened}>
        <div className="d-flex" onClick={this.handleMenuCollapseClicked(menuId)} role="button" tabIndex={0}>
          <div className="icon-wrapper">
            <Icon id={menuId} />
          </div>
          <span className="label-wrapper">
            <FormattedMessage id={labelId} defaultMessage={defualtLabel} />
          </span>
          <OpenArrow isOpened={isOpened} />
        </div>
        <Content />
      </DropdownMenuItemWrapper>
    );
  };

  renderMenuItem = ({ labelId, defaultLabel, tooltip, onClick, children }) => (
    <Item onClick={!!onClick ? onClick : null}>
      <span>
        <FormattedMessage id={labelId} defaultMessage={defaultLabel} />
        {this.getTooltip(tooltip)}
      </span>
      {children}
    </Item>
  );

  renderExchanges = () => {
    const { setExchangeActive } = this.props;
    const { searchValue } = this.state;
    return (
      <CollapseComponent expanded={this.state.openedSettings === SETTINGS_ITEMS.EXCHANGES}>
        <ExchangeListComponent
          searchValue={searchValue}
          setExchangeActive={setExchangeActive}
          expanded={this.state.openedSettings === SETTINGS_ITEMS.EXCHANGES}
          isOpened={this.props.isOpen}
          searchComponent={() => (
            <SearchInput
              value={searchValue}
              onChange={this.handleChangeSearchValue}
              placeholder="Datafeed"
              isBigger
              ref={this.searchValueRef}
            />
          )}
        />
      </CollapseComponent>
    );
  };

  renderPreferencesSettings = () => {
    const { isRealTrading, accessLevel, isDefaultCrypto, setAccessLevel, setDefaultCurrencySetting } = this.props;
    const defaultCurrency = isDefaultCrypto ? 'Crypto' : 'Fiat';
    const MenuItem = this.renderMenuItem;
    return (
      <CollapseComponent expanded={this.state.openedSettings === SETTINGS_ITEMS.PREFERENCES}>
        <MenuItem
          labelId="settings.label_real_trading"
          defaultLabel="Real Trading (Level1 Access)"
          tooltip={SETTING_TIPPY_INFO.REAL_TREADING}
          onClick={this.setRealTradingWith}
        >
          <SwitchItem isChecked={isRealTrading} handleChange={this.setRealTradingWith} />
        </MenuItem>
        <MenuItem
          labelId="settings.label_access_level"
          defaultLabel="Access Level"
          tooltip={SETTING_TIPPY_INFO.ACCESS_LEVEL}
        >
          <SelectDropdown width={180} value={accessLevel} items={accessLevels} onChange={setAccessLevel} />
        </MenuItem>
        <MenuItem
          labelId="settings.label_default_fiat"
          defaultLabel="Default Fiat"
          tooltip={SETTING_TIPPY_INFO.DEFAULT_FIAT}
        >
          <CurrencySelectDropdown width={180} type="fiat" />
        </MenuItem>
        <MenuItem
          labelId="settings.label_default_crypto"
          defaultLabel="Default Crypto"
          tooltip={SETTING_TIPPY_INFO.DEFAULT_CRYPTO}
        >
          <CurrencySelectDropdown width={180} type="crypto" />
        </MenuItem>
        <MenuItem
          labelId="settings.label_default_currency"
          defaultLabel="Default Currency"
          tooltip={SETTING_TIPPY_INFO.DEFAULT_CURRENCY}
        >
          <SelectDropdown
            width={180}
            value={defaultCurrency}
            items={defaultCurrencies}
            alignTop
            onChange={setDefaultCurrencySetting}
          />
        </MenuItem>
      </CollapseComponent>
    );
  };

  renderPrivacySettings = () => {
    const { isGoogle2FA, isGet2FA, isEmail2FA } = this.props;
    const MenuItem = this.renderMenuItem;
    return (
      <CollapseComponent expanded={this.state.openedSettings === SETTINGS_ITEMS.PRIVACY}>
        <MenuItem
          labelId="settings.label_google_2fa"
          defaultLabel="Google 2FA"
          tooltip={SETTING_TIPPY_INFO.GOOGLE_2FA}
          onClick={!isGet2FA && this.handleToggleGoogle2FA}
        >
          {isGet2FA ? (
            <div className="spinner-wrapper">
              <Spinner />
            </div>
          ) : (
            <SwitchItem isChecked={isGoogle2FA} handleChange={this.handleToggleGoogle2FA} />
          )}
        </MenuItem>
        <MenuItem
          labelId="settings.label_email_2fa"
          defaultLabel="Email 2FA"
          tooltip={SETTING_TIPPY_INFO.EMAIL_2FA}
          onClick={!isGet2FA && this.handleToggleEmail2FA}
        >
          {isGet2FA ? (
            <div className="spinner-wrapper">
              <Spinner />
            </div>
          ) : (
            <SwitchItem isChecked={isEmail2FA} handleChange={this.handleToggleEmail2FA} />
          )}
        </MenuItem>
      </CollapseComponent>
    );
  };

  renderAffiliateSettings = () => {
    const { defaultURL, referredBy, referCount, setDefaultURL, setReferredBy, setReferCount } = this.props;
    const MenuItem = this.renderMenuItem;
    const userID = localStorage.getItem('authClientId');
    const affiliateDefaultURL = `${defaultURL}/${userID}`;

    return (
      <CollapseComponent expanded={this.state.openedSettings === SETTINGS_ITEMS.AFFILIATE}>
        <MenuItem
          labelId="settings.label_default_url"
          defaultLabel="Default URL"
          tooltip={SETTING_TIPPY_INFO.DEFAULT_URL}
        >
          <InputTextCustom width={245} value={affiliateDefaultURL} onChange={setDefaultURL} readOnly />
        </MenuItem>
        <MenuItem
          labelId="settings.label_referred_by"
          defaultLabel="Referred by"
          tooltip={SETTING_TIPPY_INFO.REFERRED_BY}
        >
          <InputTextCustom width={245} value={referredBy} onChange={setReferredBy} readOnly />
        </MenuItem>
        <MenuItem
          labelId="settings.label_you_referred"
          defaultLabel="You referred"
          tooltip={SETTING_TIPPY_INFO.YOU_REFERRED}
        >
          <InputTextCustom width={245} value={referCount} onChange={setReferCount} readOnly />
        </MenuItem>
        <Item>Affiliate fee sent to userID: {userID}</Item>
      </CollapseComponent>
    );
  };

  renderAdvancedSettings = () => {
    const {
      storeCredit,
      isShortSell,
      isRealTrading,
      portfolioIncludesBct,
      privateVpn,
      timer,
      defaultForex,
      setPortfolioIncludesBct,
      setPrivateVpn,
      setTimer,
      setDefaultForex,
      setShortSell
    } = this.props;
    const storeCreditStr = formatNegativeNumber(format7DigitString(storeCredit)).replace('+', '');
    const MenuItem = this.renderMenuItem;
    return (
      <CollapseComponent expanded={this.state.openedSettings === SETTINGS_ITEMS.ADVANCED}>
        <MenuItem
          labelId="settings.label_store_credit"
          defaultLabel="Store Credit"
          tooltip={`Your Store Credit: ${storeCreditStr}`}
          onClick={isRealTrading ? this.toggleKeyModal : setShortSell}
        >
          <SwitchItem
            isChecked={isShortSell}
            handleChange={isRealTrading ? this.toggleKeyModal : setShortSell}
            onMouseLeave={() => {
              this.toggleKeyModal(false);
            }}
          />
        </MenuItem>
        <MenuItem
          labelId="settings.label_balance_includes_credit"
          defaultLabel="Balance includes Credit"
          tooltip={SETTING_TIPPY_INFO.BALANCE_CREDIT}
          onClick={setPortfolioIncludesBct}
        >
          <SwitchItem
            isChecked={portfolioIncludesBct}
            handleChange={setPortfolioIncludesBct}
            onMouseLeave={() => {
              this.toggleKeyModal(false);
            }}
          />
        </MenuItem>
        <MenuItem
          labelId="settings.label_12words"
          defaultLabel="12-word phrase"
          tooltip={SETTING_TIPPY_INFO.WORD12_PHRASE}
        >
          <button className="btn_normal" onClick={this.handleViewSeedWords}>
            <Tooltip
              arrow
              animation="shift"
              position="left"
              followCursor
              theme="bct"
              title="Your Access is Restricted to Level 1"
              popperOptions={{
                modifiers: {
                  preventOverflow: { enabled: false },
                  flip: { enabled: false },
                  hide: { enabled: false }
                }
              }}
            >
              <FormattedMessage id="settings.btn_view" defaultMessage="View" />
            </Tooltip>
          </button>
        </MenuItem>
        <MenuItem
          labelId="settings.label_private_vpn"
          defaultLabel="Private VPN"
          tooltip={SETTING_TIPPY_INFO.PRIVATE_VPN}
          onClick={setPrivateVpn}
        >
          <SwitchItem
            isChecked={privateVpn}
            handleChange={setPrivateVpn}
            onMouseLeave={() => {
              this.toggleKeyModal(false);
            }}
          />
        </MenuItem>
        <MenuItem
          labelId="settings.forex_profit_margin"
          defaultLabel="Forex Profit Margin"
          tooltip={SETTING_TIPPY_INFO.FOREX_PROFIT_MARGIN}
        >
          <ForexDropdown width={150} value={defaultForex} isSearchable={false} onChange={setDefaultForex} />
        </MenuItem>
        <MenuItem labelId="settings.timer" defaultLabel="Timer (seconds)" tooltip={SETTING_TIPPY_INFO.TIMER}>
          <Tooltip
            arrow
            animation="shift"
            position="right"
            theme="bct"
            title="Please upgrade your Access level"
            popperOptions={{
              modifiers: {
                preventOverflow: { enabled: false },
                flip: { enabled: false },
                hide: { enabled: false }
              }
            }}
          >
            <SelectDropdown width={150} value={timer} items={timerList} alignTop onChange={setTimer} />
          </Tooltip>
        </MenuItem>
      </CollapseComponent>
    );
  };

  renderReportSettings = () => {
    const { activeReports } = this.props;
    const MenuItem = this.renderMenuItem;
    return (
      <CollapseComponent expanded={this.state.openedSettings === SETTINGS_ITEMS.REPORTS}>
        {Object.values(MODE_KEYS).map(key => {
          const info = MODE_INFO[key];
          if (!info.tooltip) return null;
          return (
            <MenuItem
              key={key}
              labelId={`settings.mode.${key}`}
              defaultLabel={info.comment || info.label}
              tooltip={info.tooltip}
              onClick={this.handleReportClick(key)}
            >
              <SwitchItem isChecked={activeReports.includes(key)} handleChange={this.handleReportClick(key)} />
            </MenuItem>
          );
        })}
      </CollapseComponent>
    );
  };

  renderModeMenuItem = () => {
    const { isRealTrading, coinDepositAddress, totalBTCAmount } = this.props;
    const { isCopied } = this.state;
    return (
      <DropdownMenuItemWrapper isColumn>
        <div className="d-flex" onClick={this.setRealTradingWith} role="button" tabIndex={0}>
          <div className="icon-wrapper">
            <SettingsDemoTradeIcon id={SETTINGS_ITEMS.MODE} />
          </div>
          <span className="label-wrapper">
            <FormattedMessage id="settings.mode" defaultMessage="Mode" />
          </span>
          <SwitchCustom
            checked={isRealTrading}
            onChange={this.setRealTradingWith}
            height={40}
            width={120}
            className="react-switch"
            id="small-radius-switch"
            uncheckedIcon={<SwitchLabel>DEMO</SwitchLabel>}
            checkedIcon={<SwitchLabel>REAL</SwitchLabel>}
          />
        </div>
        <CollapseComponent expanded={isRealTrading && coinDepositAddress}>
          <TransferSection>
            <WithdrawDepositWrapper>
              <div className="withdraw-title">WITHDRAW</div>
              <div className="send">Send From Your Wallet</div>
              <div className="detail">
                <div className="amount">0.0007</div>
                <div className="symbol">
                  <CoinIcon fontIcon value="BTC" size={27} />
                </div>
                <div className="gas">(for gas)</div>
                <div className="arrow">
                  <SellArrowIcon className="arrow-icon" size={14} white />
                </div>
              </div>
              <div className="label">
                {totalBTCAmount.toFixed(4)} BTC will then be withdrawn from the ledger and sent to your wallet.
              </div>
              <WithdrawTextarea height={40} placeholder="Auto filled after withdraw." />
            </WithdrawDepositWrapper>
            <DepositQRCodeWrapper>
              <DepositQRCode>
                <Code value={coinDepositAddress} size={120} level="L" includeMargin renderAs="svg" />
              </DepositQRCode>
              <div className="public-address">{coinDepositAddress}</div>
              <button className="btn_normal" onClick={this.copyToClipboard}>
                Copy To Clipboard
              </button>
              {isCopied && (
                <div className="copied">
                  <b>Copied.</b>
                </div>
              )}
            </DepositQRCodeWrapper>
            <WithdrawDepositWrapper>
              <div className="withdraw-title deposit">Deposit</div>
              <div className="send">Send From Your Wallet</div>
              <div className="detail">
                <div className="arrow">
                  <BuyArrowIcon className="arrow-icon" size={14} white />
                </div>
                <div className="symbol">
                  <CoinIcon fontIcon value="BTC" size={27} />
                </div>
                <div className="amount">Any Bitcoin</div>
              </div>
              <div className="label">Your wallet address is:</div>
              <WithdrawTextarea
                height={95}
                placeholder="Auto filled after deposit. You may edit this after it is filled."
              />
            </WithdrawDepositWrapper>
          </TransferSection>
        </CollapseComponent>
      </DropdownMenuItemWrapper>
    );
  };

  render() {
    const { language, isLogoutModalOpen, isRealTrading } = this.props;
    const { isKeyModalOpen, isGoogle2FAModalOpen, isEmail2FAModalOpen } = this.state;
    const DropdownMenuItem = this.renderDropdownMenuItem;
    const ModeMenuItem = this.renderModeMenuItem;

    const languagesArray = [];
    for (let i = 0; i < languages.length; i++) {
      languagesArray.push({
        name: languages[i].value,
        flag: languages[i].flag
      });
    }

    return (
      <Wrapper>
        <MenuWrapper>
          <PerfectScrollWrapper scrollTop>
            <DropdownMenuItem
              menuId={SETTINGS_ITEMS.EXCHANGES}
              icon={SettingsExchangesIcon}
              labelId="settings.exchanges"
              defualtLabel="Exchanges"
              contentRenderer={this.renderExchanges}
            />

            <DropdownMenuItem
              menuId={SETTINGS_ITEMS.PREFERENCES}
              icon={SettingsPreferencesIcon}
              labelId="settings.preferences"
              defualtLabel="Preferences"
              contentRenderer={this.renderPreferencesSettings}
            />

            <DropdownMenuItem
              menuId={SETTINGS_ITEMS.PRIVACY}
              icon={SettingsPrivacyIcon}
              labelId="settings.privacy"
              defualtLabel="Privacy"
              contentRenderer={this.renderPrivacySettings}
            />

            <DropdownMenuItem
              menuId={SETTINGS_ITEMS.AFFILIATE}
              icon={SettingsAffiliateIcon}
              labelId="settings.affiliate"
              defualtLabel="Affiliate"
              contentRenderer={this.renderAffiliateSettings}
            />

            <DropdownMenuItem
              menuId={SETTINGS_ITEMS.ADVANCED}
              icon={SettingsAdvancedIcon}
              labelId="settings.advanced"
              defualtLabel="Advanced"
              contentRenderer={this.renderAdvancedSettings}
            />

            <DropdownMenuItem
              menuId={SETTINGS_ITEMS.REPORTS}
              icon={SettingsReportsIcon}
              labelId="settings.reports"
              defualtLabel="Reports"
              contentRenderer={this.renderReportSettings}
            />

            <ModeMenuItem />
          </PerfectScrollWrapper>

          <Footer>
            <FooterButtonsWrapper>
              <GradientButton
                className="primary-solid"
                header
                width="auto"
                onClick={this.handlePageOpen('terms-of-use')}
              >
                <FormattedMessage id="modal.logout.button_terms_of_use" defaultMessage="Terms of Use" />
              </GradientButton>
              <GradientButton
                className="primary-solid"
                header
                width="auto"
                onClick={this.handlePageOpen('privacy-policy')}
              >
                <FormattedMessage id="modal.page.button_privacy_policy" defaultMessage="Privacy Policy" />
              </GradientButton>
              <GradientButton className="primary-solid" header width="auto" onClick={this.handleHelpdeskOpen}>
                <FormattedMessage id="settings.button.label_support_center" defaultMessage="Helpdesk" />
              </GradientButton>
            </FooterButtonsWrapper>
            <FooterButtonsWrapper>
              {!isRealTrading && (
                <GradientButton className="primary-solid" header width="auto" onClick={this.handleResetBalance}>
                  <FormattedMessage id="settings.btn_reset" defaultMessage="Reset" />
                </GradientButton>
              )}
              <LanguageDropdown insideSettings value={language} items={languagesArray} onChange={this.handleLanguage} />
            </FooterButtonsWrapper>
          </Footer>

          {!!this.state.page && <TermsModal pageId={this.state.page} toggleModal={this.handlePageToggle} />}
        </MenuWrapper>

        <KeyModal toggleModal={this.toggleKeyModal} hoverMode inLineMode isModalOpen={isKeyModalOpen} />

        <Google2FAModal
          toggleModal={this.toggleGoogle2FAModal}
          inLineMode
          backdropClose
          isModalOpen={isGoogle2FAModalOpen}
        />

        <Email2FAModal
          toggleModal={this.toggleEmail2FAModal}
          inLineMode
          backdropClose
          isModalOpen={isEmail2FAModalOpen}
        />

        <LogoutModal
          toggleModal={this.toggleLogoutModal}
          inLineMode
          backdropClose
          onLogout={this.handleLogout}
          isModalOpen={isLogoutModalOpen}
        />
      </Wrapper>
    );
  }
}

export default compose(
  inject(
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.EXCHANGESSTORE,
    STORE_KEYS.SMSAUTHSTORE,
    STORE_KEYS.COINADDRESSSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.PORTFOLIOSTORE
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.YOURACCOUNTSTORE]: { storeCredit, resetDemoBalances, requestPosition },
      [STORE_KEYS.MODALSTORE]: { Modal },
      [STORE_KEYS.EXCHANGESSTORE]: { setExchangeActive },
      [STORE_KEYS.SMSAUTHSTORE]: { isGoogle2FA, isEmail2FA, isGet2FA, forceCleanStorage, getTwoFAStatus },
      [STORE_KEYS.COINADDRESSSTORE]: { createDepositAddress, coinDepositAddress },
      [STORE_KEYS.VIEWMODESTORE]: { isLogoutModalOpen, setLogoutModalOpen, setArbMode, setRightBottomSectionOpenMode },
      [STORE_KEYS.PORTFOLIOSTORE]: { totalBTCAmount },
      [STORE_KEYS.SETTINGSSTORE]: {
        accessLevel,
        defaultURL,
        isShortSell,
        portfolioIncludesBct,
        privateVpn,
        timer,
        defaultForex,
        isDefaultCrypto,
        referredBy,
        referCount,
        activeReports,
        isRealTrading,
        language,
        setLanguage,
        setWithdrawAddress,
        setAccessLevel,
        setDefaultCurrencySetting,
        setActiveReports,
        setRealTrading,
        setPortfolioIncludesBct,
        setPrivateVpn,
        setTimer,
        setDefaultForex,
        setShortSell,
        setDefaultURL,
        setReferredBy,
        setReferCount
      }
    }) => ({
      storeCredit,
      resetDemoBalances,
      requestPosition,
      Modal,
      setExchangeActive,
      isGoogle2FA,
      isEmail2FA,
      isGet2FA,
      forceCleanStorage,
      getTwoFAStatus,
      createDepositAddress,
      coinDepositAddress,
      isLogoutModalOpen,
      setLogoutModalOpen,
      setArbMode,
      setRightBottomSectionOpenMode,
      accessLevel,
      defaultURL,
      isShortSell,
      portfolioIncludesBct,
      privateVpn,
      timer,
      defaultForex,
      isDefaultCrypto,
      referredBy,
      referCount,
      activeReports,
      isRealTrading,
      language,
      setLanguage,
      setWithdrawAddress,
      setAccessLevel,
      setDefaultCurrencySetting,
      setActiveReports,
      setRealTrading,
      setPortfolioIncludesBct,
      setPrivateVpn,
      setTimer,
      setDefaultForex,
      setShortSell,
      setDefaultURL,
      setReferredBy,
      setReferCount,
      totalBTCAmount
    })
  )
)(SettingsMenu);
