import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { BillsWrapper, BillsColumn, Balance } from './styles';
import BillChip from '../BillChip';

const NINE_LENGTH_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Bills = memo(({ balance, onShowBillDetail }) => {
  // 16 length number array representing balance
  // 1.0123 => 0000001.012300000
  const bills = [];
  let activePoint = -9;
  for (let exponent = 6; exponent >= -9; exponent -= 1) {
    const count = Math.floor((balance / 10 ** exponent).toPrecision(10)) % 10;
    if (count > 0 && exponent > activePoint) {
      activePoint = exponent;
    }
    bills.push(count);
  }

  activePoint = 6 - activePoint;

  const handleBalanceClick = level => () => {
    onShowBillDetail(level, 9, bills[level] < 9);
  };

  return (
    <BillsWrapper>
      {bills.map((billCount, level) => (
        <BillsColumn key={`bill-col-${level}`} flexDirection="column">
          {NINE_LENGTH_ARRAY.map(index => {
            const disabled = index > billCount;

            return (
              <BillChip
                key={`bill-chip-${level}-${index}`}
                level={level}
                index={index}
                disabled={disabled}
                onClick={onShowBillDetail}
              />
            );
          })}
          <Balance active={level >= activePoint} hasDot={level === 6} onClick={handleBalanceClick(level)}>
            {billCount}
          </Balance>
        </BillsColumn>
      ))}
    </BillsWrapper>
  );
});

Bills.propTypes = {
  balance: PropTypes.number,
  onShowBillDetail: PropTypes.func.isRequired
};
Bills.defaultProps = {
  balance: 0
};

export default Bills;
