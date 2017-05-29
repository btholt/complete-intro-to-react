---
title: "Webpack Code-Splitting and Async Routing"
---

So far all of our routing with react-router has synchronous which makes sense. When we detect that a user has requested a route, we already have that route in our bundle.js and we render and serve that to them. The logic follows.

However, as our app grows and grows, our bundle.js is going to get bigger and bigger in file size. Wouldn't it be better if you were on Search that it served you _just_ the JavaScript you need for that page and none of the JS for Landing or Details? For example, Search doesn't need the axios client we brought in: that client can safely just be loaded on the Details page.

Enter webpack's code splitting ability. It's smart enough to know which files are required by which other files and thus if you choose to use webpack's async loading API (`import(…)`) then webpack will _automatically_ start chunking your JS for you. What's more is we don't have to write the glue code that will download the chunks as we need them: webpack just does this for us. All we have to do is identify the modules that can be async by treating them as if they were. Really cool.

So we're going to treat all of our routes as async and luckily react-router is already instrumented for this for both server and client-side. So let's go make it happen! We're going to be using to do this. There are many ways to do this; I've just found this easiest to teach you. People right now like [react-modules][modules] despite it having some issues with server-side rendering.

Let's go create a component that will handle our asynchronous routes to contain all that craziness. Create a file called AsyncRoute and go there.

```javascript
// @flow

import React from 'react';
import Spinner from './Spinner';

class AsyncRoute extends React.Component {
  state = {
    loaded: false
  };
  componentDidMount() {
    this.props.loadingPromise.then(module => {
      this.component = module.default;
      this.setState({ loaded: true });
    });
  }
  component = null;
  props: {
    props: mixed,
    loadingPromise: Promise<{ default: Class<React.Component<*, *, *>> }>
  };
  render() {
    if (this.state.loaded) {
      return <this.component {...this.props.props} />;
    }
    return <Spinner />;
  }
}

export default AsyncRoute;
```

AsyncRoute is going to passed a promise which will resolve to a module. Once that promise has completed, that means the module is loaded and available. Then we can render it. Notice that we stick the module on this and not into state. Modules are large and it would slow down our component to have so much state. Furthermore we don't expect it to change. Before that we'll render a loading state. That's all we're going to do with AsyncRoute.

Now we need to enable Babel, Webpack, and Node to all understand the `import(…)` syntax. This is brand new and only stage 3. Thus we need to include a few more plugins. We need one just so Babel can understand import at all, and one to transform so Webpack will know to split there. Add the following to the top level plugins array:

```javascript
"plugins": [
  "react-hot-loader/babel",
  "babel-plugin-syntax-dynamic-import",
  "babel-plugin-dynamic-import-webpack",
  "babel-plugin-transform-decorators-legacy",
  "babel-plugin-transform-class-properties"
],
```
Go to App.jsx

```javascript
// replace Landing Match
<Route exact path="/" component={props => <AsyncRoute props={props} loadingPromise={import('./Landing')} />} />
```

So now we're using our AsyncRoute function to make Landing Async. First we import our route. Then we pull in our AsyncRoute and use it inside of Route. This is amazing since Webpack knows to perform a code split here and we get all the rest of that for free.

Let's talk about what sucks about this. Now, server-side rendered or not, we get a loading screen first thing. No matter what. Ideally we get this loading screen _sooner_ but nonetheless that happens. There are ways around this but it involves either making some compromises by not server-side rendering properly and getting a [checksum violation][checksum] or by greatly increasing the complexity of this by introducing the concept of module hydration where on the server you make sure to send down the bundle and the correct chunk at the same time and detect that on the client. For now I'm happy just introducing code-splitting to our app for now.


Also, in order for import() (or [require.ensure][ensure], which is the CommonJS version) to be able to code split, the parameter passed to it must be a string of the path. It cannot be a variable. Webpack is doing static analsysis of your code and cannot follow variables.

Open up your browser to /search (without hitting / first) and watch the network tab. Make sure your npm run watch and your npm run start are both running. You should see bundle.js being downloaded but you should also see 0.bundle.js being downloaded too. This is the chunks that Webpack is sending down piecemeal, meaning your route and associated modules are not included in the initial payload. This becomes a bigger and bigger deal as your app expands. Let's finish the rest of our async routes.

```javascript
// delete Search and Details import

// replace Details and Search matches
<Route
  path="/search"
  component={props => (
    <AsyncRoute loadingPromise={import('./Search')} props={Object.assign({ shows: preload.shows }, props)} />
  )}
/>
<Route
  path="/details/:id"
  component={(props: { match: Match }) => {
    const selectedShow = preload.shows.find((show: Show) => props.match.params.id === show.imdbID);
    return (
      <AsyncRoute
        loadingPromise={import('./Details')}
        props={Object.assign({ show: selectedShow, match: {} }, props)}
      />
    );
  }}
/>
```

Nothing too crazy here either. Just extendingo out the same ideas. Now try navigating around your app and watch the network tab. You should different bundles being pulled in. If you look at your terminal output, you'll see we actually haven't optimized too much: our main bundle is nearly a megabyte and the smaller bundles are between three and fifty kilobytes. Like I said, this is wonderful for big apps where you can section off where dependencies. For example the fifty kilobyte bundle is the only one that has axios. The rest of the app doesn't need it. But for our tiny React routes, this isn't super useful. And the ability to codesplit isn't free either: Webpack includes some glue code to make this work. So evaluate this tool carefully!

Our problem now is that we've broken hot module reload. Unfortunately, with Webpack in the state it's a choose-two situation with code-spliting, hot module replacement, and server side rendering. You can set up two different webpack configs since you only need code splitting on the front end and you only need HMR in dev: I leave that to you.

Lastly, let's set up our build for production. Go modify build in package.json's scripts to be:

```json
"build": "webpack -p",
"build:dev": "webpack -d",
```

`-p` optimizes Webpack for production with Uglify and builds React in production mode. `-d` builds in debug mode and includes much more verbose logging. The sizes you see for `-p` are minified and uglified (including tree shaking) but are not gzipped. Usually your server does that automatically.

Go modify your Webpack config's devtool line to be

```javascript
devtool: process.env.NODE_ENV === 'development' ? 'cheap-eval-source-map' : false,
```

Source maps are huge and this will only ship them in dev. You'll also need to conditionally include the webpack middleware stuff: refactor to look like this:

```javascript
const path = require('path');
const webpack = require('webpack');

const config = {
  context: __dirname,
  entry: ['./js/ClientApp.jsx'],
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-eval-source-map' : false,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  devServer: {
    hot: true,
    publicPath: '/public/',
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  }
};

if (process.env.NODE_ENV === 'development') {
  config.entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
}

module.exports = config;
```

Add the development env to your .babelrc

```json
"development": {
  "plugins": ["transform-es2015-modules-commonjs"]
},
```

And now we can only run the dev middleware in dev, as well as gzip our output. This is often done at the reverse proxy layer (like Nginx) but let's do it here for fun. Refactor your server to be:

```javascript
//include
const compression = require('compression');

server.use(compression());
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  server.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  );
  server.use(webpackHotMiddleware(compiler));
}
```

This should get our first chunk down to about 105KB. Not bad. Let's see if we can press even harder with Preact.

[modules]: https://github.com/threepointone/react-modules
[ensure]: https://webpack.github.io/docs/code-splitting.html#commonjs-require-ensure
[checksum]: https://stackoverflow.com/questions/34311221/what-is-checksum-in-react-and-how-to-use-it
