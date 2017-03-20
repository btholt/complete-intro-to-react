---
title: "React Router"
---

So now we have a basic landing page and we want to be able to transition to another page. Because we making this as a single page app, we are going to use the marvelous [react-router][react-router]. react-router is a robust piece of technology and we are just going to be scratching the surface of it now. If you intend on making a single page app, I suggest you deep dive into it to uncover all of its potential.

We're going to be using React Router version 4 here. This is significant because React Router has gone through several thrashes of API, from 0 to 1, from 1 to 2/3, and now from 2/3 to 4. The authors have assured us that this is the last major thrash but it quite a departure, but thankfully the thrash is worth it. It got a lot easier to use.

We are just use the top level router at the moment. First, let's move our landing page into its own component so we can use ClientApp as the entry point for the app. Move all the code (except the ReactDOM last line; leave that there) to Landing.js.

```javascript
// Landing.js
import React from 'react'
import '../public/normalize.css'
import '../public/style.css'

const Landing = React.createClass({
  render () {
    return (
      <div className='landing'>
        <h1>svideo</h1>
        <input type='text' placeholder='Search' />
        <a>or Browse All</a>
      </div>
    )
  }
})

export default Landing
```

```javascript
// ClientApp.js
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Match } from 'react-router'
import Landing from './Landing'

const App = React.createClass({
  render () {
    return (
      <HashRouter>
        <div className='app'>
          <Match exactly pattern='/' component={Landing} />
        </div>
      </HashRouter>
    )
  }
})

render(<App />, document.getElementById('app'))
```

Cool. Make sure standard isn't yelling at you and that your app still works. It should appear pretty much the same to you. The HashRouter is a sort of hacky router which puts your route information into the hash of the URL (after the #). We'll use BrowserRouter later so we have nice URLs, but for now this gets us started. The Match component is a route; when it matchs the pattern provided (in this case we don't want fuzzy matching, hence the exactly attribute) it render the component provided, in this case the Landing component. It's wrapped in a div because routers can only have one child since they render them directly, but it's nice because all routes will now get the styling from the .app class for free.

Now we have a router so we're free to introduce a second page! Let's make our search page. Create a new file called Search.js. In Search.js put:

```javascript
import React from 'react'

const Search = React.createClass({
  render () {
    return (
      <h1>Search!!</h1>
    )
  }
})

export default Search
```

Put in ClientApp

```javascript
import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Match } from 'react-router'
import Landing from './Landing'
import Search from './Search'

const App = React.createClass({
  render () {
    return (
        <HashRouter>
          <div className='app'>
            <Match exactly pattern='/' component={Landing} />
            <Match pattern='/search' component={Search} />
          </div>
        </HashRouter>
    )
  }
})

render(<App />, document.getElementById('app'))
```

In Landing, change the <code><a>or Browse All</a></code> to

```javascript
// add at top with other requires
import { Link } from 'react-router'

// change <a> to
<Link to='/search' className='browse-all'>or Browse All</Link>
```

Now you have another working route (which all it's doing is showing an h1) and a link to get there. When linking between routes with react-router, use the Link component. This allows you to refactor how routes work without having refactor all of your individual links (you could just make your a's href "#/search" and it would work for now but could break later.) Now your button should work to take you to the browser page and you should be able to use back and forward for free thanks to react-router.

The HashRouter sort of sucks though so let's migrate to BrowserRouter. First, we have to make webpack-dev-server aware that it should pass unfound routes back to index.html anyway. Add the following line your webpack.config.js inside of the devServer object: <code>historyApiFallback: true</code>.

Then go to ClientApp.js and change all references (the import and the use of the component) of HashRouter to BrowserRouter. Now instead of #/search, it should go to just /search. Yay!

[react-router]: https://react-router.now.sh
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html#destructuring
