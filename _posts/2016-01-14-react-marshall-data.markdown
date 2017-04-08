---
title: "Data in React"
---

So now we want to add a third page: a page where we can watch the trailer. This is going to be an application of what we know already.

Create a new file in js/ called Details.js. In Details put:

```javascript
import React from 'react'

const Details = React.createClass({
  render () {
    return (
      <div className='details'>
        <h1>lolhi</h1>
      </div>
    )
  }
})

export default Details
```

In ClientApp.js, put your new route:

```javascript
// require your new route
import Details from './Details'

// add as last route in the nested routes
<Match pattern='/details/:id' component={Details} />
```

Here we've added a URL parameter using the colon. Now as a prop to Details you'll get whatever :id was. So now try to manually change the anchor on your url to be `http://localhost:8080/#/details/1`. You should see your new component here.

Let's show you a neat debugging tip I totally stole from [Ryan Florence][ryflo]. replace that h1 with this:

```javascript
// instead of the h1 in render
<pre>`
  {JSON.stringify(this.props, null, 4)}
`</pre>

// TODO
// at the bottom to shut up lint
Details.propTypes = {
  params: React.PropTypes.object
}
```
// ENDTODO

This is a useful way to dump your params to the page to see what react-router is giving you. This is __awesome__ for state too; it shows you in real time what your state looks like. We'll dig into React Tools here in a sec for even better debugging but for now let's keep trucking with our Details.js.

We're going to show all the details of a show on this page and be able to play the trailer. There's a _big_ problem here that we don't have that data on this page though; it's available in the Search route. We _could_ require in data.json here given that our data is available that way but that typically isn't the case: we typically get this data from the server. If that's the case, you don't want to make two AJAX requests to get the same data. In other words, we need to share this state between components. The way you do this is by pushing up the state to the highest common ancestor component. In this case, that'd be the router in ClientApp. So let's first refactor Search to still work while it pulls in that data from Search.

```javascript
// in ClientApp.js
// another import
import preload from '../public/data.json'

// modify the existing route
<Match pattern='/search' component={(props) => <Search shows={preload.shows} {...props} />} />
```

Now make Search use it
```javascript
// delete import preload from '../public/data.json'

// pull out PropTypes
const { shape, arrayOf, string } = React.PropTypes

// add propTypes
propTypes: {
  shows: arrayOf(shape({
    title: string,
    description: string
  }))
},

// change the map map call
{this.props.route.shows
// instead of {data.shows
```

Cool. Now it should still work but Search no longer controls the data but merely receives it as props. Now we can share this data with Details. Another thing to notice is that with components, you can pass them functions that return markup, essentially a render function inside of component. Indeed you can do this anywhere you can put a components. These are called stateless functional components. We'll see more of these later.

Now we're going to pass the correct show to the Details page. There's a bunch of ways to do this:

- We could pass all the shows and let Details select the correct show. This isn't great because Details is given an additional concern it doesn't need to have.
- We could create a callback in ClientApp that it passes to Details that Details calls with the correct ID and ClientApp hands back the correct show. This is slightly better but it's an odd API for getting data. Ideally we just hand down props and not a callback, especially since this isn't async.
- Or we could hook into react-router's ability to pass props down through stateless functions like we did with Search and just pass down the correct show. This is the best approach.

Add the following to ClientApp:

```javascript
// replace Details Match component
<Match pattern='/details/:id' component={(props) => {
  const show = preload.shows.filter((show) => props.params.id === show.imdbID)
  return <Details show={show[0]} {...props} />
}} />
```

This should put the correct show as one of the props that ClientApp passes down to Details. If you refresh the page, you should see it now.

As an aside, I've found the _best_ way to organize React method component is the following

1. propTypes
1. getInitialState / constructor
1. Other lifecycle methods like componentDidUpdate (we'll talk about those in a sec)
1. Your methods you create (like assignShow)
1. render

Makes it easier to find things when you look for them.

So let's actually display some cool stuff:

```javascript
import React from 'react'
const { shape, string } = React.PropTypes

const Details = React.createClass({
  propTypes: {
    show: shape({
      title: string,
      year: string,
      poster: string,
      trailer: string
    })
  },
  render () {
    const { title, description, year, poster, trailer } = this.props.show
    return (
      <div className='details'>
        <header>
          <h1>svideo</h1>
        </header>
        <section>
          <h1>{title}</h1>
          <h2>({year})</h2>
          <img src={`/public/img/posters/${poster}`} />
          <p>{description}</p>
        </section>
        <div>
          <iframe src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;controls=0&amp;showinfo=0`} frameBorder='0' allowFullScreen />
        </div>
      </div>
    )
  }
})

export default Details
```

Now you should have some nice looking UI.

Well, now we have a header in two places. That's a **strong** indicator that you should make it's its own component. Let's abstract that in a component and use that in both places. Create a new file called Header.js and put this in there:

```javascript
import React from 'react'
import { Link } from 'react-router'

const Header = React.createClass({
  render () {
    return (
      <header>
        <h1>
          <Link to='/'>
            svideo
          </Link>
        </h1>
      </header>
    )
  }
})

export default Header
```

We're even going to throw in a link back to the home page for fun. Now open Details.js and put:

```javascript
// add to the top
import Header from './Header'

// replace <header>...</header>
<Header />
```

Let's put a back button on the Header so you can get back to Search after you reach it.

```javascript
// after the h1 inside .header
<h2>
  <Link to='/search'>
    Back
  </Link>
</h2>
```

So let's integrate this to Search. But it's not so simple since on Search we want the header to have a search input and on Details we want a back button. So let's see how to do that. In Header.js put:

```javascript
import React from 'react'
import { Link } from 'react-router'
const { func, bool, string } = React.PropTypes

const Header = React.createClass({
  propTypes: {
    handleSearchTermChange: func,
    showSearch: bool,
    searchTerm: string
  },
  render () {
    let utilSpace
    if (this.props.showSearch) {
      utilSpace = <input type='text' placeholder='Search' value={this.props.searchTerm} onChange={this.props.handleSearchTermChange} />
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
      <header>
        <h1>
          <Link to='/'>
            svideo
          </Link>
        </h1>
        {utilSpace}
      </header>
    )
  }
})

export default Header
```

In Search.js:

```javascript
// add to requires
const Header = require('./Header')

// replace <header></header>
<Header handleSearchTermChange={this.handleSearchTermChange} showSearch searchTerm={this.state.searchTerm} />
```

This is how you have a child component modify a parent's state: you pass down the callback and let it call the parent to let the parent modify the state. This also demonstrates how to conditionally show one component and not another.

Lastly let's make our show cards clickable.

```javascript
import React from 'react'
import { Link } from 'react-router'
const { string } = React.PropTypes

const ShowCard = React.createClass({
  propTypes: {
    poster: string.isRequired,
    title: string.isRequired,
    year: string.isRequired,
    description: string.isRequired,
    imdbID: string.isRequired
  },
  render () {
    return (
      <Link to={`/details/${this.props.imdbID}`}>
        <div className='show-card'>
          <img src={`/public/img/posters/${this.props.poster}`} />
          <div>
            <h3>{this.props.title}</h3>
            <h4>({this.props.year})</h4>
            <p>{this.props.description}</p>
          </div>
        </div>
      </Link>
    )
  }
})

export default ShowCard
```

[ryflo]: https://twitter.com/ryanflorence
