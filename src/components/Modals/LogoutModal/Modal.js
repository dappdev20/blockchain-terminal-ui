import React from 'react';
import CloseButton from '@/components-generic/CloseButton';
import { ModalWrapper, InnerWrapper } from './styles';
import Content from './Content';

const Modal = ({ toggleModal, noCloseBtn, onLogout }) => (
  <ModalWrapper>
    <InnerWrapper
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {!noCloseBtn && <CloseButton onClose={toggleModal} />}
      <Content toggleModal={toggleModal} onLogout={onLogout} />
    </InnerWrapper>
  </ModalWrapper>
);

export default Modal;
