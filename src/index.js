import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '@/config/polyfills'; // custom polyfill
import 'react-virtualized/styles.css';
import 'rc-slider/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getSCPublicObservable, getSCPrivateObservable } from './lib/bct-ws';
import * as serviceWorker from './serviceWorker';
import telegramLogin from './lib/tg-auth';

// dot env vars are strings not boolean
if (process.env.REACT_APP_USE_SENTRY !== 'true') {
  console.log('===> Sentry is disabled by REACT_APP_USE_SENTRY="false"');
} else {
  import('@sentry/browser')
    .then(Sentry => {
      // TODO: set dsn in .env or config, don't hardcore here
      Sentry.init({ dsn: 'https://9e37162aad8c4b7e86d3a8e2396be980@sentry.bct.tools//2' });
      console.log('===> Sentry is enabled by REACT_APP_USE_SENTRY="true"');
    })
    .catch(err => {
      console.log('===> Sentry failed to initialize properly due to:', err);
    });
}

getSCPublicObservable();
getSCPrivateObservable();
// TODO refactoring: do we need this?
telegramLogin();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
