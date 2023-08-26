import { getScreenInfo } from '@/utils';

const { isMobileDevice } = getScreenInfo();

const createKeysEnum = keys =>
  keys.reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {});

// Keys used in both dark & light theme
const rootKeys = createKeysEnum(['palette', 'tradePalette', 'test', 'muiTheme']);

// http://prntscr.com/m42q0y (2019.01.07 design)
const corePalette = {
  clrBackground: '#020518',
  clrChartBackground: '#080924',
  clrPriceChartAreaBackground: '#0c102a',
  clrMainWindow: '#0d112b',
  clrPurple: '#7f8bc2',
  clrWhite: 'rgba(255, 255, 255, 1.0)',
  clrDarkPurple: '#1b1c3d',
  clrBlue: '#2780ff',
  clrDarkBlue: '#1f67bc',
  clrGreen: '#01a967',
  clrLightGreen: '#7bdb7a',
  clrHighLightBlue: '#0099FF',
  clrHighContrast: '#fff',
  clrRed: '#b71e1e',
  clrLightRed: '#b41e1e',
  clrDarkGreen: '#006b44',
  clrDarkRed: '#73160d',
  clrMouseHover: '#20233e',
  clrMouseClick: '#454c73',
  clrBorder: '#454c73',
  clrSubBorder: 'rgba(30, 35, 62, 1)',
  clrInnerBorder: 'rgba(69, 76, 115, 0.5)',
  clrBorderLight: 'rgba(69, 76, 115, 0.5)',
  clrBorderHover: '#747ba6',
  clrBorderHoverLight: 'rgb(116,123,166, 0.5)',
  clrBorderGray: '#333333',
  clrDisabled: '#1b1c3d',
  clrOnBackDisabled: '#454c73',
  clrOffBackDisabled: '#010311',
  clrIcoDisabled: '#0d112b',
  clrDarkPink: '#733fda',
  clrGray: '#606060',
  clrLightGray: '#999999',
  clrDarkGray: '#303030',
  clrLightBlue: '#41669d',
  clrYellow: '#faea05',
  clrPureRed: '#ff0000',
  clrTransparent: 'transparent',

  regularSpacer: '15px',
  cornerRadius: '3px',
  defaultStrokeWeight: '1px',
  portfolioChartStrokeWeight: '3px',

  // order book
  fern: '#68B168',
  pastelGreen: '#5a975b',
  dodgerBlue: '#09f',
  malibu: '#0a84d6',
  olive: '#4c9201',
  cobalt: '#0057a3',
  silver: '#c1c1c1',
  portGore: '#191D3E'
};

// Shared styles between dark & light theme
const primary = '#3E6A97'; // stormy blue
const primaryBright = '#0089cb'; // brighter stormy blue
const primaryBrightGradiant = 'linear-gradient(to bottom, #0000cc 0%, #0070e0 100%)';
const primaryHeader = '#879EC1';
const light = '#fff';
const secondaryDark = '#01b067'; // green
const secondaryLight = '#00a9ee'; // light blue

// New color palette for buttons (2018-12-24)
const btnColorPalette = {
  btnPrimaryBg: '#02a4d3',
  btnPrimaryText: '#fff',
  btnPrimaryHoverBg: '#06d0ff',
  btnPrimaryHoverText: '#fff',
  btnPrimaryActiveBg: '#06d0ff',
  btnPrimaryActiveText: '#02a4d3',
  btnPositiveBg: '#4b8653',
  btnPositiveText: '#7BDB7A',
  btnPositiveHoverBg: '#7bdb7a',
  btnPositiveHoverText: '#c7f9cb',
  btnPositiveActiveBg: '#05DB75',
  btnPositiveActiveText: '#01B067',
  btnPositiveGradientBg: 'linear-gradient(to bottom, #78DC78 0%, #286925 100%)',
  btnPositiveGradientHoverBg: 'radial-gradient(#78DC78 0%, #78DC78 100%)',
  btnPositiveGradientText: '#286925',
  btnPositiveGradientTextShadow: '#8FFF8F',
  btnNegativeBg: '#0f5c9b',
  btnNegativeText: '#0099FF',
  btnNegativeHoverBg: '#1895f3',
  btnNegativeHoverText: '#48e0ff',
  btnNegativeActiveBg: '#66CBFF',
  btnNegativeActiveText: '#BB1E1E',
  btnNegativeGradientBg: 'linear-gradient(to bottom, #0096FA 0%, #1C53AC 100%)',
  btnNegativeGradientHoverBg: 'radial-gradient(#0096FA 0%, #0096FA 100%)',
  btnNegativeGradientText: '#2E299C',
  btnNegativeGradientTextShadow: '#4DBFF7'
};

const defaultPalette = {
  primary,
  primaryBright,
  primaryBrightGradiant,
  primaryHeader,
  light,
  secondaryDark,
  secondaryLight
};

// themes
export const darkTheme = {
  [rootKeys.muiTheme]: 'dark',

  [rootKeys.test]: {
    test: 'red'
  },

  [rootKeys.tradePalette]: {
    primaryBuy: '#01B067',
    primarySell: '#BB1E1E',
    primaryBuyHover: '#1BCA81',
    primarySellHover: '#E60000',
    contrastText: '#BBBBBB', // light gray
    orderBackground: '#213040', // acts as inactiver background as well
    coinText: '#838383',
    orderBorder: '#2d4d6d',
    inactiveText: '#4E5C6E'
  },

  [rootKeys.palette]: {
    ...defaultPalette,
    ...btnColorPalette,
    ...corePalette,
    backgroundHighContrast: '#18202d',
    backgroundMedContrast: '#040711',
    contrastText: '#fff',
    portfolioComps: '#1F2F3F',
    portfolioCompsHover: 'rgba(0,0,0,0.5)',
    containerBorder: '#203347',

    // NEW DESIGN COLORS - DARK
    clrtext: '#6c7884' /* text color basic */,
    clrtextLL: '#24425B' /* text color lighter */,
    clrtextL: '#9ba6b2' /* text color light */,
    // clrtextD: '#9ba6b2',/*text color dark*/
    clrtextD: '#6C7883' /* text color dark */,
    clrtextA: '#286bb4' /* text color accented */,
    clrtextCT: '#18202d' /* text color */,
    clrtextAA: '#e15c79' /* text color accented alternative */,

    clricon: '#4f6c82' /* icon color basic */,
    clriconD: '#6a717a' /* icon color dark */,
    clraccent: '#01b067' /* icon color accented */,
    clraccentL: '#1c3135' /* icon color accented light */,
    clraccentLL: '#1c3135' /* icon color accented light */,
    clraccentD: '#007b47' /* icon color accented dark */,

    clrseparator: '#0e1622' /* separators and borders color basic */,
    clrseparatorP: '#24425b' /* separators and borders color basic */,
    clrseparatorD: '#24425b' /* separators and borders color dark */,
    clrseparatorW: '#24425b' /* separators and borders color dark */,
    clrimportant: '#9BA6B2' /* important and borders color dark */,
    clrbackL: '#141925' /* background color light */,
    clrbackLL: '#1f2736' /* background color lighter */,
    clrbackLLL: '#1f2736' /* background color lighter */,
    clrback: corePalette.clrMainWindow /* background color basic */,
    clrbacknew: '#131A23' /* background color basic */,
    clrbackA: '#1d2d33' /* background color accented */,
    clrblock: '#18202d' /* basic block color basic */,
    clrblockB: '#18202d' /* basic block color basic */,
    clrbackarrow: '#10151d' /* scroll arrow background color */,
    clrbackIA: '#24425b' /* background input group append */,
    clrbackCI: '#24425b' /* separators and borders color basic */,

    clrtexttooltip: '#F9F9F9' /* scroll arrow background color */,
    clrbacktooltip: '#2C3137' /* scroll arrow background color */,
    clrline: '#BFC0C0' /* basic tooltip  background color */,
    clrlineP: '#BFC0C0' /* portfolio tooltip line  background color */,
    clriconarrow: '#9BA6B2' /* arrow down fill color */,

    // NEW DESIGN COLORS - CHARTS - DARK
    gridColor: '#24425b',
    fontColor: '#9BA6B2',
    labelColor: '#9BA6B2',
    lineColor: '#4F6C82',

    clrtimeline: '#4f6c82' /* time control background color */,
    clrtimebar: '#24425B' /* time control bar background color */,
    clrtimeslider: '#24425B' /* time control slider color */,

    borderRadius: corePalette.cornerRadius,
    iconScale: 0.8,

    // both of below should be same
    contentGap: '12px',
    sidebarGap: '-15px',
    gapSize: '12px',
    lowerSectionHeight: isMobileDevice ? '33.33%' : '263px',

    decreaseColor: '#FF0600',
    increaseColor: '#3EA2DD',

    // should we use increase color instead?
    progressColor: '#0082AF',

    // wallet zoom buttons
    zoomBg: '#18202d',

    // use different logic here as active/hovered element should be lighter
    // with guidelines: https://i.imgur.com/As8LMtM.png
    // reverse: https://i.imgur.com/K7w0jcA.png
    sidebarBackground: corePalette.clrBackground,
    sidebarIconTitle: corePalette.clrMouseClick,
    sidebarIcon: corePalette.clrMouseClick,
    sidebarArrowIcon: corePalette.clrBorder,
    sidebarIconActive: corePalette.clrBlue,
    sidebarIconTitleActive: corePalette.clrBlue,
    sidebarIconOpenedBg: corePalette.clrBackground,

    // settings
    settingsBackground: corePalette.clrBackground,
    settingsText: corePalette.clrPurple,
    settingsSelectedText: corePalette.clrWhite,
    settingsBorder: corePalette.clrBorder,
    settingsHeaderBackground: corePalette.clrBackground,
    settingsHeaderText: corePalette.clrHighContrast,
    settingsItemBorder: corePalette.clrBorder,
    settingsItemActive: corePalette.clrHighContrast,
    settingsItemDisabled: corePalette.clrMouseClick,
    settingsItemLink: corePalette.clrBlue,
    settingsCheckBackground: corePalette.clrBackground,
    settingsCheckBackgroundActive: corePalette.clrBlue,
    settingsCheckBorder: corePalette.clrPurple,

    settingsFormBackground: '#17202c',
    settingsLabelColor: '#fff',
    settingsLabelHoverColor: '#fff',
    settingsInputPlaceHolder: '#24435c',
    settingsErrorColor: '#e30613',

    telegramDate: '#adadad',
    telegramButton: corePalette.clrBlue,
    telegramButtonHover: corePalette.clrDarkBlue,
    telegramMessage: '#1b293f',

    /*
            html/css version as of 20th of October
            (colors are not properly taken, will be redone as per design for sure)
        */
    telegramRoomName: corePalette.clrHighContrast,
    telegramRoomMembers: corePalette.clrPurple,
    telegramRoomArrow: corePalette.clrMouseClick,
    telegramJoinBtn: corePalette.clrBlue,
    telegramSearchInputBg: '#1B1C3D',
    telegramSearchText: corePalette.clrPurple,
    telegramBorder: corePalette.clrBorder,
    telegramSeparator: '#24425B',
    telegramInputText: corePalette.clrPurple,
    telegramText: corePalette.clrHighContrast,
    telegramNameText: corePalette.clrBlue,
    telegramDateText: corePalette.clrPurple,
    telegramReplyName: corePalette.clrBlue,
    telegramReplyText: corePalette.clrHighContrast,
    telegramReplyButton: corePalette.clrPurple,
    telegramSiteName: corePalette.clrBlue,
    telegramBackground: corePalette.clrBackground,
    telegramBackground2: corePalette.clrMainWindow,
    telegramReplyBackground: corePalette.clrDarkPurple,
    telegramBackgroundExtra: corePalette.clrMouseHover,
    telegramChannelName: corePalette.clrHighContrast,
    telegramChannelDate: corePalette.clrPurple,
    telegramChannelUnreadMessage: corePalette.clrPurple,
    telegramChannelsHover: corePalette.clrMouseClick,
    telegramChannelsItemHover: corePalette.clrHighContrast,
    telegramChannelsActive: '#292F5E',
    telegramSender: corePalette.clrPurple,
    telegramSendCoinsButtonBackground: corePalette.clrBlue,
    telegramSendCoinsButtonText: corePalette.clrHighContrast,
    telegramTotalMessagesBackground: corePalette.clrPurple,
    telegramTotalMessagesText: corePalette.clrHighContrast,

    telegramLoginBackground: corePalette.clrMainWindow,
    telegramLoginBorder: corePalette.clrBorderHover,
    telegramLoginTitle: corePalette.clrHighContrast,
    telegramLoginTextColor: corePalette.clrPurple,
    telegramLoginDisabled: corePalette.clrBorder,

    telegramLoginControlBackground: corePalette.clrBackground,
    telegramLoginControlBorderColor: corePalette.clrBorder,
    telegramLoginControlTextColor: corePalette.clrPurple,
    telegramLoginControlAddonColor: corePalette.clrBlue,

    telegramLoginDropdownItemBorder: corePalette.clrBorder,

    telegramLoginDropdownItemTextColor: corePalette.clrPurple,
    telegramLoginDropdownItemBackgroundColor: corePalette.clrMainWindow,
    telegramLoginDropdownItemHoverTextColor: corePalette.clrHighContrast,
    telegramLoginDropdownItemHoverBackgroundColor: corePalette.clrMouseHover,
    telegramLoginDropdownItemActiveTextColor: corePalette.clrHighContrast,
    telegramLoginDropdownItemActiveBackgroundColor: corePalette.clrMouseClick,

    telegramLoginErrorMsg: '#d82525',

    // new telegram styles, refactor/delete top ones when not needed
    // not touching them as people are working with telegram currently on different branches

    telegramAppMessageBackground: corePalette.clrMouseHover,
    telegramAppSelfMessageBackground: corePalette.clrBorder,
    telegramAppMessageJoin: corePalette.clrHighContrast,

    // orderFormText: '#9BA6B2',
    // orderFormBorder: '#141B24',
    // orderBuyBtn: '#24AB68',
    // orderSellBtn: '#BC1F1F',
    // orderBtn: '#00a',
    // orderFormToggle: '#1B1C3D',
    // orderFormToggleBorder: '#0e1521',
    // orderFormIcon: corePalette.clrMouseClick,
    // orderFormTabActive: '#02a4d3',

    orderHistoryBackground: corePalette.clrBackground,
    orderHistoryBorder: corePalette.clrInnerBorder,
    orderHistoryText: corePalette.clrPurple,
    orderHistoryHoverText: corePalette.clrHighContrast,
    orderHistoryHoverBackground: corePalette.clrMouseClick,
    orderHistoryHeader: corePalette.clrHighContrast,
    orderHistoryHeaderBackground: corePalette.clrMouseHover,
    orderHistoryHeaderTab: corePalette.clrMouseClick,
    orderHistoryHeaderTabActive: corePalette.clrBlue,
    orderHistoryInnerBorder: corePalette.clrBorderLight,
    orderHistoryBtnHover: corePalette.clrHighContrast,
    orderHistoryBtnCancelBackground: corePalette.clrRed,
    orderHistoryBtnHoverBorder: corePalette.clrMouseHover,
    orderHistoryArrow: corePalette.clrBlue,

    orderBookHeaderBg: corePalette.clrTransparent,
    orderBookHeaderBorder: corePalette.clrSubBorder,
    orderBookHeaderInnerBorder: '#454d7288',
    orderBookHeaderText: corePalette.clrHighContrast,
    orderBookHeaderText2: corePalette.clrPurple,
    orderBookTableHeaderBg: corePalette.clrMainWindow,
    orderBookTableHeaderBorder: corePalette.clrBorder,
    orderBookTableHeaderText: corePalette.clrHighContrast,
    orderBookTableHeaderText2: corePalette.clrHighContrast,
    orderBookTableHeaderButton: corePalette.clrYellow,
    orderBookTableCellBg: corePalette.clrBackground,
    orderBookTableCellBorder: corePalette.clrBorder,
    orderBookHistoryCellInnerborder: corePalette.portGore,
    orderBookTableCellText: corePalette.clrPurple,
    orderBookTableCellTextAmount: '#A2B1ED',
    orderBookTableCellTextBuy: corePalette.fern,
    orderBookTableCellTextBuyBright: corePalette.pastelGreen,
    orderBookTableCellTextBuyPriceInteger: '#5a975b',
    orderBookTableCellBuyBorder: '#01AC67',
    orderBookTableCellBuyBgStop0: '#01573F',
    orderBookTableCellBuyBgStop1: 'rgba(0, 0, 0, 0.06)',
    orderBookTableCellTextSell: corePalette.dodgerBlue,
    orderBookTableCellTextSellBright: corePalette.malibu,
    orderBookTableCellTextSellPriceInteger: '#0a84d6',
    orderBookTableCellSellBorder: '#007ABF',
    orderBookTableCellSellBgStop0: 'rgba(0, 153, 255, 0.5)',
    orderBookTableCellSellBgStop1: 'rgba(0, 0, 0, 0.06)',
    orderBookTableCellBuyProgress: corePalette.olive,
    orderBookTableCellSellProgress: corePalette.cobalt,
    orderBookTableCellHoverBg: corePalette.clrMouseHover,
    orderBookTableSpreadBg: corePalette.clrMainWindow,
    orderBookTableSpreadBorder: corePalette.clrBorder,
    orderBookTableSpreadText: corePalette.clrPurple,
    orderBookTableSpreadText2: corePalette.clrHighContrast,
    orderBookAddonBg: corePalette.clrMainWindow,
    orderBookAddonBorder: corePalette.clrBorder,
    orderBookAddonFill: corePalette.clrBorder,
    orderBookAddonHoverFill: corePalette.clrHighContrast,
    orderBookIconFilter: 'invert(51%) sepia(41%) saturate(369%) hue-rotate(192deg) brightness(101%) contrast(90%)',
    orderBookSellIconFilter:
      'invert(47%) sepia(36%) saturate(4767%) hue-rotate(181deg) brightness(100%) contrast(104%)',
    orderBookBuyIconFilter: 'invert(80%) sepia(11%) saturate(4698%) hue-rotate(62deg) brightness(98%) contrast(40%)',
    orderBookTooltipInternalLine: 'rgb(116,123,166, 0.3)',

    orderFormBg: corePalette.clrBackground,
    orderFormBorder: corePalette.clrBorder,
    orderFormHeaderBg: corePalette.clrMainWindow,
    orderFormHeaderText: corePalette.clrPurple,
    orderFormHeaderTabText: corePalette.clrMouseClick,
    orderFormHeaderTabTextHover: corePalette.clrWhite,
    orderFormHeaderTabBorder: 'transparent',
    orderFormHeaderTabHoverText: corePalette.clrHighContrast,
    orderFormHeaderTabHoverBorder: 'transparent',
    orderFormHeaderTabActiveText: corePalette.clrBlue,
    orderFormHeaderTabActiveBorder: corePalette.clrBlue,
    orderFormLabelText: corePalette.clrHighContrast,
    orderFormInputBg: corePalette.clrBackground,
    orderFormInputBorder: corePalette.clrBorder,
    orderFormInputText: corePalette.clrHighContrast,
    orderFormInputAddon: corePalette.clrPurple,
    orderFormInputDisabledBg: corePalette.clrBackground,
    orderFormInputDisabledText: corePalette.clrPurple,
    orderFormSellBtnBg: corePalette.clrRed,
    orderFormSellBtnText: corePalette.clrHighContrast,
    orderFormSellBtnHoverBg: corePalette.clrRed,
    orderFormSellBtnHoverText: corePalette.clrMainWindow,
    orderFormSellBtnActiveBg: corePalette.clrDarkRed,
    orderFormSellBtnActiveText: corePalette.clrHighContrast,
    orderFormSellBtnDisabledBg: corePalette.clrBackground,
    orderFormSellBtnDisabledText: corePalette.clrDisabled,
    orderFormBuyBtnBg: corePalette.clrGreen,
    orderFormBuyBtnText: corePalette.clrHighContrast,
    orderFormBuyBtnHoverBg: corePalette.clrGreen,
    orderFormBuyBtnHoverText: corePalette.clrMainWindow,
    orderFormBuyBtnActiveBg: corePalette.clrDarkGreen,
    orderFormBuyBtnActiveText: corePalette.clrHighContrast,
    orderFormBuyBtnDisabledBg: corePalette.clrBackground,
    orderFormBuyBtnDisabledText: corePalette.clrDisabled,

    modalCancelBackground: '#BC1F1F',
    modalConfirmColor: '#24AB68',
    modalCloseBackground: corePalette.clrBlue,

    depositBackground: corePalette.clrMainWindow,
    depositBorder: corePalette.clrBorderHover,
    depositQRText: corePalette.clrHighContrast,
    depositText: corePalette.clrMouseClick,
    depositLabel: corePalette.clrPurple,
    depositInputBackground: corePalette.clrBackground,
    depositInputBorder: corePalette.clrBorder,
    depositInputHover: corePalette.clrMouseHover,
    depositActive: corePalette.clrPurple,
    depositActiveBack: corePalette.clrMouseClick,
    depositLink: corePalette.clrBlue,
    depositToggleBackground: corePalette.clrBackground,
    depositToggleBorder: corePalette.clrBorderLight,
    depositToggleScrollThumb: corePalette.clrPurple,
    depositToggleText: corePalette.clrPurple,
    depositToggleHover: corePalette.clrMouseHover,
    depositModalButtonsColor: '#000',
    depositDropdown: corePalette.clrPurple,
    depositDropdownActive: corePalette.clrHighContrast,
    depositDropdownHoverBg: corePalette.clrMouseHover,
    depositArrowBg: corePalette.clrPurple,

    tabIcon: '#9ba6b2',
    tabIconHover: '#01b067',

    secondary: secondaryDark,
    primaryActive: '#004981',

    sendCoinsModalHeaderBg: corePalette.clrBackground,
    sendCoinsModalHeaderText: corePalette.clrHighContrast,
    sendCoinsModalBg: corePalette.clrMainWindow,
    sendCoinsModalBorder: corePalette.clrPurple,

    sendCoinsModalItemBg: corePalette.clrBackground,
    sendCoinsModalItemBorder: corePalette.clrBorderLight,
    sendCoinsModalItemText: corePalette.clrPurple,
    sendCoinsModalItemHoverBg: corePalette.clrMouseHover,
    sendCoinsModalItemHoverText: corePalette.clrHighContrast,
    sendCoinsModalItemActiveBg: corePalette.clrBorder,
    sendCoinsModalItemActiveText: corePalette.clrHighContrast,

    sendCoinsModalAddonBtnBg: corePalette.clrBackground,
    sendCoinsModalAddonBtnText: corePalette.clrBorder,
    sendCoinsModalAddonBtnHoverBg: corePalette.clrMouseHover,
    sendCoinsModalAddonBtnHoverText: corePalette.clrHighContrast,
    sendCoinsModalAddonBtnActiveBg: corePalette.clrMouseClick,
    sendCoinsModalAddonBtnActiveText: corePalette.clrHighContrast,
    sendCoinsModalAddonBg: corePalette.clrPurple,
    sendCoinsModalAddonText: corePalette.clrHighContrast,

    sendCoinsModalInputBg: corePalette.clrBackground,
    sendCoinsModalInputBorder: corePalette.clrBorder,
    sendCoinsModalInputText: corePalette.clrHighContrast,
    sendCoinsModalInputText2: corePalette.clrBorder,
    sendCoinsModalInputLabel: corePalette.clrPurple,

    sendCoinsModalInputHoverBg: corePalette.clrBackground,
    sendCoinsModalInputHoverBorder: corePalette.clrPurple,
    sendCoinsModalInputHoverText: corePalette.clrHighContrast,
    sendCoinsModalInputHoverText2: corePalette.clrHighContrast,

    walletScrollBorder: corePalette.clrBorder,
    walletScrollBack: corePalette.clrBackground,
    walletScrollThumbBack: corePalette.clrPurple,
    walletGrid: corePalette.clrBorderLight,
    walletText: corePalette.clrPurple,
    walletBtnHover: corePalette.clrBorder,
    walletBtn: corePalette.clrInnerBorder,
    walletBtnActive: corePalette.clrHighContrast,
    walletLink: corePalette.clrBlue,
    walletToggle: '#1B1C3D',
    walletToggleIcon: corePalette.clrMouseClick,
    walletSmallLinksToggleBg: corePalette.clrPurple,
    walletSmallLinksToggleText: corePalette.clrMainWindow,
    walletHeaderIconFilter: 'invert(100%) sepia(1%) saturate(7496%) hue-rotate(291deg) brightness(116%) contrast(89%)',

    exchHeadHeight: '58px',

    exchTablePercentBorder: '#24303f',
    exchTableBg: '#16212d',
    exchTableExchIconBorder: '#202c3a',
    exchTableBorder: '#131b24',
    exchTableColor: '#6d7985',

    exchBarItemBg: corePalette.clrBackground,
    exchBarItemBorder: '#0e1622',
    exchBarItemTitle: '#fdfdfd',
    exchBarItemLabel: '#6d7885',
    clrsearchinput: '#25303f',
    exchBarItemMinusPrice: corePalette.clrPureRed,
    exchBarItemPlusPrice: corePalette.clrLightGreen,
    exchBarProgressBg: '#25ab68',
    exchBarActiveItem: corePalette.clrMouseHover,
    exchBarHoverItem: corePalette.clrMouseHover,
    clrWalletHover: corePalette.clrPurple,
    // CoinPairForm refactor 2019-01-07
    coinPairSelectBg: corePalette.clrBackground,
    coinPairBuyDisabledBg: '#021620',
    coinPairSellDisabledBg: '#140819',
    coinPairSellArrow: corePalette.dodgerBlue,
    coinPairBuyArrow: corePalette.fern,
    coinPairSelectBorder: corePalette.clrBorder,
    coinPairSelectText: corePalette.clrHighContrast,
    coinPairSelectText2: corePalette.clrBorder,
    coinPairSelectAddon: corePalette.clrBorder,
    coinPairSelectHoverBg: corePalette.clrMouseHover,
    coinPairSelectHoverBorder: corePalette.clrBorderHover,
    coinPairSelectHoverText: corePalette.clrBorder,
    coinPairSelectHoverText2: corePalette.clrHighContrast,
    coinPairSelectHoverAddon: corePalette.clrHighContrast,

    coinPairSwitchBtnFill: corePalette.clrMouseClick,
    coinPairSwitchBtnHoverFill: corePalette.clrHighContrast,

    coinPairDropDownItemBg: corePalette.clrBackground,
    coinPairDropDownItemText: corePalette.clrMouseClick,
    coinPairDropDownItemHoverBg: corePalette.clrMainWindow,
    coinPairDropDownItemHoverText: corePalette.clrWhite,
    coinPairDropDownItemActiveBg: corePalette.clrMouseClick,
    coinPairDropDownItemActiveText: corePalette.clrHighContrast,
    coinPairDropDownItemActiveText2: corePalette.clrHighContrast,
    coinPairDropDownTitleBg: corePalette.clrBackground,
    coinPairDropDownTitleText: corePalette.clrHighContrast,
    coinPairDropDownBorder: '#444b72',
    coinPairDropDownScrollBg: corePalette.clrBackground,
    coinPairDropDownScrollThumb: corePalette.clrBorderHover,

    coinPairCloseBtnBg: corePalette.clrLightRed,
    coinPairCloseBtnText: corePalette.clrHighContrast,
    coinPairCloseBtnHoverBg: corePalette.clrRed,
    coinPairCloseBtnHoverText: corePalette.clrDarkRed,
    coinPairCloseBtnActiveBg: corePalette.clrDarkRed,
    coinPairCloseBtnActiveText: corePalette.clrHighContrast,
    coinPairNextBtnBg: corePalette.clrBlue,
    coinPairNextBtnText: corePalette.clrHighContrast,
    coinPairNextBtnHoverBg: corePalette.clrBlue,
    coinPairNextBtnHoverText: corePalette.clrDarkBlue,
    coinPairNextBtnActiveBg: corePalette.clrDarkBlue,
    coinPairNextBtnActiveText: corePalette.clrHighContrast,

    coinPairDoneBtnBg: corePalette.clrGreen,
    coinPairDoneBtnText: corePalette.clrHighContrast,

    coinActiveFilter: 'invert(100%) sepia(0%) saturate(7484%) hue-rotate(303deg) brightness(105%) contrast(92%)',
    coinInactiveFilter: 'invert(29%) sepia(15%) saturate(1496%) hue-rotate(193deg) brightness(91%) contrast(85%)',
    coinBuyFilter: 'invert(60%) sepia(58%) saturate(5791%) hue-rotate(126deg) brightness(93%) contrast(101%)',
    coinSellFilter: 'invert(39%) sepia(35%) saturate(4473%) hue-rotate(186deg) brightness(108%) contrast(103%)',

    // Gradient Btns
    gradientBtnNextBg:
      'linear-gradient(to right, rgb(14,113,184) 0%, rgb(14,113,184) 15%, rgb(0,157,225) 45%, rgb(0,157,225) 55%, rgb(14,113,184) 85%, rgb(14,113,184) 100%)',
    gradientBtnNextHoverBg:
      'linear-gradient(to right, rgb(16,129,210) 0%, rgb(16,131,214) 15%, rgb(0,157,225) 45%, rgb(0,157,225) 55%, rgb(16,131,214) 85%, rgb(16,129,210) 100%)',

    gradientBtnCloseBg:
      'linear-gradient(to right, rgb(205,36,36) 0%, rgb(205,36,36) 15%, rgb(255,31,31) 45%, rgb(255,31,31) 55%, rgb(205,36,36) 85%, rgb(205,36,36) 100%)',
    gradientBtnCloseHoverBg:
      'linear-gradient(to right, rgb(205,36,36) 0%, rgb(255,31,31) 15%, rgb(255,31,31) 45%, rgb(255,31,31) 55%, rgb(255,31,31) 85%, rgb(205,36,36) 100%)',

    gradientBtnDisabled: '#0E1521',

    // Controls
    ctrlSliderTrackBg: corePalette.clrBorder,
    ctrlSliderTrackProgressBg: corePalette.clrBorderHover,
    ctrlsliderTrackDisabledBg: corePalette.clrBorder,
    ctrlSliderTrackCurrentBg: corePalette.clrMainWindow,
    ctrlSliderThumbBg: corePalette.clrHighContrast,
    ctrlSliderThumbBorder: corePalette.clrMainWindow,
    ctrlSliderThumbHoverBg: corePalette.clrHighContrast,
    ctrlSliderThumbHoverBorder: corePalette.clrMainWindow,
    ctrlSliderThumbActiveBg: corePalette.clrBorderHover,
    ctrlSliderThumbActiveBorder: corePalette.clrHighContrast,
    ctrlSliderDelimiterBg: corePalette.clrBorder,
    ctrlSliderDelimiterBorder: corePalette.clrMainWindow,
    ctrlSliderDelimiterActiveBg: corePalette.clrHighContrast,
    ctrlSliderDelimiterActiveBorder: corePalette.clrMainWindow,

    welcomePageBg: corePalette.clrMainWindow,
    welcomePageText: corePalette.clrPurple,
    welcomePageBorder: corePalette.clrBorder,
    welcomePageFontSize: '24px',
    welcomePagePadding: '17px',
    welcomePagePadding2: '12px',

    portfolioTooltipBg: '#0E1521',
    portfolioTooltipPriceColor: '#fff',
    portfolioTooltipDateColor: corePalette.clrPurple,
    portfolioTooltipBorderColor: corePalette.clrDarkPink,
    portfolioUSDIconColor: '#9f49a4',
    portfolioBTCIconFilter: 'invert(51%) sepia(41%) saturate(369%) hue-rotate(192deg) brightness(101%) contrast(90%)',

    tradingviewBorder: corePalette.clrBorder,

    donutBackground: corePalette.clrBackground,
    donutCenterLabel: corePalette.clrPurple,
    donutCenterLabelHighlight: corePalette.clrHighContrast,

    leftTopHeaderBg: corePalette.clrBackground,
    leftTopBg: '#050423',

    userMenuPopupBg: corePalette.clrBackground,
    userMenuPopupBorder: corePalette.clrBorder,
    userMenuPopupArrowBg: corePalette.clrBlue,
    userMenuPopupItemBorder: corePalette.clrDarkBlue,
    userMenuPopupAvatarLink: corePalette.clrBlue,
    userMenuPopupAvatarLinkHover: corePalette.clrHighContrast,
    userMenuPopupMenuItem: corePalette.clrBorder,
    userMenuPopupMenuItemBorder: corePalette.clrInnerBorder,
    userMenuPopupMenuItemHover: corePalette.clrPurple,
    userMenuPopupMenuItemBg: corePalette.clrBackground,
    userMenuPopupMenuItemHoverBg: corePalette.clrMouseHover,

    mobile2Bg: corePalette.clrBackground,
    mobile2HeaderBgNormal: corePalette.clrBackground,
    mobile2HeaderBgHighlight: corePalette.clrHighContrast,
    mobile2HeaderBtnFill: corePalette.clrBlue,
    mobile2HeaderBtnHoverFill: corePalette.clrPurple,
    mobile2HeaderAmountColor: corePalette.clrHighContrast,
    mobile2HeaderAmountHighlightColor: corePalette.clrHighContrast,
    mobile2HeaderUnitColor: corePalette.clrHighContrast,
    mobile2InviteBtnBg: corePalette.clrLightBlue,
    mobile2InviteBtnColor: corePalette.clrHighContrast,
    mobile2ContentBg: corePalette.clrBackground,
    mobile2HistoryItemBg: corePalette.clrBackground,
    mobile2HistoryItemBorder: corePalette.clrBorderGray,
    mobile2HistoryItemColor: corePalette.clrHighContrast,
    mobile2HistoryItemSecondColor: corePalette.clrBlue,
    mobile2HistoryHeaderBorder: corePalette.clrHighContrast,

    mobileSignFormMainColor: corePalette.clrHighContrast,
    mobileSignFormColor: corePalette.clrGray,

    mobile2PayViewPayBtnColor: corePalette.clrHighContrast,
    mobile2PayViewPayBtnWrapperBg: '#0c1a58',
    mobile2PayViewPayBtnBorderColor: corePalette.clrBlue,
    mobile2PayViewPayBtnDisabled: '#666666',
    mobile2PayViewPayBtnWrapperBgDisabled: '#1a1a1a',

    mobile2PayViewNumpadColor: corePalette.clrHighContrast,
    mobile2PayViewNumpadBg: corePalette.clrDarkGray,
    mobile2PayViewNumpadBgActive: corePalette.clrBlue,

    mobile2CircleGlowColor: '#3269d1',
    mobile2CircleMainBg: '#061333',

    mobilePageIndicatorBg: '#999999',
    mobile2CurrencyGlowColor: '#3269d1',
    mobile2CurrencyBgGlowColor: '#0c1a58',

    mobile2QRGlowColor: '#fbb03b',

    mobile2PhoneInputBg: '#05040a',
    mobile2PhoneInputBorder: '#3269d1',
    mobile2CurrencyCornerNumber: '#fbdf8a',
    mobile2CurrencyCornerBg: 'rgba(130,104,88,0.815)',

    donutTotalBalanceLabel: '#fa9f32',
    inputTxtColor: corePalette.clrBorder,
    inputPlaceholderBgColor: '#7d8dbe',
    inputPlaceholderTxtColor: '#434d70',

    settingsHeaderBgColor: '#040B31',
    settingsBorderColor: '#0C1334',
    settingsHeaderFontColor: '#A2AACE',
    settingsBackgroundColor: '#141B44',
    settingsBtnBgColor: '#454D72',
    settingsHoverColor: '#00C6C0',

    apiDocumentModalBgColor: '#141C44'
  }
};
