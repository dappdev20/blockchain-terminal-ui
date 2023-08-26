import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import throttle from 'lodash.throttle';

// Child Components
import LeftTopSectionGrid from './LeftTopSectionGrid';
import RightTopSectionGrid from './RightTopSectionGrid';
import ConfirmEmail2FA from './ConfirmEmail2FA';
import InitialLoaderContainer from '../components/InitialLoaderContainer';
import ConnectionLost from '../components-generic/ConnectionLost';
import { getScreenInfo } from '../utils';
import { STORE_KEYS } from '../stores';
import { orderFormToggleKeys } from '../stores/MarketMaker';

// Set ReactDom
window.React = React;
window.ReactDOM = ReactDOM;

const GridWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  background: ${props => props.theme.palette.clrBackground};
  padding: ${({
      theme: {
        palette: { contentGap }
      }
    }) => `${contentGap} ${contentGap} ${contentGap}`}
    0;

  @media (max-width: 1600px) {
    transform: scale(0.85);
    transform-origin: 0 0;
    width: 117.64%;
    height: 117.64%;
  }

  @media (max-width: 1500px) {
    transform: scale(0.75);
    transform-origin: 0 0;
    width: 133.33%;
    height: 133.33%;
  }

  @media (max-width: 1080px) {
    transform: scale(0.65);
    transform-origin: 0 0;
    width: 153.84%;
    height: 153.84%;
  }

  @media (max-width: 940px) {
    transform: scale(0.55);
    transform-origin: 0 0;
    width: 181.81%;
    height: 181.81%;
  }

  @media (max-width: 790px) {
    transform: scale(0.45);
    transform-origin: 0 0;
    width: 222.22%;
    height: 222.22%;
  }

  @media (max-width: 700px) {
    transform: scale(0.35);
    transform-origin: 0 0;
    width: 285.71%;
    height: 285.71%;
  }

  transform: ${({ isMobilePortrait, isMobileLandscape, isSmallWidth }) => {
    if (isMobileLandscape) return 'scale(0.5) !important';
    if (isMobilePortrait) return 'scale(0.75) !important';
    if (isSmallWidth) return 'scale(1) !important';
  }};

  width: ${({ isMobilePortrait, isMobileLandscape, isSmallWidth }) => {
    if (isMobileLandscape) return '200% !important';
    if (isMobilePortrait) return '133.33% !important';
    if (isSmallWidth) return '100% !important';
  }};

  height: ${({ isMobilePortrait, isMobileLandscape, isSmallWidth }) => {
    if (isMobileLandscape) return '200% !important';
    if (isMobilePortrait) return '133.33% !important';
    if (isSmallWidth) return '100% !important';
  }};
`;

class Trading extends PureComponent {
  componentDidMount() {
    const { setRouterCoin, isHFApp, match } = this.props;
    if (!isHFApp && match && match.params && match.params.coin !== '') {
      setRouterCoin(match.params.coin.toUpperCase());
    }

    window.addEventListener('resize', throttle(this.updateDimensions, 250));
  }

  updateDimensions = () => {
    this.forceUpdate();
  };

  render() {
    const { isMobileDevice, isMobileLandscape, isMobilePortrait, isSmallWidth } = getScreenInfo();

    const { isCoinTransfer, showOrderFormWith, isHFApp } = this.props;

    if (isMobilePortrait) {
      showOrderFormWith(orderFormToggleKeys.offToggleKey);
    }

    if (isMobileLandscape) {
      showOrderFormWith(orderFormToggleKeys.onToggleKey);
    }

    return (
      <GridWrapper
        id="grid"
        isMobilePortrait={isMobilePortrait}
        isMobileLandscape={isMobileLandscape}
        isSmallWidth={isSmallWidth}
      >
        <LeftTopSectionGrid
          isCoinTransfer={isCoinTransfer}
          isMobileDevice={isMobileDevice}
          isMobilePortrait={isMobilePortrait}
          isSmallWidth={isSmallWidth}
          trId={isCoinTransfer ? this.props.id : null}
        />

        <RightTopSectionGrid
          isMobilePortrait={isMobilePortrait}
          isSmallWidth={isSmallWidth}
          isMobileDevice={isMobileDevice}
          isHFApp={isHFApp}
        />

        <InitialLoaderContainer />

        <ConnectionLost isMobileDevice={isMobileDevice} />
      </GridWrapper>
    );
  }
}

const MainGrid = props => {
  return (
    <Router>
      <Route exact path="/HF" component={() => <Trading {...props} isHFApp={true} />} />
      <Route
        exact
        path="/t/:id"
        component={({ match }) => <Trading {...props} isCoinTransfer={true} id={match.params.id} />}
      />
      <Route
        exact
        path="/r/:id"
        component={({ match }) => <Trading {...props} isCoinTransfer={true} id={match.params.id} />}
      />
      <Route exact path="/index.html" component={() => <Trading {...props} />} />
      <Route exact path="/" component={() => <Trading {...props} />} />
      <Route
        exact
        path="/2fa/confirm/:code"
        component={({ match }) => <ConfirmEmail2FA {...props} code={match.params.code} />}
      />
    </Router>
  );
};

export default compose(
  inject(STORE_KEYS.INSTRUMENTS, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.MARKETMAKER),
  observer,
  withProps(({ [STORE_KEYS.INSTRUMENTS]: { setRouterCoin }, [STORE_KEYS.MARKETMAKER]: { showOrderFormWith } }) => ({
    setRouterCoin,
    showOrderFormWith
  }))
)(MainGrid);
