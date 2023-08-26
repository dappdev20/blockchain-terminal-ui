import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import DataLoader from '@/components-generic/DataLoader';
import PieChart from '@/lib/chartModules/pieChart';

import { Wrapper } from './styles';

class PieChartCanvas extends Component {
  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (this.chart && data.length && prevProps.data.length === data.length) {
      if (data.every((item, i) => item.Percentage === prevProps.data[i].Percentage)) {
        return;
      }
    }
    this.updateChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getData = () => {
    const { data } = this.props;

    if (!data || !data.length) {
      return [];
    }

    return data.reduce(
      (result, { Exchange = '', Percentage = 0 }) => {
        result.data.push(Percentage);
        result.labels.push(Exchange);
        return result;
      },
      { data: [], labels: [] }
    );
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

    this.chart = new PieChart({
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
    const { data } = this.props;

    if (!data.length) {
      this.destroyChart();
      return <DataLoader width={100} height={100} />;
    }

    return (
      <Wrapper>
        <canvas ref={el => (this.el = el)} />
      </Wrapper>
    );
  }
}

const enhanced = compose(
  inject(STORE_KEYS.LOWESTEXCHANGESTORE),
  observer,
  withProps(({ [STORE_KEYS.LOWESTEXCHANGESTORE]: { Plan } }) => ({
    data: Plan
  }))
);

export default enhanced(PieChartCanvas);
