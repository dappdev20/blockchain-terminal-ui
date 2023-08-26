import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import Slider from 'rc-slider';
import partial from 'lodash.partial';

import { STORE_KEYS } from '@/stores';
import { withValueFromEvent } from '@/utils';
import { TradeSlider, RailStyle, HandleStyle, TrackStyle, ProgressValue } from './styles';

const MULTIPLIER = 10000;

class AutoConvertSlider extends Component {
  state = {
    isFirstLoad: true,
    isTrading: false,
    isBuy: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.isFirstLoad || (this.props.coin !== nextProps.coin && nextProps.coin)) {
      this.props.updatHashArray(nextProps.coin);

      if (this.state.isFirstLoad) {
        this.setState({
          isFirstLoad: false
        });
      }
    }
  }

  setAmount = amount => {
    const { setAmountOf, coin } = this.props;
    setAmountOf(amount / MULTIPLIER, coin);
    this.forceUpdate();
  };

  handleTrading = (isTrading, percentage) => () => {
    this.setState({ isTrading });
    if (this.props.handleTrading) {
      this.props.handleTrading(isTrading);
    }

    if (!isTrading) {
      const isFullMode = percentage === 100;
      this.props.proceedAutoTrade(isFullMode);
    }
  };

  stopPropagation = e => e.stopPropagation();

  render() {
    const { slidersHash, coin, disabled, color } = this.props;
    const { isTrading, isBuy } = this.state;

    const maxSlide = slidersHash[coin] ? slidersHash[coin].maxSlider : 0;
    const amount = slidersHash[coin] ? slidersHash[coin].valueSlider : 0;

    const percentage = maxSlide > 0 ? ((amount / maxSlide) * 100).toFixed(2) : 0;
    const isShow = maxSlide > 0 && Boolean(percentage);

    return (
      <TradeSlider onClick={this.stopPropagation} isTrading={isTrading}>
        <Slider
          trackStyle={[isTrading ? (isBuy ? TrackStyle.buy : TrackStyle.sell) : TrackStyle.default]}
          railStyle={disabled ? RailStyle.default : RailStyle.search}
          activeDotStyle={{ backgroundColor: 'gray' }}
          handleStyle={[
            disabled
              ? { ...HandleStyle.default, backgroundColor: color }
              : isTrading
              ? HandleStyle.selected
              : isBuy
              ? HandleStyle.buy
              : HandleStyle.sell
          ]}
          disabled={disabled}
          min={0}
          max={maxSlide * MULTIPLIER}
          step={0.01}
          value={amount * MULTIPLIER}
          onChange={value => partial(withValueFromEvent, this.setAmount)({ target: { value } })}
          onAfterChange={this.handleTrading(false, percentage)}
          onBeforeChange={this.handleTrading(true, percentage)}
        />

        {isShow && isTrading && <ProgressValue>{percentage} %</ProgressValue>}
      </TradeSlider>
    );
  }
}

const enhanced = compose(
  inject(STORE_KEYS.AUTOSLIDERSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.AUTOSLIDERSTORE]: {
        slidersHash,
        setAmountOf,
        baseSymbol,
        quoteSymbol,
        proceedAutoTrade,
        updatHashArray
      }
    }) => ({
      slidersHash,
      setAmountOf,
      baseSymbol,
      quoteSymbol,
      proceedAutoTrade,
      updatHashArray
    })
  )
);

export default enhanced(AutoConvertSlider);
