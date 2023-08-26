import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { navReportDropdowns } from '../../constants';
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

class NavReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: undefined,
      endDate: undefined
    };
  }

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
    const navReportColumns = this.props.OrderHistoryData;
    const filteredColumns = [];
    const { startDate, endDate } = this.state;
    for (let i = 0; i < navReportColumns.length; i++) {
      const ithDate = new Date(navReportColumns[i].timeUnFormatted);
      if (checkDateIsBetweenTwo(ithDate, startDate, endDate) === true) {
        filteredColumns.push(navReportColumns[i]);
      }
    }
    return (
      <Wrapper>
        <TabHeader
          tab="navReport"
          changeStartDate={this.changeStartDate}
          changeEndDate={this.changeEndDate}
          dropdowns={navReportDropdowns}
        >
          <SubHeader tab="navReport" />
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
)(NavReport);
