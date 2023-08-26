import React from 'react';
import styled from 'styled-components/macro';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import OrderHistoryAdv from '@/components/OrderHistoryAdv';
import ModeSwitchMenu from '@/components/ModeSwitchMenu';
import { MODE_KEYS } from '@/config/constants';

const StyledRightLowerSectionGrid = styled.div`
  position: ${props => (props.fullScreen ? 'absolute' : 'relative')};
  width: 100%;
  bottom: 0;
  z-index: 100;
  height: ${props => (props.fullScreen ? '100%' : props.theme.palette.lowerSectionHeight)};
  transition: all 0.3s ease-in-out;
  margin-top: ${props => (props.hasMargin ? '12px' : '0')};
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  background-color: ${props => props.theme.palette.clrBackground};
`;

const RightLowerSectionGrid = ({
  hasMargin,
  arbMode,
  rightBottomSectionFullScreenMode,
  rightBottomSectionOpenMode,
  isLoggedIn,
  walletDataLoadStatus
}) => (
  <StyledRightLowerSectionGrid
    arbMode={arbMode}
    fullScreen={rightBottomSectionFullScreenMode}
    hasMargin={hasMargin}
    id="rightLowerSectionGrid"
  >
    <OrderHistoryAdv
      arbMode={arbMode}
      rightBottomSectionOpenMode={isLoggedIn ? rightBottomSectionOpenMode : MODE_KEYS.depthChartKey}
    />
    {walletDataLoadStatus && <ModeSwitchMenu />}
  </StyledRightLowerSectionGrid>
);

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.TELEGRAMSTORE, STORE_KEYS.PORTFOLIOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { arbMode, rightBottomSectionFullScreenMode, rightBottomSectionOpenMode },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
      [STORE_KEYS.PORTFOLIOSTORE]: { walletDataLoadStatus }
    }) => ({
      arbMode,
      rightBottomSectionFullScreenMode,
      rightBottomSectionOpenMode,
      isLoggedIn,
      walletDataLoadStatus
    })
  )
)(RightLowerSectionGrid);
