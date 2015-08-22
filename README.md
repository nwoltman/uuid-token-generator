# UUID Key Generator

[![NPM Version](https://img.shields.io/npm/v/uuid-key-generator.svg)](https://www.npmjs.com/package/uuid-key-generator)
[![Build Status](https://travis-ci.org/woollybogger/uuid-key-generator.svg?branch=master)](https://travis-ci.org/woollybogger/uuid-key-generator)
[![Coverage Status](https://coveralls.io/repos/woollybogger/uuid-key-generator/badge.svg?branch=master&service=github)](https://coveralls.io/github/woollybogger/uuid-key-generator?branch=master)
[![Dependency Status](https://david-dm.org/woollybogger/uuid-key-generator.svg)](https://david-dm.org/woollybogger/uuid-key-generator)
[![devDependency Status](https://david-dm.org/woollybogger/uuid-key-generator/dev-status.svg)](https://david-dm.org/woollybogger/uuid-key-generator#info=devDependencies)

Provides a class that generates random keys with custom size and base-encoding using the RFC4122 v4 UUID algorithm. Generated keys are strings that are guaranteed to always be the same length, depending on the specified bit-size of the key.

Great for generating things like API keys and compact IDs.


## Installation

```sh
npm install uuid-key-generator --save
```


## Usage

```js
var KeyGenerator = require('uuid-key-generator');

var keygen = new KeyGenerator(); // Default is a 128-bit key encoded in base58
keygen.generateKey();
// -> '4QhmRwHwwrgFqXULXNtx4d'

var keygen2 = new KeyGenerator(256, KeyGenerator.BASE62);
keygen2.generateKey();
// -> 'x6GCX3aq9hIT8gjhvO96ObYj0W5HBVTsj64eqCuVc5X'
```


## API

### new KeyGenerator([bitSize][, baseEncoding]) ⇒ `Object`
Creates a new KeyGenerator instance that generates `bitSize` keys encoded using the characters in `baseEncoding`.

| Param | Default | Type | Description |
|-------|---------|------|-------------|
| [bitSize] | `128` | Number | The size of the key to generate in bits. Must be a multiple of 128. |
| [baseEncoding] | `KeyGenerator.BASE58` | String | One of the `KeyGenerator.BASE##` constants or a custom string of characters to use to encode the key. |

**Example**
```js
new KeyGenerator();
new KeyGenerator(256);
new KeyGenerator(KeyGenerator.BASE36);
new KeyGenerator(512, KeyGenerator.BASE62);
new KeyGenerator('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'); // Custom encoding (base64)
```

---

### KeyGenerator.BASE16 : `String`
`0123456789abcdef`

### KeyGenerator.BASE36 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`

### KeyGenerator.BASE58 : `String`
`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`

### KeyGenerator.BASE62 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

---

### keygen.generateKey() ⇒ `String`
Generates a random key.

**Returns**: `String` - A random key that is always `keygen.keyLength` characters long.

**Example**
```js
var keygen = new KeyGenerator();
keygen.generateKey();
// -> 'vf5NrETkUKCa6FhkyRSazD'
```

---

### (readonly) keygen.bitSize : `Number`
The size of the key that will be generated in bits (the `bitSize` value passed to the `KeyGenerator` constructor).

### (readonly) keygen.baseEncoding : `String`
The set of characters used to encode the key (the `baseEncoding` value passed to the `KeyGenerator` constructor).

### (readonly) keygen.base : `Number`
The base of the key that will be generated (which is the number of characters in the `baseEncoding`).

### (readonly) keygen.keyLength : `Number`
The length of the key that will be generated. The generated key will always be this length.
