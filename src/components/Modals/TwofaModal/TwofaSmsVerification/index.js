import React, { useState, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import GradientButton from '@/components-generic/GradientButtonSquare';
import { InnerWrapper, TextTitle, ButtonWrappers, InputWrapper, Input } from './styles';

const TwofaSmsVerification = memo(({ isSecretCodeSent, handleSubmitSecretCode }) => {
  const [secretCode, setSecretCode] = useState(true);

  const handleChangeSecretCode = e => {
    e.stopPropagation();
    setSecretCode(e.target.value);
  };

  return (
    <InnerWrapper>
      <TextTitle>
        <FormattedMessage id="modal.2fa.label_sms_verification" defaultMessage="Sms code is sent via your phone" />
      </TextTitle>

      <InputWrapper>
        <FormattedMessage id="modal.2fa.label_confirm_code" defaultMessage="Confirm Code">
          {placeholder => (
            <Input
              type="number"
              placeholder={placeholder}
              value={secretCode}
              onChange={handleChangeSecretCode}
              readOnly={isSecretCodeSent}
            />
          )}
        </FormattedMessage>
      </InputWrapper>

      <ButtonWrappers>
        <GradientButton
          className="primary-solid"
          onClick={handleSubmitSecretCode(secretCode)}
          disabled={isSecretCodeSent}
        >
          <FormattedMessage id="modal.2fa.button_submit" defaultMessage="Submit" />
        </GradientButton>
      </ButtonWrappers>
    </InnerWrapper>
  );
});

export default TwofaSmsVerification;
