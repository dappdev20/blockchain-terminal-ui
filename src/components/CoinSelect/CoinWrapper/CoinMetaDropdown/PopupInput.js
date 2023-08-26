import React, { memo } from 'react';

import { InputWrapper, TransactionInput } from './styles';

const PopupInput = memo(({ placeholder }) => {
  return (
    <TransactionInput>
      <InputWrapper>
        <input placeholder={placeholder} />
      </InputWrapper>
    </TransactionInput>
  );
});

export default PopupInput;
