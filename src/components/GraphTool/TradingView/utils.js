import { INTERVAL_MAP } from './historyProvider';

export const getSymbol = ({ exchange, market }) => ({
  name: market.code,
  ticker: `${exchange.code}:${market.code}`,
  description: market.code,
  timezone: 'UTC',
  type: 'market',
  session: '24x7',
  minmov: 1,
  minmov2: 0,
  pricescale: 1e2,
  pointvalue: 1,
  volume_precision: 4,
  data_status: 'streaming',
  has_intraday: true,
  has_daily: true,
  supported_resolutions: ['1', '5', '15', '60', '360', '1440', 'D'],
  intraday_multipliers: ['1', '5', '15', '60', '360', '1440', 'D'],
  has_weekly_and_monthly: false,
  has_empty_bars: false,
  exchange_name: exchange.code,
  exchange: exchange.code,
  market_name: market.code
});

const roundTimeByInterval = (time, interval) => +new Date(Math.trunc(time / interval) * interval);

export const drawHistoryGraph = (
  bars,
  firstDataRequest,
  onDataCallback,
  symbolInfo,
  resolution,
  onErrorCallback,
  apiDataLoadObservable
) => {
  let normalizedBars;
  const url = `https://rest.qa.bct.trade/api/best-conversion-rate/${symbolInfo.name}`;
  const barsLength = bars.length;

  fetch(url)
    .then(response => response.json())
    .then(Data => {
      let price = 0;
      let average1 = 0;
      let average2 = 0;

      try {
        price = Data.data.rate || 0;
      } catch (err) {
        price = 0;
      }

      try {
        average1 = (bars[barsLength - 1].low + bars[barsLength - 1].high) / 2;
        average2 = (1 / bars[barsLength - 1].low + 1 / bars[barsLength - 1].high) / 2;
      } catch (e) {
        average1 = 0;
        average2 = 0;
      }

      if (Math.abs(average1 - price) > Math.abs(average2 - price)) {
        normalizedBars = bars.map((b, i) => ({
          close: 1 / +b.cls,
          isLastBar: i === bars.length - 1,
          time: +new Date(b.time),
          volume: 1 / +b.vol,
          isBarClosed: true,
          open: 1 / +b.opn,
          high: 1 / +b.high,
          low: 1 / +b.low
        }));
      } else {
        normalizedBars = bars.map((b, i) => ({
          close: +b.cls,
          isLastBar: i === bars.length - 1,
          time: +new Date(b.time),
          volume: +b.vol,
          isBarClosed: true,
          open: +b.opn,
          high: +b.high,
          low: +b.low
        }));
      }

      if (firstDataRequest) {
        // TODO handle correct
        try {
          this.lastBarTime = roundTimeByInterval(
            normalizedBars[normalizedBars.length - 1].time,
            INTERVAL_MAP[resolution]
          );
        } catch (e) {
          // console.log(e);
        }
      }
      apiDataLoadObservable.next({
        apiLoaded: true
      });
      return onDataCallback(normalizedBars, { noData: !normalizedBars.length });
    })
    .catch(err => onErrorCallback());
};

export const drawHistoryGraphWithMultiply = (
  bars,
  firstDataRequest,
  onDataCallback,
  symbolInfo,
  resolution,
  onErrorCallback,
  apiDataLoadObservable
) => {
  // console.log('[symbolInfo111]', symbolInfo);
  const coin1 = symbolInfo.name.split('-')[0] || '';
  const coin2 = symbolInfo.name.split('-')[1] || '';

  let normalizedBars;
  fetch(`https://rest.qa.bct.trade/api/best-conversion-rate/${coin1}-ETH`)
    .then(response => response.json())
    .then(Data => {
      let rateY = 0;
      try {
        rateY = Data.data.rate || 0;
      } catch (err) {
        rateY = 0;
      }

      fetch(`https://rest.qa.bct.trade/api/best-conversion-rate/${coin2}-BTC`)
        .then(response => response.json())
        .then(Data => {
          let rateZ = 0;
          try {
            rateZ = Data.data.rate || 0;
          } catch (err) {
            rateZ = 0;
          }

          const rate = rateZ !== 0 ? rateY / rateZ : 0;

          normalizedBars = bars.map((b, i) => ({
            close: +b.cls * rate,
            isLastBar: i === bars.length - 1,
            time: +new Date(b.time),
            volume: +b.vol * rate,
            isBarClosed: true,
            open: +b.opn * rate,
            high: +b.high * rate,
            low: +b.low * rate
          }));

          if (firstDataRequest) {
            // TODO handle correct
            try {
              this.lastBarTime = roundTimeByInterval(
                normalizedBars[normalizedBars.length - 1].time,
                INTERVAL_MAP[resolution]
              );
            } catch (e) {
              console.log(e);
            }
          }
          apiDataLoadObservable.next({
            apiLoaded: true
          });
          return onDataCallback(normalizedBars, { noData: !normalizedBars.length });
        })
        .catch(err => onErrorCallback());
    })
    .catch(err => onErrorCallback());
};

export const customIndicatorsGetter = PineJS => {
  return Promise.resolve([
    {
      name: 'Equity',
      metainfo: {
        _metainfoVersion: 40,
        id: 'Equity@tv-basicstudies-1',
        scriptIdPart: '',
        name: 'Equity',
        description: 'Equity',
        shortDescription: 'Equity',

        is_hidden_study: true,
        is_price_study: true,
        isCustomIndicator: true,

        plots: [{ id: 'plot_0', type: 'line' }],
        defaults: {
          styles: {
            plot_0: {
              linestyle: 0,
              visible: true,

              // Make the line thinner
              linewidth: 1,

              // Plot type is Line
              plottype: 2,

              // Show price line
              trackPrice: true,

              transparency: 40,

              // Set the plotted line color to dark red
              color: '#880000'
            }
          },

          // Precision is set to one digit, e.g. 777.7
          precision: 1,

          inputs: {}
        },
        styles: {
          plot_0: {
            // Output name will be displayed in the Style window
            title: 'Equity value',
            histogramBase: 0
          }
        },
        inputs: []
      },

      constructor: function() {
        this.init = function(context, inputCallback) {
          this._context = context;
          this._input = inputCallback;

          var symbol = 'BINANCE:BTC-USDT';
          this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
        };

        this.main = function(context, inputCallback) {
          this._context = context;
          this._input = inputCallback;

          this._context.select_sym(1);

          var v = PineJS.Std.close(this._context);
          return [v];
        };
      }
    }
  ]);
};
