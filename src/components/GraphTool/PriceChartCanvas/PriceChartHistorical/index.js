import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import DataLoader from '@/components-generic/DataLoader';
import LineChart from '@/lib/chartModules/lineChart';
import { STORE_KEYS } from '@/stores';
import { ChartCanvasWrapper } from '../styles';

class PriceChartHistorical extends Component {
  canvas = createRef();
  chartInitialized = false;

  componentDidMount() {
    this.handleData();
  }

  componentDidUpdate(prevProps) {
    const { baseSymbol, quoteSymbol } = this.props;

    if (prevProps.baseSymbol !== baseSymbol || prevProps.quoteSymbol !== quoteSymbol) {
      this.destroyChart();
    }

    this.handleData();
  }

  componentWillUnmount() {
    this.destroyChart();
  }

  handleData = () => {
    const { historicalData, loading, selectedFilterKey, quoteSymbol, baseSymbol } = this.props;

    if (loading) {
      this.destroyChart();
      return;
    }

    if (!this.chartInitialized && historicalData.length) {
      this.chart = new LineChart({
        el: this.canvas.current,
        data: historicalData,
        config: {
          liveMode: false,
          startTime: historicalData[0].x,
          endTime: historicalData[historicalData.length - 1].x,
          maxDataLength: historicalData.length,
          isQuoteFiat: quoteSymbol.includes('F:'),
          quoteSymbol: quoteSymbol.replace(/S:|F:/, ''),
          baseSymbol: baseSymbol.replace(/S:|F:/, ''),
          selectedFilterKey,
          maxTicksLimit: 6
        }
      });

      this.chartInitialized = true;
    }
  };

  destroyChart = () => {
    this.chartInitialized = false;
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };

  render() {
    const { loading } = this.props;

    return (
      <ChartCanvasWrapper>
        <canvas ref={this.canvas} />
        {loading && <DataLoader width={100} height={100} />}
      </ChartCanvasWrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.HISTORICALPRICESSTORE, STORE_KEYS.ORDERBOOKBREAKDOWN),
  observer,
  withProps(
    ({
      [STORE_KEYS.HISTORICALPRICESSTORE]: { historicalData, loading, selectedFilterKey },
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { baseSymbol, quoteSymbol }
    }) => ({
      loading,
      historicalData,
      selectedFilterKey,
      baseSymbol,
      quoteSymbol
    })
  )
)(PriceChartHistorical);
