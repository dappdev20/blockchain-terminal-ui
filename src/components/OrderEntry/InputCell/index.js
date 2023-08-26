import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import { customDigitFormatWithDecimals, convertToFloat, customDigitFormat } from '@/utils';
import { valueNormalized } from '@/stores/utils/OrderEntryUtils';
import { Wrapper, Content, OrderSlider, Symbol } from './styles';

const MULTIPLIER = 10000;

export default class MarketInputCell extends Component {
  state = {
    amount: '',
    isAmtInputFocused: false,
    isAmtChangedAfterFocus: false
  };

  handleSliderChange = (obj, val) => {
    const { type } = this.props;
    const isDisabled = type !== 'buy_from' && type !== 'sell_from';
    if (!isDisabled) {
      this.props.handleInputChange(convertToFloat(val / MULTIPLIER));
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

  renderInputField = ({ tooltip, children }) =>
    tooltip ? (
      <Tooltip arrow position="bottom" theme="bct" title={tooltip}>
        {children}
      </Tooltip>
    ) : (
      children
    );

  render() {
    const { isAmtInputFocused, isAmtChangedAfterFocus, amount: amountFromState } = this.state;
    /**
     *  We can pass label props such as 'limit', 'stop', 'highest price', 'lowest price' to show label in input form.
     */
    const { value, symbol, isBuy, max, type, width, height, isLeft, isHover, animation } = this.props;
    const isDisabled = (type !== 'buy_from' && type !== 'sell_from') || !Number(max.toFixed(5));
    const isUSD = symbol === 'USD';
    let valueOfAmount = isUSD ? customDigitFormatWithDecimals(value, 2) : customDigitFormat(value, 5);
    if (valueOfAmount === '') {
      valueOfAmount = '0';
    }

    const preValue = valueOfAmount.split('.')[0];
    let postValue = '';
    let symbolStr = symbol;
    if (isUSD) {
      postValue = valueOfAmount.split('.').length > 1 ? valueOfAmount.split('.')[1] : '';
      valueOfAmount = '';
      symbolStr = '$';
    }

    const InputField = this.renderInputField;
    const tooltip = isHover && value && `${customDigitFormat(value, 10)} ${symbol}`;

    return (
      <Wrapper
        isBuy={isBuy}
        isLeft={isLeft}
        isHover={isHover}
        isDisabled={isDisabled}
        width={width}
        height={height}
        animation={animation}
      >
        <Content width={width} height={height}>
          <InputField tooltip={tooltip}>
            <input
              type="text"
              disabled={isDisabled}
              value={isAmtInputFocused ? (isAmtChangedAfterFocus ? amountFromState : '') : valueOfAmount}
              onFocus={this.handleAmtInputFocus}
              onBlur={this.handleAmtInputBlur}
              onChange={this.handleAmountChange}
            />
            {isUSD && !isAmtInputFocused && (
              <span className="postValue">
                {preValue}
                <span>{postValue && postValue}</span>
              </span>
            )}
            <Symbol>{symbolStr}</Symbol>
          </InputField>

          {!isHover && (type === 'buy_from' || type === 'sell_from') && (
            <OrderSlider
              min={0}
              max={!isDisabled ? max * MULTIPLIER : MULTIPLIER}
              step={0.01}
              value={!isDisabled ? value * MULTIPLIER : MULTIPLIER}
              disabled={isDisabled}
              onChange={this.handleSliderChange}
            />
          )}
        </Content>
      </Wrapper>
    );
  }
}
