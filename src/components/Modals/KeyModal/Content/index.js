import React from 'react';
import { FormattedMessage } from 'react-intl';
import { OuterWrapper, InnerWrapper, ImgKey, TextDescription } from './styles';
import imgYubiKey from './yubi-key.svg';

const Content = () => (
  <OuterWrapper>
    <InnerWrapper>
      <ImgKey src={imgYubiKey} />
      <TextDescription>
        <FormattedMessage id="modal.key.label_description1" defaultMessage="Please insert your" />
        <br />
        <FormattedMessage id="modal.key.label_description2" defaultMessage="Hardware Key now." />
      </TextDescription>
    </InnerWrapper>
  </OuterWrapper>
);

export default Content;
