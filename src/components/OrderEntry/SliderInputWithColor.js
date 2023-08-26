import React from 'react';
import SliderInput from '../../components-generic/SliderInput';
// import { darkTheme } from '../../theme/core';

const SliderInputWithColor = ({ ...props }) => (
  <SliderInput
    colors={
      {
        // ctrlSliderTrackProgressBg: darkTheme.palette.orderFormTabActive,
        // ctrlSliderThumbBg: darkTheme.palette.orderFormTabActive,
        // ctrlSliderThumbHoverBg: darkTheme.palette.orderFormTabActive,
        // ctrlSliderDelimiterActiveBg: darkTheme.palette.orderFormTabActive,
      }
    }
    {...props}
  />
);

export default SliderInputWithColor;
