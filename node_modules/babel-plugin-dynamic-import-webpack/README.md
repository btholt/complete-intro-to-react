# babel-plugin-dynamic-import-webpack

Babel plugin to transpile `import()` to `require.ensure`, for Webpack.

**NOTE:** Babylon v6.12.0 is required to correct parse dynamic imports.

## Installation

```sh
$ npm install babel-plugin-dynamic-import-webpack --save-dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["dynamic-import-webpack"]
}
```

### Via CLI

```sh
$ babel --plugins dynamic-import-webpack script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["dynamic-import-webpack"]
});
```
