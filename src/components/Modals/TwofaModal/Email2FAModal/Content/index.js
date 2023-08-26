import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { STORE_KEYS } from '@/stores';
import Spinner from '@/components-generic/Spinner';
import TwofaSmsVerification from '../../TwofaSmsVerification';
import DisableEmail2FA from './DisableEmail2FA';
import EnableEmail2FA from './EnableEmail2FA';
import { OuterWrapper, SpinnerWrapper, ErrorDescription } from './styles';

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitSent: false,
      isSecretCodeSent: false,
      isAPIError: false,
      isProcess2FA: false,
      isAsk2FA: false,
      email: ''
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isModalOpen && this.props.isModalOpen) {
      this.initData();
    }
  }

  handleSubmitSecretCode = secretCode => async () => {
    const { toggleModal, confirmAuthCode, requestEmailSecret, disableEmail2FA, isEmail2FA } = this.props;
    const { email, isAsk2FA } = this.state;

    if (secretCode.length !== 4) {
      return;
    }

    this.setState({
      isSecretCodeSent: true
    });

    try {
      await confirmAuthCode(secretCode, 'UpdateSecondFactor');

      if (!isAsk2FA) {
        this.initData();
      } else {
        this.setState({
          isProcess2FA: true
        });

        if (isEmail2FA) {
          try {
            await disableEmail2FA();
            toggleModal();
          } catch (err) {
            this.setState({
              isSubmitSent: false,
              isProcess2FA: false,
              isAsk2FA: false
            });
          }
        } else {
          try {
            await requestEmailSecret(email);
            toggleModal();
          } catch (err) {
            this.setState({
              isSubmitSent: false,
              isProcess2FA: false,
              isAsk2FA: false
            });
          }
        }
      }
    } catch (err) {
      this.setState({
        isSecretCodeSent: false
      });
    }
  };

  handleSubmit = email => () => {
    const { toggleModal, requestEmailSecret, disableEmail2FA, isEmail2FA } = this.props;

    this.setState({
      isAsk2FA: true
    });

    if (!isEmail2FA) {
      if (email) {
        this.setState({
          isSubmitSent: true
        });

        requestEmailSecret(email)
          .then(() => {
            toggleModal();
          })
          .catch(err => {
            if (!err) {
              this.setState({
                email
              });
            }

            this.setState({
              isSubmitSent: false
            });
          });
      }
    } else {
      this.setState({
        isSubmitSent: true
      });

      disableEmail2FA()
        .then(() => {
          toggleModal();
        })
        .catch(() => {
          this.setState({
            isSubmitSent: false
          });
        });
    }
  };

  initData() {
    this.setState({
      isSubmitSent: false,
      isAPIError: false,
      isSecretCodeSent: false,
      isProcess2FA: false,
      isAsk2FA: false,
      email: ''
    });
  }

  renderBody() {
    const { isProcess2FA } = this.state;
    const { isEmail2FA, is2FAVerified } = this.props;

    if (isProcess2FA) {
      return (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      );
    }

    if (!is2FAVerified) {
      return (
        <TwofaSmsVerification
          isSecretCodeSent={this.state.isSecretCodeSent}
          handleSubmitSecretCode={this.handleSubmitSecretCode}
        />
      );
    }

    if (isEmail2FA) {
      return <DisableEmail2FA isSubmitSent={this.state.isSubmitSent} handleSubmit={this.handleSubmit} />;
    }

    return <EnableEmail2FA isSubmitSent={this.state.isSubmitSent} handleSubmit={this.handleSubmit} />;
  }

  render() {
    const { isAPIError } = this.state;

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

export default compose(
  inject(STORE_KEYS.SMSAUTHSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.SMSAUTHSTORE]: { confirmAuthCode, requestEmailSecret, disableEmail2FA, isEmail2FA, is2FAVerified }
    }) => ({
      confirmAuthCode,
      requestEmailSecret,
      disableEmail2FA,
      isEmail2FA,
      is2FAVerified
    })
  )
)(Content);
