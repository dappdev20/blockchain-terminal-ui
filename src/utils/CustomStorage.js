export default {
  isKeyExist: key => {
    return localStorage.getItem(key) !== null;
  },

  get: key => {
    return new Promise(resolve => {
      resolve(localStorage.getItem(key));
    });
  },

  set: (key, val) => {
    return new Promise(resolve => {
      resolve(localStorage.setItem(key, val));
    });
  },

  remove: (...keys) => {
    return new Promise(resolve => {
      for (let i = 0; i < keys.length; i++) {
        localStorage.removeItem(keys[i]);
      }

      resolve();
    });
  },

  clear: () => {
    return new Promise(resolve => {
      resolve(localStorage.clear());
    });
  }
};
