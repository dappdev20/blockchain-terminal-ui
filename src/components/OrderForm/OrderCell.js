import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import { arbModeKeys } from '@/stores/ConversionAutoStore';
import { customDigitFormat, formatFiatString } from '@/utils';
import { Wrapper, Content, InputValue, Symbol } from './styles';

const OrderCell = ({ isBuy, isLeft, animation, isHover, width, totalUSDAmount, totalBTCAmount, arbitrageMode }) => {
  const activeCoin = 'F:USD'; // will lock as usd until BE supports multiple options
  const abMode = arbitrageMode === arbModeKeys.AMODE_USD ? !isLeft : isLeft;
  const symbol = abMode ? (activeCoin || '').replace('S:', '').replace('F:', '') : 'BTC';
  let value = abMode ? totalUSDAmount : totalBTCAmount;

  if (abMode && activeCoin.includes('F:')) {
    const { unitValue, unitPrefix } = formatFiatString(value, 2);
    value = `${unitValue}${unitPrefix}`;
  } else {
    value = customDigitFormat(value, 5);
  }
  const preValue = value.split('.')[0];
  let postValue = '';
  let symbolStr = symbol;
  if (symbol === 'USD') {
    postValue = value.split('.').length > 1 ? value.split('.')[1] : '';
    symbolStr = '$';
  }

  return (
    <Wrapper animation={animation} isBuy={isBuy} isLeft={isLeft} isHover={isHover}>
      <Content width={width}>
        {symbol === 'USD' ? (
          <span className="postValue">
            {preValue}
            <span>{postValue && postValue}</span>
          </span>
        ) : (
          <InputValue type="text" value={value} onChange={() => {}} />
        )}
        <Symbol>{symbolStr}</Symbol>
      </Content>
    </Wrapper>
  );
};
export default compose(
  inject(STORE_KEYS.CONVERSIONAUTOSTORE, STORE_KEYS.PORTFOLIOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { arbitrageMode },
      [STORE_KEYS.PORTFOLIOSTORE]: { totalBTCAmount, totalUSDAmount }
    }) => ({
      arbitrageMode,
      totalBTCAmount,
      totalUSDAmount
    })
  )
)(OrderCell);
