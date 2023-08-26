import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import { Wrapper } from './styles';

const KeyModal = ({ inLineMode, isModalOpen, toggleModal, hoverMode }) =>
  ReactDOM.createPortal(
    <Wrapper
      hoverMode={hoverMode}
      inLineMode={inLineMode}
      className={inLineMode ? (isModalOpen ? 'animate-appear' : 'animate-disappear') : ''}
    >
      <Modal toggleModal={toggleModal} noCloseBtn />
    </Wrapper>,
    document.getElementById('modal')
  );

export default KeyModal;
