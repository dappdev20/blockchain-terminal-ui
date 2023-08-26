import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { withSafeTimeout } from '@hocs/safe-timers';
import { STORE_KEYS } from '@/stores';
import ExchangeFields from '@/mock/exchange-fields-data';
import { GlobalIcon } from '@/components/OrderTabs/Components';
import DataLoader from '@/components-generic/DataLoader';
import { CloseButton } from '@/components-generic/Icons';
import { LogoWrapper, Logo, ApiKeyWrapper, Wrapper, WrapperWithBorder, Input, InputAddon, Button } from './styles';

class ApiKey extends React.Component {
  state = {
    step: 0,
    apiKey: '',
    apiSecret: '',
    uid: '',
    password: ''
  };

  clearHandleConfirmButtonTimeout = null;

  componentWillUnmount() {
    if (this.clearHandleConfirmButtonTimeout) {
      this.clearHandleConfirmButtonTimeout();
    }
  }

  nextStep = () => {
    const fields = ExchangeFields[this.props.selectedExchange.name];

    if (!this.state.apiKey) {
      this.setState({ step: 0 });
    } else if (!this.state.apiSecret) {
      this.setState({ step: 1 });
    } else if (fields.password && !this.state.password) {
      this.setState({ step: 2 });
    } else if (fields.uid && !this.state.uid) {
      this.setState({ step: 3 });
    } else {
      this.submitCredentials();
    }
  };

  changeValue = field => e => {
    this.setState({
      [field]: e.target.value
    });
  };

  remove = () => {
    this.setState({ isInProgress: true });

    this.props
      .removeExchange(this.props.selectedExchange.name)
      .then(() => {
        this.setState({ isInProgress: false });

        if (this.props.onCloseHandler) {
          this.props.onCloseHandler();
        }
      })
      .catch(err => {
        console.log('=== Remove Exchange error ===\n', err);
        this.setState({ isInProgress: false });
      });
  };

  cancel = () => {
    if (this.props.onCloseHandler) {
      this.props.onCloseHandler();
    }
  };

  submitCredentials = () => {
    const exchange = this.props.selectedExchange.name;

    const payload = {
      exchange,
      enabled: true,
      active: true
    };

    // The shape of the payload varies by exchanges based
    // on the fields required. Add each field as needed
    Object.keys(ExchangeFields[exchange]).forEach(field => (payload[field] = this.state[field]));

    this.setState({ isInProgress: true });

    this.props
      .addExchange(payload)
      .then(() => {
        this.setState({ isInProgress: false });

        if (this.props.onCloseHandler) {
          this.props.onCloseHandler();
        }
      })
      .catch(err => {
        console.log('=== Add Exchange error ===\n', err);
        this.setState({ isInProgress: false });

        if (this.props.onCloseHandler) {
          this.props.onCloseHandler();
        }
      });
  };

  render() {
    const { selectedExchange, hasAPIKey } = this.props;
    const { step, apiKey, apiSecret, isInProgress, password, uid } = this.state;

    const isGlobal = selectedExchange && selectedExchange.name === 'Global';

    if (isInProgress)
      return (
        <ApiKeyWrapper onClick={this.props.onClick}>
          {isGlobal ? (
            <GlobalIcon size={30} marginRight={15} color="#fff" />
          ) : (
            <LogoWrapper size={30}>
              <Logo src={`/img/exchange/${selectedExchange.icon}`} alt="" />
            </LogoWrapper>
          )}

          <Wrapper>
            <DataLoader width={30} height={30} />
          </Wrapper>
        </ApiKeyWrapper>
      );

    return (
      <ApiKeyWrapper onClick={this.props.onClick}>
        {isGlobal ? (
          <GlobalIcon size={30} marginRight={15} color="#fff" />
        ) : (
          <LogoWrapper size={30}>
            <Logo src={`/img/exchange/${selectedExchange.icon}`} alt="" />
          </LogoWrapper>
        )}

        {hasAPIKey && (
          <Wrapper>
            <Button onClick={this.remove}>Remove API</Button>
            <Button onClick={this.cancel}>Cancel</Button>
          </Wrapper>
        )}

        {!hasAPIKey && step === 0 && (
          <WrapperWithBorder>
            <Input
              placeholder={`Enter Your ${selectedExchange.name} API Key`}
              value={apiKey}
              onChange={this.changeValue('apiKey')}
            />

            <InputAddon onClick={this.nextStep}>Next</InputAddon>
          </WrapperWithBorder>
        )}

        {!hasAPIKey && step === 1 && (
          <WrapperWithBorder>
            <Input
              placeholder={`Enter Your ${selectedExchange.name} API Secret`}
              value={apiSecret}
              onChange={this.changeValue('apiSecret')}
            />

            <InputAddon onClick={this.nextStep}>Next</InputAddon>
          </WrapperWithBorder>
        )}

        {!hasAPIKey && step === 2 && (
          <WrapperWithBorder>
            <Input
              placeholder={`Enter Your ${selectedExchange.name} password`}
              value={password}
              onChange={this.changeValue('password')}
            />

            <InputAddon onClick={this.nextStep}>Next</InputAddon>
          </WrapperWithBorder>
        )}

        {!hasAPIKey && step === 3 && (
          <WrapperWithBorder>
            <Input
              placeholder={`Enter Your ${selectedExchange.name} UID`}
              value={uid}
              onChange={this.changeValue('uid')}
            />

            <InputAddon onClick={this.nextStep}>Next</InputAddon>
          </WrapperWithBorder>
        )}
        {!hasAPIKey && (
          <div
            className="api-close-link"
            role="button"
            tabIndex={0}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <CloseButton
              size={20}
              onClick={() => {
                this.props.closeApiKey();
              }}
            />
          </div>
        )}
      </ApiKeyWrapper>
    );
  }
}

const enchanced = compose(
  withSafeTimeout,
  inject(STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(({ [STORE_KEYS.EXCHANGESSTORE]: { addExchange, removeExchange } }) => ({
    addExchange,
    removeExchange
  }))
);

export default enchanced(ApiKey);
