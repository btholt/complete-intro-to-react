---
title: "A Note on Hot Module Reload"
---

So webpack has a nifty ability to do what's called hot module reload (HMR.) If you've ever used LiveReload's CSS injection, this will sound familiar. HMR will take your code, compile it on the fly, and then inject it into your live-running code. Pretty cool tech.

If you're working a dropdown that requires three different clicks to get there, it's pretty neat to be able to change the code and watch the UI change without having to reload and get the UI back into a state where you can see the effects of your change.

While this is not exclusive to React, the React component architecture lends itself very well to hot module reload. Dan Abramov, creator of Redux, React Drag-and-Drop, and other great stuff also wrote the code for this. He's a magician.

How does it work? Seems magical. Well, since we're using ES6 modules, it means the dependency graph of our app is static. Think of it as a big tree with branches. If one branch changes, it means we can tear off the branch (the old code) and graft on a new one (the new code that Webpack just compiled) without stopping the rest of the code from running

```
    Landing
   /
App
   \
    Search — ShowCard
```

That's our app as it stands in terms of dependencies. App imports Search which imports ShowCard. If Landing changes, we can leave App, Search, and ShowCard running as is and just graft on a new Landing. If Search changes, we have to graft on a whole new Search which includes new ShowCards.

This is accomplished with some black magic from Webpack and Babel. Babel when it transforms your code from JSX to JS and from ES6+ to ES5 will also instrument your modules with the ability to be replaced. We'll then insert a small client into our code that will receive small JSON packages via websockets and insert those into our running code. None of these details are important: mostly it's just for your information. react-hot-loader, Webpack, and Babel largely abstract these away from you.

Let's start with your .babelrc file. Add this as a top level property:

```json
"plugins": [
  "react-hot-loader/babel"
],
```

This is what instruments the code with the ability to be replaced. Refactor your webpack.config.js to look like this:

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './js/ClientApp.jsx'
  ],
  devtool: 'cheap-eval-source-map',
  output: {
    path: path.resolve(__dirname, '/public'),
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
```

- We required Webpack. We need to pull some plugins off of it.
- We added some additional files to be packed into app via the entry property. The order here *is* important.
- We gave the output a publicPath so it can know where the bundle.js file is since that's where it'll pull new bundles.
- We told the dev server to run in hot reload mode.
- We gave Webpack two plugins to work with. These affect the internals of Webpack. The second one is optional but it's helpful because it'll print the name of the files being hot reloaded.

From here we need to split the App component out of ClientApp. We need to give hot module reload the ability to split the root component away from what actually renders the component to the page. Turns out we would have had to do this anyway for server-side rendering anyway so it's fine for us to tackle this now.

Create a new file called App.jsx and put this in there:

```javascript
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './Landing';
import Search from './Search';

const App = () => (
  <BrowserRouter>
    <div className="app">
      <Route exact path="/" component={Landing} />
      <Route path="/search" component={Search} />
    </div>
  </BrowserRouter>
);

export default App;
```

Then from here, make your ClientApp.jsx look like this:

```javascript
import React from 'react';
import { render } from 'react-dom';
import App from './App';

const renderApp = () => {
  render(<App />, document.getElementById('app'));
};
renderApp();

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}
```

The first thing I always here is "Am I shipping that module.hot stuff down in prod!?" Yes, you are, and no, it doesn't matter. It's an if statement that gets runs once. You'll be fine. If you're so worried, use something like [groundskeeper][gk].

Okay, so we made renderApp a function so that we can render the App each time App itself changes. The rest of the modules will take care of themselves: this is all you need to hook up to get hot module reload to work! Also, when you build for production, all of the hot module reload code and transformations will be stripped out, meaning you're not making your package any larger (other than the if statement in ClientApp). Go give it a shot! Open your console (so you can see the debug statements) and go change something in your app. You should see the UI change without a full page reload. Pretty cool!

[gk]: https://github.com/Couto/groundskeeper
