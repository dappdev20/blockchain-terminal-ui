import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import SimpleSnackbar from '../../components-generic/Snackbar';
import { STORE_KEYS } from '../../stores';

const SnackbarPortal = inject(STORE_KEYS.SNACKBARSTORE, STORE_KEYS.VIEWMODESTORE)(
  observer(
    ({
      [STORE_KEYS.SNACKBARSTORE]: { SnackBarProps, open, onClose, isRight },
      [STORE_KEYS.VIEWMODESTORE]: { isUserDropDownOpen }
    }) => {
      return (
        <>
          {Object.keys(SnackBarProps).length > 0 &&
            !isUserDropDownOpen &&
            ReactDOM.createPortal(
              <SimpleSnackbar {...SnackBarProps} open={open} onClose={onClose} isRight={isRight} />,
              document.getElementById('snackbar')
            )}
        </>
      );
    }
  )
);

export default SnackbarPortal;
