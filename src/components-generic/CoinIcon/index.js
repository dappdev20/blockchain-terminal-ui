import React, { useState, memo, useEffect } from 'react';
import { IconStyleWrapper, SvgIcon, FontIcon, StockImg } from './styles';
import COIN_DATA_MAP from '@/mock/coin-data-map';
import { currencySymbols } from '@/mock/currencies';
import IcAUM from '@/components/CoinSelect/CoinsList/icon-aum.svg';

const tryRequire = path => {
  try {
    /* eslint-disable-next-line */
    return require(`${path}`);
  } catch (err) {
    return null;
  }
};

const CoinIcon = memo(
  ({
    showTether = true,
    value,
    defaultFiat,
    size,
    fontIcon,
    symbol,
    filter,
    opacity = 1,
    insideWalletButton,
    onImageError
  }) => {
    const isColdStorage = value === 'PORTFOLIO';
    const [imgValid, setImgValid] = useState(true);
    useEffect(() => {
      setImgValid(true);
    }, [value]);
    function handleImageError() {
      if (onImageError) {
        onImageError(false);
      }
      setImgValid(false);
    }

    function getCoinIcon(value) {
      const backgroundSrc = isColdStorage
        ? IcAUM
        : `https://storage.googleapis.com/iex/api/logos/${(value || '').replace('S:', '')}.png`;
      // const backgroundSrc = `https://storage.googleapis.com/iex/api/logos/${(value || '').replace('S:', '')}.png`;

      return (
        <IconStyleWrapper fontIcon={fontIcon} insideWalletButton={insideWalletButton} size={size}>
          {imgValid || isColdStorage ? (
            <StockImg src={backgroundSrc} alt="" onError={handleImageError} />
          ) : (
            <IconStyleWrapper noIcon insideWalletButton={insideWalletButton} size={size}>
              {value.replace('S:', '')}
            </IconStyleWrapper>
          )}
        </IconStyleWrapper>
      );
    }

    if (fontIcon) {
      // fiat
      if (value && (value.includes('F:') || value.includes('S:'))) {
        const sym = value.replace('S:', '').replace('F:', '');
        const fiatSymbol = currencySymbols[sym];
        return (
          <FontIcon filter={filter} fontSize={size} className="coin-symbol">
            {fiatSymbol || sym}
          </FontIcon>
        );
      }

      if (value === 'USDT') {
        return (
          <FontIcon filter={filter} fontSize={size}>
            $
          </FontIcon>
        );
      }

      const coinName = typeof value === 'string' ? value : value.symbol;
      const src = tryRequire(`./coin-svg/${coinName}${symbol ? '' : '-alt'}.svg`);
      if (src) {
        return <SvgIcon src={src} alt={coinName} filter={filter} />;
      }
      return (
        <FontIcon filter={filter} fontSize={14}>
          {coinName}
        </FontIcon>
      );
    }

    let backgroundSrc = '';
    if (typeof value === 'string') {
      if (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].file) {
        backgroundSrc =
          value === 'USDT' && !showTether && !!defaultFiat
            ? `url('img/icons-coin/${defaultFiat.toLowerCase()}.png') no-repeat`
            : COIN_DATA_MAP[value].file.indexOf('svg') < 0
            ? `url('img/icons-coin/${COIN_DATA_MAP[value].file}') no-repeat`
            : `url('img/sprite-coins-view.svg#coin-${value.toLowerCase()}') no-repeat`;

        return (
          <IconStyleWrapper
            fontIcon={fontIcon}
            insideWalletButton={insideWalletButton}
            size={size}
            backgroundSrc={backgroundSrc}
            opacity={opacity}
          />
        );
      }

      return (
        <IconStyleWrapper className="no-icon" fontIcon={fontIcon} insideWalletButton={insideWalletButton} size={size}>
          {getCoinIcon(value)}
        </IconStyleWrapper>
      );
    }

    if (value && value.stock) {
      backgroundSrc = `https://storage.googleapis.com/iex/api/logos/${(value.symbol || '').replace('S:', '')}.png`;

      return (
        <IconStyleWrapper fontIcon={fontIcon} insideWalletButton={insideWalletButton} size={size}>
          {imgValid ? (
            <StockImg src={backgroundSrc} alt="" onError={handleImageError} />
          ) : (
            <IconStyleWrapper noIcon insideWalletButton={insideWalletButton} size={size}>
              {value && value.symbol && value.symbol.length ? value.symbol.replace('S:', '') : ''}
            </IconStyleWrapper>
          )}
        </IconStyleWrapper>
      );
    }

    if (value && value.file) {
      backgroundSrc =
        value.file.indexOf('svg') < 0
          ? `url('img/icons-coin/${value.file}') no-repeat`
          : `url('img/sprite-coins-view.svg#coin-${value.symbol.toLowerCase()}') no-repeat`;

      return (
        <IconStyleWrapper
          fontIcon={fontIcon}
          insideWalletButton={insideWalletButton}
          size={size}
          backgroundSrc={backgroundSrc}
        />
      );
    }

    return (
      <IconStyleWrapper className="no-icon" fontIcon={fontIcon} insideWalletButton={insideWalletButton} size={size}>
        {value && value.symbol && value.symbol.length ? getCoinIcon(value.symbol) : ''}
      </IconStyleWrapper>
    );
  }
);

export default CoinIcon;
