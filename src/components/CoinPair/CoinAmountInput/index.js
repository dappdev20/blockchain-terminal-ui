import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import { customDigitFormatWithNoTrim, formatFiatString } from '@/utils';
import { currencySymbols } from '@/mock/currencies';
import { valueNormalized } from '@/stores/utils/OrderEntryUtils';

import DataLoader from '@/components-generic/DataLoader';
import InputTooltip from './InputTooltip';

import { CoinAmtInputLeft, CoinAmtInputRight, CoinAmtInputWrapper, CoinAmtSymbol, SuffixDecimal } from './Components';

const DECIMAL_DIGITS_LIMIT = 20;
const DEFAULT_DECIMAL_DIGITS = 10;

class CoinAmountInput extends Component {
  contentEditable = React.createRef();

  state = {
    amount: '',
    isAmtInputFocused: false,
    isAmtChangedAfterFocus: false
  };

  handleAmtInputWrapperClick = () => {
    if (this.contentEditable.current) {
      this.contentEditable.current.focus();
    }
  };

  handleAmtInputFocus = () => {
    this.setState({
      amount: '',
      isAmtInputFocused: true,
      isAmtChangedAfterFocus: false
    });
  };

  handleAmtInputBlur = () => {
    this.setState({
      isAmtInputFocused: false
    });
  };

  handleAmountChange = event => {
    const value = event.target.value;
    const oldValue = String(this.state.amount);
    const newValue = valueNormalized(oldValue, value);

    this.props.handleInputChange(newValue || 0);
    this.setState({
      amount: newValue,
      isAmtChangedAfterFocus: true
    });
  };

  getLowestNonZeroDecimlPosition = () => {
    const { isRight, c1Amount, c2Amount } = this.props;
    const value = (isRight ? c2Amount : c1Amount) / 1;
    const nonExponentialValue = value.toFixed(DECIMAL_DIGITS_LIMIT);
    const splittedValue = nonExponentialValue.split('.');
    if (parseInt(splittedValue[0])) {
      return 0;
    }

    const decimalPart = splittedValue[1];
    if (!decimalPart) {
      return 0;
    }

    const trailingZerosRegex = decimalPart.match(/^0+/);
    const trailingZeros = trailingZerosRegex ? trailingZerosRegex[0] : '';
    if (DECIMAL_DIGITS_LIMIT === trailingZeros.length) {
      return 0;
    }
    // plus 1 digit for a zero on the left side of the dot
    // plus 1 digit for a meaningful decimal digit
    return trailingZeros.length + 2;
  };

  render() {
    const { isAmtInputFocused, isAmtChangedAfterFocus, amount: amountFromState } = this.state;
    const {
      isRight,
      isFiat,
      hasUnitPrefix,
      c1Amount,
      c2Amount,
      arbMode,
      totalBTCAmount,
      totalUSDAmount,
      btcPrice,
      usdPrice,
      baseSymbol,
      quoteSymbol
    } = this.props;

    let value = '';
    let amountValue = 0;
    const symbolText = isRight ? quoteSymbol : baseSymbol;
    const symbol = isFiat && !arbMode ? currencySymbols[symbolText.replace('F:', '')] : '';

    if (arbMode) {
      amountValue = isRight ? totalBTCAmount : totalUSDAmount;
      const { unitValue } = formatFiatString(amountValue, 2);
      value = `${(!isRight ? '$' : '') +
        (!isRight ? `${unitValue}` : customDigitFormatWithNoTrim(isRight ? totalBTCAmount : totalUSDAmount, 5))}`;
    } else {
      const lowestNonZeroDecimlPosition = this.getLowestNonZeroDecimlPosition();
      const decimalNumbers = isRight ? Math.max(DEFAULT_DECIMAL_DIGITS, lowestNonZeroDecimlPosition) : 0;
      amountValue = isRight ? c2Amount : c1Amount;
      const { unitValue } = formatFiatString(amountValue, 2);
      value = isFiat && isRight ? `${unitValue}` : customDigitFormatWithNoTrim(amountValue, decimalNumbers);
    }

    const isLoaded = amountValue && value && !isAmtChangedAfterFocus;

    const amount = isAmtInputFocused ? (isAmtChangedAfterFocus ? amountFromState : '') : value;
    const integerAmount = amount.split('.')[0];
    const decimalAmount = (amount.split('.')[1] && `${amount.split('.')[1]}`) || '';
    const CoinAmtInputComponentName = isRight ? CoinAmtInputRight : CoinAmtInputLeft;

    const content = (
      <>
        <CoinAmtSymbol>{symbol}</CoinAmtSymbol>
        <CoinAmtInputComponentName
          innerRef={this.contentEditable}
          disabled={isRight || arbMode}
          html={(arbMode ? !isRight : isFiat) ? integerAmount : amount}
          onFocus={this.handleAmtInputFocus}
          onBlur={this.handleAmtInputBlur}
          onChange={this.handleAmountChange}
        />
        {(arbMode ? !isRight : isFiat) && <SuffixDecimal>{decimalAmount}</SuffixDecimal>}
      </>
    );

    return (
      <CoinAmtInputWrapper
        isRight={isRight}
        hasUnitPrefix={hasUnitPrefix}
        disabled={isRight || arbMode}
        onClick={this.handleAmtInputWrapperClick}
      >
        {isRight ? (
          isLoaded ? (
            <InputTooltip arbMode={arbMode} btcPrice={btcPrice} usdPrice={usdPrice} totalBTCAmount={totalBTCAmount}>
              {content}
            </InputTooltip>
          ) : (
            <DataLoader width={35} height={35} />
          )
        ) : (
          content
        )}
      </CoinAmtInputWrapper>
    );
  }
}

const enhanced = compose(
  inject(STORE_KEYS.PORTFOLIOSTORE, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.ORDERBOOKBREAKDOWN),
  observer,
  withProps(
    ({
      [STORE_KEYS.PORTFOLIOSTORE]: {
        c1Amount,
        c2Amount,
        totalBTCAmount,
        totalUSDAmount,
        handleInputChange,
        btcPrice,
        usdPrice
      },
      [STORE_KEYS.VIEWMODESTORE]: { arbMode },
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { baseSymbol, quoteSymbol }
    }) => ({
      c1Amount,
      c2Amount,
      totalBTCAmount,
      totalUSDAmount,
      handleInputChange,
      btcPrice,
      usdPrice,
      arbMode,
      baseSymbol,
      quoteSymbol
    })
  )
);

export default enhanced(CoinAmountInput);
