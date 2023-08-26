import Chart from 'chart.js';
import max from 'lodash.max';
import min from 'lodash.min';

import { formatCoinString, commafy } from '@/utils';
import { SHIFT_CHART_QUALIFIER, MAX_DECIMALS_COUNT } from './constants';

const defaultLinearScale = Chart.scaleService.getScaleDefaults('linear');

function determineDataLimits() {
  const { data } = this.chart.data.datasets[0];
  const { min: minTime, max: maxTime } = this.chart.scales.time;
  const { drawingTo, cachedMinMax } = this.chart.options;

  if (this.drawingTo && drawingTo) {
    // skip during animation
    if (cachedMinMax) {
      this.max = cachedMinMax.max;
      this.min = cachedMinMax.min;
    }
    return;
  }

  this.drawingTo = drawingTo;

  const visibleData = [];
  let firstVisibleIndex;
  // get all visible points on the chart
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.x >= minTime && item.x <= maxTime) {
      visibleData.push(item.y);
      if (!firstVisibleIndex) {
        firstVisibleIndex = i;
      }
    }
  }

  // add the closest invisible point from the left
  if (firstVisibleIndex && data[firstVisibleIndex - 1]) {
    visibleData.unshift(data[firstVisibleIndex - 1].y);
  }

  // add the currently drawing point
  if (this.chart.options.drawingTo) {
    visibleData.push(this.chart.options.drawingTo);
  }

  // in case we zoom-in too close and there are no visible points on the chart
  // just take the closest invisible ponits from the left and from the right
  if (!visibleData.length && data.length) {
    let closestLeft;
    let closestRight;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!closestLeft || (minTime - item.x > 0 && item.x > closestLeft.x)) {
        closestLeft = item;
      }
      if (!closestRight || (item.x - maxTime > 0 && item.x < closestLeft.x)) {
        closestRight = item;
      }
    }
    visibleData.push(closestLeft.y);
    visibleData.push(closestRight.y);
  }

  const maxVisiblePrice = max(visibleData) || 0;
  const minVisiblePrice = min(visibleData) || 0;

  const priceDifference = parseFloat((maxVisiblePrice - minVisiblePrice).toFixed(MAX_DECIMALS_COUNT));

  let tickStep;
  if (priceDifference === 0 || priceDifference > 0.5) {
    tickStep = 10 ** (Math.round(priceDifference).toString().length - 1);
  } else {
    const leadingZerosRegex = priceDifference.toFixed(10).match(/^[0, .]+/);
    const leadingZeros = leadingZerosRegex && leadingZerosRegex[0];
    const leadingZerosCount = leadingZeros ? leadingZeros.replace('.', '').length : 0;
    tickStep = 10 ** -leadingZerosCount;
  }

  let maxPrice = maxVisiblePrice - (maxVisiblePrice % tickStep) + tickStep;
  let minPrice = minVisiblePrice - (minVisiblePrice % tickStep);

  const scaleDistance = maxPrice - minPrice;

  if (scaleDistance > 0) {
    if (minVisiblePrice - minPrice < scaleDistance * SHIFT_CHART_QUALIFIER) {
      minPrice -= tickStep;
    }

    if (maxPrice - maxVisiblePrice < scaleDistance * SHIFT_CHART_QUALIFIER) {
      maxPrice += tickStep;
    }
  }

  // fix overflow problem, e.g. 11063.800000000001, instead of 11063.8
  this.max = parseFloat(maxPrice.toFixed(MAX_DECIMALS_COUNT));
  this.min = parseFloat(minPrice.toFixed(MAX_DECIMALS_COUNT));
  this.chart.options.cachedMinMax = { max: this.max, min: this.min };
}

function buildTicks() {
  this.start = this.min;
  this.end = this.max;

  const tickStep = (this.max - this.min) / (this.options.ticks.maxTicksLimit - 1);

  // calculate the ticks
  this.ticks = Array(this.options.ticks.maxTicksLimit)
    .fill(0)
    .map((item, index) => {
      return this.max - index * tickStep;
    });
}

function convertTicksToLabels() {
  this.ticksAsNumbers = this.ticks.slice();
  this.zeroLineIndex = this.ticks.indexOf(0);

  this.chart.options.maxTickDecimalPoints = this.ticksAsNumbers.reduce((res, tick) => {
    // format the number and remove trailing zeros
    const tickAsString = formatCoinString(tick, MAX_DECIMALS_COUNT).replace(/\.?0+$/, '');

    if (tickAsString.indexOf('.') === -1) {
      return res;
    }

    const decimalPart = tickAsString.split('.')[1];
    return decimalPart.length > res ? decimalPart.length : res;
  }, 2);

  this.ticks = this.ticksAsNumbers.map((tick, i) => {
    // hide first and last tick labels
    if (!i || i === this.ticks.length - 1) {
      return '';
    }
    return commafy(tick.toPrecision(7));
  });
}

const customMinMaxScale = Chart.scaleService.getScaleConstructor('linear').extend({
  determineDataLimits,
  convertTicksToLabels
});

const customFixedTicksScale = Chart.scaleService.getScaleConstructor('linear').extend({
  determineDataLimits,
  buildTicks,
  convertTicksToLabels
});

Chart.scaleService.registerScaleType('custom-min-max-scale', customMinMaxScale, defaultLinearScale);

Chart.scaleService.registerScaleType('custom-fixed-ticks-scale', customFixedTicksScale, defaultLinearScale);
