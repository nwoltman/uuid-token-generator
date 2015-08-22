'use strict';

/* jshint mocha: true */
/* jscs:disable requireBlocksOnNewline */

var KeyGenerator = require('../');
var should = require('should');

describe('KeyGenerator', function() {

  describe('new KeyGenerator(bitSize, baseEncoding)', function() {

    it('should accept 0 parameters', function() {
      var keygen = new KeyGenerator();
      keygen.should.be.an.instanceOf(KeyGenerator);
      keygen.bitSize.should.be.exactly(128);
      keygen.baseEncoding.should.be.exactly(KeyGenerator.BASE58);
    });

    it('should accept just a bitSize parameter', function() {
      var keygen = new KeyGenerator(256);
      keygen.bitSize.should.be.exactly(256);
      keygen.baseEncoding.should.be.exactly(KeyGenerator.BASE58);
    });

    it('should accept just a baseEncoding parameter', function() {
      var keygen = new KeyGenerator(KeyGenerator.BASE16);
      keygen.bitSize.should.be.exactly(128);
      keygen.baseEncoding.should.be.exactly(KeyGenerator.BASE16);
    });

    it('should accept both parameters', function() {
      var keygen = new KeyGenerator(512, KeyGenerator.BASE62);
      keygen.bitSize.should.be.exactly(512);
      keygen.baseEncoding.should.be.exactly(KeyGenerator.BASE62);
    });

    it('should accept a custom baseEncoding', function() {
      new KeyGenerator('123abc').baseEncoding.should.be.exactly('123abc');
      new KeyGenerator(512, '123abc').baseEncoding.should.be.exactly('123abc');
    });

    it('should throw if bitSize is not a positive integer that is a multiple of 128', function() {
      should.throws(function() { new KeyGenerator(-128); }, Error);
      should.throws(function() { new KeyGenerator(127); }, Error);
      should.throws(function() { new KeyGenerator(Infinity); }, Error);
      should.throws(function() { new KeyGenerator(true); }, Error);
    });

    it('should throw if baseEncoding is not a string', function() {
      should.throws(function() { new KeyGenerator(128, true); }, Error);
      should.throws(function() { new KeyGenerator(128, 256); }, Error);
      should.throws(function() { new KeyGenerator(128, {}); }, Error);
      should.throws(function() { new KeyGenerator(128, []); }, Error);
      should.throws(function() { new KeyGenerator(128, /regex/); }, Error);
      should.throws(function() { new KeyGenerator(128, new Date()); }, Error);
    });

  });


  describe('#bitSize', function() {

    it('should be the same value as is passed to the constructor', function() {
      new KeyGenerator().bitSize.should.be.exactly(128);
      new KeyGenerator(256).bitSize.should.be.exactly(256);
    });

  });


  describe('#baseEncoding', function() {

    it('should be the same value as is passed to the constructor', function() {
      new KeyGenerator().baseEncoding.should.be.exactly(KeyGenerator.BASE58);
      new KeyGenerator(KeyGenerator.BASE62).baseEncoding.should.be.exactly(KeyGenerator.BASE62);
    });

  });


  describe('#base', function() {

    it('should be the encoding base number (which is the length of the baseEncoding)', function() {
      new KeyGenerator().base.should.be.exactly(58);
      new KeyGenerator(KeyGenerator.BASE62).base.should.be.exactly(62);
      new KeyGenerator(256, '123abc').base.should.be.exactly(6);
    });

  });


  describe('#keyLength', function() {

    it('should be the maximum possible key length', function() {
      new KeyGenerator().keyLength.should.be.exactly(22);
      new KeyGenerator(256, KeyGenerator.BASE62).keyLength.should.be.exactly(43);
      new KeyGenerator(512, '01').keyLength.should.be.exactly(512);
    });

  });


  describe('#generateKey()', function() {

    it('should return a string', function() {
      new KeyGenerator().generateKey().should.have.type('string');
    });

    it('should generate a key with the specified bitSize and baseEncoding', function() {
      var keygen = new KeyGenerator();
      var key = keygen.generateKey();
      key.should.match(new RegExp('^[' + keygen.baseEncoding + ']{' + keygen.keyLength + '}$'));

      keygen = new KeyGenerator(KeyGenerator.BASE16);
      key = keygen.generateKey();
      key.should.match(new RegExp('^[' + keygen.baseEncoding + ']{' + keygen.keyLength + '}$'));

      keygen = new KeyGenerator('01');
      key = keygen.generateKey();
      key.should.match(new RegExp('^[' + keygen.baseEncoding + ']{' + keygen.keyLength + '}$'));

      keygen = new KeyGenerator(256);
      key = keygen.generateKey();
      key.should.match(new RegExp('^[' + keygen.baseEncoding + ']{' + keygen.keyLength + '}$'));

      keygen = new KeyGenerator(512, KeyGenerator.BASE62);
      key = keygen.generateKey();
      key.should.match(new RegExp('^[' + keygen.baseEncoding + ']{' + keygen.keyLength + '}$'));
    });

    it('should work if the generated UUID has leading zeros', function() {
      // Mock node-uuid.v4
      require('node-uuid').v4 = function(options, buffer, offset) {
        offset = offset || 0;
        buffer[offset] = 0;
        buffer[offset + 1] = 0;
        for (var i = 2; i < 16; i++) {
          buffer[offset + i] = (256 * Math.random()) | 0;
        }
      };
      var keygen = new KeyGenerator();
      var key = keygen.generateKey();
      key.should.match(new RegExp('^[' + keygen.baseEncoding + ']{' + keygen.keyLength + '}$'));
    });

  });

});
