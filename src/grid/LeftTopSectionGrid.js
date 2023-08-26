import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '../stores';
import OrderBookRecentTradesContainer from '../components/OrderBookRecentTradesContainer';

const StyledLeftTopSectionGrid = styled.div`
    position: relative;
    ${props =>
      props.isMobilePortrait || props.isSmallWidth
        ? 'width: calc(100% - 8px);'
        : 'max-width: calc(33% - 12px); width: calc(33% - 12px);'}
    margin-left: ${props => (props.isTrading && !props.isMobilePortrait ? '-33%' : '12px')};
    transition: margin .1s linear;

    & > div:first-child {
        transition: none !important;
        margin-left: 0 !important;
        width: 100% !important;
    }
`;

class LeftTopSectionGrid extends Component {
  componentDidMount() {}

  render() {
    const { isUserDropDownOpen, isCoinTransfer, isMobileDevice, isMobilePortrait, isSmallWidth } = this.props;

    return (
      <StyledLeftTopSectionGrid
        id="left-sidebar"
        isMobilePortrait={isMobilePortrait}
        isSmallWidth={isSmallWidth}
        isSidebarMenuOpen={isUserDropDownOpen}
      >
        <OrderBookRecentTradesContainer
          isLeftTop
          isMobileDevice={isMobileDevice}
          isCoinTransfer={isCoinTransfer}
          trId={isCoinTransfer ? this.props.trId : null}
          isUserDropDownOpen={isUserDropDownOpen}
          isSidebarMenuOpen={isUserDropDownOpen}
        />
      </StyledLeftTopSectionGrid>
    );
  }
}

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(({ [STORE_KEYS.VIEWMODESTORE]: { viewMode, isUserDropDownOpen } }) => ({
    viewMode,
    isUserDropDownOpen
  }))
)(LeftTopSectionGrid);
