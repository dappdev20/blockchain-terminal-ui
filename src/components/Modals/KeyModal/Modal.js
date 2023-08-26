import React from 'react';
import CloseButton from '@/components-generic/CloseButton';
import Content from './Content';
import { ModalWrapper, InnerWrapper } from './styles';

const handleClick = onClose => ({ target: { dataset } }) => {
  if (dataset && dataset.zone === 'terms-modal') {
    onClose();
  }
};

const Modal = ({ toggleModal, noCloseBtn }) => (
  <ModalWrapper onClick={handleClick(toggleModal)}>
    <InnerWrapper>
      {!noCloseBtn && <CloseButton onClose={toggleModal} />}
      <Content />
    </InnerWrapper>
  </ModalWrapper>
);

export default Modal;
