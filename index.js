'use strict';

var uuid = require('node-uuid');

// Polyfill Math.log2() if necessary
Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.log(2);
};

function KeyGenerator(bitSize, baseEncoding) {
  if (typeof bitSize === 'string') {
    baseEncoding = bitSize;
    bitSize = null;
  }

  bitSize = bitSize || 128;
  baseEncoding = baseEncoding || KeyGenerator.BASE58;

  if (bitSize % 128 !== 0 || bitSize < 0) {
    throw new Error('bitSize must be a positive integer that is a multiple of 128');
  }
  if (typeof baseEncoding !== 'string') {
    throw new Error('baseEncoding must be a string');
  }

  this.bitSize = bitSize;
  this.baseEncoding = baseEncoding;
  this.base = baseEncoding.length;
  this.keyLength = Math.ceil(bitSize / Math.log2(this.base));

  this._bytes = bitSize / 8;
}

KeyGenerator.BASE16 = '0123456789abcdef';
KeyGenerator.BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
KeyGenerator.BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
KeyGenerator.BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
KeyGenerator.BASE71 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!'()*-._~";

KeyGenerator.prototype.generateKey = function() {
  var buffer = new Buffer(this._bytes);
  var digits = [0];
  var i;
  var j;

  for (i = 0; i < this._bytes; i += 16) {
    uuid.v4(null, buffer, i);
  }

  if (this.baseEncoding === KeyGenerator.BASE16) {
    return buffer.toString('hex');
  }

  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) {
      digits[j] <<= 8;
    }

    digits[0] += buffer[i];

    var carry = 0;
    for (j = 0; j < digits.length; j++) {
      digits[j] += carry;
      carry = digits[j] / this.base | 0;
      digits[j] %= this.base;
    }

    while (carry) {
      digits.push(carry % this.base);
      carry = carry / this.base | 0;
    }
  }

  // Deal with leading zeros
  for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
    digits.push(0);
  }

  // Fill with random numbers to get the full key length
  while (digits.length < this.keyLength) {
    digits.push(this.base * Math.random() | 0);
  }

  // Convert digits to a string
  var key = '';
  for (i = 0; i < digits.length; i++) {
    key += this.baseEncoding[digits[i]];
  }

  return key;
};

module.exports = KeyGenerator;
