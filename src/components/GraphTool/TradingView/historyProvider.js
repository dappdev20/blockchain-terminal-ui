import { HISTORICAL_DATA_URL } from '@/config/constants';

export const INTERVAL_MAP = {
  1: '1m',
  5: '5m',
  15: '15m',
  60: '1h',
  360: '6h',
  D: '1d'
};

export default {
  history: {},

  getBars: (symbolInfo, resolution, from, to /* addiontal Params: first, limit */) => {
    const split_symbol = symbolInfo.full_name.split(/[:-]/);

    const url = HISTORICAL_DATA_URL.replace('@marketId', `${split_symbol[1]}-${split_symbol[2]}`)
      .replace('@tsBeg', from * 1000)
      .replace('@tsEnd', to * 1000)
      .replace('@interval', INTERVAL_MAP[resolution])
      .replace('@exchangeId', (split_symbol[0] || '').toLowerCase());

    return fetch(url).then(res => res.json());
  }
};
