import React from 'react';
import { FormattedMessage } from 'react-intl';
import GradientButton from '@/components-generic/GradientButtonSquare';
import { OuterWrapper, InnerWrapper, TextDescription, ButtonWrappers } from './styles';

const Content = ({ toggleModal, onLogout }) => (
  <OuterWrapper>
    <InnerWrapper>
      <TextDescription>
        <FormattedMessage id="modal.logout.label_confirm" defaultMessage="Are you sure to logout?" />
      </TextDescription>

      <ButtonWrappers>
        <GradientButton className="primary-solid" width="120px" height="40px" onClick={toggleModal}>
          <FormattedMessage id="modal.logout.button_cancel" defaultMessage="Cancel" />
        </GradientButton>

        <GradientButton className="primary-solid" width="120px" height="40px" onClick={onLogout}>
          <FormattedMessage id="modal.logout.button_logout" defaultMessage="Log out" />
        </GradientButton>
      </ButtonWrappers>
    </InnerWrapper>
  </OuterWrapper>
);

export default Content;
