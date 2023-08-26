import React, { memo } from 'react';
import { injectIntl } from 'react-intl';
import styled from 'styled-components/macro';
import { noop, customDigitFormat } from '@/utils';

import InputCell from './InputOrderCell';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  width: 100%;

  & > div {
    background: ${props =>
      props.darkBg ? `${props.theme.palette.orderFormInputDisabledBg} !important` : 'transparent'};
  }

  input,
  [data-coin] {
    ${props => props.darkBg && `color: ${props.theme.palette.orderFormInputDisabledText};`}
  }
`;

export const Row = memo(({ width, amount, coin, onChange, readOnly, darkBg, isHideAmount, arbInputType }) => (
  <Wrapper darkBg={darkBg}>
    <InputCell
      amount={customDigitFormat(amount, 9)}
      coin={coin}
      onChange={onChange}
      maxWidth={width / 2}
      readOnly={readOnly}
      isHideAmount={isHideAmount}
      arbInputType={arbInputType}
    />
  </Wrapper>
));

Row.defaultProps = {
  onChange: noop
};

export default injectIntl(Row);
