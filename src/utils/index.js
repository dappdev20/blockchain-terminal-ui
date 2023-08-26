/* eslint-disable no-bitwise */
/* eslint-disable no-fallthrough */
import React, { Fragment } from 'react';
import decode from 'jwt-decode';
import moment from 'moment';
import get from 'lodash.get';
import isMobile from 'is-mobile';
import { round } from 'mathjs/number';
import { refreshSecurityToken } from '../lib/sms-auth';

export const splitAmtOnDecimal = amt => {
  // whole number case; returns empty string as digitsAfterDecimal
  if (amt.toString() === parseFloat(amt).toFixed(0)) {
    return [amt.toString(), ''];
  }

  const [digitsBeforeDecimal, digitsAfterDecimal] = amt.toString().split('.');
  return [digitsBeforeDecimal, digitsAfterDecimal];
};

export const roundToFixedNum = (amt, decimals) => {
  const roundedNum = round(amt, decimals);
  return roundedNum.toFixed(decimals);
};

export const fillUntil = (limit = 0, mapFn) => {
  let i = -1;
  const items = [];
  while (++i < limit) items.push(mapFn(i));
  return items;
};

export const pageIsVisible = (() => {
  let hidden;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
  }

  return () => !document[hidden];
})();

export const invokeAll = (...fns) => (...args) => fns.forEach(fn => fn(...args));

/**
 * Function returning a new array sorted by time ascending or descending
 *
 * @param {String} [path]
 * Dot or bracket-notation object path string.
 *
 * @param {Array} list
 * Array to sort.
 *
 * @param {Boolean} desc
 * flag for sorting list ascending or descending
 *
 * @return {Array}
 * Array sorted by time.
 */

export const sortObjectArray = (path, list, desc = false) => {
  return [].concat(list).sort(function sort(a, b) {
    return desc
      ? new Date(get(a, path, a)).getTime() - new Date(get(b, path, b)).getTime()
      : new Date(get(b, path, b)).getTime() - new Date(get(a, path, a)).getTime();
  });
};

export const getISODate = date => {
  return new Date(date).toISOString();
};

export const withValueFromEvent = (fn, { target: { value = '' } }) =>
  fn(typeof value === 'string' ? value.trim() : value.toFixed(4));

export const isUrlContain = text => {
  return new RegExp(
    '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?'
  ).test(text);
};

export const formatCoinString = (string, num) =>
  parseFloat(string).toLocaleString('en-US', {
    minimumFractionDigits: num,
    maximumFractionDigits: num
  });

export const formatString = (string, digits = 4, useGrouping = true) =>
  parseFloat(string).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping
  });

/**
 * Format fiat value with 2 decimals
 *
 * ex:
 * input 1.2345 -> output 1.23
 * input 0.0012 -> output 1.2m
 * input 0.0000012 -> output 1.2µ
 * input 0.0000000012 -> output 1.2n
 *
 * @param {String} input
 * @param {Number} digits
 * @param {Boolean} useGrouping
 * @return {Object}
 */
export const formatFiatString = (input, digits = 2, useGrouping = true) => {
  let inputValue = input;
  let unitPrefix = '';

  if (input > 0.01) {
    inputValue = input;
  } else if (input > 0.00001) {
    inputValue = input * 1000;
    unitPrefix = 'm';
  } else if (input > 0.00000001) {
    inputValue = input * 1000000;
    unitPrefix = 'µ';
  } else if (input > 0.00000000001) {
    inputValue = input * 1000000000;
    unitPrefix = 'n';
  } else {
    inputValue = 0;
    unitPrefix = '';
  }

  const unitValue =
    inputValue === 0
      ? 0
      : parseFloat(inputValue).toLocaleString('en-US', {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
          useGrouping
        });
  return {
    unitValue,
    unitPrefix
  };
};

// If input has trailing zeros, cut them as long as original does not have more decimals
// ex: input: 1.0000, original: 1.0000001, then do not cut
// input: 1.0000, original: 0.9999, then cut .0000
// input: 1.0000, original: 1, then cut .0000
export const trimTrailingZero = (input, original) => {
  // Get original decimal length
  let numOriginal = original;
  if (typeof numOriginal === 'string') {
    numOriginal = numOriginal.replace(',', '');
    numOriginal = Number.parseFloat(numOriginal) || 0;
  }
  const decimalOriginal = numOriginal - Number.parseInt(numOriginal);

  let numInput = input;
  if (typeof numInput === 'string') {
    numInput = numInput.replace(',', '');
    numInput = Number.parseFloat(numInput) || 0;
  }
  const decimalInput = numInput - Number.parseInt(numInput);

  if (decimalOriginal - decimalInput !== 0 && Number.parseInt(numOriginal) === Number.parseInt(numInput)) {
    return input;
  }

  // Get input decimal position
  const strInput = String(input);
  const decimalPosition = strInput.lastIndexOf('.');

  // If there is no decimal just return
  if (decimalPosition === -1) {
    return input;
  }

  // else cut 0s
  let i = strInput.length - 1;
  while (i >= 0 && strInput[i] === '0' && i > decimalPosition) {
    i--;
  }

  if (strInput[i] === '.') {
    i--;
  }

  return strInput.substr(0, i + 1);
};

/**
 * https://stackoverflow.com/a/51411377
 *
 * @param {String} locale
 * @param {String} separatorType - eather 'decimal' or 'group'
 */
export const getSeparator = (locale = 'en-US', separatorType = 'decimal') => {
  if (locale === 'en-US' && separatorType === 'decimal') {
    return '.';
  }
  const numberWithGroupAndDecimalSeparator = 1000.1;
  return Intl.NumberFormat(locale)
    .formatToParts(numberWithGroupAndDecimalSeparator)
    .find(part => part.type === separatorType).value;
};

export const formatStringMinMax = (string, min, max) =>
  trimTrailingZero(
    parseFloat(string).toLocaleString('en-US', {
      minimumFractionDigits: min,
      maximumFractionDigits: max
    }),
    string
  );

export const convertToFloat = input => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(/,/g, '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }
  return parseFloat(num);
};

export const format7DigitString = input => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  const decimals = parseInt(num).toString().length > 4 ? 2 : 5 - parseInt(num).toString().length;
  if (!!decimals) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }),
      input
    );
  }

  return trimTrailingZero(
    parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    input
  );
};

export const formatOrderBookDigitString = input => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  const decimals = parseInt(num).toString().length > 4 ? 2 : 7 - parseInt(num).toString().length;
  if (!!decimals) {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

let intervalscnt = 0;
let intervalmax = 5;
export const formatDepthIntervalString = num => {
  if (num === 0) {
    if (intervalscnt !== 0) {
      intervalmax = intervalscnt;
      intervalscnt = 0;
    }
    return '';
  }
  intervalscnt++;
  if (intervalscnt >= intervalmax) {
    return '';
  }

  const numBase = parseFloat(num.toExponential().split('e')[0]);
  const numPower = parseInt(num.toExponential().split('e')[1]);

  if (numPower < 0) {
    return num;
  }
  if (numPower < 3) {
    return num;
  }

  const thousandCnt = Math.floor(numPower / 3);
  const precision = (numBase || '').split('.')[1] ? (numBase || '').split('.')[1].length : 0;
  if (thousandCnt === 1) {
    const mainNumber = numBase * 10 ** (numPower - 3);
    const decimalDigits = precision - numPower + 3;
    if (decimalDigits < 0) {
      return `${mainNumber.toFixed(0)}K`;
    }
    return `${mainNumber.toFixed(decimalDigits)}K`;
  }

  const mainNumber = numBase * 10 ** (numPower - 6);
  const decimalDigits = precision - numPower + 6;
  if (decimalDigits < 0) {
    return `${mainNumber.toFixed(0)}MM`;
  }
  return `${mainNumber.toFixed(decimalDigits)}MM`;
};

export const formatTotalDigitString = (input, count) => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  let decimals = count - parseInt(num).toString().length;
  if (decimals < 0) {
    decimals = 0;
  }

  return trimTrailingZero(
    parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }),
    input
  );
};

export const format2DigitString = num => {
  return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatIntegerString = num => {
  return parseInt(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const format2DigitStringForDonut = num => {
  if (parseInt(num).toString().length > 1) {
    return parseInt(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  if (parseFloat(num) < 0.01) {
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

export const formatStringForMKTCAP = labelValue => {
  if (!labelValue) {
    return 0;
  }

  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? `${format2DigitString(Math.abs(Number(labelValue)) / 1.0e9)}B`
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? `${format2DigitString(Math.abs(Number(labelValue)) / 1.0e6)}M`
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? `${format2DigitString(Math.abs(Number(labelValue)) / 1.0e3)}K`
    : format2DigitString(Math.abs(Number(labelValue)));
};

const DIGIT_GAP_THRESHOLD = 6;
const DEFAULT_DIGIT_GAP_REDUCTION = 3;
const SUFFIXES = [
  {
    name: 'K',
    denominator: 1000,
    digitsThreshold: 3
  },
  {
    name: 'M',
    denominator: 1000000,
    digitsThreshold: 6
  },
  {
    name: 'B',
    denominator: 1000000000,
    digitsThreshold: 9
  }
];
const MAX_NUMBERS_TO_SHOW = 10;

export const customDigitFormatParts = (input, meta = {}) => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  const digitGapReduction = meta.digitsGap >= DIGIT_GAP_THRESHOLD ? DEFAULT_DIGIT_GAP_REDUCTION : 0;
  const digitLength = meta.intLength - digitGapReduction;

  let decimals = meta.fractionDigits;
  let suffix = '';
  if (meta.intLength > MAX_NUMBERS_TO_SHOW) {
    for (let i = 0; i < SUFFIXES.length; i++) {
      const current = SUFFIXES[i];
      if (digitLength > current.digitsThreshold) {
        if (decimals >= 3) {
          // don't apply denominator if there are enough decimals to display without denominator
          decimals -= 3;
        } else {
          suffix = current.name;
          num /= current.denominator;
          break;
        }
      }
    }
  }

  let resultNumber = parseFloat(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  let [integerPart = '', fractionalPart = ''] = `${resultNumber}`.split('.');

  const trailingZerosRegex = fractionalPart.match(/0+$/);
  const trailingZeros = trailingZerosRegex ? trailingZerosRegex[0] : '';

  if (trailingZeros) {
    fractionalPart = fractionalPart.slice(0, trailingZerosRegex.index);
  }

  resultNumber = `${integerPart}${!fractionalPart && !trailingZeros ? '' : `.${fractionalPart}`}`;

  const integerPartLength = integerPart.replace(/,/g, '').length;
  const leadingZeroesLength = Math.max(
    MAX_NUMBERS_TO_SHOW - integerPartLength - fractionalPart.length - trailingZeros.length - suffix.length,
    0
  );
  const leadingZeroes = '0'
    .repeat(leadingZeroesLength)
    .split('')
    .map((item, index) => {
      if ((integerPartLength + index) % 3 === 0) {
        return `${item},`;
      }
      return item;
    })
    .slice()
    .reverse()
    .join('');

  return {
    leadingZeroes,
    resultNumber,
    trailingZeros,
    suffix
  };
};

export const customDigitFormat = (input, count = 6) => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  const digitLength = parseInt(num).toString().length;

  if (digitLength > 9) {
    return `${formatTotalDigitString(num / 1000000000, count - 1)}B`;
  }
  if (digitLength > 6) {
    return `${formatTotalDigitString(num / 1000000, count - 1)}M`;
  }
  if (digitLength > 5) {
    return `${formatTotalDigitString(num / 1000, count - 1)}K`;
  }

  let decimals = count - digitLength;
  if (decimals < 0) {
    decimals = 0;
  }

  return trimTrailingZero(
    parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }),
    input
  );
};

export const customDigitFormatWithNoTrim = (input, count = 6, decimalCounts) => {
  let num = input;
  if (!num) return '';
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    } else {
      num = parseFloat(num);
    }
  }
  num = num.toFixed(count);

  const digitLength = parseInt(num).toString().length;

  if (digitLength > 9) {
    return `${formatTotalDigitString(num / 1000000000, count - 1)}B`;
  }
  if (digitLength > 6) {
    return `${formatTotalDigitString(num / 1000000, count - 1)}M`;
  }
  if (digitLength > 5) {
    return `${formatTotalDigitString(num / 1000, count - 1)}K`;
  }

  const decimals = decimalCounts || Math.max(0, count - digitLength);

  return parseFloat(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const customDigitFormatWithDecimals = (input, decimalCounts = 2) => {
  let num = input;
  if (!num) return '';
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    } else {
      num = parseFloat(num);
    }
  }

  const digitLength = parseInt(num).toString().length;

  if (digitLength > 9) {
    let bValue = num / 1000000000;
    bValue = parseFloat(bValue).toLocaleString('en-US', {
      minimumFractionDigits: decimalCounts,
      maximumFractionDigits: decimalCounts
    });
    return `${bValue}B`;
  }
  if (digitLength > 6) {
    let mValue = num / 1000000;
    mValue = parseFloat(mValue).toLocaleString('en-US', {
      minimumFractionDigits: decimalCounts,
      maximumFractionDigits: decimalCounts
    });
    return `${mValue}M`;
  }
  if (digitLength > 5) {
    let kValue = num / 1000;
    kValue = parseFloat(kValue).toLocaleString('en-US', {
      minimumFractionDigits: decimalCounts,
      maximumFractionDigits: decimalCounts
    });
    return `${kValue}K`;
  }

  return parseFloat(num).toLocaleString('en-US', {
    minimumFractionDigits: decimalCounts,
    maximumFractionDigits: decimalCounts
  });
};

export const customDigitFormatWithLengthAndDecimals = (input, numLength = 5, decimalCounts = 2) => {
  let num = input;
  if (!num) return '';
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    } else {
      num = parseFloat(num);
    }
  }

  const digitLength = parseInt(num).toString().length;

  let unitSymbol = '';
  let unitValue = num;

  if (digitLength > 9) {
    unitValue = num / 1000000000;
    unitSymbol = 'B';
  } else if (digitLength > 6) {
    unitValue = num / 1000000;
    if (parseInt(unitValue).toString().length + decimalCounts > numLength) {
      unitValue /= 1000;
      unitSymbol = 'B';
    } else {
      unitSymbol = 'M';
    }
  } else if (digitLength > 3) {
    unitValue = num / 1000;
    if (parseInt(unitValue).toString().length + decimalCounts > numLength) {
      unitValue /= 1000;
      unitSymbol = 'M';
    } else {
      unitSymbol = 'K';
    }
  } else if (parseInt(unitValue).toString().length + decimalCounts > numLength) {
    unitValue /= 1000;
    unitSymbol = 'K';
  }
  unitValue = parseFloat(unitValue).toLocaleString('en-US', {
    minimumFractionDigits: decimalCounts,
    maximumFractionDigits: decimalCounts
  });
  return `${unitValue}${unitSymbol}`;
};

export const customDigitFormatWithMaxDecimalPoints = (input, maxDecimals) => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  let decimals = parseFloat(num).toString().length - parseInt(num).toString().length - 1;
  if (decimals > maxDecimals) {
    decimals = maxDecimals;
  }

  if (decimals < 0) {
    decimals = 0;
  }

  return trimTrailingZero(
    parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }),
    input
  );
};

export const timeDiffShort = time => {
  const before = moment(time * 1000);

  if (before.isValid()) {
    const now = moment();

    // In same day, display HH:mm
    if (now.diff(before, 'days') < 1) {
      return before.format('h:mm A');
    }
    if (now.diff(before, 'weeks') < 1) {
      return before.format('ddd');
    }
    return before.format('MM/DD/YY');
  }

  return '';
};

export const stringToHslColor = (str, s, l) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const getItemColor = str => {
  const s = 40;
  const l = 50;
  const textColor = l > 70 ? '#555' : '#fff';
  const hexColor = stringToHslColor(str, s, l);

  return {
    hexColor,
    textColor
  };
};

export const getRandomInt = (min, max) => {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum)) + minimum; // The maximum is exclusive and the minimum is inclusive
};

export const capitalizeFirstLetter = input => {
  const string = input.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getDecimalPlaces = input => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 1;
    }
  }

  if (num < 0.001) {
    return 10 ** 7;
  }
  if (num < 0.01) {
    return 10 ** 6;
  }
  if (num < 0.1) {
    return 10 ** 5;
  }
  if (num < 1) {
    return 10 ** 4;
  }
  if (num < 10) {
    return 10 ** 3;
  }
  if (num < 100) {
    return 10 ** 2;
  }
  if (num < 1000) {
    return 10 ** 1;
  }
  if (num < 10000) {
    return 1;
  }
};

export const numberWithCommas = (input, fixed) => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }
  if (fixed) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: fixed,
        maximumFractionDigits: fixed
      }),
      input
    );
  }

  if (num < 0.001) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      }),
      input
    );
  }
  if (num < 0.01) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 7,
        maximumFractionDigits: 7
      }),
      input
    );
  }
  if (num < 0.1) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      input
    );
  }
  if (num < 1) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5
      }),
      input
    );
  }
  if (num < 10) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }),
      input
    );
  }
  if (num < 100) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }),
      input
    );
  }
  if (num < 1000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  if (num < 10000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  if (num < 100000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  const digitLength = parseInt(num).toString().length;
  let decimals = 7 - digitLength;

  if (decimals < 0) {
    decimals = 0;
  }

  return trimTrailingZero(
    parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }),
    input
  );
};

export const unifyDigitString = input => {
  let num = input;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  if (num < 0.001) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      }),
      input
    );
  }
  if (num < 0.01) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 7,
        maximumFractionDigits: 7
      }),
      input
    );
  }
  if (num < 0.1) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      input
    );
  }
  if (num < 1) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5
      }),
      input
    );
  }
  if (num < 10) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }),
      input
    );
  }
  if (num < 100) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }),
      input
    );
  }
  if (num < 1000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  if (num < 10000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  if (num < 100000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      input
    );
  }

  return customDigitFormat(num, 7);
};

export const getScreenDimensions = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};

export const getScreenInfo = withGridDimensions => {
  // DON'T ADD NEW CODE HERE
  // Create a separate function and use it
  const { width: screenWidth, height: screenHeight } = getScreenDimensions();

  const isMobileDevice = isMobile({ tablet: true });
  const isMobilePortrait = isMobileDevice ? screenWidth < screenHeight : false;
  const isMobileLandscape = isMobileDevice ? screenWidth >= screenHeight : false;
  const isSmallWidth = screenWidth < 850 && !isMobileDevice;

  let gridWidth;
  let gridHeight;
  let leftSidebarWidth;
  let leftSidebarHeight;
  if (withGridDimensions) {
    const GridElement = document.getElementById('grid');
    const LeftSidebarElement = document.getElementById('left-sidebar');
    gridWidth = (GridElement && GridElement.clientWidth) || screenWidth;
    gridHeight = (GridElement && GridElement.clientHeight) || screenHeight;
    leftSidebarWidth = (LeftSidebarElement && LeftSidebarElement.clientWidth) || screenWidth;
    leftSidebarHeight = (LeftSidebarElement && LeftSidebarElement.clientHeight) || screenHeight;
  }

  return {
    screenWidth,
    screenHeight,
    isMobileDevice,
    isMobilePortrait,
    isMobileLandscape,
    isSmallWidth,
    gridWidth,
    gridHeight,
    leftSidebarWidth,
    leftSidebarHeight
  };
};

export const unifyDigitStringLimit = input => {
  let num = input;
  let limit;
  const isMobile = getScreenInfo();
  const { screenWidth, isMobileDevice } = isMobile;
  if (typeof input === 'string') {
    num = input.replace(',', '');
    if (!Number.parseFloat(num)) {
      num = 0;
    }
  }

  if (num < 0.001) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      }),
      input
    );
  }
  if (num < 0.01) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 7,
        maximumFractionDigits: 7
      }),
      input
    );
  }
  if (num < 0.1) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }),
      input
    );
  }
  if (num < 1) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5
      }),
      input
    );
  }
  if (num < 10) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }),
      input
    );
  }
  if (num < 100) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }),
      input
    );
  }
  if (num < 1000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  if (num < 10000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      input
    );
  }
  if (num < 100000) {
    return trimTrailingZero(
      parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      input
    );
  }
  if (isMobileDevice || screenWidth < 1248) {
    limit = 6;
  } else {
    limit = 7;
  }

  return customDigitFormat(num, limit);
};

export const formatNegativeNumber = numStr => {
  if (numStr.indexOf('-') > -1) {
    return `-$${numStr.substr(1)}`;
  }
  return `+$${numStr}`;
};

export const formatNegativeNumberSecond = numStr => {
  const numString = format2DigitString(numStr);
  if (numString.indexOf('-') > -1) {
    return `- $${numString.substr(1)}`;
  }
  return `+ $${numString}`;
};

export const formatNegativeNumberWithCurrency = (numStr, currency, isDefaultCrypto) => {
  if (numStr.indexOf('-') > -1) {
    return !isDefaultCrypto ? `-${currency + numStr.substr(1)}` : `-${numStr.substr(1)}`;
  }
  return !isDefaultCrypto ? `+${currency + numStr}` : `+${numStr}`;
};

export const highlightSearchDom = (src, search) => {
  if (!src || !search) {
    return src;
  }

  const positions = [];
  try {
    const regex = new RegExp(search, 'gi');
    src.replace(regex, (match, offset) => {
      positions.push(offset);
    });
  } catch (e) {
    return src;
  }

  if (positions.length === 0) {
    return src;
  }

  const results = [];
  let endCursor = 0;

  for (let i = 0; i < positions.length; i++) {
    results.push(<Fragment key={`${i}t`}>{src.substring(endCursor, positions[i])}</Fragment>);
    results.push(
      <span className="highlight" key={`${i}s`}>
        {src.substring(positions[i], positions[i] + search.length)}
      </span>
    );
    endCursor = positions[i] + search.length;
  }

  results.push(src.substring(endCursor));
  return results;
};

export const getNumPadFont = digits => {
  if (digits < 3) {
    return {
      bigSize: 194,
      smallSize: 100
    };
  }
  if (digits < 5) {
    return {
      bigSize: 160,
      smallSize: 86
    };
  }
  if (digits < 7) {
    return {
      bigSize: 126,
      smallSize: 65
    };
  }
  if (digits < 9) {
    return {
      bigSize: 90,
      smallSize: 48
    };
  }
  if (digits < 11) {
    return {
      bigSize: 72,
      smallSize: 40
    };
  }
  if (digits < 13) {
    return {
      bigSize: 60,
      smallSize: 32
    };
  }
  if (digits < 15) {
    return {
      bigSize: 50,
      smallSize: 28
    };
  }
  if (digits < 17) {
    return {
      bigSize: 40,
      smallSize: 22
    };
  }
  if (digits < 19) {
    return {
      bigSize: 30,
      smallSize: 18
    };
  }
  return {
    bigSize: 24,
    smallSize: 16
  };
};

export const imageExists = (url, callback) => {
  const img = new Image();
  img.addEventListener('load', () => {
    callback(true);
  });
  img.addEventListener('error', () => {
    callback(false);
  });
  img.src = url;
};

export const isTokenExpired = token => {
  try {
    const now = Date.now() / 1000;
    const exp = decode(token).exp || now;
    return now >= exp;
  } catch (e) {
    return true;
  }
};

export const refreshToken = () => {
  return new Promise(resolve => {
    const authToken = localStorage.getItem('authToken');
    const deviceToken = localStorage.getItem('deviceToken') || '';

    if (authToken && isTokenExpired(authToken) && !isTokenExpired(deviceToken)) {
      refreshSecurityToken(deviceToken)
        .then(data => {
          const token = data.ok.sessionToken;
          const payload = decode(token);
          localStorage.setItem('authClientId', payload.sub || '');
          localStorage.setItem('authToken', token);
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const toFixedWithoutRounding = (num, fixed) => {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?'); // eslint-disable-line
  return (num || 0).toString().match(re)[0];
};

export const getDenoSymbol = deno => {
  if (deno > 8) {
    return {
      unit: 10 ** (deno - 9),
      unitSymbol: 'B'
    };
  }

  if (deno > 5) {
    return {
      unit: 10 ** (deno - 6),
      unitSymbol: 'M'
    };
  }

  if (deno > 2) {
    return {
      unit: 10 ** (deno - 3),
      unitSymbol: 'K'
    };
  }

  if (deno > -1) {
    return {
      unit: 10 ** deno,
      unitSymbol: ''
    };
  }

  if (deno > -4) {
    return {
      unit: 10 ** (deno + 3),
      unitSymbol: 'm'
    };
  }

  if (deno > -8) {
    return {
      unit: 1 / 10 ** (deno + 3),
      unitSymbol: 'm'
    };
  }

  return {
    unit: 10 ** (deno + 6),
    unitSymbol: 'μ'
  };
};

export const getUpperLowerValue = (balance = 0) => {
  const balanceStr = balance.toString().split('.');

  if (balance < 1) {
    return {
      upper: balanceStr[0] || '',
      lower: balanceStr[1] ? `.${balanceStr[1].substr(0, 4)}` : ''
    };
  }

  if (balance < 1000) {
    return {
      upper: balanceStr[0] || '',
      lower: balanceStr[1] ? `.${balanceStr[1].substr(0, 2)}` : ''
    };
  }

  if (balance < 1000000) {
    return {
      upper: `${Math.floor(balance / 1000)}`,
      lower: `,${Math.floor(balance)
        .toString()
        .substr(Math.floor(balance).toString().length - 3, 3)}`
    };
  }

  if (balance < 1000000000) {
    return {
      upper: `${Math.floor(balance / 1000000)}M`,
      lower: `.${Math.floor(balance % 1000000)
        .toString()
        .substr(0, 4)}`
    };
  }

  return {
    upper: `${Math.floor(balance / 1000000000)}B`,
    lower: `.${Math.floor(balance % 1000000000)
      .toString()
      .substr(0, 4)}`
  };
};

export const commafy = num => {
  const str = num.toString().split('.');
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  return str.join('.');
};

export const commafyDigitFormat = (num, digitLength) => {
  let str;
  const ePlus = num.toString().split('e+')[1];
  const eMinus = num.toString().split('e-')[1];
  let catenateSymbol = '';
  let decimalDigits = 0;
  if (ePlus) {
    decimalDigits = digitLength - 4;
    catenateSymbol = 'e+';
    str = num.toString().split(catenateSymbol);
    str[0] = parseFloat(str[0]).toFixed(decimalDigits);
  } else if (eMinus) {
    decimalDigits = digitLength - 4;
    catenateSymbol = 'e-';
    str = num.toString().split(catenateSymbol);
    str[0] = parseFloat(str[0]).toFixed(decimalDigits);
  } else {
    catenateSymbol = '.';
    const numPrecised = Number(num).toPrecision(digitLength);
    str = numPrecised.toString().split(catenateSymbol);
  }
  if (str[0].length >= 4 && catenateSymbol === '.') {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  return str.join(catenateSymbol);
};

export const noop = () => {};

const decimalSeparator = getSeparator();

export const getNumberParts = resultNumber => {
  let [integerPart = '', fractionalPart = ''] = `${resultNumber}`.split(decimalSeparator);

  const trailingZerosRegex = fractionalPart.match(/0+$/);
  const trailingZeros = trailingZerosRegex ? trailingZerosRegex[0] : '';

  if (trailingZeros) {
    fractionalPart = fractionalPart.slice(0, trailingZerosRegex.index);
  }

  return {
    integerPart,
    fractionalPart
  };
};

export const expo = (x, f) => {
  return Number.parseFloat(x).toExponential(f);
};

export const checkDateIsBetweenTwo = (date, startDate, endDate) => {
  let result = true;
  const now = new Date();
  if (startDate === undefined && endDate === undefined) {
    result = true;
  } else if (startDate === undefined && endDate !== undefined) {
    if (date < endDate) {
      result = true;
    } else {
      result = false;
    }
  } else if (startDate !== undefined && endDate === undefined) {
    if (date > startDate && date < now) {
      result = true;
    } else {
      result = false;
    }
  } else if (date > startDate && date < endDate) {
    result = true;
  } else {
    result = false;
  }
  return result;
};

/**
 * Get the proper number pairs for small values
 *
 * @param {Number} input
 * @return {Object}
 */
export const getProperValuePairs = input => {
  let value1 = 1;
  let value2 = input;

  if (input === 0) {
    value1 = 0;
    value2 = 0;
  } else if (input < 0.000001) {
    value1 = 1000000;
    value2 = input * 1000000;
  } else if (input < 0.001) {
    value1 = 1000;
    value2 = input * 1000;
  } else if (input < 0.01) {
    value1 = 1000;
    value2 = input * 1000;
  } else {
    value1 = 1;
    value2 = input;
  }

  return {
    leftValue: value1,
    rightValue: value2
  };
};
