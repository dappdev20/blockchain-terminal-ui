import Chart from 'chart.js';
import randomColor from 'randomcolor';

const generateColors = count =>
  randomColor({
    count,
    luminosity: 'dark',
    hue: 'blue',
    format: 'rgba',
    alpha: 0.3
  });

export default class PieChart {
  constructor(props) {
    this.el = props.el;
    this.config = props.config;

    this.chart = new Chart(this.el, this.getConfig(props.data));
  }

  maxNumberOfColors = 10;
  colors = generateColors(this.maxNumberOfColors);

  getColors = data => {
    if (data.length > this.maxNumberOfColors) {
      this.maxNumberOfColors = data.length;
      this.colors = this.getColors(data.length);
    }

    return this.colors.slice(0, data.length);
  };

  getConfig = ({ data, labels }) => {
    return {
      type: 'pie',
      data: {
        datasets: [
          {
            data,
            backgroundColor: this.getColors(data),
            borderColor: 'rgba(255, 255, 255, 0.5)'
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      },
      labels
    };
  };

  update = ({ data, labels }) => {
    this.chart.config.data.datasets[0].data = data;
    this.chart.config.data.labels = labels;
    this.chart.config.data.datasets[0].backgroundColor = this.getColors(data);
    this.chart.update({ duration: 500 });
  };

  destroy = () => {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };
}
