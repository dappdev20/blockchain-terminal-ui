import React from 'react';

import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import PriceChartLive from './PriceChartLive';
import PriceChartHistorical from './PriceChartHistorical';
import PriceChartToolbar from './PriceChartToolbar';

import { ChartWrapper } from './styles';

const PriceChartCanvas = ({ [STORE_KEYS.HISTORICALPRICESSTORE]: { selectedFilterKey } }) => {
  return (
    <ChartWrapper>
      <PriceChartToolbar />
      {selectedFilterKey ? <PriceChartHistorical /> : <PriceChartLive />}
    </ChartWrapper>
  );
};

export default inject(STORE_KEYS.HISTORICALPRICESSTORE)(observer(PriceChartCanvas));
