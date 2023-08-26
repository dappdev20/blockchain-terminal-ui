import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import Cookies from 'universal-cookie';
import { formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import { AsYouType } from 'libphonenumber-js';
import { compose } from 'recompose';
import { withSafeTimeout } from '@hocs/safe-timers';
import { Wrapper, InputWrapper, InputLabel, Input, SpinnerIcon } from './Components';
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

  phoneNumberInput = React.createRef();
  codeInput = React.createRef();
  clearConfirmAuthCodeHandleTimeout = null;
  clearConfirmAuthCodeInnerHandleTimeout = null;

  componentDidMount() {
    const cookies = new Cookies();
    const phoneNum = this.getInternationPhoneNumberFormat(cookies.get('phoneNumber') || '');
    this.setState({ phoneNumber: phoneNum });
    this.phoneNumberInput.current.focus();
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
    if (value.includes('+')) {
      intFormatValue = formatPhoneNumberIntl(value);
    } else {
      intFormatValue = new AsYouType('US').input(value);
    }

    return intFormatValue;
  };

  handleChangePhoneNumber = e => {
    e.stopPropagation();
    const { phoneNumber } = this.state;
    let phoneNum = e.target.value;

    if (/[a-z]/.test(e.target.value) || e.target.value.replace(/\s/g, '').length > 14) {
      phoneNum = phoneNumber;
    }

    if (this.validPhone(phoneNum)) {
      phoneNum = this.getInternationPhoneNumberFormat(phoneNum);
      this.setState({ phoneNumber: phoneNum }, () => {
        this.handleSendPhoneNumber();
      });
    }

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
    if (e) e.stopPropagation();
    const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
    let { phoneNumber } = this.state;
    if (!phoneNumber.includes('+')) {
      phoneNumber = `1${phoneNumber}`;
    }
    let phoneNumberTrimed = phoneNumber.replace(/[\s\(\)+-]/g, '');
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

  validPhone = number => {
    let phone = number;
    if (!number.includes('+')) {
      phone = `1${number}`;
    }
    let phoneNumberTrimed = phone.replace(/[\s\(\)+-]/g, '');
    phoneNumberTrimed = `+${phoneNumberTrimed.replace(/\+/g, '')}`;

    return isValidPhoneNumber(phoneNumberTrimed);
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

    const codeInputClassForValid = isCodeValid ? 'code-valid' : '';

    return (
      <Wrapper>
        <InputWrapper className={`phone-number-input ${currentView}`} isPhoneNumberSent={isPhoneNumberSent}>
          <InputLabel>
            <FormattedMessage id="sms_verification.label_enter_mobile_number" defaultMessage="Phone Number" />
            {isSendingPhoneNumber && <SpinnerIcon />}
          </InputLabel>
          <FormattedMessage id="sms_verification.label_enter_mobile_number" defaultMessage="Phone Number">
            {placeholder => (
              <Input
                type="tel"
                ref={this.phoneNumberInput}
                placeholder={placeholder}
                value={phoneNumber}
                onChange={this.handleChangePhoneNumber}
                readOnly={isSendingPhoneNumber || isSendingCode || isCodeSent}
              />
            )}
          </FormattedMessage>
        </InputWrapper>

        {isPhoneNumberSent && (
          <InputWrapper
            className={`code-input ${currentView} ${codeInputClassForValid}`}
            isPhoneNumberSent={isPhoneNumberSent}
          >
            <InputLabel>
              <FormattedMessage id="sms_verification.label_what_code" defaultMessage="CODE" />
              {isSendingCode && <SpinnerIcon />}
            </InputLabel>
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
