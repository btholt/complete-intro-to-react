---
title: "React Router"
---

So now we have a basic landing page and we want to be able to transition to another page. Because we making this as a single page app, we are going to use the marvelous [react-router][react-router]. react-router is a robust piece of technology and we are just going to be scratching the surface of it now. If you intend on making a single page app, I suggest you deep dive into it to uncover all of its potential.

We are just use the top level router at the moment. First, let's move our landing page into its own component so we can use ClientApp as the router. Move all the code (except the ReactDOM last line; leave that there) to Landing.jsx.

{% highlight javascript %}
// Landing.jsx
const React = require('react')

const Landing = () => (
  <div className='app-container'>
    <div className='home-info'>
      <h1 className='title'>svideo</h1>
      <input className='search' type='text' placeholder='Search' />
      <a className='browse-all'>or Browse All</a>
    </div>
  </div>
)

module.exports = Landing
{% endhighlight %}

{% highlight javascript %}
// ClientApp.jsx
const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const ReactRouter = require('react-router')
const { Router, Route, hashHistory } = ReactRouter

const App = () => (
  <Router history={hashHistory}>
    <Route path='/' component={Landing} />
  </Router>
)

ReactDOM.render(<App/>, document.getElementById('app'))
{% endhighlight %}

Cool. Make sure standard isn't yelling at you and that your app still works. It should appear pretty much the same to you. Now we have a router so we're free to introduce a second page! If the <code>const { Router, Route, hashHistory } = ReactRouter</code> code looks foreign to you, check out [2ality's post on it][destructuring].

So now we got react-router rolling, let's move onto our second page, the search page.

Let's make our search page. We're going to start with some dummy data and work our way from there. Again, follow the same HTML structure and CSS naming as me and you'll get all the styling for free. Feel free to take a glance at public/data.json to see what's there. As you may have guessed, it's a bunch of Netflix shows. This whole workshop is actually just an elaborate advertisement for Netflix (just kidding; I promise.)

webpack allows you to require in json files just like you would another JavaScript file so we'll take advantage of that when we start coding our new search page. However we do have add another loader to do that. Add the following object to your <code>loaders</code> array in your webpack.config.js.

{% highlight javascript %}
  {
    test: /\.json$/,
    loader: 'json-loader'
  }
{% endhighlight %}

Create a new file called Search.jsx. In Search.jsx put:

{% highlight javascript %}
const React = require('react')
const shows = require('../public/data')

const Search = () => (
  <h1>Search!!</h1>
)

module.exports = Search
{% endhighlight %}

Put in ClientApp

{% highlight javascript %}
const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const Search = require('./Search')
const ReactRouter = require('react-router')
const { Router, Route, hashHistory } = ReactRouter

const App = () => (
  <Router history={hashHistory}>
    <Route path='/' component={Landing} />
    <Route path='/search' component={Search} />
  </Router>
)

ReactDOM.render(<App/>, document.getElementById('app'))
{% endhighlight %}

In Landing, change the <code><a href='#'>or Browse All</a></code> to

{% highlight javascript %}
// add at top with other requires
const ReactRouter = require('react-router')
const { Link } = ReactRouter

// change <a> to
<Link to='/search' className='browse-all'>or Browse All</Link>
{% endhighlight %}

Now you have another working route (which all it's doing is showing an h1) and a link to get there. When linking between routes with react-router, use the Link component. This allows you to refactor how routes work without having refactor all of your individual links (you could just make your a's href "#/search" and it would work for now but could break later.) Now your button should work to take you to the browser page and you should be able to use back and forward for free thanks to react-router.

[react-router]: https://github.com/reactjs/react-router
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html#destructuring