/* eslint no-param-reassign: 0 */
import Chart from 'chart.js';

import { formatCoinString } from '@/utils';

import './customChartTypes';
import './customScaleTypes';

const ARB_WIDTH = 150;

function convertHex(hex, opacity) {
  const hexSplit = hex.replace('#', '');
  const r = parseInt(hexSplit.substring(0, 2), 16);
  const g = parseInt(hexSplit.substring(2, 4), 16);
  const b = parseInt(hexSplit.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
}

function getArbGradient(el, color, height) {
  const gradient = el.getContext('2d').createLinearGradient(0, 0, 0, height.replace('px', ''));
  gradient.addColorStop(0, convertHex(color, 0.01));
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, color);

  return gradient;
}

export default class DepthChart {
  constructor(props) {
    this.el = props.el;
    this.config = props.config;

    const { palette } = props.config.theme;

    const gradientView = this.el;
    const leftGradientBgColor = gradientView.getContext('2d').createLinearGradient(0, 100, 0, 290);
    leftGradientBgColor.addColorStop(0, palette.orderBookTableCellBuyBgStop0);
    leftGradientBgColor.addColorStop(1, palette.orderBookTableCellBuyBgStop1);

    const rightGradientBgColor = gradientView.getContext('2d').createLinearGradient(0, 100, 0, 290);
    rightGradientBgColor.addColorStop(0, palette.orderBookTableCellSellBgStop0);
    rightGradientBgColor.addColorStop(1, palette.orderBookTableCellSellBgStop1);

    this.colors = {
      buysBorder: palette.orderBookTableCellBuyBorder,
      buysBackground: leftGradientBgColor,
      buysBorderInactive: convertHex(palette.orderBookTableCellTextBuyBright, 0.3),
      buysBackgroundInactive: convertHex(palette.orderBookTableCellTextBuyBright, 0.1),
      sellsBorder: palette.orderBookTableCellSellBorder,
      sellsBackground: rightGradientBgColor,
      sellsBorderInactive: convertHex(palette.orderBookTableCellTextSellBright, 0.3),
      sellsBackgroundInactive: convertHex(palette.orderBookTableCellTextSellBright, 0.1)
    };

    this.chart = new Chart(this.el, this.getConfig(props.data));
  }

  getPriceScaleEdges = ({ buys, sells }) => {
    const { midPrice } = this.config;

    const buyGap = midPrice - buys[buys.length - 1].x;
    const sellGap = sells[sells.length - 1].x - midPrice;
    const smallerGap = Math.min(buyGap, sellGap);

    return {
      max: midPrice + smallerGap,
      min: midPrice - smallerGap
    };
  };

  getAmountScaleEdges = ({ buys, sells }) => {
    const maxAmount = Math.max(sells[sells.length - 1].y, buys[buys.length - 1].y);

    // move the bottom line upper to see the line in ARB
    return {
      min: 0 - maxAmount * 0.1
    };
  };

  getClosestDatasetPoint = (datasetIndex, x) => {
    let { data } = this.chart.getDatasetMeta(datasetIndex);

    if (!datasetIndex) {
      data = data.slice().reverse();
    }

    let meta;
    let i = 0;
    for (i; i < data.length; i++) {
      if (data[i]._model.x > x) {
        meta = data[i]._model;
        break;
      }
    }
    if (!meta) {
      // reached to the end
      i = data.length - 1;
      meta = data[i]._model;
    } else if (i && x - data[i - 1]._model.x < data[i]._model.x - x) {
      // check the left point
      i -= 1;
      meta = data[i]._model;
    }

    return { index: datasetIndex ? i : data.length - i - 1, meta };
  };

  getTooltipMeta = x => {
    const { width } = this.chart;

    const { index: buyIndex, meta: buyMeta } = this.getClosestDatasetPoint(0, x);
    const { index: sellIndex, meta: sellMeta } = this.getClosestDatasetPoint(1, x);

    const buyDistance = Math.abs(x - buyMeta.x);
    const sellDistance = Math.abs(x - sellMeta.x);

    let meta;
    let datasetIndex;
    let index;
    if (sellDistance > buyDistance) {
      meta = buyMeta;
      datasetIndex = 0;
      index = buyIndex;
    } else {
      meta = sellMeta;
      datasetIndex = 1;
      index = sellIndex;
    }

    let tooltipXPosition = 'middle';
    if (meta.x < 100) {
      tooltipXPosition = 'right';
    } else if (meta.x > width - 100) {
      tooltipXPosition = 'left';
    }

    return { meta, index, datasetIndex, x, tooltipXPosition, value: this.chart.scales.price.getValueForPixel(x) };
  };

  getConfig = ({ buys, sells }) => {
    const { buysBorder, buysBackground, sellsBorder, sellsBackground } = this.colors;
    const { min, max } = this.getPriceScaleEdges({ buys, sells });
    const { min: amountMin } = this.getAmountScaleEdges({ buys, sells });

    return {
      type: 'arb-color-line',
      data: {
        datasets: [
          {
            borderColor: buysBorder,
            backgroundColor: buysBackground,
            fill: 'start',
            lineTension: 0,
            borderWidth: 2,
            steppedLine: 'middle',
            data: buys,
            colors: this.colors
          },
          {
            borderColor: sellsBorder,
            backgroundColor: sellsBackground,
            fill: 'start',
            lineTension: 0,
            borderWidth: 2,
            steppedLine: 'middle',
            data: sells,
            colors: this.colors
          }
        ]
      },
      options: {
        cursor: {},
        tooltipMeta: undefined,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0
          },
          point: {
            radius: 0,
            hitRadius: 7,
            hoverRadius: 0
          }
        },
        scales: {
          xAxes: [
            {
              id: 'price',
              type: 'linear-scale-with-arbitrage',
              bounds: 'ticks',
              ticks: {
                display: false,
                min,
                max
              },
              gridLines: {
                drawOnChartArea: false,
                color: '#666',
                drawBorder: false,
                tickMarkLength: 0
              },
              afterFit: chart => {
                chart.paddingLeft = 0;
                chart.paddingRight = 0;

                const [buys, sells] = chart.chart.config.data.datasets;

                if (!buys || !buys.data.length || !sells || !sells.data.length) {
                  chart.arbRanges = undefined;
                  return;
                }

                const bestBuy = buys.data[0].x;
                const bestSell = sells.data[0].x;
                const isArbitrage = bestBuy > bestSell;

                const startArb = isArbitrage ? bestSell : bestBuy;
                const endArb = isArbitrage ? bestBuy : bestSell;

                if (startArb >= endArb) {
                  chart.arbRanges = undefined;
                  return;
                }

                const { start, end, width } = chart;
                const sideRangesWidth = (width - ARB_WIDTH) / 2;

                //   |____________|__ARB__|____________|
                // start     startArb  endArb        end

                chart.arbRanges = {
                  start: {
                    values: [start, startArb],
                    pixels: [0, sideRangesWidth]
                  },
                  arb: {
                    values: [startArb, endArb],
                    pixels: [sideRangesWidth, sideRangesWidth + ARB_WIDTH]
                  },
                  end: {
                    values: [endArb, end],
                    pixels: [sideRangesWidth + ARB_WIDTH, width]
                  }
                };
              }
            }
          ],
          yAxes: [
            {
              id: 'amount',
              type: 'linear-scale-with-amount-qualifier',
              position: 'right',
              ticks: {
                autoSkip: true,
                mirror: true,
                padding: -5,
                fontColor: '#999',
                min: amountMin,
                callback: (value, index, values) => {
                  // skip the first and zero ticks
                  if (!index || index === values.length - 1 || value === 0) {
                    return '';
                  }

                  return formatCoinString(value, 0);
                }
              },
              gridLines: {
                drawBorder: false,
                drawOnChartArea: false,
                display: false,
                tickMarkLength: 0
              },
              afterFit: chart => {
                chart.margins.bottom = 0;
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
        }
      },
      plugins: [
        {
          beforeEvent: (chart, e) => {
            switch (e.type) {
              case 'mouseout':
                clearTimeout(this.updateTooltipTimer);
                chart.options.tooltipMeta = undefined;
                this.config.onTooltipChange();
                chart.update({ duration: 0 });
                break;
              case 'mousemove':
                if (e.x < e.chart.chartArea.left || e.x > e.chart.chartArea.right) {
                  break;
                }

                clearTimeout(this.updateTooltipTimer);
                const tooltipMeta = this.getTooltipMeta(e.x);
                this.config.onTooltipChange(tooltipMeta);
                chart.options.tooltipMeta = tooltipMeta;
                chart.update({ duration: 0 });
                break;
              case 'click':
                this.config.onClick(this.getTooltipMeta(e.x));
                break;
              default:
                break;
            }
          },
          afterDraw: chart => {
            // draw mid price
            this.drawArb(chart);

            // draw tooltip meta
            this.drawTooltipMeta(chart);

            // draw amount label
            this.drawAmountLabel(chart);
          }
        }
      ]
    };
  };

  update = ({ buys, sells }, midPrice) => {
    this.config.midPrice = midPrice;

    const { data, options } = this.chart.config;
    const {
      datasets: [currentBuys, currentSells]
    } = data;

    // trying to be smart to get rid of useless updates
    // check data length and first/last price
    if (
      currentBuys.data.length === buys.length &&
      currentBuys.data[0].x === buys[0].x &&
      currentBuys.data[currentBuys.data.length - 1].x === buys[buys.length - 1].x &&
      currentSells.data.length === sells.length &&
      currentSells.data[0].x === sells[0].x &&
      currentSells.data[currentSells.data.length - 1].x === sells[sells.length - 1].x
    ) {
      return;
    }

    const { min, max } = this.getPriceScaleEdges({ buys, sells });
    const { min: amountMin } = this.getAmountScaleEdges({ buys, sells });

    currentBuys.data = buys;
    currentSells.data = sells;
    options.scales.xAxes[0].ticks.min = min;
    options.scales.xAxes[0].ticks.max = max;
    options.scales.yAxes[0].ticks.min = amountMin;

    this.chart.update({ duration: 200 });

    if (options.tooltipMeta) {
      this.updateTooltipTimer = setTimeout(() => {
        if (!this.chart.options.tooltipMeta) {
          return;
        }
        this.chart.options.tooltipMeta = this.getTooltipMeta(this.chart.options.tooltipMeta.x);
        this.config.onTooltipChange(this.chart.options.tooltipMeta);
        this.chart.update({ duration: 0 });
      }, 200);
    }
  };

  destroy = () => {
    clearTimeout(this.updateTooltipTimer);

    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  };

  drawAmountLabel = chart => {
    const {
      ctx,
      chartArea: { right }
    } = chart;

    const { tooltipMeta } = chart.options;

    if (!tooltipMeta) {
      return;
    }

    const { min, max } = chart.scales.amount;

    const {
      meta: { y }
    } = tooltipMeta;

    const { top, bottom } = chart.chartArea;
    const valueAtCursor = (1 - (y - top) / (bottom - top)) * (max - min) + min;

    const value = formatCoinString(valueAtCursor, 2);
    const label = `${value}`;

    const labelHeight = 34;
    const labelWidth = ctx.measureText(label).width + 10;

    // save canvas state
    ctx.save();

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

    ctx.restore();
  };

  drawTooltipMeta = chart => {
    const { tooltipMeta } = chart.options;

    if (!tooltipMeta) {
      return;
    }

    const { palette } = this.config.theme;

    const { meta, datasetIndex, x } = tooltipMeta;

    const { ctx } = chart;
    // save canvas state
    ctx.save();

    const { bottom } = chart.chartArea;

    const color = datasetIndex ? palette.orderBookTableCellTextSellBright : palette.orderBookTableCellTextBuyBright;

    ctx.beginPath();
    ctx.arc(x, meta.y, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.setLineDash([5, 3]);
    ctx.moveTo(x, meta.y);
    ctx.lineTo(x, bottom);
    ctx.stroke();

    ctx.restore();
  };

  drawArb = chart => {
    const { ctx } = chart;
    const { bottom } = chart.chartArea;
    const { buysBorder, sellsBorder } = this.colors;
    const { lowerSectionHeight } = this.config.theme.palette;

    const buysMeta = chart.getDatasetMeta(0);
    const sellsMeta = chart.getDatasetMeta(1);

    const bestBuyMeta = buysMeta.data[0]._model.x;
    const bestSellMeta = sellsMeta.data[0]._model.x;

    ctx.save();

    // arbitrage, 2 lines
    const canvas = this.el;
    let gradientColor = getArbGradient(canvas, buysBorder, lowerSectionHeight);
    this.drawLine(bestBuyMeta, 0, bestBuyMeta, bottom, gradientColor);

    gradientColor = getArbGradient(canvas, sellsBorder, lowerSectionHeight);
    this.drawLine(bestSellMeta, 0, bestSellMeta, bottom, gradientColor);

    if (bestBuyMeta > bestSellMeta) {
      ctx.fillStyle = 'rgba(2, 5, 24, 0.5)';
      ctx.fillRect(bestSellMeta, 0, bestBuyMeta - bestSellMeta, bottom);
    }

    ctx.restore();
  };

  drawLine = (x1, y1, x2, y2, color = '#999') => {
    const {
      chart: { ctx }
    } = this.chart;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.setLineDash([5, 3]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
}
