/* eslint-disable */
import Chart from 'chart.js';

const VERTICAL_SCALE_TICKS_NUMBER = 4;

const defaultLinearScale = Chart.scaleService.getScaleDefaults('linear');

const defaultGetPixelForValue = function([start, end], width, value) {
  const range = end - start;
  return this.left + (width / range) * (value - start);
};

const defaultGetValueForPixel = function([start, end], width, pixel) {
  const offset = pixel / width;
  return (end - start) * offset;
};

const getRange = type => ({ start, arb, end }, value) => {
  if (value < start[type][1]) {
    return 'start';
  }

  if (value > end[type][0]) {
    return 'end';
  }

  return 'arb';
};

const getRangeForValue = getRange('values');
const getRangeForPixel = getRange('pixels');

const LinearScaleWithArbitrage = Chart.scaleService.getScaleConstructor('linear').extend({
  getPixelForValue: function(value) {
    const rightValue = +this.getRightValue(value);

    const { arbRanges } = this.chart.scales.price;
    if (!arbRanges) {
      return defaultGetPixelForValue.call(this, [this.start, this.end], this.width, rightValue);
    }

    const range = getRangeForValue(arbRanges, rightValue);
    const meta = arbRanges[range];

    const [startPx, endPx] = meta.pixels;
    const width = endPx - startPx;

    return startPx + defaultGetPixelForValue.call(this, meta.values, width, rightValue);
  },

  getValueForPixel: function(pixel) {
    const { arbRanges } = this.chart.scales.price;

    if (!arbRanges) {
      return defaultGetValueForPixel.call(this, [this.start, this.end], this.width, pixel);
    }

    const range = getRangeForPixel(arbRanges, pixel);
    const meta = arbRanges[range];

    const [startPx, endPx] = meta.pixels;
    const [start] = meta.values;
    const width = endPx - startPx;

    return start + defaultGetValueForPixel.call(this, meta.values, width, pixel - startPx);
  }
});

const LinearScaleWithAmountQualifier = Chart.scaleService.getScaleConstructor('linear').extend({
  getPixelForValue: function(value) {
    const range = this.end - this.start;

    const decimal = 1 - (+this.getRightValue(value) - this.start) / range;

    const result = this.top + decimal * this.height;

    if (!value || !value.type || !value.x) {
      return result;
    }

    return result + (value.type === 'buy' ? 2 : 0);
  },
  buildTicks: function() {
    this.start = this.min;
    this.end = this.max;

    const tickStep = (this.max - this.min) / (VERTICAL_SCALE_TICKS_NUMBER + 2);

    // calculate the ticks
    this.ticks = Array(VERTICAL_SCALE_TICKS_NUMBER + 2)
      .fill(0)
      .map((item, index) => {
        return this.max - index * tickStep;
      });
  }
});

Chart.scaleService.registerScaleType('linear-scale-with-arbitrage', LinearScaleWithArbitrage, defaultLinearScale);
Chart.scaleService.registerScaleType(
  'linear-scale-with-amount-qualifier',
  LinearScaleWithAmountQualifier,
  defaultLinearScale
);
