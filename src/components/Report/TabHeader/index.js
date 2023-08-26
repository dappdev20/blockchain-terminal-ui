import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';

import DropMenu from '../DropMenu';

import 'react-datepicker/dist/react-datepicker.css';

import {
  timePeriodList,
  instrumentList,
  accountList,
  orderTypeList,
  timeInForceList,
  sideList,
  sourceList,
  hasTradesList,
  orderStateList,
  makerTakerList,
  directionList,
  typeList,
  reportTypeList,
  outputTypeList,
  currencyList
} from '../constants';
import { IcExitFullScreen, ExitFullScreenWrapper } from '@/components/OrderHistoryAdv/Components';
import { MODE_KEYS } from '@/config/constants';
import { STORE_KEYS } from '@/stores';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  padding: 10px 0;
  justify-content: space-between;
  border-bottom: 1px solid #454c73;
  background-color: ${props => props.theme.palette.clrMainWindow};
  .react-datepicker-popper {
    z-index: 1000;
  }
  .react-datepicker__header {
    background-color: ${props => props.theme.palette.clrBackground};
    border-bottom: 1px solid #454c73;
  }
  .react-datepicker__input-container input {
    background-color: ${props => props.theme.palette.clrDarkPurple};
    border: 1px solid #454c73;
    outline-color: white;
    color: ${props => props.theme.palette.clrPurple};
    padding: 5px;
    width: 50px;
  }
  .day--keyboard-selected {
    color: white;
  }
  .react-datepicker {
    background: ${props => props.theme.palette.clrBackground};
    border: 1px solid #454c73;
  }
  .react-datepicker__day-name,
  .react-datepicker-time__caption {
    color: ${props => props.theme.palette.clrPurple};
  }
  .react-datepicker__current-month {
    color: ${props => props.theme.palette.clrPurple};
  }
  .react-datepicker__day {
    color: ${props => props.theme.palette.clrPurple};
  }
  .react-datepicker__month-container {
    background-color: ${props => props.theme.palette.clrMainWindow};
    padding: 0.4em;
    margin: 0;
    border-bottom: 1px solid #454c73;
  }
  input.react-datepicker-time__input {
    background-color: ${props => props.theme.palette.clrMainWindow};
    border: 1px solid #454c73;
    margin-left: 0;
    text-align: center;
    color: ${props => props.theme.palette.clrPurple};
  }
  .react-datepicker-popper[data-placement^='bottom'] {
    margin-top: 20px;
  }
  .react-datepicker-popper[data-placement^='top'] {
    margin-bottom: 0;
  }
`;

const DropdownGroup = styled.div`
  display: flex;
`;

const dropdownMenus = {
  instrument: <DropMenu label="Instrument" data={instrumentList} key="Instrument" />,
  account: <DropMenu label="Account" data={accountList} key="Account" />,
  orderType: <DropMenu label="Order type" data={orderTypeList} key="Order type" />,
  timeInForce: <DropMenu label="Time in force" data={timeInForceList} key="Time in force" />,
  side: <DropMenu label="Side" data={sideList} key="Side" />,
  source: <DropMenu label="Source" data={sourceList} key="Source" />,
  hasTrades: <DropMenu label="Has trades" data={hasTradesList} key="Has trades" />,
  orderState: <DropMenu label="Order state" data={orderStateList} key="Order state" />,
  makerTaker: <DropMenu label="Maker/Taker" data={makerTakerList} key="Maker/Taker" />,
  direction: <DropMenu label="Direction" data={directionList} key="Direction" />,
  status: <DropMenu label="Status" data={directionList} key="Status" />,
  type: <DropMenu label="Type" data={typeList} key="Type" />,
  reportType: <DropMenu label="Report type" data={reportTypeList} key="Report type" />,
  outputType: <DropMenu label="Output type" data={outputTypeList} key="Output type" />,
  currency: <DropMenu label="Currency" data={currencyList} key="Currency" />
};

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Separator = styled.div`
  display: inline-block;
  position: relative;
  width: 10px;
  height: 1px;
  margin: 0 10px;

  &:after {
    content: '';
    display: block;
    width: 9px;
    height: 1px;
    border-bottom: 1px solid #454c73;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
  }
`;

class TabHeader extends React.Component {
  state = {
    startDate: null,
    endDate: null
  };

  handleChangeStartDate = date => {
    this.setState({
      startDate: date
    });
    this.props.changeStartDate(date);
  };

  handleChangeEndDate = date => {
    this.setState({
      endDate: date
    });
    this.props.changeEndDate(date);
  };

  handleExitFullScreen = () => {
    this.props[STORE_KEYS.VIEWMODESTORE].setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
  };

  render() {
    const { dropdowns, children } = this.props;

    return (
      <Wrapper>
        <LeftWrapper>
          <DropMenu label="Time period" data={timePeriodList} />
          <DatePicker
            selected={this.state.startDate}
            timeInputLabel="Time:"
            onChange={this.handleChangeStartDate}
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
          <Separator />
          <DatePicker
            selected={this.state.endDate}
            timeInputLabel="Time:"
            onChange={this.handleChangeEndDate}
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
        </LeftWrapper>

        <div>
          <DropdownGroup>{dropdowns.map(dropdown => dropdownMenus[dropdown])}</DropdownGroup>
        </div>

        {children}

        <ExitFullScreenWrapper onClick={this.handleExitFullScreen}>
          <IcExitFullScreen />
        </ExitFullScreenWrapper>
      </Wrapper>
    );
  }
}

export default inject(STORE_KEYS.VIEWMODESTORE)(observer(TabHeader));
