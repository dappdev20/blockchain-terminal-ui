import React from 'react';
import ReactDOM from 'react-dom';
import { Wrapper } from './styles';
import Modal from './Modal';

const LogoutModal = ({ inLineMode, isModalOpen, toggleModal, hoverMode, backdropClose, onLogout }) =>
  ReactDOM.createPortal(
    <Wrapper
      hoverMode={hoverMode}
      inLineMode={inLineMode}
      className={inLineMode ? (isModalOpen ? 'animate-appear' : 'animate-disappear') : ''}
      onClick={e => {
        e.preventDefault();

        if (backdropClose) {
          toggleModal();
        }
      }}
    >
      <Modal toggleModal={toggleModal} onLogout={onLogout} />
    </Wrapper>,
    document.getElementById('modal')
  );

export default LogoutModal;
