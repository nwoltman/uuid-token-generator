'use strict';

const uuid = require('uuid');

class TokenGenerator {
  constructor(bitSize, baseEncoding) {
    if (typeof bitSize === 'string') {
      baseEncoding = bitSize;
      bitSize = null;
    }

    bitSize = bitSize || 128;
    baseEncoding = baseEncoding || TokenGenerator.BASE58;

    if (bitSize % 128 !== 0 || bitSize < 0) {
      throw new Error('bitSize must be a positive integer that is a multiple of 128');
    }
    if (typeof baseEncoding !== 'string') {
      throw new Error('baseEncoding must be a string');
    }

    this.bitSize = bitSize;
    this.baseEncoding = baseEncoding;
    this.base = baseEncoding.length;
    this.tokenLength = Math.ceil(bitSize / Math.log2(this.base));

    this._bytes = bitSize / 8;
  }

  generate() {
    const buffer = Buffer.allocUnsafe(this._bytes);
    var i;

    for (i = 0; i < this._bytes; i += 16) {
      uuid.v4(null, buffer, i);
    }

    if (this.baseEncoding === TokenGenerator.BASE16) {
      return buffer.toString('hex');
    }

    const digits = [0];

    for (i = 0; i < buffer.length; ++i) {
      var carry = buffer[i];

      for (var j = 0; j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % this.base;
        carry = (carry / this.base) | 0;
      }

      while (carry > 0) {
        digits.push(carry % this.base);
        carry = (carry / this.base) | 0;
      }
    }

    var token = digits.length < this.tokenLength
      ? this.baseEncoding[0].repeat(this.tokenLength - digits.length) // Leading zeros
      : '';

    i = digits.length;

    while (i--) {
      token += this.baseEncoding[digits[i]];
    }

    return token;
  }
}

TokenGenerator.BASE16 = '0123456789abcdef';
TokenGenerator.BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
TokenGenerator.BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
TokenGenerator.BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
TokenGenerator.BASE66 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~';
TokenGenerator.BASE71 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!'()*-._~";

module.exports = TokenGenerator;
