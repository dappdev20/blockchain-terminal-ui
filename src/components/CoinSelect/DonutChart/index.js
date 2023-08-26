import React, { Component } from 'react';

import DonutPortfolioChart from '@/lib/chartModules/donutChart';
import { BalanceLabel, Wrapper } from './styles';

class DonutChart extends Component {
  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getData = () => {
    const { percentage } = this.props;

    return {
      data: [percentage, 100 - percentage],
      labels: ['', ''],
      colors: ['blue', 'white']
    };
  };

  updateChart = () => {
    if (!this.el) {
      return;
    }

    const nextData = this.getData();

    if (this.chart) {
      this.chart.update(nextData);
      return;
    }

    this.chart = new DonutPortfolioChart({
      el: this.el,
      data: nextData
    });
  };

  destroyChart = () => {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };

  render() {
    const { percentage } = this.props;

    return (
      <Wrapper>
        <canvas ref={el => (this.el = el)} />

        <BalanceLabel>{`${percentage}%`}</BalanceLabel>
      </Wrapper>
    );
  }
}

export default DonutChart;
