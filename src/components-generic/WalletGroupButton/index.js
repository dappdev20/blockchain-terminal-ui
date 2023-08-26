import React from 'react';

import { WalletGroupButtonWrapper, WalletButtonWrapper, AniWalletButton } from './ChildComponents';
import { getScreenInfo } from '@/utils';

const WalletGroupButton = props => {
  let isExecAnimated = false;
  let start = 0;
  if (!props.isWhite) {
    const isEstimatedField = (props.isBuy && props.isLeft) || (!props.isBuy && !props.isLeft);
    if (props.animatable >= 3 && isEstimatedField) {
      isExecAnimated = true;
    }

    if (props.animatable === 4) {
      if (props.isBuy && !props.isLeft) {
        start = 0;
      }

      if (props.isBuy && props.isLeft) {
        start = 30;
      }

      if (!props.isBuy && props.isLeft) {
        start = 50;
      }

      if (!props.isBuy && !props.isLeft) {
        start = 80;
      }
    }
  }

  const { isMobileLandscape } = getScreenInfo();

  return (
    <WalletGroupButtonWrapper
      width={props.groupWidth}
      className="orderhistory__wallet-btn"
      isMobileLandscape={isMobileLandscape}
      isChartLabel={props.isChartLabel}
    >
      <WalletButtonWrapper isOverFlow={props.isOverFlow} isBuy={props.isBuy} isHistory={props.isHistory}>
        <AniWalletButton
          type="inactive"
          width={props.width}
          {...props}
          className={`${isExecAnimated && 'progress'} ${props.animatable === 4 && 'filled'}`}
          start={start}
          isMobileLandscape={isMobileLandscape}
          isChartLabel={props.isChartLabel}
        >
          {props.children}
        </AniWalletButton>
      </WalletButtonWrapper>
    </WalletGroupButtonWrapper>
  );
};

export default WalletGroupButton;
