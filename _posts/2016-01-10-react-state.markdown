---
title: "React: State"
---

We've discussed props which all you to have immutable state passed from parents to children. However, as any seasoned UI developer will point out, user interfaces are inherently stateful. You app at some level must contain some level of mutability. React gives you a very controlled window to introduce this mutability to be able to reason easily about this mutability aptly called state.

While props are passed down from parents and are immutable, state is created, read, and mutated all _inside of_ a component. In other words, if a component has state, that state cannot be mutated by a parent, child, or any other external influence; only that same component has access to the setState method which is the only way to mutate state. That component has the ability to expose methods to children that the child can call to let the parent know it should mutate its state, but again, it is totally up to the parent to respect that call and mutate the state; the child can only call methods exposed to it via passed-down props.

So let's see this in action. We're going to add a header that allows us to search our shows.

In Search.js, add the following:

```javascript
// inside div.search, above and sibling to the div that contains the shows
<header>
  <h1>svideo</h1>
  <input type='text' placeholder='Search' />
</header>
```

Now the UI is in place. Let's start tracking what's actually in the input.

```javascript
import React from 'react'
import ShowCard from './ShowCard'
import preload from '../public/data.json'

const Search = React.createClass({
  getInitialState () {
    return {
      searchTerm: 'this is the default searchTerm'
    }
  },
  render () {
    return (
      <div className='search'>
        <header>
          <h1>{this.state.searchTerm}</h1>
          <input type='text' placeholder='Search' />
        </header>
        <div>
          {preload.shows.map((show) => {
            return (
              <ShowCard {...show} key={show.imdbID} />
            )
          })}
        </div>
      </div>
    )
  }
})

export default Search
```

I replaced the brand momentarily so you can see the see the searchTerm change. You should see whatever you made the initial state for searchTerm show up as the brand. Neat, right? Alright, let's make it mutable now. Change the input in the header to be this:

```javascript
<input type='text' placeholder='Search' value={this.state.searchTerm} />
```

Cool! Now your input should have the initial state of your searchTerm. Now try and type and/or delete anything. You can't! You broke the Internet! Just kidding. But to understand why this weird bug is happening you have to understand how React handles keypresses. Your state object on your component states that the value of searchTerm is <code>'this is the default searchTerm'</code>. When a keypress happens, React kicks off a re-render. Since nothing modified the value of searchTerm, it's still the same string and thus it re-renders the same string there. Your state object is the source of truth. So let's make the value of searchTerm bound to the value of the input.

```javascript
// add method
handleSearchTermChange (event) {
  this.setState({ searchTerm: event.target.value })
},

// replace input
<input type='text' placeholder='Search' value={this.state.searchTerm} onChange={this.handleSearchTermChange} />
```

Now try typing in the input. As you see, the title is now reflective of whatever you type in the search input. So let's chat about what we did here. We made an event listener that handles the change events that the input throws off when it has a keypress. That event listener accepts an event that's technically a React synthetic event but its API looks just like a normal DOM event. In the event listener, we call <code>this.setState</code>, a method that allows you to mutate the state and then lets React re-render. If you don't call setState and instead mutate <code>this.state</code> yourself, React isn't privy to the fact the fact that you're changing stuff and thus doesn't know to re-render. In other words, never modify <code>this.state</code> directly and always just use setState. setState works like <code>Object.assign</code> in that it will do a merge of your objects (it's a shallow merge and not a deep merge) so you're free to just modify the keys you need to.

So go back now and change the brand to the correct title.

Let's make the search actually _do_ something now. Since now we have our state being tracked, let's use it do a real time search on our titles.

```javascript
// replace div inside search which contains shows
<div>
  {data.shows
    .filter((show) => `${show.title} ${show.description}`.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) >= 0)
    .map((show, index) => (
      <ShowCard {...show} key={index} id={index} />
  ))}
</div>
```

This is a little clever but let's dissect the new filter line we added. We're looking at both the title and description lines to search on and using the indexOf method from strings to see if the searchTerm exists within the description or title. We use toUpperCase on both to make it case agnostic. And the filter method on arrays just filters out items in an array that the method returns false on. Now try typing in your searchBox. You should see it filter as you type. We could make this more efficient but I'll leave that to you in your own time.

If you're unfamiliar with filter, [check this out][filter]. If you're unfamiliar with arrow functions, [check this out][arrow]. If you're unfamiliar with indexOf, [look here][indexOf]. And finally, for template strings (the back ticks instead of the quotes for the strings) [look here][template].

[filter]: http://adripofjavascript.com/blog/drips/filtering-arrays-with-array-filter
[arrow]: http://www.2ality.com/2012/04/arrow-functions.html
[indexOf]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
[template]: https://developers.google.com/web/updates/2015/01/ES6-Template-Strings
