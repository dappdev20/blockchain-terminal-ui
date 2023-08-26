import Chart from 'chart.js';

export default class DonutChart {
  constructor(props) {
    this.el = props.el;
    this.config = props.config;

    this.chart = new Chart(this.el, this.getConfig(props.data));
  }

  getConfig = ({ data, labels, colors }) => {
    return {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: '#020518'
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        cutoutPercentage: 88,
        tooltips: {
          enabled: false
        },
        layout: {
          padding: 15
        }
      },
      labels
    };
  };

  update = ({ data, labels, colors, selected }) => {
    this.chart.config.data.datasets[0].data = data;
    this.chart.config.data.labels = labels;
    this.chart.config.data.datasets[0].backgroundColor = colors;
    this.chart.update({ duration: 500 });
    const selectedIndex = this.chart.config.data.labels.indexOf(selected);
    if (selectedIndex !== -1) {
      const dataset = this.chart.config.data.datasets[0];
      /* eslint-disable-next-line */
      for (let key in dataset._meta) {
        const model = dataset._meta[key].data[selectedIndex]._model;
        model.x += Math.cos((model.endAngle + model.startAngle) / 2) * 10;
        model.y += Math.sin((model.endAngle + model.startAngle) / 2) * 10;
      }
    }
  };

  destroy = () => {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };
}
