---
title: "Data in React"
---

So now we want to add a third page: a page where we can watch the trailer. This is going to be an application of what we know already.

Create a new file in js/ called Details.jsx. In Details put:

{% highlight javascript %}
const React = require('react')

class Details extends React.Component {
  render () {
    return (
      <div className='container'>
        <h1>lolhi</h1>
      </div>
    )
  }
}

module.exports = Details
{% endhighlight %}

In ClientApp.jsx, put your new route:

{% highlight javascript %}
// require your new route
const Details = require('./Details')

// add as last route in the nested routes
<Route path='/details/:id' component={Details} />
{% endhighlight %}

Here we've added a URL parameter using the colon. Now as a prop to Details you'll get whatever :id was. So now try to manually change the anchor on your url to be <code>[stuff]/index.html#/details/1</code>. You should see your new component here.

Let's show you a neat debugging tip I totally stole from [Ryan Florence][ryflo]. replace that h1 with this:

{% highlight javascript %}
// instead of the h1 in render
<pre style={ { textAlign: 'left' } }><code>
  {JSON.stringify(this.props.params, null, 4)}
</code></pre>

// at the bottom to shut up lint
Details.propTypes = {
  params: React.PropTypes.object
}
{% endhighlight %}

This is a useful way to dump your params to the page. This is __awesome__ for state too; it shows you in real time what your state looks like. We'll dig into React Tools here in a sec for even better debugging but for now let's keep trucking with our Details.jsx

We're going to show all the details of a show on this page and be able to play the trailer. There's a _big_ problem here that we don't have that data on this page though; it's available in the Search route. We _could_ require in data.json here given that our data is available that way but that typically isn't the case: we typically get this data from the server. If that's the case, you don't want to make two AJAX requests to get the same data. In other words, we need to share this state between components. The way you do this is by pushing up the state to the highest common ancestor component. In this case, that'd be the router in ClientApp. So let's first refactor Search to still work while it pulls in that data from Search.

{% highlight javascript %}
// another require
const data = require('../public/data')

// modify the existing route
<Route path='/search' component={Search} shows={data.shows} />
{% endhighlight %}

Now make Search use it
{% highlight javascript %}
// delete const data = require('../public/data')

// change the map map call
{this.props.route.shows
// instead of {data.shows

// add propTypes
Search.propTypes = {
  shows: React.PropTypes.arrayOf(React.PropTypes.object)
}
{% endhighlight %}

Cool. Now it should still work but Search no longer controls the data but merely receives it as props. Now we can share this data with Details.

Now we're going to pass the correct show to the Details page. There's a bunch of ways to do this:

- We could pass all the shows and let Details select the correct show. This isn't great because Details is given an additional concern it doesn't need to have.
- We could create a callback in ClientApp that it passes to Details that Details calls with the correct ID and ClientApp hands back the correct show. This is slightly better but it's an odd API for getting data. Ideally we just hand down props and not a callback, especially since this isn't async.
- Or we could hook into react-router's onEnter callback for the route, grab the ID, and then pass that down in addition to the ID to Details. This is my preferred approach. So let's do that.

Add the following to ClientApp:

{% highlight javascript %}
// method before render
assignShow (nextState, replace) {
  const show = data.shows[nextState.params.id]
  if (!show) {
    return replace('/')
  }
  Object.assign(nextState.params, show)
  return nextState
}

// method before assignShow
constructor (props) {
  super(props)

  this.assignShow = this.assignShow.bind(this)
}

// replace /details route
<Route path='/details/:id' component={Details} onEnter={this.assignShow} />
{% endhighlight %}

This should put the correct show as one of the props.params that ClientApp passes down to Details. If you refresh the page, you should see it now.

As an aside, I've found the _best_ way to organize React method component is the following

1. getInitialState / constructor
1. Other lifecycle methods like componentDidUpdate (we'll talk about those in a sec)
1. Your methods you create (like assignShow)
1. render

Makes it easier to find things when you look for them.

So let's actually display some cool stuff:

{% highlight javascript %}
class Details extends React.Component {
  render () {
    const params = this.props.params || {}
    const { title, description, year, poster, trailer } = params
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>svideo</h1>
        </header>
        <div className='video-info'>
          <h1 className='video-title'>{title}</h1>
          <h2 className='video-year'>({year})</h2>
          <img className='video-poster' src={`/public/img/posters/${poster}`} />
          <p className='video-description'>{description}</p>
        </div>
        <div className='video-container'>
          <iframe src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;controls=0&amp;showinfo=0`} frameBorder='0' allowFullScreen></iframe>
        </div>
      </div>
    )
  }
}
{% endhighlight %}

Now you should have some nice looking UI.

Well, now we have a header in two places. Let's abstract that in a component and use that in both places. Create a new file called Header.jsx and put this in there:

{% highlight javascript %}
const React = require('react')
const ReactRouter = require('react-router')
const { Link } = ReactRouter

class Header extends React.Component {
  render () {
    return (
      <header className='header'>
        <h1 className='brand'>
          <Link to='/' className='brand-link'>
            svideo
          </Link>
        </h1>
      </header>
    )
  }
}

module.exports = Header
{% endhighlight %}

We're even going to throw in a link back to the home page for fun. Now open Details.jsx and put:

{% highlight javascript %}
// add to the top
const Header = require('./Header')

// replace <header></header>
<Header />
{% endhighlight %}

Let's put a back button on the Header so you can get back to Search after you reach it.

{% highlight javascript %}
// after the h1 inside .header
<h2 className='header-back'>
  <Link to='/search'>
    Back
  </Link>
</h2>
{% endhighlight %}

So let's integrate this to Search. But it's not so simple since on Search we want the header to have a search input and on Details we want a back button. So let's see how to do that. In Header.jsx put:

{% highlight javascript %}
const React = require('react')
const ReactRouter = require('react-router')
const { Link } = ReactRouter

class Header extends React.Component {
  render () {
    let utilSpace
    if (this.props.showSearch) {
      utilSpace = <input type='text' className='search-input' placeholder='Search' value={this.props.searchTerm} onChange={this.props.handleSearchTermChange} />
    } else {
      utilSpace = (
        <h2 className='header-back'>
          <Link to='/search'>
            Back
          </Link>
        </h2>
      )
    }
    return (
      <header className='header'>
        <h1 className='brand'>
          <Link to='/' className='brand-link'>
            svideo
          </Link>
        </h1>
        {utilSpace}
      </header>
    )
  }
}

Header.propTypes = {
  handleSearchTermChange: React.PropTypes.func,
  showSearch: React.PropTypes.bool,
  searchTerm: React.PropTypes.string
}

module.exports = Header
{% endhighlight %}

In Search.jsx:

{% highlight javascript %}
// add to requires
const Header = require('./Header')

// replace <header></header>
<Header handleSearchTermChange={this.handleSearchTermChange} showSearch searchTerm={this.state.searchTerm} />
{% endhighlight %}

This is how you have a child component modify a parent's state: you pass down the callback and let it call the parent to let the parent modify the state. This also demonstrates how to conditionally show one component and not another.

Lastly let's make our show cards clickable.

{% highlight javascript %}
// add requires
const ReactRouter = require('react-router')
const { Link } = ReactRouter

// replace ShowCard
const ShowCard = (props) => (
  <Link to={`/details/${props.id}`}>
    <div className='show-card'>
      <img src={`/public/img/posters/${props.poster}`} className='show-card-img' />
      <div className='show-card-text'>
        <h3 className='show-card-title'>{props.title}</h3>
        <h4 className='show-card-year'>({props.year})</h4>
        <p className='show-card-description'>{props.description}</p>
      </div>
    </div>
  </Link>
)
{% endhighlight %}

[ryflo]: https://twitter.com/ryanflorence