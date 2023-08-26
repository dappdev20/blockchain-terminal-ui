import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import GradientButton from '@/components-generic/GradientButtonSquare';
import { InnerWrapper, TextTitle, ButtonWrappers } from './styles';

const DisableGoogle2FA = memo(({ isSubmitSent, handleSubmit }) => (
  <InnerWrapper>
    <TextTitle>
      <FormattedMessage id="modal.2fa.label_disable_google" defaultMessage="Disable Google 2-Step Authentication" />
    </TextTitle>

    <ButtonWrappers>
      <GradientButton className="primary-solid" onClick={handleSubmit('')} disabled={isSubmitSent}>
        <FormattedMessage id="modal.2fa.button_submit" defaultMessage="Submit" />
      </GradientButton>
    </ButtonWrappers>
  </InnerWrapper>
));

export default DisableGoogle2FA;
