import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';

import { STORE_KEYS } from '@/stores';
import { arbStateKeys } from '@/stores/ConversionAutoStore';

import OrderContainer from './OrderContainer';

const Wrapper = styled.div.attrs({ className: 'order-form' })`
  display: flex;
  width: 100%;
`;

const OrderFrom = () => ({
  render() {
    const { activeCoin, arbState } = this.props;
    let animation = 0;
    switch (arbState) {
      case arbStateKeys.ARB_NONE:
      case arbStateKeys.ARB_LOAD:
        animation = 1;
        break;
      case arbStateKeys.ARB_PLAN:
        animation = 2;
        break;
      case arbStateKeys.ARB_EXEC:
        animation = 3;
        break;
      case arbStateKeys.ARB_RUN:
        animation = 4;
        break;
      default:
        animation = 0;
    }
    return (
      <Wrapper>
        <OrderContainer activeCoin={activeCoin} animation={animation} isBuy />
        <OrderContainer activeCoin={activeCoin} animation={animation} />
      </Wrapper>
    );
  }
});

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.CONVERSIONAUTOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { arbMode, setArbMode },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { arbState, activeCoin }
    }) => ({
      setArbMode,
      arbMode,
      arbState,
      activeCoin
    })
  )
)(OrderFrom);
