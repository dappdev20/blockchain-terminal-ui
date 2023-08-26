import React, { memo, useState } from 'react';
import { numberWithCommas, formatFiatString } from '@/utils';
import CoinIcon from '@/components-generic/CoinIcon';
import { Container, PriceWrapper, ArrowIcon } from './styles';

const DECIMAL_DIGITS_LIMIT = 9;
const FIAT_DECIMAL_DIGITS_LIMIT = 2;

const CustomTooltip = memo(({ tooltipModel, base, quote, isFiat }) => {
  if (!tooltipModel || !tooltipModel.meta) {
    return false;
  }

  const [leftImgValid, setLeftImgValid] = useState(true);
  const [rightImgValid, setRightImgValid] = useState(true);

  const { datasetIndex, tooltipXPosition, meta, value } = tooltipModel;
  const left = meta.x + (datasetIndex ? 1 : -1);
  const { unitValue, unitPrefix } = formatFiatString(value, FIAT_DECIMAL_DIGITS_LIMIT);
  const tooltipValue = isFiat ? `${unitValue}${unitPrefix}` : numberWithCommas(value || 0, DECIMAL_DIGITS_LIMIT);

  if (!leftImgValid || !rightImgValid) {
    const symbol = base === 'F:USD' || base === 'USDT' ? '\u20BF' : '$';

    return (
      <Container left={left} datasetIndex={datasetIndex} tooltipXPosition={tooltipXPosition}>
        <PriceWrapper>
          {symbol} {tooltipValue}
        </PriceWrapper>
      </Container>
    );
  }

  return (
    <Container left={left} datasetIndex={datasetIndex} tooltipXPosition={tooltipXPosition}>
      <CoinIcon size={18} value={datasetIndex ? quote : base} onImageError={setLeftImgValid} />
      {!!datasetIndex && <PriceWrapper>{tooltipValue}</PriceWrapper>}
      <ArrowIcon />
      {!datasetIndex && <PriceWrapper>{tooltipValue}</PriceWrapper>}
      <CoinIcon size={18} value={datasetIndex ? base : quote} onImageError={setRightImgValid} />
    </Container>
  );
});

export default CustomTooltip;
