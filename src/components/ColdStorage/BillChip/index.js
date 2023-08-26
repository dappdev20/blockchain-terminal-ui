import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { ChipWrapper, ChipBGImg } from './styles';

const BillChip = memo(({ level, index, disabled, onClick }) => {
  const srcUrl = `./img/bills/thumb_${level + 1}.png`;

  function handleOpenDetail() {
    onClick(level, index, disabled);
  }

  return (
    <ChipWrapper disabled={disabled} onClick={handleOpenDetail}>
      <ChipBGImg src={srcUrl} />
    </ChipWrapper>
  );
});

BillChip.propTypes = {
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};
BillChip.defaultProps = {
  disabled: true
};

export default BillChip;
