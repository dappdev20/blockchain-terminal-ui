import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import DataLoader from '@/components-generic/DataLoader';
import LineChart from '@/lib/chartModules/lineChart';
import { STORE_KEYS } from '@/stores';
import { MAX_PRICES_LENGTH } from '@/stores/PriceChartStore';
import { ChartCanvasWrapper } from '../styles';

class PriceChartLive extends Component {
  canvas = createRef();

  state = {
    initialized: false
  };

  componentDidUpdate(prevProps) {
    const { baseSymbol, quoteSymbol, price } = this.props;
    const { initialized } = this.state;

    if (prevProps.baseSymbol !== baseSymbol || prevProps.quoteSymbol !== quoteSymbol || !price) {
      this.destroyChart();
      return;
    }

    if (initialized) {
      this.updateChart();
      return;
    }

    this.initChart();
  }

  initChart = () => {
    const { baseSymbol, quoteSymbol, price } = this.props;

    const startTime = Date.now();
    const endTime = moment(this.props.now)
      .add(10, 'seconds')
      .valueOf();

    this.setState({ initialized: true });

    this.chart = new LineChart({
      el: this.canvas.current,
      data: [{ x: Date.now(), y: price }],
      config: {
        liveMode: true,
        startTime,
        endTime,
        maxDataLength: MAX_PRICES_LENGTH,
        isQuoteFiat: quoteSymbol.includes('F:'),
        baseSymbol: baseSymbol.replace(/S:|F:/, ''),
        quoteSymbol: quoteSymbol.replace(/S:|F:/, ''),
        maxTicksLimit: 6
      }
    });
  };

  componentWillUnmount() {
    this.destroyChart();
  }

  destroyChart = () => {
    if (this.chart) {
      this.setState({ initialized: false });
      this.chart.destroy();
      this.chart = undefined;
    }
  };

  updateChart = () => {
    const { price, avgPrice } = this.props;
    const nextItem = { x: Date.now(), y: price };

    this.chart.lineTo(nextItem, avgPrice);
  };

  render() {
    const { initialized } = this.state;
    return (
      <ChartCanvasWrapper>
        <canvas ref={this.canvas} />
        {!initialized && <DataLoader width={100} height={100} />}
      </ChartCanvasWrapper>
    );
  }
}

export default compose(
  inject(STORE_KEYS.PRICECHARTSTORE, STORE_KEYS.SETTINGSSTORE, STORE_KEYS.ORDERBOOKBREAKDOWN),
  observer,
  withProps(
    ({
      [STORE_KEYS.PRICECHARTSTORE]: { priceData, price },
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { baseSymbol, quoteSymbol, avgPrice }
    }) => ({
      priceData,
      price,
      baseSymbol,
      quoteSymbol,
      avgPrice
    })
  )
)(PriceChartLive);
