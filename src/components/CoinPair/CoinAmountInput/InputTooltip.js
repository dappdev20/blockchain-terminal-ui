import React from 'react';

import { TooltipWrapper, StyledTooltip } from './Components';
import { customDigitFormatWithNoTrim } from '@/utils';

const InputTooltip = ({ arbMode, btcPrice, usdPrice, totalBTCAmount, children }) => {
  const value = arbMode ? totalBTCAmount : btcPrice;

  return (
    <StyledTooltip
      arrow
      animation="shift"
      position="bottom"
      theme="bct"
      html={
        <TooltipWrapper>
          <div>
            <span className="tooltip-value">{Number(value).toFixed(9)}</span>
            BTC
          </div>
          {!arbMode && (
            <div>
              <span className="tooltip-value">{customDigitFormatWithNoTrim(usdPrice, 10)}</span>
              USD
            </div>
          )}
        </TooltipWrapper>
      }
    >
      {children}
    </StyledTooltip>
  );
};

export default InputTooltip;
