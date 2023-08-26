import Chart from 'chart.js';
import moment from 'moment';
import throttle from 'lodash.throttle';
import 'chartjs-plugin-zoom';

import documentVisibilityListener from '@/utils/documentVisibilityListener';
import { ANIMATION_DURATION, ANIMATION_STEPS, SHIFT_CHART_DURATION, SHIFT_CHART_QUALIFIER } from './constants';
import { customDigitFormatWithNoTrim, formatFiatString } from '@/utils';

import PulsateDotSrc from './pulsateDot.svg';
import './customScaleTypes';

const MAX_TIME_DURATION = 180000; // 180 seconds

const PulsateDot = new Image();
PulsateDot.src = PulsateDotSrc;

Chart.defaults.global.animation.duration = 200;

export default class LineChart {
  constructor(props) {
    this.el = props.el;
    this.initialDataLength = props.data.length;
    this.config = props.config;
    this.chart = new Chart(this.el, this.getConfig(props.data));
    this.removeVisibilityListener = documentVisibilityListener(this.onChangeVisibility);

    // helpers
    this.updateInProgress = false;
    this.lineAnimationStartedAt = Date.now();
    this.tabStatus = 'visible';

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

  getConfig = data => {
    const {
      startTime,
      endTime,
      liveMode,
      steppedLine,
      isPortfolio,
      selectedFilterKey,
      maxTicksLimit,
      yAxesOffset
    } = this.config;

    let pointStyle = [];
    let zoomMin = startTime;
    const zoomMax = endTime;
    if (data.length) {
      if (liveMode) {
        pointStyle = Array(data.length - 1)
          .fill('')
          .concat([PulsateDot]);

        zoomMin = Math.min(zoomMin, data[0].x);
      }
    }

    return {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: '#d4d4d4',
            backgroundColor: this.getLineGradient(),
            fill: true,
            data,
            type: 'line',
            lineTension: 0,
            borderWidth: 3,
            pointRadius: 0,
            pointStyle,
            steppedLine
          }
        ]
      },

      options: {
        maintainAspectRatio: false,
        maxTickDecimalPoints: 0,
        customLine: {},
        scales: {
          xAxes: [
            {
              id: 'time',
              type: 'time',
              distribution: 'linear',
              bounds: 'ticks',
              ticks: {
                display: isPortfolio !== true,
                source: 'auto',
                autoSkip: true,
                autoSkipPadding: 100,
                maxRotation: 0,
                // move ticks inside the chart
                padding: -20
              },
              time: {
                min: startTime,
                max: endTime,
                displayFormats: {
                  hour: 'MMM D hA',
                  minute: 'H:mm',
                  second: 'H:mm:ss',
                  millisecond: 'H:mm:ss',
                  day: 'MMM D'
                }
              },
              gridLines: {
                color: '#191D3E',
                tickMarkLength: 0,
                display: true,
                drawBorder: false
              },
              afterFit: chart => {
                chart.minSize.height = 0;
                chart.paddingLeft = 0;
                chart.paddingRight = 0;
              }
            }
          ],
          yAxes: [
            {
              display: !isPortfolio,
              id: 'price',
              type: maxTicksLimit ? 'custom-fixed-ticks-scale' : 'custom-min-max-scale',
              position: isPortfolio === true ? 'left' : 'right',
              scaleLabel: {
                display: false
              },
              ticks: {
                mirror: true,
                source: 'labels',
                maxTicksLimit: maxTicksLimit || 8,
                padding: -5
              },
              gridLines: {
                color: '#191D3E',
                display: true,
                drawBorder: false,
                tickMarkLength: -4
              },
              offset: yAxesOffset,
              afterFit: chart => {
                chart.margins.top = 0;
                chart.margins.bottom = 0;
                chart.paddingTop = 0;
                chart.paddingBottom = 0;
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        },
        // Container for pan options
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: zoomMin
          },
          rangeMax: {
            x: zoomMax
          },
          onPan: this.onZoom
        },

        // Container for zoom options
        zoom: {
          enabled: true,
          mode: 'x',
          speed: 0.016,
          rangeMin: {
            x: zoomMin
          },
          rangeMax: {
            x: zoomMax
          },
          onZoom: this.onZoom
        }
      },
      // Chart.js plugin:
      // - draws verical and horizontal lines under a cursor
      // - draws horizontal line from the most recent price
      // - displays cursor and the most recent price on the right side
      plugins: [
        {
          beforeEvent: (chart, e) => {
            if (e.type === 'mousemove') {
              chart.options.customLine.x =
                e.x >= e.chart.chartArea.left && e.x <= e.chart.chartArea.right ? e.x : undefined;
              chart.options.customLine.y =
                e.y >= e.chart.chartArea.top && e.y <= e.chart.chartArea.bottom ? e.y : undefined;
              clearTimeout(this.mouseMoveTimer);
              this.mouseMoveTimer = setTimeout(() => {
                chart.options.customLine.x = undefined;
                chart.options.customLine.y = undefined;
                this.updateChartThrottled();
              }, 5000);
              this.updateChartThrottled();
            }
            if (e.type === 'mouseout') {
              chart.options.customLine.x = undefined;
              chart.options.customLine.y = undefined;
              this.updateChartThrottled();
            }
          },
          afterDraw: chart => {
            const ctx = chart.chart.ctx;
            const { x, y } = chart.options.customLine;

            // save canvas state
            ctx.save();

            const { top, bottom, right } = chart.chartArea;

            if (liveMode) {
              // draw price label for the current price
              const dataset = chart.data.datasets[0].data;
              const lastItem = dataset[dataset.length - 1];
              const meta = chart.getDatasetMeta(0);
              if (!meta.data.length) {
                // meta array is empty during the full redraw
                return;
              }
              const lastItemX = meta.data[meta.data.length - 1]._model.x;
              const lastItemY = meta.data[meta.data.length - 1]._model.y;

              if (!isPortfolio) {
                this.drawLine(lastItemX + 5, lastItemY, right, lastItemY);
              }
              this.drawPriceLabel(lastItemY, lastItem.y);
            }

            if (!x || !y) {
              ctx.restore();
              return;
            }

            const { min, max } = chart.scales.price;

            // draw lines at cursor position
            // this.drawLine(x, bottom, x, top);
            // this.drawLine(left, y, right, y);

            if (!liveMode) {
              // draw price label for cursor
              const valueAtCursor = (1 - (y - top) / (bottom - top)) * (max - min) + min;
              this.drawPriceLabel(y, valueAtCursor);
            }

            const totalSeconds = (chart.scales.time.max - chart.scales.time.min) / 1000;
            const frameWidth = chart.scales.time.maxWidth;
            let secondStep = frameWidth / totalSeconds;
            if (secondStep === 0) {
              secondStep = 1;
            }

            if (!liveMode) {
              const date = new Date(chart.scales.time.min + (x / secondStep) * 1000);
              let format = '';

              switch (selectedFilterKey) {
                case '1H':
                  format = 'mm:ss';
                  break;
                case '1D':
                  format = 'LT';
                  break;
                case '1W':
                  format = 'MMM D HH';
                  break;
                case '1M':
                case '1Y':
                  format = 'MMM D';
                  break;
                default:
                  format = 'hh:mm:ss';
                  break;
              }
              this.drawTimeLabel(x, moment(date).format(format));
            }

            // restore canvas state
            ctx.restore();
          }
        }
      ]
    };
  };

  drawPriceLabel = (y, valueAtCursor) => {
    if (this.config.isPortfolio) {
      const {
        chart: { ctx }
      } = this.chart;
      const label = ` ${customDigitFormatWithNoTrim(valueAtCursor, 9, 9)} BTC`;

      // draw box for price at Y-axes for cursor
      ctx.beginPath();
      ctx.moveTo(0, y - 10);
      ctx.lineTo(ctx.measureText(label).width, y - 10);
      ctx.lineTo(ctx.measureText(label).width, y + 10);
      ctx.lineTo(0, y + 10);
      ctx.fillStyle = '#767E83';
      ctx.fill();

      // draw price at Y-axes for cursor
      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(label, ctx.measureText(label).width / 2, y);

      return;
    }

    const {
      chart: { ctx },
      chartArea: { right }
    } = this.chart;

    const { baseSymbol, quoteSymbol, isQuoteFiat } = this.config;
    const quote = quoteSymbol === 'BTC' ? '\u20BF' : quoteSymbol;
    const base = baseSymbol === 'BTC' ? '\u20BF' : baseSymbol;
    const { unitValue, unitPrefix } = formatFiatString(valueAtCursor, 2);
    const value = isQuoteFiat ? `${unitValue}${unitPrefix}` : customDigitFormatWithNoTrim(valueAtCursor, 9, 9);
    const symbolSpace = '\u2009'; // \u200A thin space
    const label =
      baseSymbol === 'USD' || baseSymbol === 'USDT'
        ? `1${symbolSpace}$ = ${quote}${symbolSpace}${value}`
        : `1${symbolSpace}${base} = $${symbolSpace}${value}`;

    const labelHeight = 34;
    const labelWidth = ctx.measureText(label).width + 10;
    ctx.beginPath();
    ctx.moveTo(right, y - labelHeight / 2);
    ctx.lineTo(right - labelWidth, y - labelHeight / 2);
    ctx.lineTo(right - labelWidth, y + labelHeight / 2);
    ctx.lineTo(right, y + labelHeight / 2);
    ctx.fillStyle = '#0061b8';
    ctx.fill();

    // draw price at Y-axes for cursor
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(label, right - labelWidth / 2, y);
  };

  drawTimeLabel(x, valueAtCursor) {
    const {
      chart: { ctx },
      chartArea: { bottom }
    } = this.chart;
    // draw box for price at Y-axes for cursor
    const labelWidth = 60;
    const offsetY = -20;
    const labelHeight = 20;
    ctx.beginPath();
    ctx.moveTo(x - labelWidth / 2, bottom + offsetY);
    ctx.lineTo(x + labelWidth / 2, bottom + offsetY);
    ctx.lineTo(x + labelWidth / 2, bottom + offsetY + labelHeight);
    ctx.lineTo(x - labelWidth / 2, bottom + offsetY + labelHeight);
    ctx.lineTo(x - labelWidth / 2, bottom + offsetY);
    ctx.fillStyle = '#0061b8';
    ctx.fill();
    // draw price at Y-axes for cursor
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(`${valueAtCursor}`, x, bottom + offsetY + labelHeight / 2);
  }

  drawLine = (x1, y1, x2, y2, isPortfolio = false) => {
    const {
      chart: { ctx }
    } = this.chart;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = isPortfolio ? '#9ba4af7f' : '#0061b8';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // function to calculate offset based on time and distance
  // http://gizma.com/easing/
  easeOutQuart = (t, b, c, d) => {
    /* eslint-disable-next-line */
    t /= d;
    /* eslint-disable-next-line */
    t--;
    return c * (t * t * t * t * t + 1) + b;
  };

  updateChartThrottled = throttle(() => {
    if (!this.chart) {
      return;
    }

    if (this.config.liveMode) {
      const elapsed = Date.now() - this.lineAnimationStartedAt;
      if (elapsed < ANIMATION_DURATION) {
        // line animation is in progress
        // no need to update chart manually
        return;
      }
    }
    this.chart.update({ duration: 0 });
  }, 150);

  onChangeVisibility = status => {
    this.tabStatus = status;
  };

  onZoom = ({ chart }) => {
    const { data } = chart.data.datasets[0];
    if (!data.length || !this.config.liveMode) {
      return;
    }

    const {
      time: { min, max }
    } = chart.scales;
    const timeAxesDuration = max - min;

    const lastItem = data[data.length - 1];
    if (lastItem.x + timeAxesDuration * SHIFT_CHART_QUALIFIER > max) {
      this.chart.config.options.scales.xAxes[0].time.max = lastItem.x + timeAxesDuration * SHIFT_CHART_QUALIFIER;
      this.chart.update({ duration: 0 });
    }
  };

  // function to animate line
  animateLine = (lastItem, nextItem, timestamp, isFirstCall) => {
    if (!this.chart || this.tabStatus === 'hidden') {
      return;
    }

    const elapsed = Date.now() - timestamp;

    if (elapsed >= ANIMATION_DURATION) {
      this.chart.data.datasets[0].data.pop();
      this.chart.data.datasets[0].data.push(nextItem);
      this.chart.update({ duration: 0 });
      return;
    }

    const coordinates = {
      x: this.easeOutQuart(elapsed, lastItem.x, nextItem.x - lastItem.x, ANIMATION_DURATION),
      y: this.easeOutQuart(elapsed, lastItem.y, nextItem.y - lastItem.y, ANIMATION_DURATION)
    };

    let itemAdded = isFirstCall;
    if (coordinates.x <= nextItem.x && coordinates.x >= lastItem.x) {
      itemAdded = false;
      if (isFirstCall) {
        this.chart.data.datasets[0].pointStyle.unshift('');
      } else {
        this.chart.data.datasets[0].data.pop();
      }
      this.chart.data.datasets[0].data.push(coordinates);
      this.chart.update({ duration: 0 });
    }

    if (elapsed < ANIMATION_DURATION) {
      setTimeout(
        () => this.animateLine(lastItem, nextItem, timestamp, itemAdded),
        ANIMATION_DURATION / ANIMATION_STEPS
      );
    }
  };

  // shift time axes
  shiftChartTimeline = nextItem => {
    const {
      time: { min: timeMin, max: timeMax }
    } = this.chart.scales;
    const timeAxesDuration = timeMax - timeMin;

    if (nextItem.x + timeAxesDuration * SHIFT_CHART_QUALIFIER > timeMax) {
      // the line reaches the edge
      if (timeAxesDuration === MAX_TIME_DURATION) {
        // shift timeline
        this.chart.config.options.scales.xAxes[0].time.min = nextItem.x - timeAxesDuration / 2;
        this.chart.config.options.scales.xAxes[0].time.max = nextItem.x + timeAxesDuration / 2;
      } else {
        // extend timeline
        const targetDuration = Math.min(timeAxesDuration * 2, MAX_TIME_DURATION);
        this.chart.config.options.scales.xAxes[0].time.max = timeMin + targetDuration;
      }

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

  lineTo = nextItem => {
    if (this.updateInProgress || !this.chart) {
      // block all updates while current animation is in progress
      return Promise.resolve();
    }

    let { data: currentData, pointStyle } = this.chart.data.datasets[0];

    if (!currentData.length) {
      // add first item without animation
      this.chart.data.datasets[0].pointStyle.push(PulsateDot);
      this.chart.data.datasets[0].data.push(nextItem);
      this.chart.update({ duration: 0 });
      return Promise.resolve();
    }

    this.updateInProgress = true;

    const lastItem = currentData[currentData.length - 1];

    if (lastItem.x >= nextItem.x) {
      // in case of any glitches :)
      this.updateInProgress = false;
      return Promise.resolve();
    }

    if (currentData.length >= this.config.maxDataLength) {
      // slice history prices
      const nextData = currentData.slice(currentData.length - this.initialDataLength);
      this.chart.data.datasets[0].data = nextData;
      this.chart.data.datasets[0].pointStyle = pointStyle.slice(currentData.length - this.initialDataLength);
      const nextMinTime = nextData.length && nextData[0].x;
      if (nextMinTime) {
        const {
          time: { min: timeMin }
        } = this.chart.scales;
        if (timeMin < nextMinTime) {
          this.chart.config.options.scales.xAxes[0].time.min = nextMinTime;
        }
        this.chart.options.pan.rangeMin.x = nextMinTime;
        this.chart.options.zoom.rangeMin.x = nextMinTime;
      }
      this.chart.update({ duration: 0 });
      currentData = nextData;
    }

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
        this.chart.data.datasets[0].data = currentData.slice(0, -recurringItemsCount + 1).concat([lastItem]);
        this.chart.data.datasets[0].pointStyle = pointStyle.slice(recurringItemsCount - 2);
      }
    }

    return new Promise(resolve => {
      // adjust and shift chart
      const updateBeforeAnimation = this.shiftChartTimeline(nextItem);

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
        const nextMaxTime = nextItem.x + timeAxesDuration / 2;
        this.chart.options.pan.rangeMax.x = nextMaxTime;
        this.chart.options.zoom.rangeMax.x = nextMaxTime;
        if (this.tabStatus === 'visible') {
          // let's use animation only when tab is active
          this.animateLine(lastItem, nextItem, currentTs, true);
          this.lineAnimationStartedAt = currentTs;
          this.chart.options.drawingTo = nextItem.y;
          this.clearUpdateProgressTimer = setTimeout(() => {
            this.updateInProgress = false;
            this.chart.options.drawingTo = undefined;
            resolve();
          }, ANIMATION_DURATION);
        } else {
          // render without animation when tab is hidden
          this.chart.data.datasets[0].pointStyle.unshift('');
          this.chart.data.datasets[0].data.push(nextItem);
          this.chart.update({ duration: 0 });
          this.updateInProgress = false;
          resolve();
        }
      }, delayBeforeNextAnimation);
    });
  };
}
