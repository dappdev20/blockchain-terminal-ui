import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import GradientButton from '@/components-generic/GradientButtonSquare';
import { InnerWrapper, TextTitle, ButtonWrappers, InputWrapper, Input } from './styles';

function EnableEmail2FA(props) {
  const [email, setEmail] = useState('');
  const { isSubmitSent, handleSubmit } = props;

  const handleChangeEmail = e => {
    e.stopPropagation();
    setEmail(e.target.value);
  };

  return (
    <InnerWrapper>
      <TextTitle>
        <FormattedMessage id="modal.2fa.label_enable_email" defaultMessage="Enable Email 2-Step Authentication" />
      </TextTitle>

      <InputWrapper>
        <FormattedMessage id="modal.2fa.label_input_email" defaultMessage="Enter your email">
          {placeholder => (
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={handleChangeEmail}
              readOnly={isSubmitSent}
            />
          )}
        </FormattedMessage>
      </InputWrapper>

      <ButtonWrappers>
        <GradientButton
          className="primary-solid"
          width="120px"
          height="40px"
          onClick={handleSubmit(email)}
          disabled={isSubmitSent}
        >
          <FormattedMessage id="modal.2fa.button_submit" defaultMessage="Submit" />
        </GradientButton>
      </ButtonWrappers>
    </InnerWrapper>
  );
}

export default inject(STORE_KEYS.SMSAUTHSTORE)(observer(EnableEmail2FA));
