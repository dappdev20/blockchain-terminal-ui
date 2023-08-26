import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import Spinner from '@/components-generic/Spinner';
import TwofaSmsVerification from '../../TwofaSmsVerification';
import DisableGoogle2FA from './DisableGoogle2FA';
import EnableGoogle2FA from './EnableGoogle2FA';
import { OuterWrapper, SpinnerWrapper, ErrorDescription } from './styles';

class Content extends Component {
  state = {
    isSubmitSent: false,
    isSecretCodeSent: false,
    isDone2FARequest: false,
    isAPIError: false
  };

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isModalOpen && this.props.isModalOpen) {
      this.initData(true);
    }
  }

  handleSubmitSecretCode = secretCode => () => {
    const { confirmAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];

    if (secretCode.length === 4) {
      this.setState({
        isSecretCodeSent: true
      });

      confirmAuthCode(secretCode, 'UpdateSecondFactor')
        .then(() => {
          this.initData(true);
        })
        .catch(() => {
          this.setState({
            isSecretCodeSent: false
          });
        });
    }
  };

  handleSubmit = token => () => {
    const { toggleModal } = this.props;
    const { verifyGoogle2FA, disableGoogle2FA, isGoogle2FA } = this.props[STORE_KEYS.SMSAUTHSTORE];

    if (!isGoogle2FA) {
      if (token.length === 6) {
        this.setState({
          isSubmitSent: true
        });

        verifyGoogle2FA(token)
          .then(() => {
            this.setState({
              isSubmitSent: false
            });

            toggleModal();
          })
          .catch(() => {
            this.setState({
              isSubmitSent: false
            });
          });
      }
    } else {
      this.setState({
        isSubmitSent: true
      });

      disableGoogle2FA()
        .then(() => {
          this.setState({
            isSubmitSent: false
          });

          toggleModal();
        })
        .catch(() => {
          this.setState({
            isSubmitSent: false
          });
        });
    }
  };

  initData(isReqestGoogleSecret = false) {
    const { requestGoogleSecret, isGoogle2FA } = this.props[STORE_KEYS.SMSAUTHSTORE];

    this.setState(
      {
        isSubmitSent: false,
        isDone2FARequest: false,
        isAPIError: false,
        isSecretCodeSent: false
      },
      () => {
        if (!isGoogle2FA && isReqestGoogleSecret) {
          // if currently the google 2fa is not enabled
          requestGoogleSecret()
            .then(() => {
              this.setState({ isDone2FARequest: true });
            })
            .catch(err => {
              this.setState({
                isDone2FARequest: true,
                isAPIError: !!err
              });
            });
        } else {
          this.setState({ isDone2FARequest: true });
        }
      }
    );
  }

  renderBody() {
    const { isGoogle2FA, is2FAVerified } = this.props[STORE_KEYS.SMSAUTHSTORE];

    if (!is2FAVerified) {
      return (
        <TwofaSmsVerification
          isSecretCodeSent={this.state.isSecretCodeSent}
          handleSubmitSecretCode={this.handleSubmitSecretCode}
        />
      );
    }

    if (isGoogle2FA) {
      return <DisableGoogle2FA isSubmitSent={this.state.isSubmitSent} handleSubmit={this.handleSubmit} />;
    }

    return (
      <EnableGoogle2FA
        isSubmitSent={this.state.isSubmitSent}
        isDone2FARequest={this.state.isDone2FARequest}
        handleSubmit={this.handleSubmit}
      />
    );
  }

  render() {
    const { isAPIError, isDone2FARequest } = this.state;

    if (!isDone2FARequest) {
      return (
        <OuterWrapper>
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        </OuterWrapper>
      );
    }

    if (isAPIError) {
      return (
        <OuterWrapper>
          <ErrorDescription>API Error</ErrorDescription>
        </OuterWrapper>
      );
    }

    return <OuterWrapper>{this.renderBody()}</OuterWrapper>;
  }
}

export default inject(STORE_KEYS.SMSAUTHSTORE)(observer(Content));
