/* eslint-disable */

const webCrypto = window.crypto && (window.crypto.subtle || window.crypto.webkitSubtle);
let useSha256Crypto = webCrypto && webCrypto.digest !== undefined;

function convertToUint8Array(bytes) {
  if (bytes.buffer !== undefined) {
    return bytes;
  }

  return new Uint8Array(bytes);
}

function bytesToWords(bytes) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }
  let len = bytes.length;
  let words = [];
  let i;
  for (i = 0; i < len; i++) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }

  return new CryptoJS.lib.WordArray.init(words, len);
}

function bytesFromWords(wordArray) {
  let words = wordArray.words;
  let sigBytes = wordArray.sigBytes;
  let bytes = [];

  for (let i = 0; i < sigBytes; i++) {
    bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
  }

  return bytes;
}

function sha256HashSync(bytes) {
  let hashWords = CryptoJS.SHA256(bytesToWords(bytes));

  return bytesFromWords(hashWords);
}

function sha256Hash(bytes) {
  return new Promise((resolve, reject) => {
    try {
      if (useSha256Crypto) {
        const bytesTyped = Array.isArray(bytes) ? convertToUint8Array(bytes) : bytes;
        webCrypto.digest({ name: 'SHA-256' }, bytesTyped).then(
          function(digest) {
            resolve(digest);
          },
          function(e) {
            console.error('Crypto digest error', e);
            useSha256Crypto = false;
            resolve(sha256HashSync(bytes));
          }
        );
      } else {
        resolve(sha256HashSync(bytes));
      }
    } catch (err) {
      reject(err);
    }
  });
}

function bufferConcat(buffer1, buffer2) {
  let l1 = buffer1.byteLength || buffer1.length;
  let l2 = buffer2.byteLength || buffer2.length;
  let tmp = new Uint8Array(l1 + l2);

  tmp.set(buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1, 0);
  tmp.set(buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2, l1);

  return tmp.buffer;
}

function makePasswordHash(salt, password) {
  let passwordUTF8 = unescape(encodeURIComponent(password));
  let buffer = new ArrayBuffer(passwordUTF8.length);
  let byteView = new Uint8Array(buffer);

  for (let i = 0, len = passwordUTF8.length; i < len; i++) {
    byteView[i] = passwordUTF8.charCodeAt(i);
  }

  buffer = bufferConcat(bufferConcat(salt, byteView), salt);

  return sha256Hash(buffer);
}

export default makePasswordHash;

export {
  convertToUint8Array,
  bytesToWords,
  bytesFromWords,
  sha256Hash,
  sha256HashSync,
  bufferConcat,
  makePasswordHash
};
