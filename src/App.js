import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider, StylesProvider, jssPreset } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
/* eslint-disable-next-line */
import { create } from 'jss';
import { ThemeProvider } from 'styled-components/macro';
import { Provider, inject, observer } from 'mobx-react';
import { IntlProvider } from 'react-intl';

import MainGrid from '@/grid/MainGrid';
import Stores, { STORE_KEYS } from '@/stores';
import SnackbarPortal from '@/components/SnackbarPortal';
import ModalPortal from '@/components/ModalPortal';
import { darkTheme } from '@/theme/core';
import { languages } from '@/lib/translations/languages';
import { messages } from '@/lib/translations';
import createGlobalStyles from '@/globalStyles';

const jss = create({
  ...jssPreset(),
  // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
  insertionPoint: 'jss-insertion-point'
});

const muiTheme = theme =>
  createMuiTheme({
    palette: {
      type: theme.muiTheme
    },
    appTheme: theme
  });

const GlobalStyles = createGlobalStyles();

class ThemedAppComponent extends React.Component {
  lastTouchEnd = 0;

  componentDidMount() {
    document.addEventListener('touchmove', this.handleTouchMove, true);
    document.addEventListener('touchend', this.handleTouchEnd, true);
  }

  componentWillUnmount() {
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchMove = e => {
    if (e.scale != null && e.scale !== 1) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleTouchEnd = e => {
    const now = new Date().getTime();
    if (now - this.lastTouchEnd <= 300) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.lastTouchEnd = now;
  };

  render() {
    const { language } = this.props[STORE_KEYS.SETTINGSSTORE];
    const activeLanguage = languages.find(x => !!language && language.toLowerCase() === x.value.toLowerCase());
    const activeLocale = activeLanguage ? activeLanguage.key : 'en';
    const activeMessages = messages[activeLocale];
    return (
      <IntlProvider locale={activeLocale} key={activeLocale} messages={activeMessages}>
        <MainGrid />
      </IntlProvider>
    );
  }
}

const ThemedApp = inject(STORE_KEYS.SETTINGSSTORE)(observer(ThemedAppComponent));

const App = () => (
  <Provider {...Stores()}>
    <StylesProvider jss={jss}>
      <ThemeProvider theme={darkTheme}>
        <MuiThemeProvider theme={muiTheme(darkTheme)}>
          <GlobalStyles />
          <CssBaseline />
          <ThemedApp />
          <ModalPortal />
          <SnackbarPortal />
        </MuiThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  </Provider>
);

export default App;
