---
title: "React: Props"
---

Let's start making our search page. Replace JSX HTML in Search with

{% highlight javascript %}
<div className='container'>
  {data}
</div>
{% endhighlight %}

You should see it say "House of Cards" at the top of the page. When you use curly braces in JSX, you're telling JSX you want it run a JavaScript expression and then display whatever it returns. If you take away those curly braces (try it) you'll see it literally displays "data.shows[0].title" as a string. So that's a neat tool to have; let's take it a step further and display all of the titles as their own components.

As you may remember, JSX is transpiling your JSX-HTML to function calls. As such, you may be able to imagine that a bunch of sibling components are just an array of components. Since they're just normal ol' JavaScript arrays, we can use some functional-programming-fu to transform data into components.

{% highlight javascript %}
const React = require('react')
const data = require('../public/data')
const Search = () => (
  <div className='container'>
    {data.shows.map((show) => (
      <h3>{show.title}</h3>
    ))}
  </div>
)

module.exports = Search
{% endhighlight %}

You should now see all of the titles in a nice scrollable list. This is the ng-repeat/#each of React: plain ol' JavaScript map. This is one of the reasons I _love_ React: for the most part best practices of React are just JavaScript best practices. There's very little DSL to learn. Cool! Let's flesh out how our search results are going to look.

{% highlight javascript %}
const React = require('react')
const data = require('../public/data')
const Search = () => (
  <div className='container'>
    <div className='shows'>
      {data.shows.map((show) => (
        <div className='show'>
          <img src={`/public/img/posters/${show.poster}`} className='show-img' />
          <div className='show-text'>
            <h3 className='show-title'>{show.title}</h3>
            <h4 className='show-year'>({show.year})</h4>
            <p className='show-description'>{show.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

module.exports = Search
{% endhighlight %}

Try saving and re-rendering. You should see some nice cards for the shows. Notice that we can use those fancy curly braces to insert JavaScript expressions into HTML attribute too. Neat.

However we can reorganize this a bit better: the Show component can be broken out into its own component. Let's do that. Make a file called ShowCard.jsx and put this in there:

{% highlight javascript %}
const React = require('react')

const ShowCard = (props) => (
  <div className='show-card'>
    <img src={`/public/img/posters/${props.show.poster}`} className='show-card-img' />
    <div className='show-card-text'>
      <h3 className='show-card-title'>{props.show.title}</h3>
      <h4 className='show-card-year'>({props.show.year})</h4>
      <p className='show-card-description'>{props.show.description}</p>
    </div>
  </div>
)

module.exports = ShowCard
{% endhighlight %}

Notice we're using this strange props object being passed in as a parameter to the ShowCard component. This is what we are going to be receiving from our parents. In this case, an individual ShowCard needs to receive all the necessary data from its parent to be able to display it.

This is a good time to discuss the philosophy that's sort of tough to get used to with React coding. We typically think of user interfaces as entities that change over a span of actions and events. Think of a jQuery UI you have made. Imagine making a drop down. You would have to write the code for a user clicking it to opening the drop down to the user clicking an item in the drop down. It's a progression of time, events, and interactions. Imagine if there was a bug with that final interaction. You now have to work out in your head the sequence of events to get it to that same state that the bug occurs in to able to fix it. This is second nature to many of us since we have done it so many times.

React takes a fundamentally different approach but it takes some retraining of your brain. However I argue this approach is superior due to it being much easier to reason about, making it more readable for new-comers to the code and much more debuggable. In React, you think of your UI as snapshots. You do not think of it as a progression of time and events; rather, you look at the UI as how is it going to look given a set of parameters. That's all it is. Given a set of parameters, how does this UI look? Using the drop down example, you think of the drop down in its various states: an open state, a closed state, and an event that triggers when you click the item. You represent these varying states using props and state (we'll get to state in a bit.) Given a certain set of props, the UI always looks this way. This will become more concrete as we go on.

This brings me to my next point: when coding React, assume you have all the data you need coming in via props and then figure out later how to get it there. That will make it much easier. Just assume it all works and then later go make it work.

And these principles? Not invented by React. These are battle-tested ideas that stem a lot from functional programming. There's a lot of good computer science going on here, whether or not we use React to apply these concepts.

Okay, great, let's go to Search and drop in our new component.

{% highlight javascript %}
const React = require('react')
const ShowCard = require('./ShowCard')
const data = require('../public/data')

const Search = () => (
  <div className='container'>
    <div className='shows'>
      {data.shows.map((show, index) => (
        <ShowCard show={show} key={index} id={key} />
      ))}
    </div>
  </div>
)

module.exports = Search
{% endhighlight %}

Much like you give an HTML tag an attribute is how you give props to children componets in React. Here we're passing down an object to our child component to make it available to the ShowCard via props. Neat, right? Save it and reload the page. standard is going to give you a bunch of complaints but we're going to address that momentarily. You should see the same UI.

We give it a key so React can internally keep track of which component is which. We give it an id to refer to later.

So let's fix our standard errors now. standard-react dictates that all props have a propType. React has a features that allows you to set propTypes which it then validates at runtime. This ends up being great for debugging because React now knows what sort of props it should be getting so it can give you a meaningful error messages. So let's go fix the errors.

In ShowCard, go add this just below the declaration of the ShowCard function:

{% highlight javascript %}
// below ShowCard
ShowCard.propTypes = {
  show: React.PropTypes.object.isRequired
}
{% endhighlight %}

Now React knows to expect that show is both an object _and_ required for the ShowCard to work. If the prop is optional (which is fine if it is indeed optional) then leave off the isRequired part.

We can make this a little neater via the ES6/JSX spread operator. Let's try that. Change Search's ShowCard from <code><ShowCard show={show} /></code> to <code><ShowCard {...show} /></code>. This will take all the properties from show and spread them out as individual properties on ShowCard. You _could_ write <code><ShowCard title={show.title} poster={show.poster} description={show.description} year={show.year} /></code> but that's a lot of writing and this cuts an easy corner. Let's go modify ShowCard to match.

{% highlight javascript %}
const React = require('react')

const ShowCard = (props) => (
  <div className='show-card'>
    <img src={`/public/img/posters/${props.poster}`} className='show-card-img' />
    <div className='show-card-text'>
      <h3 className='show-card-title'>{props.title}</h3>
      <h4 className='show-card-year'>({props.year})</h4>
      <p className='show-card-description'>{props.description}</p>
    </div>
  </div>
)

ShowCard.propTypes = {
  year: React.PropTypes.string.isRequired,
  poster: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.number.isRequired
}

module.exports = ShowCard
{% endhighlight %}

We've now made our code a bit cleaner since we don't have to props.show... ad nauseam. We've also made it so React can check each individual property that we need; this will save us bugs in the future.

## React Router Layout

Now, we have a common layout that we want to maintain between all of our pages. This is a common problem: you make a nice looking nav bar and background that you intend to share amongst multiple pages. We could make a nav component and share that but we can take it a step further (right now we're just going to share the background div.) We're going to use nested routes and what's called an IndexRoute. A nested route allows you to share UI between routes and an IndexRoute is just the default, base route of a nested route. Let's see it.

Make a new file called Layout.jsx. Put:

{% highlight javascript %}
const React = require('react')

const Layout = (props) => (
  <div className='app-container'>
    {props.children}
  </div>
)

module.exports = Layout
{% endhighlight %}

In ClientApp, pull in the IndexRoute component from react-router and make a nested route in your component.

{% highlight javascript %}
const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const Search = require('./Search')
const Layout = require('./Layout')
const ReactRouter = require('react-router')
const { Router, Route, hashHistory, IndexRoute } = ReactRouter

const App = () => (
  <Router history={hashHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Landing} />
      <Route path='/search' component={Search} />
    </Route>
  </Router>
)

ReactDOM.render(<App/>, document.getElementById('app'))
{% endhighlight %}

<code>children</code> is in particular an interesting beast. It allows you to make a tag and have access to whatever's inside. So:

{% highlight html %}
<MyComponent>
  <div><h1>lol</h1></div>
</MyComponent>
{% endhighlight %}

The children here would be the div and the h1. That's what children get you.

Also you may be seeing PropType errors here. Those are React's friendly ways of reminding you to make sure you're getting the data you expect via props.

