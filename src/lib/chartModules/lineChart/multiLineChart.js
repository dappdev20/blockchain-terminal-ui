/* eslint-disable */
import Chart from 'chart.js';
import moment from 'moment';

import { ANIMATION_DURATION, ANIMATION_STEPS, SHIFT_CHART_DURATION, SHIFT_CHART_QUALIFIER } from './constants';
import { formatTotalDigitString, formatIntegerString } from '@/utils';
import { graphViewModeKeys } from '@/stores/ViewModeStore';
import PulsateDotSrc from './pulsateDot.svg';
import PulsateDotWhiteSrc from './pulsateDot.white.svg';
import './customScaleTypes';

const PulsateDot = new Image();
PulsateDot.src = PulsateDotSrc;

const PulsateDotWhite = new Image();
PulsateDotWhite.src = PulsateDotWhiteSrc;

Chart.defaults.global.animation.duration = 200;

export default class MultiLineChart {
  constructor(props) {
    this.el = props.el;
    this.initialDataLength = props.datasets[0].data.length;
    this.config = props.config;
    this.chart = new Chart(this.el, this.getConfig(props.datasets));

    // helpers
    this.updateInProgress = false;
    this.lineAnimationStartedAt = moment().valueOf();

    // timers
    this.shiftChartTimer = undefined;
    this.drawLineTimer = undefined;
    this.clearUpdateProgressTimer = undefined;
    this.mouseMoveTimer = undefined;
  }

  // getDefault gradient for line chart
  getLineGradient = () => {
    const ctx = this.el.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, this.el.offsetHeight);
    gradient.addColorStop(0, 'rgba(15, 68, 149, 0.3)');

    return gradient;
  };

  getYAxesConfig = axesId => ({
    display: false,
    id: axesId,
    type: 'linear',
    scaleLabel: {
      display: false
    },
    ticks: {
      source: 'labels',
      maxTicksLimit: 8
    },
    gridLines: {
      color: '#191D3E',
      display: false,
      drawBorder: false
    },
    afterFit: chart => {
      chart.margins.top = 0;
      chart.margins.bottom = 0;
      chart.paddingTop = 0;
      chart.paddingBottom = 0;
    }
  });

  getVisibility = (mode, idx) => {
    switch (mode) {
      case graphViewModeKeys.valueMode:
        return false;
      case graphViewModeKeys.numberMode:
        return idx === 1;
      case graphViewModeKeys.unfixedMode:
        return idx === 0;
      default:
        return false;
    }
  };

  getConfig = datasetsArray => {
    let pointStyle = [];

    const datasets = datasetsArray.map((dataset, index) => {
      if (dataset.data.length) {
        pointStyle = Array(dataset.data.length - 1)
          .fill('')
          .concat([dataset.datasetType === 'portfolio' ? PulsateDotWhite : PulsateDot]);
      }

      return {
        hidden: this.getVisibility(this.config.arbitrage.graphMode, index),
        borderColor: '#d4d4d4',
        backgroundColor: this.getLineGradient(),
        fill: true,
        type: 'line',
        lineTension: 0,
        borderWidth: 3,
        pointRadius: 0,
        pointStyle,
        yAxisID: this.config.commonYAxes ? 'price' : `price${index}`,
        ...dataset
      };
    });

    const yAxes = this.config.commonYAxes
      ? [this.getYAxesConfig('price')]
      : datasetsArray.map((data, index) => this.getYAxesConfig(`price${index}`));

    return {
      type: 'line',
      data: {
        datasets
      },
      options: {
        maintainAspectRatio: false,
        maxTickDecimalPoints: 0,
        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        },
        scales: {
          xAxes: [
            {
              id: 'time',
              type: 'time',
              distribution: 'linear',
              bounds: 'ticks',
              ticks: {
                source: 'auto',
                autoSkip: true,
                autoSkipPadding: 100,
                maxRotation: 0,
                padding: -20
              },
              time: {
                min: this.config.startTime,
                max: this.config.endTime,
                displayFormats: {
                  hour: 'H:mm',
                  minute: 'H:mm',
                  second: 'H:mm:ss',
                  millisecond: 'H:mm:ss'
                }
              },
              gridLines: {
                color: '#191D3E',
                tickMarkLength: 0,
                display: false,
                drawBorder: false
              },
              afterFit: chart => {
                chart.minSize.height = 0;
                chart.paddingLeft = 0;
              }
            }
          ],
          yAxes
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        }
      },
      plugins: [
        {
          afterDraw: chart => {
            const ctx = chart.chart.ctx;

            const { top, bottom, right, left } = chart.chartArea;

            // save canvas state
            ctx.save();

            const positions = [];

            // draw price label for the current price
            chart.data.datasets.forEach(({ data, datasetType }, index) => {
              const lastItem = data[data.length - 1];
              const meta = chart.getDatasetMeta(index);
              if (!meta.data.length) {
                // meta array is empty during the full redraw
                return;
              }

              const lastItemX = meta.data[meta.data.length - 1]._model.x;
              const lastItemY = meta.data[meta.data.length - 1]._model.y;

              positions[index] = {
                top,
                bottom,
                lastItemX,
                lastItemY,
                datasetType
              };

              if (this.config.arbitrage && !this.getVisibility(this.config.arbitrage.graphMode, index)) {
                // draw lines from last point to y axis
                if (datasetType === 'portfolio') {
                  this.drawLine(right, lastItemY, lastItemX, lastItemY, true);
                } else {
                  this.drawLine(lastItemX, lastItemY, left, lastItemY, false);
                }
              }
            });

            if (this.config.updatePosition) {
              this.config.updatePosition(positions);
            }

            ctx.restore();
          }
        }
      ]
    };
  };

  drawArbLabel = (y, value, datasetType) => {
    const {
      chart: { ctx },
      width
    } = this.chart;

    const isLeft = datasetType === 'portfolio';

    const topLabel = `${formatIntegerString(this.config.arbitrage.amount)} ${this.config.arbitrage.baseCoin} =`;
    const bottomLabel = `${formatTotalDigitString(value, 8)} ₿`;

    const labelWidth = 70;
    const labelHeight = 11;
    ctx.beginPath();

    if (isLeft) {
      ctx.moveTo(labelWidth, y - labelHeight);
      ctx.lineTo(0, y - labelHeight);
      ctx.lineTo(0, y + labelHeight);
      ctx.lineTo(labelWidth, y + labelHeight);
      ctx.lineTo(labelWidth + 8, y);
      ctx.lineTo(labelWidth, y - labelHeight);
    } else {
      ctx.moveTo(width - labelWidth, y - labelHeight);
      ctx.lineTo(width, y - labelHeight);
      ctx.lineTo(width, y + labelHeight);
      ctx.lineTo(width - labelWidth, y + labelHeight);
      ctx.lineTo(width - labelWidth - 8, y);
      ctx.lineTo(width - labelWidth, y - labelHeight);
    }

    ctx.fillStyle = '#004370';
    ctx.fill();
    ctx.save();

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    if (!isLeft) {
      ctx.font = 'normal 600 10px open_sans';
      ctx.fillText(topLabel, width - labelWidth / 2, y);
    }

    ctx.textBaseline = isLeft ? 'middle' : 'top';
    ctx.font = 'normal 600 10px open_sans';
    ctx.fillText(bottomLabel, isLeft ? labelWidth / 2 : width - labelWidth / 2, y);

    ctx.restore();
  };

  // function to calculate offset based on time and distance
  // http://gizma.com/easing/
  easeOutQuart = (t, b, c, d) => {
    t /= d;
    t--;
    return c * (t * t * t * t * t + 1) + b;
  };

  getMaxItem = (items, prop) => Math.max(...items.map(item => item[prop]));

  // function to animate line
  animateLine = (itemsToAnimate, timestamp, isFirstCall) => {
    if (!this.chart) {
      return;
    }

    const elapsed = Date.now() - timestamp;

    if (elapsed >= ANIMATION_DURATION) {
      for (let i = 0; i < itemsToAnimate.length; i++) {
        this.chart.data.datasets[i].data.pop();
        this.chart.data.datasets[i].data.push(itemsToAnimate[i].nextItem);
      }

      this.chart.update({ duration: 0 });
      return;
    }

    let itemAdded = isFirstCall;
    let shouldUpdate = false;
    for (let i = 0; i < itemsToAnimate.length; i++) {
      const { lastItem, nextItem } = itemsToAnimate[i];

      const coordinates = {
        x: this.easeOutQuart(elapsed, lastItem.x, nextItem.x - lastItem.x, ANIMATION_DURATION),
        y: this.easeOutQuart(elapsed, lastItem.y, nextItem.y - lastItem.y, ANIMATION_DURATION)
      };

      if (coordinates.x <= nextItem.x && coordinates.x >= lastItem.x) {
        itemAdded = false;
        if (isFirstCall) {
          this.chart.data.datasets[i].pointStyle.unshift('');
        } else {
          this.chart.data.datasets[i].data.pop();
        }
        this.chart.data.datasets[i].data.push(coordinates);
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      this.chart.update({ duration: 0 });
    }

    if (elapsed < ANIMATION_DURATION) {
      setTimeout(() => this.animateLine(itemsToAnimate, timestamp, itemAdded), ANIMATION_DURATION / ANIMATION_STEPS);
    }
  };

  // shift time axes
  shiftChartTimeline = nextItems => {
    const {
      time: { min: timeMin, max: timeMax }
    } = this.chart.scales;
    const timeAxesDuration = timeMax - timeMin;
    const maxTime = this.getMaxItem(nextItems, 'x');
    if (maxTime + timeAxesDuration * SHIFT_CHART_QUALIFIER > timeMax) {
      // the line reaches the edge
      const minTime = maxTime - timeAxesDuration / 2;
      this.chart.config.options.scales.xAxes[0].time.max = maxTime + timeAxesDuration / 2;
      this.chart.config.options.scales.xAxes[0].time.min = minTime;
      // remove invisible items in order to automatically adjust Y-scale
      const { datasets } = this.chart.data;
      datasets.forEach(({ data, pointStyle }, i) => {
        const nextItems = data.filter(item => item.x >= minTime);
        this.chart.data.datasets[i].data = nextItems;
        this.chart.data.datasets[i].pointStyle = pointStyle.slice(data.length - nextItems.length);
      });
      return true;
    }

    return false;
  };

  destroy = () => {
    this.updateInProgress = false;

    clearTimeout(this.shiftChartTimer);
    clearTimeout(this.drawLineTimer);
    clearTimeout(this.clearUpdateProgressTimer);
    clearTimeout(this.mouseMoveTimer);

    if (this.removeVisibilityListener) {
      this.removeVisibilityListener();
    }

    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };

  lineTo = (nextItems, nextConfig = {}) => {
    if (this.updateInProgress || !this.chart) {
      // block all updates while current animation is in progress
      return Promise.resolve();
    }

    this.config = {
      ...this.config,
      ...nextConfig
    };

    let shouldUpdate = false;
    const itemsToAnimate = [];
    for (let i = 0; i < nextItems.length; i++) {
      if (!this.chart.data.datasets[i]) continue;
      let { data: currentData, pointStyle, datasetType } = this.chart.data.datasets[i];
      const nextItem = nextItems[i];

      if (!currentData.length) {
        // add first item without animation
        this.chart.data.datasets[i].pointStyle.push(datasetType === 'portfolio' ? PulsateDotWhite : PulsateDot);
        this.chart.data.datasets[i].data.push(nextItem);
        shouldUpdate = true;
        continue;
      }

      this.updateInProgress = true;

      this.chart.data.datasets[i].pointStyle = Array(currentData.length - 1)
        .fill('')
        .concat([datasetType === 'portfolio' ? PulsateDotWhite : PulsateDot]);

      if (currentData.length >= this.config.maxDataLength) {
        // slice history prices
        const nextData = currentData.slice(currentData.length - this.initialDataLength);
        this.chart.data.datasets[i].data = nextData;
        this.chart.data.datasets[i].pointStyle = pointStyle.slice(currentData.length - this.initialDataLength);
        const nextMinTime = nextData.length && nextData[0].x;
        if (nextMinTime) {
          const {
            time: { min: timeMin }
          } = this.chart.scales;
          if (timeMin < nextMinTime) {
            this.chart.config.options.scales.xAxes[0].time.min = nextMinTime;
          }
        }
        currentData = nextData;
        shouldUpdate = true;
      }

      const lastItem = currentData[currentData.length - 1];
      itemsToAnimate.push({ nextItem, lastItem });

      if (this.config.removeRecurringPricesAtTheEnd) {
        let recurringItemsCount = 1;
        for (let i = currentData.length - 2; i >= 0; i--) {
          if (lastItem.y === currentData[i].y) {
            recurringItemsCount += 1;
          } else {
            break;
          }
        }

        if (recurringItemsCount > 2) {
          this.chart.data.datasets[i].data = currentData.slice(0, -recurringItemsCount + 1).concat([lastItem]);
          this.chart.data.datasets[i].pointStyle = pointStyle.slice(recurringItemsCount - 2);
          shouldUpdate = true;
        }
      }
    }

    if (shouldUpdate) {
      this.chart.update({ duration: 0 });
    }

    if (!itemsToAnimate.length) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      // adjust and shift chart
      const updateBeforeAnimation = this.shiftChartTimeline(nextItems);

      const timeToFinishPrevAnimation = Math.max(ANIMATION_DURATION - (Date.now() - this.lineAnimationStartedAt), 0);
      let delayBeforeNextAnimation = timeToFinishPrevAnimation;
      if (updateBeforeAnimation) {
        this.shiftChartTimer = setTimeout(() => {
          // wait while previous animation is finished
          this.chart.update({ duration: SHIFT_CHART_DURATION });
        }, timeToFinishPrevAnimation);

        delayBeforeNextAnimation += SHIFT_CHART_DURATION;
      }

      this.drawLineTimer = setTimeout(() => {
        const currentTs = Date.now();
        const {
          time: { min: timeMin, max: timeMax }
        } = this.chart.scales;
        const timeAxesDuration = timeMax - timeMin;
        const nextMaxTime = this.getMaxItem(nextItems, 'x') + timeAxesDuration / 2;
        this.animateLine(itemsToAnimate, currentTs, true);
        this.lineAnimationStartedAt = currentTs;
        this.clearUpdateProgressTimer = setTimeout(() => {
          this.updateInProgress = false;
          resolve();
        }, ANIMATION_DURATION);
      }, delayBeforeNextAnimation);
    });
  };

  drawLine = (x1, y1, x2, y2, isPortfolio = false) => {
    const {
      chart: { ctx }
    } = this.chart;

    ctx.beginPath();
    ctx.setLineDash([2]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isPortfolio ? '#9ba4af' : '#09f';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
}
