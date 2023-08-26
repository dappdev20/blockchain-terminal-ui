import React from 'react';
import { compose } from 'recompose';
import { withSnackBar } from '@/hocs/WithSnackBar';
import OrderGradientButton from '@/components-generic/GradientButtonSquare';

const OrderButton = ({ transparent, isBuy, onClick, orderButtonText = 'PLACE ORDER', disabled, active }) => {
  return (
    <OrderGradientButton
      className={`${isBuy ? 'positive-solid' : 'negative-solid'} ${active ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      width="100%"
      transparent={transparent}
    >
      {orderButtonText}
    </OrderGradientButton>
  );
};

export default compose(withSnackBar)(OrderButton);
