import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { orderHistoryDropdowns } from '../../constants';
import { STORE_KEYS } from '@/stores';
import { checkDateIsBetweenTwo } from '@/utils';
import SubHeader from '@/components/Report/Header/SubHeader';

import TabHeader from '../../TabHeader';
import ReportTable from '../../Table';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
`;

class OrderHistory extends React.Component {
  state = {
    startDate: undefined,
    endDate: undefined
  };

  changeStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  changeEndDate = date => {
    this.setState({
      endDate: date
    });
  };

  render() {
    const orderHistoryColumns = this.props.OrderHistoryData;
    const filteredColumns = [];
    const { startDate, endDate } = this.state;
    for (let i = 0; i < orderHistoryColumns.length; i++) {
      const ithDate = new Date(orderHistoryColumns[i].timeUnFormatted);
      if (checkDateIsBetweenTwo(ithDate, startDate, endDate) === true) {
        filteredColumns.push(orderHistoryColumns[i]);
      }
    }
    return (
      <Wrapper>
        <TabHeader
          tab="orderHistory"
          changeStartDate={this.changeStartDate}
          changeEndDate={this.changeEndDate}
          dropdowns={orderHistoryDropdowns}
        >
          <SubHeader tab="orderHistory" />
        </TabHeader>

        <ReportTable columns={filteredColumns} />
      </Wrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.ORDERHISTORY),
  observer,
  withProps(({ [STORE_KEYS.ORDERHISTORY]: { OrderHistoryData } }) => ({ OrderHistoryData }))
)(OrderHistory);
