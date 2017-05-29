---
title: "Universal Rendering"
---

Universal rendering, or the artist formerly known as isomorphic rendering. The idea here is that you server-side prerender your code so that when it gets down to the client, your browser can __instantly__ show the markup while your app bootstraps in the background. It makes everything feel very instantaneous.

With just vanilla React, universal rendering is a cinch. Check out the [whole node file from another one of my workshops][es6-react]. It does server-side rendering in just a few lines.

It's not quite so simple now that we have routing involved. We don't want to have to duplicate all of our routing info that we wrote for react-router. Rather, if possible, we just want to reuse the routes we already built for react-router. So let's do that (with some refactoring.)

First thing you typically need to do when getting ready to implements server-side rendering (SSR) is split browser concerns and app concerns. The key is anything in the _initial render path_ cannot reference anything in the DOM or window. We can't make AJAX calls, reference the window, or anything else browser specific. All the browser specific code has to live in ClientApp.jsx (which won't get included in Node,) componentDidMount (which doesn't get called,) or behind some sort of `if (window)` conditional.

We're pretty close to good as is. The only thing we need to do is move BrowserRouter from App to ClientApp. In Node we'll use a ServerRouter so we need the Browser one to only to get included client-side. So remove BrowserRouter from App altogether and wrap the `<App />` in the render call in ClientApp with `<BrowserRouter></BrowserRouter>` (after importing it.)

That should be enough. ClientApp should look like:

```javascript
// @flow

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const renderApp = () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('app')
  );
};
renderApp();

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}
```

You may still have the Perf stuff in there. At this point you should take it out.

Now all browser concerns lie in ClientApp and the general app has been split out and is ready to be server renderered. We'll use a special ServerRouter for server rendering so that's why we put the BrowserRouter inside of ClientApp.

Okay, now we need to go make it so that index.html can be used as a template. There `Number.POSITIVE_INFINITY` ways of doing this, I'm just going to show you one (hopefully easy) way of doing it: with Lodash. First go add the `<%= body %>` template tag to index.html inside of `#app` like so:

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>svideo</title>
  <link rel="stylesheet" href="/public/style.css" />
</head>
<body>
  <div id="app"><%= body %></div>
  <&NegativeMediumSpace;script src="/public/bundle.js"></script>
</body>
</html>
```

This is [Lodash-specific templating][lodash]. We'll use it as we server-side render.

Go to .babelrc and add env, for server. For now it'll be the same as test (since we need Babel to make the modules to CommonJS here too) but we don't want to tie those together.

```json
{
  "presets": [
    "react",
    ["env", {
      "targets": {
        "browsers": "last 2 versions"
      },
      "loose": true,
      "modules": false
    }]
  ],
  "plugins": [
    "react-hot-loader/babel",
    "babel-plugin-transform-decorators-legacy",
    "babel-plugin-transform-class-properties"
  ],
  "env": {
    "server": {
      "plugins": ["transform-es2015-modules-commonjs"]
    },
    "test": {
      "plugins": ["transform-es2015-modules-commonjs"]
    }
  }
}
```

Okay, let's create a server now! Create a server.js *outside* the js folder and put it just in the root directory of your project. Put:

```javascript
/* eslint no-console:0 */
require('babel-register');

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router-dom');
const _ = require('lodash');
const fs = require('fs');
const App = require('./js/App').default;

const StaticRouter = ReactRouter.StaticRouter;
const port = 8080;
const baseTemplate = fs.readFileSync('./index.html');
const template = _.template(baseTemplate);

const server = express();

server.use('/public', express.static('./public'));

server.use((req, res) => {
  const context = {};
  const body = ReactDOMServer.renderToString(
    React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App))
  );

  if (context.url) {
    res.redirect(context.url);
  }

  res.write(template({ body }));
  res.end();
});

console.log(`listening on ${port}`);
server.listen(port);
```

We're switching back to CommonJS here to work with Node; Node doesn't natively understand ES6 modules so we need to use CommonJS. We require in a bunch of stuff. We're using Lodash templates but that's a detail; I just did it since it's an easy way to template. There's ten billion other ways to do it. We do some static serving for our CSS and bundled JS. And then we do the magic of server side rendering.

The context object we're feeding into the StaticRouter is to handle the 404 and redirect cases.

babel-register at the top lets us require modules that need transpilation.

Okay. Let's run the app. Run in your CLI `npm run build` (to build your bundle) then run `NODE_ENV=server node server.js`. Make sure you re-run build because the webpack-dev-server doesn't necessarily re-write out the bundle.js. Okay, so now try going to localhost:5050. While you won't necessarily notice it loading quicker since you were developing locally, check out view source. You should see it ships with a bunch of markup which means your page will load _much_ quicker on a slower connection since markup will start rendering before the JS is done downloading.

Congrats! You've done server-side rendering! Now, we messed up hot module reload. It'd be great if we didn't have to choose between SSR and HMR. And we don't! Let's go include that too. First go to your webpack config and let's change just one thing:

```javascript
// replace the entry:
entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './js/ClientApp.jsx'],
```

We need webpack to look for the webpack middleware instead of the dev server. After doing this, the dev server will not work and you can only use the server version. So let's go make the server work as well.

```javascript
// more includes
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const config = require('./webpack.config');


// after the creation of server, before server.use('public' …)
const compiler = webpack(config);
server.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);
server.use(webpackHotMiddleware(compiler));
```

Now you should be able to run `NODE_ENV=server node server.js` (or however you set environment variables in your shell, this works for bash) and get SSR and HMR! Let's go modify our dev command in package.json to use our server instead of webpack-dev-server.

```json
"dev": "NODE_ENV=server nodemon server.js",
```

[Nodemon][nodemon] is a dev helper tool that will automatically restart the server that we make changes to server.js. Shouldn't need it now but it's useful once you want to start changing server.js. So now try `yarn dev` and see if it works (make sure your webpack-dev-server is not running.) You should see everything working as expected.

[es6-react]: https://github.com/btholt/es6-react-pres/blob/master/completed/app.js
[lodash]: https://lodash.com/docs#template
[nodemon]: https://github.com/remy/nodemon
