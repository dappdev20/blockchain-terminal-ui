import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';

import SubHeader from './SubHeader';
import { STORE_KEYS } from '@/stores';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  background-color: ${props => props.theme.palette.clrMainWindow};
  position: relative;
  color: ${props => props.theme.palette.clrPurple};
  border: 1px solid #454c73;
`;

const TabItem = styled.div`
  font-size: 13px;
  padding: 15px 20px;
  cursor: pointer;
  color: ${props => props.theme.palette.clrPurple};

  &:hover::after {
    width: 80%;
    color: ${props => props.theme.palette.clrHighContrast};
  }

  &::after {
    display: block;
    content: '';
    width: 0%;
    height: 1px;
    background: #fff;
    margin: 0 auto;
    -webkit-transition: 0.2s ease-in-out;
    transition: 0.2s ease-in-out;
  }
`;

const TabItemSelected = styled(TabItem)`
  color: ${props => props.theme.palette.clrHighContrast};
  &::after {
    width: 80%;
  }
`;

const TabList = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: 700;
  font-family: 'open_sans', sans-serif;
  color: ${props => props.theme.palette.clrPurple};
  background-color: ${props => props.theme.palette.clrMainWindow};
`;

const tabs = ['Accounts', 'Order history', 'Trade history', 'Payment history', 'NAV report'];

class Header extends React.Component {
  handleClickTabItem = tabIndex => {
    this.props.onTabChange(tabIndex);
  };

  subHeader = () => {
    const { activeTabIndex } = this.props;
    switch (activeTabIndex) {
      case 0:
        return <SubHeader tab="accounts" />;
      case 1:
        return <SubHeader tab="orderHistory" />;
      case 2:
        return <SubHeader tab="tradeHistory" />;
      case 3:
        return <SubHeader tab="paymentHistory" />;
      case 4:
        return <SubHeader tab="navReport" />;
      default:
        break;
    }
  };

  render() {
    const { activeTabIndex } = this.props;

    return (
      <Wrapper>
        <TabList>
          {tabs.map((tab, i) => {
            if (activeTabIndex === i) {
              return (
                <TabItemSelected onClick={() => this.handleClickTabItem(i)} key={i}>
                  {tab}
                </TabItemSelected>
              );
            }

            return (
              <TabItem onClick={() => this.handleClickTabItem(i)} key={i}>
                {tab}
              </TabItem>
            );
          })}
        </TabList>
        {this.subHeader()}
      </Wrapper>
    );
  }
}

export default inject(STORE_KEYS.VIEWMODESTORE)(observer(Header));
