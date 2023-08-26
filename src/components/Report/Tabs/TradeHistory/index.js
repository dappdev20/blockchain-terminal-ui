import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';

import TabHeader from '../../TabHeader';
import Table from './Table';
import SubHeader from '@/components/Report/Header/SubHeader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const dropdowns = ['instrument', 'account', 'side', 'makerTaker', 'source'];

class TradeHistory extends React.Component {
  render() {
    const history = this.props.History.map(trade => {
      return {
        ...trade,
        amount: parseFloat(trade.amount).toFixed(2),
        cost: parseFloat(trade.cost).toFixed(2),
        price: parseFloat(trade.price).toFixed(2)
      };
    });

    return (
      <Wrapper>
        <TabHeader tab="tradeHistory" dropdowns={dropdowns}>
          <SubHeader tab="tradeHistory" />
        </TabHeader>
        <Table columns={history} />
      </Wrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.TRADESSTORE),
  observer,
  withProps(({ [STORE_KEYS.TRADESSTORE]: { History } }) => ({ History }))
)(TradeHistory);
