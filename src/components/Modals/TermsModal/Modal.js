import React from 'react';
import Content from './Content';
import { ModalWrapper, ModalInnerWrapper } from './styles';
import CloseButton from '@/components-generic/CloseButton';

const Modal = ({ noCloseBtn, text, isLoading, toggleModal }) => {
  const handleInnerWrapperClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCloseClick = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleModal();
  };

  return (
    <ModalWrapper>
      <ModalInnerWrapper onClick={handleInnerWrapperClick}>
        {!noCloseBtn && <CloseButton onClose={handleCloseClick} />}
        <Content text={text} isLoading={isLoading} />
      </ModalInnerWrapper>
    </ModalWrapper>
  );
};

export default Modal;
