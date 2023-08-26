import React, { Component } from 'react';
import Slider from 'rc-slider';
import { TradeSlider, RailStyle, HandleStyle, TrackStyle } from './styles';

class AllocationSlider extends Component {
  stopPropagation = e => e.stopPropagation();

  render() {
    const { amount, disabled, color } = this.props;

    return (
      <TradeSlider onClick={this.stopPropagation}>
        <Slider
          trackStyle={[TrackStyle]}
          railStyle={RailStyle}
          activeDotStyle={{ backgroundColor: 'gray' }}
          handleStyle={[{ ...HandleStyle.default, backgroundColor: color }]}
          disabled={disabled}
          min={0}
          max={100}
          step={0.01}
          value={amount}
        />
      </TradeSlider>
    );
  }
}

export default AllocationSlider;
