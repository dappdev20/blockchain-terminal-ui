import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { paymentHistoryDropdowns } from '../../constants';
import { STORE_KEYS } from '@/stores';
import { checkDateIsBetweenTwo } from '@/utils';

import TabHeader from '../../TabHeader';
import ReportTable from '../../Table';
import SubHeader from '../../Header/SubHeader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
`;

class PaymentHistory extends React.Component {
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
    const paymentHistoryColumns = this.props.OrderHistoryData;
    const filteredColumns = [];
    const { startDate, endDate } = this.state;
    for (let i = 0; i < paymentHistoryColumns.length; i++) {
      const ithDate = new Date(paymentHistoryColumns[i].timeUnFormatted);
      if (checkDateIsBetweenTwo(ithDate, startDate, endDate) === true) {
        filteredColumns.push(paymentHistoryColumns[i]);
      }
    }
    return (
      <Wrapper>
        <TabHeader
          tab="paymentHistory"
          changeStartDate={this.changeStartDate}
          changeEndDate={this.changeEndDate}
          dropdowns={paymentHistoryDropdowns}
        >
          <SubHeader tab="paymentHistory" />
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
)(PaymentHistory);
