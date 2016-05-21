'use strict';

var TokenGenerator = require('../');

var should = require('should');
var uuid = require('node-uuid');

describe('TokenGenerator', function() {

  describe('new TokenGenerator(bitSize, baseEncoding)', function() {

    it('should accept 0 parameters', function() {
      var tokgen = new TokenGenerator();
      tokgen.should.be.an.instanceOf(TokenGenerator);
      tokgen.bitSize.should.be.exactly(128);
      tokgen.baseEncoding.should.be.exactly(TokenGenerator.BASE58);
    });

    it('should accept just a bitSize parameter', function() {
      var tokgen = new TokenGenerator(256);
      tokgen.bitSize.should.be.exactly(256);
      tokgen.baseEncoding.should.be.exactly(TokenGenerator.BASE58);
    });

    it('should accept just a baseEncoding parameter', function() {
      var tokgen = new TokenGenerator(TokenGenerator.BASE16);
      tokgen.bitSize.should.be.exactly(128);
      tokgen.baseEncoding.should.be.exactly(TokenGenerator.BASE16);
    });

    it('should accept both parameters', function() {
      var tokgen = new TokenGenerator(512, TokenGenerator.BASE62);
      tokgen.bitSize.should.be.exactly(512);
      tokgen.baseEncoding.should.be.exactly(TokenGenerator.BASE62);
    });

    it('should accept a custom baseEncoding', function() {
      new TokenGenerator('123abc').baseEncoding.should.be.exactly('123abc');
      new TokenGenerator(512, '123abc').baseEncoding.should.be.exactly('123abc');
    });

    it('should throw if bitSize is not a positive integer that is a multiple of 128', function() {
      should.throws(function() { new TokenGenerator(-128); }, Error);
      should.throws(function() { new TokenGenerator(127); }, Error);
      should.throws(function() { new TokenGenerator(Infinity); }, Error);
      should.throws(function() { new TokenGenerator(true); }, Error);
    });

    it('should throw if baseEncoding is not a string', function() {
      should.throws(function() { new TokenGenerator(128, true); }, Error);
      should.throws(function() { new TokenGenerator(128, 256); }, Error);
      should.throws(function() { new TokenGenerator(128, {}); }, Error);
      should.throws(function() { new TokenGenerator(128, []); }, Error);
      should.throws(function() { new TokenGenerator(128, /regex/); }, Error);
      should.throws(function() { new TokenGenerator(128, new Date()); }, Error);
    });

  });


  describe('#bitSize', function() {

    it('should be the same value as is passed to the constructor', function() {
      new TokenGenerator().bitSize.should.be.exactly(128);
      new TokenGenerator(256).bitSize.should.be.exactly(256);
    });

  });


  describe('#baseEncoding', function() {

    it('should be the same value as is passed to the constructor', function() {
      new TokenGenerator().baseEncoding.should.be.exactly(TokenGenerator.BASE58);
      new TokenGenerator(TokenGenerator.BASE62).baseEncoding.should.be.exactly(TokenGenerator.BASE62);
    });

  });


  describe('#base', function() {

    it('should be the encoding base number (which is the length of the baseEncoding)', function() {
      new TokenGenerator().base.should.be.exactly(58);
      new TokenGenerator(TokenGenerator.BASE62).base.should.be.exactly(62);
      new TokenGenerator(256, '123abc').base.should.be.exactly(6);
    });

  });


  describe('#tokenLength', function() {

    it('should be the maximum possible token length', function() {
      new TokenGenerator().tokenLength.should.be.exactly(22);
      new TokenGenerator(256, TokenGenerator.BASE62).tokenLength.should.be.exactly(43);
      new TokenGenerator(512, '01').tokenLength.should.be.exactly(512);
    });

  });


  describe('#generate()', function() {

    it('should return a string', function() {
      new TokenGenerator().generate().should.have.type('string');
    });

    it('should generate a token with the specified bitSize and baseEncoding', function() {
      var tokgen = new TokenGenerator();
      var token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));

      tokgen = new TokenGenerator(TokenGenerator.BASE16);
      token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));

      tokgen = new TokenGenerator('01');
      token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));

      tokgen = new TokenGenerator(256);
      token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));

      tokgen = new TokenGenerator(512, TokenGenerator.BASE62);
      token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));
    });

    it('should produce a token of the correct length even if the uuid function returns a small token value', function() {
      // Mock node-uuid.v4
      uuid.v4 = function(options, buffer, offset) {
        offset = offset || 0;
        for (var i = 0; i < 16; i++) {
          buffer[offset + i] = 1;
        }
      };
      var tokgen = new TokenGenerator(256);
      var token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));
    });

    it('should work if the generated UUID has leading zeros', function() {
      // Mock node-uuid.v4
      uuid.v4 = function(options, buffer, offset) {
        offset = offset || 0;
        buffer[offset] = 0;
        buffer[offset + 1] = 0;
        for (var i = 2; i < 16; i++) {
          buffer[offset + i] = 256 * Math.random() | 0;
        }
      };
      var tokgen = new TokenGenerator();
      var token = tokgen.generate();
      token.should.match(new RegExp('^[' + tokgen.baseEncoding + ']{' + tokgen.tokenLength + '}$'));
    });

  });

});
