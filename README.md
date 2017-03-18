# UUID Token Generator

[![NPM Version](https://img.shields.io/npm/v/uuid-token-generator.svg)](https://www.npmjs.com/package/uuid-token-generator)
[![Build Status](https://travis-ci.org/nwoltman/uuid-token-generator.svg?branch=master)](https://travis-ci.org/nwoltman/uuid-token-generator)
[![Coverage Status](https://coveralls.io/repos/nwoltman/uuid-token-generator/badge.svg?branch=master&service=github)](https://coveralls.io/github/nwoltman/uuid-token-generator?branch=master)
[![Dependency Status](https://david-dm.org/nwoltman/uuid-token-generator.svg)](https://david-dm.org/nwoltman/uuid-token-generator)
[![devDependency Status](https://david-dm.org/nwoltman/uuid-token-generator/dev-status.svg)](https://david-dm.org/nwoltman/uuid-token-generator#info=devDependencies)

Provides a class that generates random tokens with custom size and base-encoding using the [RFC 4122](http://www.ietf.org/rfc/rfc4122.txt) v4 UUID algorithm. Generated tokens are strings that are guaranteed to always be the same length, depending on the [bit-size](#new-tokgeneratorbitsize-baseencoding--object) specified for the token.

Great for generating things like API keys and compact UIDs.

---
### WARNING
---

**This package is no longer being maintained because a better one exists—[uid-generator](https://www.npmjs.com/package/uid-generator)—which is better for the following reasons:**

+ **It has more flexible token generation options**
  + **i.e. You can specify the length of the token that you'd like to generate**
+ **It has both a synchronous and asynchronous interface**
+ **It is less likely to produce colliding tokens**
+ **It's more performant**

---


## Installation

```sh
npm install uuid-token-generator --save
```


## Usage

```js
const TokenGenerator = require('uuid-token-generator');

const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
tokgen.generate();
// -> '4QhmRwHwwrgFqXULXNtx4d'

const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
tokgen2.generate();
// -> 'x6GCX3aq9hIT8gjhvO96ObYj0W5HBVTsj64eqCuVc5X'
```


## API

### new TokenGenerator([bitSize][, baseEncoding]) ⇒ `Object`
Creates a new TokenGenerator instance that generates `bitSize`-bit tokens encoded using the characters in `baseEncoding`.

| Param | Default | Type | Description |
|:------|:--------|:-----|:------------|
| [bitSize] | `128` | number | The size of the token to generate in bits. Must be a multiple of 128. |
| [baseEncoding] | `TokenGenerator.BASE58` | string | One of the `TokenGenerator.BASE##` constants or a custom string of characters to use to encode the token. |

**Example**
```js
new TokenGenerator();
new TokenGenerator(256);
new TokenGenerator(TokenGenerator.BASE36);
new TokenGenerator(512, TokenGenerator.BASE62);
new TokenGenerator('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'); // Custom encoding (base64)
```

---

### TokenGenerator.BASE16 : `String`
`0123456789abcdef`

### TokenGenerator.BASE36 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`

### TokenGenerator.BASE58 : `String`
`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`

### TokenGenerator.BASE62 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

### TokenGenerator.BASE66 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~`

(all ASCII characters that do not need to be encoded in a URI as specified by [RFC 3986](http://tools.ietf.org/html/rfc3986))

### TokenGenerator.BASE71 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!'()*-._~`

(all ASCII characters that are not encoded by `encodeURIComponent()`)

---

### tokgen.generate() ⇒ `String`
Generates a random token.

**Returns**: `String` - A random token that is always `tokgen.tokenLength` characters long.

**Example**
```js
const tokgen = new TokenGenerator();
tokgen.generate();
// -> 'vf5NrETkUKCa6FhkyRSazD'
```

---

### (readonly) tokgen.bitSize : `Number`
The size of the token that will be generated in bits (the `bitSize` value passed to the `TokenGenerator` constructor).

**Example**
```js
new TokenGenerator().bitSize // -> 128
new TokenGenerator(256).bitSize // -> 256
```

### (readonly) tokgen.baseEncoding : `String`
The set of characters used to encode the token (the `baseEncoding` value passed to the `TokenGenerator` constructor).

**Example**
```js
new TokenGenerator().baseEncoding // -> '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
new TokenGenerator('abc').baseEncoding // -> 'abc'
```

### (readonly) tokgen.base : `Number`
The base of the token that will be generated (which is the number of characters in the `baseEncoding`).

**Example**
```js
new TokenGenerator().base // -> 58
new TokenGenerator(TokenGenerator.BASE62).base // -> 62
new TokenGenerator('abc').base // -> 3
```

### (readonly) tokgen.tokenLength : `Number`
The length of the token that will be generated. The generated token will always be this length.  
Calculated as such: `tokenLength = Math.ceil(bitSize / Math.log2(base))`

**Example**
```js
new TokenGenerator().tokenLength // -> 22
new TokenGenerator(256, TokenGenerator.BASE62).tokenLength // -> 43
```
