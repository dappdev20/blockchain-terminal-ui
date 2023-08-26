import React, { memo } from 'react';

import { Wrapper } from './styles';

const ProgressCell = memo(({ cumulativeAmount, totalAmount, isBuy }) => {
  const progressPercents = cumulativeAmount / totalAmount;
  return <Wrapper width={progressPercents * 100} isBuy={isBuy} />;
});

export default ProgressCell;
