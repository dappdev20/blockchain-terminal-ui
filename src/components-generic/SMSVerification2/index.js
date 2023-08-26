import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import Cookies from 'universal-cookie';
import { formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import { compose } from 'recompose';
import { withSafeTimeout } from '@hocs/safe-timers';
import { noop } from '@/utils';
import {
  Wrapper,
  InputWrapper,
  Input,
  InputAddon,
  // SendIcon,
  SpinnerIcon,
  SendIcon,
  SendIcon2
} from './Components';
import { STORE_KEYS } from '../../stores';

const SMS_AUTH_VIEW_STEPS = {
  ENTER_PHONE_NUMBER: 'enter-phone-number',
  ENTER_CODE: 'enter-code',
  VERIFY_SUCCESS: 'verify-success'
};

class SMSVerification extends Component {
  state = {
    currentView: SMS_AUTH_VIEW_STEPS.ENTER_PHONE_NUMBER,
    phoneNumber: '',
    code: '',
    isSendingPhoneNumber: false,
    isPhoneNumberSent: false,
    isSendingCode: false,
    isCodeSent: false
  };

  codeInput = React.createRef();
  clearConfirmAuthCodeHandleTimeout = null;
  clearConfirmAuthCodeInnerHandleTimeout = null;

  componentDidMount() {
    const cookies = new Cookies();
    const phoneNum = this.getInternationPhoneNumberFormat(cookies.get('phoneNumber') || '');
    this.setState({ phoneNumber: phoneNum });
  }

  componentWillUnmount() {
    if (this.clearConfirmAuthCodeHandleTimeout) {
      this.clearConfirmAuthCodeHandleTimeout();
    }
    if (this.clearConfirmAuthCodeInnerHandleTimeout) {
      this.clearConfirmAuthCodeInnerHandleTimeout();
    }
  }

  getInternationPhoneNumberFormat = value => {
    let intFormatValue = '';
    const { phoneNumber } = this.state;
    if (value.includes('+')) {
      intFormatValue = formatPhoneNumberIntl(value);
    } else {
      intFormatValue = formatPhoneNumberIntl(`+${value}`);
    }
    if (/[a-z]/.test(intFormatValue) || value.replace(/\s/g, '').length > 14) {
      intFormatValue = phoneNumber;
    }

    if (intFormatValue.length === 0) {
      intFormatValue = value;
    }
    intFormatValue = intFormatValue.replace(/\s/g, '');
    return intFormatValue;
  };

  handleChangePhoneNumber = e => {
    e.stopPropagation();
    const phoneNum = this.getInternationPhoneNumberFormat(e.target.value);
    this.setState({
      phoneNumber: phoneNum,
      code: '',
      isPhoneNumberSent: false,
      isCodeValid: false
    });
  };

  handleChangeCode = e => {
    const { setSafeTimeout } = this.props;
    e.stopPropagation();
    this.setState(
      {
        code: e.target.value
      },
      () => {
        const { code: securityCode } = this.state;
        this.setState({
          isCodeValid: securityCode.length >= 4
        });
        if (securityCode.length >= 4) {
          setSafeTimeout(this.handleCheckCode, 1000);
        }
      }
    );
  };

  handleSendPhoneNumber = e => {
    e.stopPropagation();
    const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
    const { phoneNumber } = this.state;
    let phoneNumberTrimed = phoneNumber.replace(/\s+/g, '');
    phoneNumberTrimed = `+${phoneNumberTrimed.replace(/\+/g, '')}`;

    this.setState({
      isSendingPhoneNumber: true
    });

    requestAuthCode(phoneNumberTrimed)
      .then(() => {
        this.setState(
          {
            isPhoneNumberSent: true,
            isSendingPhoneNumber: false,
            currentView: SMS_AUTH_VIEW_STEPS.ENTER_CODE
          },
          () => {
            this.codeInput.current.focus();
          }
        );
      })
      .catch(() => {
        this.setState({
          isSendingPhoneNumber: false
        });
      });
  };

  handleGoBack = () => {
    this.setState({
      isPhoneNumberSent: false,
      isSendingPhoneNumber: false,
      currentView: SMS_AUTH_VIEW_STEPS.ENTER_PHONE_NUMBER
    });
  };

  handleCheckCode = () => {
    const { code: securityCode, isCodeValid } = this.state;
    const { confirmAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];

    if (!isCodeValid) return;

    this.setState({
      isSendingCode: true
    });

    confirmAuthCode(securityCode)
      .then(() => {
        if (this.clearConfirmAuthCodeHandleTimeout) {
          this.clearConfirmAuthCodeHandleTimeout();
        }
        this.clearConfirmAuthCodeHandleTimeout = this.props.setSafeTimeout(() => {
          this.setState({
            isCodeSent: true,
            isSendingCode: false,
            currentView: SMS_AUTH_VIEW_STEPS.VERIFY_SUCCESS
          });

          if (this.clearConfirmAuthCodeInnerHandleTimeout) {
            this.clearConfirmAuthCodeInnerHandleTimeout();
          }
          this.clearConfirmAuthCodeInnerHandleTimeout = this.props.setSafeTimeout(() => {
            const {
              [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
              [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
              [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
              [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
              onClose
            } = this.props;
            const mockUser = {
              id: '1020',
              username: '',
              first_name: 'SMS',
              last_name: 'User'
            };

            telegramStore.initByTelegramLogin();
            orderHistoryStore.requestOrderHistory();
            yourAccountStore.requestPositionWithReply();
            lowestExchangeStore.requestOrderEvents();
            telegramStore.loginFinishWith(mockUser);

            if (onClose) {
              onClose();
            }
          }, 500);
        }, 500);
      })
      .catch(() => {
        this.setState({
          isSendingCode: false
        });
      });
  };

  render() {
    const {
      currentView,
      phoneNumber,
      code,
      isPhoneNumberSent,
      isSendingPhoneNumber,
      isCodeSent,
      isSendingCode,
      isCodeValid
    } = this.state;

    const { handleBack } = this.props;

    const isPhoneNumberValid = isValidPhoneNumber(phoneNumber);

    const codeInputClassForValid = isCodeValid ? 'code-valid' : '';

    return (
      <Wrapper>
        <InputWrapper className={`phone-number-input ${currentView}`}>
          <FormattedMessage id="sms_verification.label_enter_mobile_number" defaultMessage="Mobile Phone Number">
            {placeholder => (
              <Input
                type="tel"
                placeholder={placeholder}
                value={phoneNumber}
                onChange={this.handleChangePhoneNumber}
                readOnly={isSendingPhoneNumber || isSendingCode || isCodeSent}
              />
            )}
          </FormattedMessage>

          {!isPhoneNumberSent && (
            <InputAddon onClick={!phoneNumber ? handleBack : isSendingPhoneNumber ? null : this.handleSendPhoneNumber}>
              {!phoneNumber || !isPhoneNumberValid ? (
                <SendIcon />
              ) : isSendingPhoneNumber ? (
                <SpinnerIcon />
              ) : (
                <SendIcon2 />
              )}
            </InputAddon>
          )}
        </InputWrapper>

        {isPhoneNumberSent && (
          <InputWrapper className={`code-input ${currentView} ${codeInputClassForValid}`}>
            <FormattedMessage id="sms_verification.label_what_code" defaultMessage="CODE">
              {placeholder => (
                <Input
                  type="number"
                  ref={this.codeInput}
                  placeholder={placeholder}
                  value={code}
                  onChange={this.handleChangeCode}
                  readOnly={!isPhoneNumberSent || isSendingPhoneNumber || isSendingCode || isCodeSent}
                />
              )}
            </FormattedMessage>

            {
              <InputAddon onClick={isSendingCode ? noop : this.handleCheckCode}>
                {isSendingCode ? (
                  <SpinnerIcon />
                ) : isCodeValid && currentView === SMS_AUTH_VIEW_STEPS.VERIFY_SUCCESS ? (
                  <SpinnerIcon />
                ) : (
                  <SendIcon />
                )}
              </InputAddon>
            }
          </InputWrapper>
        )}
      </Wrapper>
    );
  }
}

const enhanced = compose(
  withSafeTimeout,
  inject(
    STORE_KEYS.SMSAUTHSTORE,
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.ORDERHISTORY,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.LOWESTEXCHANGESTORE
  ),
  observer
);

export default enhanced(SMSVerification);
