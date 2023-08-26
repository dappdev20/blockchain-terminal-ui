/**
 * Import required polyfills from core-js based on browserlist key defined
 * in the package.json
 */
if (process.env.NODE_ENV === 'production') {
  require('@babel/polyfill');
}
if (typeof window !== 'undefined') {
  require('intersection-observer');
}
if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}
require('isomorphic-fetch');
// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');
// window.localStorage is not assignable so we use a ref which CAN be assigned
// to polyfill for cookies disabled or to localStorage itself
// NOTE: must remain ES5 for to compile for server builds
window.localStorageRef = navigator.cookieEnabled
  ? window.localStorage
  : (function storageSimile() {
    var store = {};
    return {
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      removeItem: function (key) {
        delete store[key];
      },
      clear: function () {
        store = {};
      }
    };
  })();
// window.sessionStorage is not assignable so we use a ref which CAN be assigned
// to polyfill for cookies disabled or to sessionStorage itself
// NOTE: must remain ES5 for to compile for server builds
window.sessionStorageRef = navigator.cookieEnabled
  ? window.sessionStorage
  : (function storageSimile() {
    var store = {};
    return {
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      removeItem: function (key) {
        delete store[key];
      },
      clear: function () {
        store = {};
      }
    };
  })();