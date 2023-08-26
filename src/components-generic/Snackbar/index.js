import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { BUY_SIDE, SELL_SIDE } from '@/config/constants';

import { CustomStyle, StyledSnackbar } from './styles';

const SimpleSnackbar = ({ open, message, onClose, snackbarPositionType, isRight, classes, ...props }) => {
  const msg = typeof message === 'function' ? message : () => message;
  let customPositionClass = classes.default;

  switch (snackbarPositionType) {
    case BUY_SIDE:
      customPositionClass = classes.buyPosition;
      break;
    case SELL_SIDE:
      customPositionClass = classes.sellPosition;
      break;
    default:
      break;
  }
  if (isRight) {
    customPositionClass = classes.buyPosition;
  }

  return (
    <StyledSnackbar
      {...props}
      key={new Date().toString()}
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      autoHideDuration={4000}
      onClose={onClose}
      message={msg()}
      action={[
        <IconButton key={new Date().toString()} color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ]}
      className={customPositionClass}
    />
  );
};

export default withStyles(CustomStyle)(SimpleSnackbar);
