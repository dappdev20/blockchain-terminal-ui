import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import CoinPair from '@/components/CoinPair';
import GraphTool from '@/components/GraphTool';
import RightLowerSectionGrid from './RightLowerSectionGrid';
import ColdStorage from '@/components/ColdStorage';
import Login from '@/components/Login';

const StyledRightTopSectionGrid = styled.div`
  position: relative;
  margin-left: 12px;
  ${props =>
    props.isMobilePortrait || props.isSmallWidth
      ? 'display: none;'
      : 'flex: 1; max-width: calc(67% - 12px); width: calc(67% -12px);'}
`;

const GraphGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SearchBarGridArea = styled.div`
  grid-area: search;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-width: 0;
  height: 60px;
  background-color: ${props => props.theme.palette.clrChartBackground};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  z-index: ${props => (props.rightBottomSectionFullScreenMode ? '100' : '1000000')};
`;

const ChartGridArea = styled.div`
  flex: 1;
  position: relative;
  margin-top: 12px;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
`;

const RightTopSectionGrid = props => {
  const { arbMode, isMobilePortrait, isSmallWidth, rightBottomSectionFullScreenMode, isLoggedIn } = props;

  return (
    <StyledRightTopSectionGrid id="right-side" isMobilePortrait={isMobilePortrait} isSmallWidth={isSmallWidth}>
      <GraphGrid>
        <SearchBarGridArea rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}>
          {isLoggedIn ? <CoinPair /> : <Login />}
        </SearchBarGridArea>
        <ChartGridArea id="right-top">{!arbMode ? <GraphTool /> : <ColdStorage />}</ChartGridArea>

        <RightLowerSectionGrid hasMargin />
      </GraphGrid>
    </StyledRightTopSectionGrid>
  );
};

const withStore = compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.TELEGRAMSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { rightBottomSectionFullScreenMode, arbMode },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
    }) => ({
      rightBottomSectionFullScreenMode,
      arbMode,
      isLoggedIn
    })
  )
);

export default withStore(RightTopSectionGrid);
