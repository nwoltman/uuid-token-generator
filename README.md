# UUID Key Generator

#### This module has been deprecated in favour of [uuid-token-generator](https://www.npmjs.com/package/uuid-token-generator). Please note that there are [breaking changes](https://github.com/nwoltman/uuid-token-generator/releases/tag/v0.4.0) when upgrading to `uuid-token-generator`.

#### However, you should probably use [uid-generator](https://www.npmjs.com/package/uid-generator) instead since it allows for more customization in the tokens it generates and does not produce overlapping UIDs.

---

Provides a class that generates random keys with custom size and base-encoding using the [RFC4122](http://www.ietf.org/rfc/rfc4122.txt) v4 UUID algorithm. Generated keys are strings that are guaranteed to always be the same length, depending on the [bit-size](#new-keygeneratorbitsize-baseencoding--object) specified for the key.

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
Creates a new KeyGenerator instance that generates `bitSize`-bit keys encoded using the characters in `baseEncoding`.

| Param | Default | Type | Description |
|:------|:--------|:-----|:------------|
| [bitSize] | `128` | number | The size of the key to generate in bits. Must be a multiple of 128. |
| [baseEncoding] | `KeyGenerator.BASE58` | string | One of the `KeyGenerator.BASE##` constants or a custom string of characters to use to encode the key. |

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

### KeyGenerator.BASE71 : `String`
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!'()*-._~`

(all ASCII characters that are not escaped by `encodeURIComponent()`)

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
Calculated as such: `keyLength = Math.ceil(bitSize / Math.log2(base))`
