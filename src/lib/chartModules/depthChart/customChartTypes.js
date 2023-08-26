/* eslint-disable */
import Chart from 'chart.js';

function setColor(newColor, meta) {
  meta.dataset._view.borderColor = newColor;
}

Chart.defaults['arb-color-line'] = Chart.defaults.line;
Chart.controllers['arb-color-line'] = Chart.controllers.line.extend({
  draw: function(ease) {
    const meta = this.getMeta();
    const points = meta.data || [];
    const area = this.chart.chartArea;
    const colors = this.getDataset().colors;
    const originalDatasets = meta.dataset._children.filter(data => {
      return !isNaN(data._view.y);
    });

    const { arbRanges } = this.chart.scales.price;
    if (!arbRanges) {
      Chart.controllers.line.prototype.draw.call(this, ease);
      return;
    }

    let datasetIndex = null;
    if (this.chart.options.tooltipMeta) {
      datasetIndex = this.chart.options.tooltipMeta.datasetIndex;
    }

    const currentDatasetIndex = meta.dataset._datasetIndex;

    const arbColor = currentDatasetIndex
      ? datasetIndex
        ? colors.sellsBorder
        : colors.sellsBorderInactive
      : datasetIndex
      ? colors.buysBorderInactive
      : colors.buysBorder;
    setColor(arbColor, meta);

    const range = 'arb';
    const rangeMeta = arbRanges[range];
    const [startPx, endPx] = rangeMeta.pixels;

    const startIndex = 0;
    let endIndex = originalDatasets.findIndex(item => {
      const x = item._model.x;
      return currentDatasetIndex ? x > endPx : x < startPx;
    });
    endIndex = endIndex - 1;

    const restPointsToDraw = originalDatasets.slice(endIndex);

    const arbPointsToDraw = originalDatasets.slice(startIndex, endIndex);

    meta.dataset._children = arbPointsToDraw;
    meta.dataset.draw();

    const restColor = currentDatasetIndex ? colors.sellsBorder : colors.buysBorder;
    setColor(restColor, meta);

    const resultPoints = [].concat(arbPointsToDraw).concat(restPointsToDraw);

    meta.dataset._children = restPointsToDraw;
    meta.dataset.draw();
    meta.dataset._children = resultPoints;

    points.forEach(function(point) {
      point.draw(area);
    });
  }
});
