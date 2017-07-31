# pretty-format [![Travis build status](http://img.shields.io/travis/thejameskyle/pretty-format.svg?style=flat)](https://travis-ci.org/thejameskyle/pretty-format)

> Stringify any JavaScript value.

- Supports [all built-in JavaScript types](#type-support)
- [Blazingly fast](https://gist.github.com/thejameskyle/2b04ffe4941aafa8f970de077843a8fd) (similar performance to v8's `JSON.stringify` and significantly faster than Node's `util.format`)
- Plugin system for extending with custom types (i.e. [`ReactTestComponent`](#reacttestcomponent-plugin))


## Installation

```sh
$ npm install pretty-format
```

## Usage

```js
var prettyFormat = require('pretty-format');

var obj = { property: {} };
obj.circularReference = obj;
obj[Symbol('foo')] = 'foo';
obj.map = new Map();
obj.map.set('prop', 'value');
obj.array = [1, NaN, Infinity];

console.log(prettyFormat(obj));
```

**Result:**

```js
Object {
  "property": Object {},
  "circularReference": [Circular],
  "map": Map {
    "prop" => "value"
  },
  "array": Array [
    1,
    NaN,
    Infinity
  ],
  Symbol(foo): "foo"
}
```

#### Type Support

`Object`, `Array`, `ArrayBuffer`, `DataView`, `Float32Array`, `Float64Array`, `Int8Array`, `Int16Array`, `Int32Array`, `Uint8Array`, `Uint8ClampedArray`, `Uint16Array`, `Uint32Array`, `arguments`, `Boolean`, `Date`, `Error`, `Function`, `Infinity`, `Map`, `NaN`, `null`, `Number`, `RegExp`, `Set`, `String`, `Symbol`, `undefined`, `WeakMap`, `WeakSet`

### Plugins

Pretty format also supports adding plugins:

```js
var fooPlugin = {
  test: function(val) {
    return val && val.hasOwnProperty('foo');
  },
  print: function(val, print, indent) {
    return 'Foo: ' + print(val.foo);
  }
};

var obj = { foo: { bar: {} } };

prettyFormat(obj, {
  plugins: [fooPlugin]
});
// Foo: Object {
//   "bar": Object {}
// }
```

#### `ReactTestComponent` plugin

```js
var prettyFormat = require('pretty-format');
var reactPlugin = require('pretty-format/plugins/ReactTestComponent');

var React = require('react');
var renderer = require('react/lib/ReactTestRenderer');

var jsx = React.createElement('h1', null, 'Hello World');

prettyFormat(renderer.create(jsx).toJSON(), {
  plugins: [reactPlugin]
});
// <h1>
//   Hello World
// </h1>
```
