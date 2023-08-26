import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';

import InitialLoader from '../../components-generic/InitialLoader';
import { STORE_KEYS } from '../../stores';

class InitialLoaderContainer extends Component {
  state = {
    loadFailed: false
  };

  componentDidMount() {
    this.props.setSafeTimeout(this.updateLoadFailed, 30000);
  }

  updateLoadFailed = () => {
    const { isAccountStoreLoaded } = this.props;

    if (!isAccountStoreLoaded) {
      this.setState({
        loadFailed: true
      });
    }
  };

  render() {
    const {
      [STORE_KEYS.INSTRUMENTS]: { isLoaded: isBaseQuotesLoaded }
    } = this.props;

    if (this.state.loadFailed) {
      return null;
    }

    return !isBaseQuotesLoaded && <InitialLoader />;
  }
}

const enhanced = compose(
  withSafeTimeout,
  inject(STORE_KEYS.INSTRUMENTS),
  observer
);

export default enhanced(InitialLoaderContainer);
