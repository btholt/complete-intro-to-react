---
title: "Webpack Code-Splitting and Async Routing"
---

So far all of our routing with react-router has synchronous which makes sense. When we detect that a user has requested a route, we already have that route in our bundle.js and we render and serve that to them. The logic follows.

However, as our app grows and grows, our bundle.js is going to get bigger and bigger in file size. Wouldn't it be better if you were on Search that it served you _just_ the JavaScript you need for that page and none of the JS for Landing or Details? For example, Search doesn't need the axios client we brought in: that client can safely just be loaded on the Details page.

Enter webpack's code splitting ability. It's smart enough to know which files are required by which other files and thus if you choose to use webpack's async loading API (<code>require</code>) then webpack will _automatically_ start chunking your JS for you. What's more is we don't have to write the glue code that will download the chunks as we need them: webpack just does this for us. All we have to do is identify the modules that can be async by treating them as if they were. Really cool.

So we're going to treat all of our routes as async and luckily react-router is already instrumented for this for both server and client-side. So let's go make it happen! We're going to be using to do this. There are many ways to do this; I've just found this easiest to teach you. People right now like [react-modules][modules] despite it having some issues with server-side rendering.

So first we need give a minor tweak to webpack.config.js.

```javascript
// inside of the output config object (not the devServer object)
publicPath: '/public/'
```

First we need to tell webpack where to find all of its bundles instead when it calls back to the server to grab them.

Let's go create a component that will handle our asynchronous routes to contain all that craziness. Create a file called AsyncRoute and go there.

```javascript
import React from 'react'
const { object } = React.PropTypes

const AsyncRoute = React.createClass({
  propTypes: {
    props: object,
    loadingPromise: object
  },
  getInitialState () {
    return {
      loaded: false
    }
  },
  componentDidMount () {
    this.props.loadingPromise.then((module) => {
      this.component = module.default
      this.setState({loaded: true})
    })
  },
  render () {
    if (this.state.loaded) {
      return <this.component {...this.props.props} />
    } else {
      return <h1>loading...</h1>
    }
  }
})

export default AsyncRoute
```

AsyncRoute is going to passed a promise which will resolve to a module. Once that promise has completed, that means the module is loaded and available. Then we can render it. Notice that we stick the module on this and not into state. Modules are large and it would slow down our component to have so much state. Furthermore we don't expect it to change. Before that we'll render a loading state. That's all we're going to do with AsyncRoute. Go to App.js

```javascript
// at top
// delete Landing import
import AsyncRoute from './AsyncRoute'
if (global) {
  global.System = { import () {} }
}

// replace Landing Match
<Match
  exactly
  pattern='/'
  loadingPromise={(props) => <AsyncRoute props={props} component={System.import('./Landing')} />}
/>
```

So now we're using our AsyncRoute function to make Landing Async. First we import our route and then we have to shim System.import out. Node doesn't have System.import (it's tied to the new ES6 module system which Node doesn't have yet.) Then we pull in our async route and use it inside of Match. This is amazing since Webpack knows to perform a code split here and we get all the rest of that for free.

Let's talk about what sucks about this. Now, server-side rendered or not, we get a loading screen first thing. No matter what. Ideally we get this loading screen _sooner_ but nonetheless that happens. There are ways around this but it involves either making some compromises by not server-side rendering properly and getting a [checksum violation][checksum] or by greatly increasing the complexity of this by introducing the concept of module hydration where on the server you make sure to send down the bundle and the correct chunk at the same time and detect that on the client. For now I'm happy just introducing code-splitting to our app for now.


Also, in order for System.import (or [require.ensure][ensure], which is the CommonJS version) to be able to code split, the parameter passed to it must be a string of the path. It cannot be a variable. Webpack is doing static analsysis of your code and cannot follow variables.

Open up your browser to /search (without hitting / first) and watch the network tab. Make sure your npm run watch and your npm run start are both running. You should see bundle.js being downloaded but you should also see 0.bundle.js being downloaded too. This is the chunks that Webpack is sending down piecemeal, meaning your route and associated modules are not included in the initial payload. This becomes a bigger and bigger deal as your app expands. Let's finish the rest of our async routes.

```javascript
// delete Search and Details import

// replace Details and Search matches
<Match
  pattern='/search'
  component={(props) => {
    return <AsyncRoute props={Object.assign({shows: preload.shows}, props)} loadingPromise={System.import('./Search')} />
  }}
/>
<Match
  pattern='/details/:id'
  component={(props) => {
    const show = preload.shows.filter((show) => props.params.id === show.imdbID)
    return <AsyncRoute props={Object.assign({show: show[0]}, props)} loadingPromise={System.import('./Details')} />
  }}
/>
```

Nothing too crazy here either. Just extendingo out the same ideas. Now try navigating around your app and watch the network tab. You should different bundles being pulled in. If you look at your terminal output, you'll see we actually haven't optimized too much: our main bundle is nearly a megabyte and the smaller bundles are between three and fifty kilobytes. Like I said, this is wonderful for big apps where you can section off where dependencies. For example the fifty kilobyte bundle is the only one that has axios. The rest of the app doesn't need it. But for our tiny React routes, this isn't super useful. And the ability to codesplit isn't free either: Webpack includes some glue code to make this work. So evaluate this tool carefully!

[modules]: https://github.com/threepointone/react-modules
[ensure]: https://webpack.github.io/docs/code-splitting.html#commonjs-require-ensure
[checksum]: https://stackoverflow.com/questions/34311221/what-is-checksum-in-react-and-how-to-use-it
