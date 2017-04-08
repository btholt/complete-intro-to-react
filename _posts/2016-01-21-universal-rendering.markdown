---
title: "Universal Rendering"
---

Universal rendering, or the artist formerly known as isomorphic rendering. The idea here is that you server-side prerender your code so that when it gets down to the client, your browser can __instantly__ show the markup while your app bootstraps in the background. It makes everything feel very instantaneous.

With just vanilla React, universal rendering is a cinch. Check out the [whole node file from another one of my workshops][es6-react]. It does server-side rendering in just a few lines.

It's not quite so simple now that we have routing involved. We don't want to have to duplicate all of our routing info that we wrote for react-router. Rather, if possible, we just want to reuse the routes we already built for react-router. So let's do that (with some refactoring.)

First thing is we need to split browser concerns away from our app. Right now ClientApp.js worries about the creating the base app _and_ rendering it to the DOM. We need to do a few things to satisfy those requirements. First let's split the app into browser and app concerns. Create a new file called App.js and put this in there:

```javascript
import React from 'react'
import { Match } from 'react-router'
import { Provider } from 'react-redux'
import store from './store'
import Landing from './Landing'
import Search from './Search'
import Details from './Details'
import preload from '../public/data.json'

const App = () => {
  return (
    <Provider store={store}>
      <div className='app'>
        <Match exactly pattern='/' component={Landing} />
        <Match pattern='/search' component={(props) => <Search shows={preload.shows} {...props} />} />
        <Match pattern='/details/:id' component={(props) => {
          const show = preload.shows.filter((show) => props.params.id === show.imdbID)
          return <Details show={show[0]} {...props} />
        }} />
      </div>
    </Provider>
  )
}

export default App
```

Now all ClientApp.js should be is:

```javascript
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router'
import App from './App'

render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('app'))
```

Now all browser concerns lie in ClientApp and the general app has been split out and is ready to be server renderered. We'll use a special ServerRouter for server rendering so that's why we put the BrowserRouter inside of ClientApp.

Also, since App itself carries no state, we put it inside of a stateless functional component. I typically default to this kind of component and only migrate to React.createClass when I need lifecycle methods or need to keep track of state. They're great because they're simpler.

Okay, copout here: doing CSS modules in server-side rendering is going to add a bunch of complexity that with how little we're using CSS modules. It's possible, you need to pull in [isomorphic-style-loader][isl] instead of css-loader, but we're skip it for now. Remove/comment-out the css imports inside of Landing.js and add them to the head in index.html. Change index.html to look like:

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vidflix</title>
  <link rel="stylesheet" href="/public/normalize.css" />
  <link rel="stylesheet" href="/public/style.css" />
</head>
<body>
  <div id="app"><%= body %></div>
  <&NegativeMediumSpace;script src="/public/bundle.js"></script>
</body>
</html>
```

We also added a [lodash template][lodash] tag in it. We'll use it as we server-side render.

Go to .babelrc and add env, for server. For now it'll be the same as test (since we need Babel to make the modules to CommonJS here too) but we don't want to tie those together.

```json
{
  "presets": [
    "react",
    ["es2015", {modules: false, loose: true}]
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
require('babel-register')

const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const ReactRouter = require('react-router')
const ServerRouter = ReactRouter.ServerRouter
const _ = require('lodash')
const fs = require('fs')
const port = 5050
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const App = require('./js/App').default

const server = express()

server.use('/public', express.static('./public'))

server.use((req, res) => {
  const context = ReactRouter.createServerRenderContext()
  let body = ReactDOMServer.renderToString(
    React.createElement(ServerRouter, {location: req.url, context: context},
      React.createElement(App)
    )
  )

  res.write(template({body: body}))
  res.end()
})

console.log('listening on ' + port)
server.listen(port)
```

We're switching back to CommonJS here to work with Node; Node doesn't natively understand ES6 modules so we need to use CommonJS. We require in a bunch of stuff. We're using Lodash templates but that's a detail; I just did it since it's an easy way to template. There's ten billion other ways to do it. We do some static serving for our CSS. And then we do the magic of server side rendering.

Notably here we are _not_ handling the 404 or redirect case. react-router is able to handle these without a ton of effort, both server and client-side, but we'll get to that later. With the createElement stuff is just like we were at the beginning of the workshop; it's just here we're doing out of necessity since Node can't read JSX either.

babel-register at the top lets us require modules that need transpilation. This isn't ideal; in production you'll probably want to pre-transpile them so you don't continually pay that cost.

Okay. Let's run the app. Run in your CLI `npm run build` then run `NODE_ENV=server node server.js`. Make sure you re-run build because the webpack-dev-server doesn't necessarily re-write out the bundle.js. Okay, so now try going to localhost:5050. While you won't necessarily notice it loading quicker since you were developing locally, check out view source. You should see it ships with a bunch of markup which means your page will load _much_ quicker on a slower connection since markup will start rendering before the JS is done downloading.

Congrats! You've done server-side rendering!

[es6-react]: https://github.com/btholt/es6-react-pres/blob/master/completed/app.js
[lodash]: https://lodash.com/docs#template
[isl]: https://github.com/kriasoft/isomorphic-style-loader
