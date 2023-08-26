import React, { memo } from 'react';

import { getScreenInfo } from '@/utils';

import { Container, ZoomButton, FlexWrapper } from './styles';

const ChartControls = memo(({ midPrice, onZoom, plusDisabled, minusDisabled }) => {
  if (!midPrice) {
    return null;
  }

  const { isMobileDevice, isMobilePortrait } = getScreenInfo();

  return (
    <Container>
      <FlexWrapper>
        <ZoomButton
          type="out"
          alt="Zoom out"
          isMobile={isMobileDevice && !isMobilePortrait}
          disabled={minusDisabled}
          onClick={() => !minusDisabled && onZoom('out')}
        />
        <ZoomButton
          type="in"
          alt="Zoom in"
          isMobile={isMobileDevice && !isMobilePortrait}
          disabled={plusDisabled}
          onClick={() => !plusDisabled && onZoom('in')}
        />
      </FlexWrapper>
    </Container>
  );
});

export default ChartControls;
