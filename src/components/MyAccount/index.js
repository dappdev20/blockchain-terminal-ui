import React from 'react';

import { Wrapper, Content } from './styles';
import DonutChart from './DonutChart';
import WalletTable from './WalletTable';

const MyAccount = () => (
  <Wrapper>
    <Content>
      <DonutChart />
      <WalletTable />
    </Content>
  </Wrapper>
);

export default MyAccount;
