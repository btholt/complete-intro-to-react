---
title: "webpack Chunking and Async Routing"
---

So far all of our routing with react-router has synchronous which makes sense. When we detect that a user has requested a route, we already have that route in our bundle.js and we render and serve that to them. The logic follows.

However, as our app grows and grows, our bundle.js is going to get bigger and bigger in file size. Wouldn't it be better if you were on Search that it served you _just the JavaScript you need for that page and none of the JS for Landing or Details? For example, Search doesn't need the omdb client we brought in: that client can safely just be loaded on the Details page.

Enter webpack's code splitting ability. It's smart enough to know which files are required by which other files and thus if you choose to use webpack's async loading API (<code>require.ensure</code>) then webpack will _automatically_ start chunking your JS for. What's more is we don't have to write the glue code that will download the chunks as we need them: webpack just does this for us. All we have to do is identify the modules that can be async by treating them as if they were. Really cool.

So we're going to treat all of our routes as async and luckily react-router is already instrumented for this for both server and client-side. So let's go make it happen!

So first we need give a minor tweak to webpack.config.js.

{% highlight javascript %}
// inside of the output config object
publicPath: '/public/'

// inside stats
chunks: true
{% endhighlight%}

First we need to tell webpack where to find all of its bundles instead when it calls back to the server to grab them. We also would like to see some webpack stats now on chunks since we're using them.

Go to ClientApp

{% highlight javascript %}
// delete requires for Landing, Search, Details, Route, and IndexRoute

// after the requires
if (typeof module !== 'undefined' && module.require) {
  if (typeof require.ensure === 'undefined') {
    require.ensure = require('node-ensure')// shim for node.js
  }
}

// replace myRoutes
const rootRoute = {
  component: Layout,
  path: '/',
  indexRoute: {
    getComponent (location, cb) {
      require.ensure([], (error) => {
        if (error) {
          return console.error('ClientApp Landing require.ensure error', error)
        }
        cb(null, require('./Landing'))
      })
    }
  },
  childRoutes: [
    {
      path: 'search',
      getComponent (location, cb) {
        require.ensure([], (error) => {
          if (error) {
            return console.error('ClientApp Search require.ensure error', error)
          }
          cb(null, require('./Search'))
        })
      }
    },
    {
      path: 'details/:id',
      getComponent (location, cb) {
        require.ensure([], (error) => {
          if (error) {
            return console.error('ClientApp Details require.ensure error', error)
          }
          cb(null, require('./Details'))
        })
      }
    }
  ]
}

// replace Router and its children
<Router routes={rootRoute} history={browserHistory} />

// replace App.Routes assignment
App.Routes = rootRoute
App.History = browserHistory
{% endhighlight %}

First bit is the async API we were talking about for chunking, require.ensure. This API lets webpack that it should wait and lazily load this component as soon as ensure is called. This API is available in the webpack, client-side world as it's available as a part of webpack's packaging; however, require.ensure is not necessarily in node and thus this shim is needed.

Next, we're eschewing from the JSX-ish config of react-route to the object config style. We could have done this before but now we have to because this is the only way to async route loading. Notice the getComponent is a function now which means we can lazy load this routes as we need them. webpack is smart enough to call that function, wait 'til it gets downloaded and then keep going. We're not going to do it today, but in the route that's being transitioned away from you can throw up a loading state while it loads the new code.

Next we move the config of routes from the children of Router to just being that object we created about.

And below that we need to ship out the routes so they can be universally rendered and the browserHistory because BrowserEntry is going to need it. So let's go to BrowserEntry

{% highlight javascript %}
// bring in react-router
const ReactRouter = require('react-router')
const { match } = ReactRouter

// replace ReactDOM.render
match({ history: App.History, routes: App.Routes }, (error, redirectLocation, renderProps) => {
  if (error) {
    return console.error('BrowserEntry require.ensure error', error)
  }
  ReactDOM.render(<App {...renderProps} />, document.getElementById('app'))
})
{% endhighlight %}

The match looks similar to what we do on the server. What we do here is make sure that the routes get check synchronously initially so that we can make sure that React renders correctly the first time so it matches the server-rendered code or otherwise React will blow away your server-rendered code in favor of its own.

Go to app.js

{% highlight javascript %}
// replace the match statement
match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
{% endhighlight %}

Only difference is that routes is no longer a function invocation but rather just an object of configs so all we do is remove the parens. And that's it! The rest should be handled by webpack and react-router.

So now browse around your site and watch the files being loaded in via the dev tools network tab. You should see the chunks being loaded as they are needed. This again doesn't split out too much since this is such a small app but you know how to do it! It's not as hard as one may expect!