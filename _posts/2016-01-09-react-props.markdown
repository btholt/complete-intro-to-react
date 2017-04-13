---
title: "React: Props"
---

Let's start making our search page. We're going to start with some dummy data and work our way from there. Again, follow the same HTML structure and CSS naming as me and you'll get all the styling for free. Feel free to take a glance at ./data.json to see what's there. As you may have guessed, it's a bunch of Netflix shows. This whole workshop is actually just an elaborate advertisement for Netflix (just kidding; I promise.)

Webpack allows you to require in json files just like you would another JavaScript file so we'll take advantage of that when we start coding our new search page.

Previously Webpack required a JSON loader to load JSON files but now Webpack 2 allows it by default.

```javascript
// in replace Search.js
import React from 'react';
import preload from '../data.json';

const Search = () => (
  <div className="search">
    <pre>{JSON.stringify(preload, null, 4)}</pre>
  </div>
);

export default Search;
```

You should see it say dump a lot of JSON to the page at the top of the page. When you use curly braces in JSX, you're telling JSX you want it run a JavaScript expression and then display whatever it returns. If you take away those curly braces (try it) you'll see it literally displays "JSON.stringify(preload, null, 4)" as a string. So that's a neat tool to have; let's take it a step further and display all of the titles as their own components.

As you may remember, JSX is transpiling your JSX-HTML to function calls. As such, you may be able to imagine that a bunch of sibling components are just an array of components. Since they're just normal ol' JavaScript arrays, we can use some functional-programming-fu to transform data into components.

```javascript
// replace render's return
<div className='search'>
  {preload.shows.map((show) => {
    return (
      <h3>{show.title}</h3>
    )
  })}
</div>
```

You should now see all of the titles in a nice scrollable list. This is the ng-repeat/#each of React: plain ol' JavaScript map. If you are not familiar with map, [read this][map]. This is one of the reasons I _love_ React: for the most part best practices of React are just JavaScript best practices. There's very little DSL to learn. Cool! Let's flesh out how our search results are going to look.

```javascript
import React from 'react';
import preload from '../data.json';

const Search = () => (
  <div className="search">
    <div>
      {preload.shows.map(show => (
        <div className="show-card">
          <img alt={`${show.title} Show Poster`} src={`/public/img/posters/${show.poster}`} />
          <div>
            <h3>{show.title}</h3>
            <h4>({show.year})</h4>
            <p>{show.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Search;
```

Try saving and re-rendering. You should see some nice cards for the shows. Notice that we can use those fancy curly braces to insert JavaScript expressions into HTML attribute too. Neat.

However we can reorganize this a bit better: the ShowCard component can be broken out into its own component. Let's do that. Make a file called ShowCard.jsx and put this in there:

```javascript
import React from 'react';

const ShowCard = props => (
  <div className="show-card">
    <img alt={`${props.show.title} Show Poster`} src={`/public/img/posters/${props.show.poster}`} />
    <div>
      <h3>{props.show.title}</h3>
      <h4>({props.show.year})</h4>
      <p>{props.show.description}</p>
    </div>
  </div>
);

export default ShowCard;
```

Notice we're using the props object like we did for title and color before in MyTitle. This is what we are going to be receiving from our parents. In this case, an individual ShowCard needs to receive all the necessary data from its parent to be able to display it.

This is a good time to discuss the philosophy that's sort of tough to get used to with React coding. We typically think of user interfaces as entities that change over a span of actions and events. Think of a jQuery UI you have made. Imagine making a drop down. You would have to write the code for a user clicking it to opening the drop down to the user clicking an item in the drop down. It's a progression of time, events, and interactions. Imagine if there was a bug with that final interaction. You now have to work out in your head the sequence of events to get it to that same state that the bug occurs in to able to fix it. This is second nature to many of us since we have done it so many times.

React takes a fundamentally different approach but it takes some retraining of your brain. However I argue this approach is superior due to it being much easier to reason about, making it more readable for newcomers to the code and much more debuggable. In React, you think of your UI as snapshots. You do not think of it as a progression of time and events; rather, you look at the UI as how is it going to look given a set of parameters. That's all it is. Given a set of parameters, how does this UI look? Using the drop down example, you think of the drop down in its various states: an open state, a closed state, and an event that triggers when you click the item. You represent these varying states using props and state (we'll get to state in a bit.) Given a certain set of props, the UI always looks this way. This will become more concrete as we go on.

This brings me to my next point: when coding React, assume you have all the data you need coming in via props and then figure out later how to get it there. That will make it much easier. Just assume it all works and then later go make it work.

And these principles? Not invented by React. These are battle-tested ideas that stem a lot from functional programming. There's a lot of good computer science going on here, whether or not we use React to apply these concepts.

Okay, great, let's go to Search and drop in our new component.

```javascript
import React from 'react'
import ShowCard from './ShowCard'
import preload from '../public/data.json'

const Search = React.createClass({
  render () {
    return (
      <div className='search'>
        <div>
          {preload.shows.map((show) => {
            return (
              <ShowCard show={show} />
            )
          })}
        </div>
      </div>
    )
  }
})

export default Search
```

Much like you give an HTML tag an attribute is how you give props to children components in React. Here we're passing down an object to our child component to make it available to the ShowCard via props. Neat, right? Save it and reload the page. standard is going to give you a bunch of complaints but we're going to address that momentarily. You should see the same UI.

One of the errors you'll notice in the browser console is something like: "Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Search`." You see this because we have multiple, similiar sibling components next to each other and React doesn't have a quick way to tell them apart. If you start reordering them (like if we added a sort feature) then React would just destroy and re-create them each time since it doesn't know you're just reordering them. This is unnecessarily expensive, as you may imagine, and can really kill your performance if you have a lot of complex nodes being created and destroyed. You can give React a shortcut to be able to tell them quickly apart: give each a component a unique identifier as a key attribute. So go add it to the ShowCard component like so: `<ShowCard show={show} key={show.imdbID} />`.

So let's fix our lint errors now. Airbnb lint rules dictates that all props have a propType. React has a features that allows you to set propTypes which it then validates at runtime. This ends up being great for debugging because React now knows what type of props it should be getting so it can give you a meaningful error messages if there's a type mismatch or omission. So let's go fix the errors.

In ShowCard, go add this just below the declaration of the ShowCard function:

```javascript
// add below import React
import { shape, string } from 'prop-types';

// add below ShowCard function
ShowCard.propTypes = {
  show: shape({
    poster: string.isRequired,
    title: string.isRequired,
    year: string.isRequired,
    description: string.isRequired
  }).isRequired
};
```

Now React knows to expect that show is both an object full of strings _and_ those strings are required for the ShowCard to work. If a prop is optional (which is fine if it is indeed optional) then leave off the isRequired part. You must provide a default or the Airbnb rules are going to yell at you.

We can make this a little neater via the ES6/JSX spread operator. Let's try that. Change Search's ShowCard from `<ShowCard show={show} />` to `<ShowCard {...show} key={show.imdbID} />`. This will take all the properties from show and spread them out as individual properties on ShowCard. You _could_ write `<ShowCard title={show.title} poster={show.poster} description={show.description} year={show.year} />` but that's a lot of writing and this cuts an easy corner. Let's go modify ShowCard to match. This is a dangerous tool: only do it if you know every property in the object is needed in the component (or if you're doing a higher order component, but we'll get to the later.)

```javascript
import React from 'react';
import { string } from 'prop-types';

const ShowCard = props => (
  <div className="show-card">
    <img alt={`${props.title} Show Poster`} src={`/public/img/posters/${props.poster}`} />
    <div>
      <h3>{props.title}</h3>
      <h4>({props.year})</h4>
      <p>{props.description}</p>
    </div>
  </div>
);

ShowCard.propTypes = {
  poster: string.isRequired,
  title: string.isRequired,
  year: string.isRequired,
  description: string.isRequired
};

export default ShowCard;
```

We've now made our code a bit cleaner since we don't have to props.show... ad nauseam. From here we're going to move beyond prop types: we're going to incorporate Flow types. Prop types were deprecated as being part of the main package as of 15.5 since it's extra weight if you don't need them. If you're using types (like Flow or TypeScript) then they're redundant. Let's keep going.

[map]: https://www.discovermeteor.com/blog/understanding-javascript-map/
[flow]: https://flowtype.org
[ts]: https://www.typescriptlang.org
