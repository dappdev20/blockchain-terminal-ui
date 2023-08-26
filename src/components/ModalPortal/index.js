import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import Modal from '@/components-generic/Modal';
import { STORE_KEYS } from '@/stores';

const ModalPortal = inject(STORE_KEYS.MODALSTORE)(
  observer(({ [STORE_KEYS.MODALSTORE]: { ModalProps, open, onClose, onConfirm } }) => {
    const location = ModalProps.portal || 'graph-chart-parent';
    return (
      <>
        {Object.keys(ModalProps).length > 0 &&
          ReactDOM.createPortal(
            <Modal
              {...ModalProps}
              open={open}
              onClose={() => {
                onClose();

                if (ModalProps.onCloseHandler) {
                  ModalProps.onCloseHandler();
                }
              }}
              onConfirm={onConfirm}
              location={location}
            />,
            document.getElementById(location)
          )}
      </>
    );
  })
);

export default ModalPortal;
