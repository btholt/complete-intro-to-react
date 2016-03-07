---
title: "Universal Rendering"
---

Universal rendering, or the artist formerly known as isomorphic rendering. The idea here is that you server-side prerender your code so that when it gets down to the client, your browser can __instantly__ show the markup while your app bootstraps in the background. It makes everything feel very instantaneous.

With just vanilla React, universal rendering is a cinch. Check out the [whole node file from another one of my workshops][es6-react]. It does server-side rendering in just a few lines.

It's not quite so simple now that we have routing involved. We don't want to have to duplicate all of our routing info that we wrote for react-router. Rather, if possible, we just want to re-use the routes we already built for react-router. So let's do that (with some refactoring.)

## Move shows to redux

We're passing shows everywhere. In order to simplifiy our app a lot by not having to worry about passing it in, let's make all the shows-based data just come from redux.

Go to Store.jsx

{% highlight javascript %}
// another require
const data = require('../public/data')

// change initial state
const initialState = {
  searchTerm: '',
  shows: data.shows
}

// add to mapStateToProps
const mapStateToProps = (state) => ({ searchTerm: state.searchTerm, shows: data.shows })
{% endhighlight %}

Cool. Now these shows will available to any connected components. Let's go fix Details first.

{% highlight javascript %}
// bring in connector
const Store = require('./Store')
const { connector } = Store

// pull show from redux
const { title, description, year, poster, trailer } = this.props.shows[this.props.params.id]

// add proptype
shows: React.PropTypes.arrayOf(React.PropTypes.object)

// connect component
module.exports = connector(Details)
{% endhighlight %}

This should fix Details. Let's fix Search.

{% highlight javascript %}
// change the statement to map and filter
{this.props.shows

// overwrite the route proptype
shows: React.PropTypes.arrayOf(React.PropTypes.object),
{% endhighlight %}

Just needed pull shows from a different part of the params. Not much else to change here. Now (while your tests and lint are failing at the moment) the app should still work but the shows are coming from redux. Let's go clean up ClientApp.jsx

{% highlight javascript %}
// remove data.json require

// remove shows attribute from Search

// remove assignShow onEnter from Details

// remove assignShow method and constructor from App
{% endhighlight %}

Feels good to delete code. We successfully simplified our app a lot by moving that to redux. And now it will simplifiy us moving to render universally. Let's fix our test too.

{% highlight javascript %}
// change the Store init test's expect statement
expect(state).to.deep.equal({ searchTerm: '', shows: data.shows })
{% endhighlight %}

All tests should pass now. Now we have a few more things to refactor before we can universally render successfully.

## Split out BrowserEntry.jsx

The big key with universal rendering is being careful about referencing <code>window</code> and <code>document</code> as those aren't available in node environments. That isn't to say you can't interact with them: you just have to do <code>if (window) { /* do stuff with window*/ }</code>. Part of that means we need to split our the rendering of ClientApp from the declaration of the component. Remove the ReactDOM stuff from ClientApp, create a new called BrowserLanding.jsx and put this in there:

{% highlight javascript %}
const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./ClientApp')

ReactDOM.render(<App />, document.getElementById('app'))
{% endhighlight %}

We're also going to be doing a couple of things with history here. First, we're switching from hashHistory to browserHistory. Instead of <code>localhost:5050/#/search</code> it's just going to be <code>localhost:5050/search</code> which we can do since we're doing server-side rendering and can control the routes.

Go back to ClientApp.jsx

{% highlight javascript %}
// delete hashHistory from ReactRouter destructuring, add browserHistory
const { Router, Route, IndexRoute, browserHistory } = ReactRouter

// delete data.json require

// change attribute of <Router>
<Router history={browserHistory}>

// at the bottom
module.exports = App
{% endhighlight %}

And now the webpack config

{% highlight javascript %}
// just need to change the entry
entry: './js/BrowserEntry.jsx',
{% endhighlight %}

Cool. That should cover our refactor to split out BrowserEntry. Now we've done that, let's refactor a bit more: split out routes.

Back in ClientApp

{% highlight javascript %}
// above App
const myRoutes = (props) => (
  <Route path='/' component={Layout}>
    <IndexRoute component={Landing} />
    <Route path='/search' component={Search} />
    <Route path='/details/:id' component={Details} />
  </Route>
)

// replace Route and children
{myRoutes()}

// below App
App.Routes = myRoutes
{% endhighlight %}

Now we can pass these routes in to the server to be able to reuse them. This should wrap up all the things we need to refactor in our client code and now we spew out our server code.

## Writing the Server

This is a lot to take in at once but we have to write the whole app at once. Reason being is that you need it _all_ to be able to run the server. So let's write it first and then deconstruct it.

{% highlight javascript %}
require('babel-register')

const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const ReactRouter = require('react-router')
const match = ReactRouter.match
const RouterContext = ReactRouter.RouterContext
const ReactRedux = require('react-redux')
const Provider = ReactRedux.Provider
const Store = require('./js/Store.jsx')
const store = Store.store
const _ = require('lodash')
const fs = require('fs')
const port = 5050
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const ClientApp = require('./js/ClientApp.jsx')
const routes = ClientApp.Routes

const app = express()

app.use('/public', express.static('./public'))

app.use((req, res) => {
  match({ routes: routes(), location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const body = ReactDOMServer.renderToString(
        React.createElement(Provider, {store},
          React.createElement(RouterContext, renderProps)
        )
      )
      res.status(200).send(template({body}))
    } else {
      res.status(404).send('Not found')
    }
  })
})

console.log('listening on ' + port)
app.listen(port)
{% endhighlight %}

So we require a bunch of stuff and build a basic Express server. From there we're going to use react-router's match function which is what react-router uses internally to match routes. We pass that route to match as well as the URL. From there, we first check for 500s, then for 300s, and then if there was a matched route. If none of those are matched, then we throw off a 404.

Once a route is matched, we use ReactDOMServer to render our app out to a string (instead of to the DOM.) Once we have that string, we use [lodash][lodash] to template our rendered string into the index.html markup. And that's it! You're universally rendering!

[es6-react]: https://github.com/btholt/es6-react-pres/blob/master/completed/app.js
[lodash]: https://lodash.com/docs#template