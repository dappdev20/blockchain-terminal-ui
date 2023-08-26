import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import GradientButton from '@/components-generic/GradientButtonSquare';
import Spinner from '@/components-generic/Spinner';
import {
  SpinnerWrapper,
  InnerWrapper,
  TextTitle,
  TextDescription,
  TextHighlight,
  ButtonWrappers,
  QRImgWrapper,
  QRKeyWrapper,
  InputWrapper,
  Input,
  Google2FAInfo,
  AppStoreLink,
  GooglePlayLink
} from './styles';

function EnableGoogle2FA(props) {
  const [token, setToken] = useState('');
  const { isSubmitSent, isDone2FARequest, handleSubmit } = props;
  const { googleSecret, googleQrCodeData } = props[STORE_KEYS.SMSAUTHSTORE];

  const handleChangeToken = e => {
    e.stopPropagation();
    setToken(e.target.value);
  };

  if (!isDone2FARequest) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <InnerWrapper>
      <TextTitle>
        <FormattedMessage id="modal.2fa.label_enable_google" defaultMessage="Enable Google 2-Step Authentication" />
      </TextTitle>

      <TextDescription>
        <FormattedMessage id="modal.2fa.label_notice" defaultMessage="Use Google Authenticator App" />
      </TextDescription>

      <Google2FAInfo>
        <AppStoreLink href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8" target="_blank" />
        <GooglePlayLink
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en"
          target="_blank"
        />
      </Google2FAInfo>

      <TextDescription>
        <div>
          Scan the <TextHighlight>QR code</TextHighlight> or enter the
        </div>
        <div>
          <TextHighlight>Secret Key</TextHighlight> Manually
        </div>
      </TextDescription>

      <QRImgWrapper>
        <img src={googleQrCodeData} alt="Google QrCode" />
      </QRImgWrapper>

      <QRKeyWrapper>
        <TextHighlight>{googleSecret}</TextHighlight>
        <div>Secret Key</div>
      </QRKeyWrapper>

      <InputWrapper>
        <FormattedMessage id="modal.2fa.label_input_one_time_password" defaultMessage="Enter one-time password">
          {placeholder => (
            <Input
              type="number"
              placeholder={placeholder}
              value={token}
              onChange={handleChangeToken}
              readOnly={isSubmitSent}
            />
          )}
        </FormattedMessage>
      </InputWrapper>

      <ButtonWrappers>
        <GradientButton className="primary-solid" onClick={handleSubmit(token)} disabled={isSubmitSent}>
          <FormattedMessage id="modal.2fa.button_submit" defaultMessage="Submit" />
        </GradientButton>
      </ButtonWrappers>
    </InnerWrapper>
  );
}

export default inject(STORE_KEYS.SMSAUTHSTORE)(observer(EnableGoogle2FA));
