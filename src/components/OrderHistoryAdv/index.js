import React, { PureComponent } from 'react';

import { Wrapper, InnerWrapper, Header } from './Components';
import ActiveTable from './ActiveTable';
import FilledTable from './FilledTable';
import MyTradesTable from './MyTradesTable';
import { MODE_KEYS } from './Constants';
import Accounts from '@/components/Accounts';
import Report from '@/components/Report';
import OrderHistory from '@/components/Report/Tabs/OrderHistory';
import TradeHistory from '@/components/Report/Tabs/TradeHistory';
import PaymentHistory from '@/components/Report/Tabs/PaymentHistory';
import NavReport from '@/components/Report/Tabs/NavReport';
import MyAccount from '@/components/MyAccount';
import DepthChart from '@/components/DepthChart';

class OrderHistoryAdv extends PureComponent {
  getContent = () => {
    const { rightBottomSectionOpenMode } = this.props;
    switch (rightBottomSectionOpenMode) {
      case MODE_KEYS.depthChartKey:
        return (
          <>
            <DepthChart />
          </>
        );
      case MODE_KEYS.myTradesModeKey:
        return <MyTradesTable />;
      case MODE_KEYS.activeModeKey:
        return <ActiveTable />;
      case MODE_KEYS.filledModeKey:
        return <FilledTable />;
      case MODE_KEYS.reportsModeKey:
        return <Report />;
      case MODE_KEYS.accountsModeKey:
        return <Accounts />;
      case MODE_KEYS.orderHistoryModeKey:
        return <OrderHistory />;
      case MODE_KEYS.tradeHistoryModeKey:
        return <TradeHistory />;
      case MODE_KEYS.paymentHistoryModeKey:
        return <PaymentHistory />;
      case MODE_KEYS.navReportModeKey:
        return <NavReport />;
      case MODE_KEYS.myPortfolioModeKey:
      case MODE_KEYS.coldStorage:
        return <MyAccount />;
      case MODE_KEYS.tradingViewModeKey:
        return null;
      case MODE_KEYS.arbitrageModeKey:
        return null;
      default:
        return null;
    }
  };

  render() {
    const { rightBottomSectionOpenMode } = this.props;
    return (
      <Wrapper>
        {(rightBottomSectionOpenMode === MODE_KEYS.myPortfolioModeKey ||
          rightBottomSectionOpenMode === MODE_KEYS.depthChartKey ||
          rightBottomSectionOpenMode === MODE_KEYS.coldStorage) && <Header />}
        <InnerWrapper>{this.getContent()}</InnerWrapper>
      </Wrapper>
    );
  }
}

export default OrderHistoryAdv;
