---
title: "React: State"
---

We've discussed props which all you to have immutable state passed from parents to children. However, as any seasoned UI developer will point out, user interfaces are inherently stateful. You app at some level must contain some level of mutability. React gives you a very controlled window to introduce this mutability to be able to reason easily about this mutability aptly called state.

While props are passed down from parents and are immutable, state is created, read, and mutated all _inside of_ a component. In other words, if a component has state, that state cannot be mutated by a parent, child, or any other external influence; only that same component has access to the setState method which is the only way to mutate state. That component has the ability to expose methods to children that the child can call to let the parent know it should mutate its state, but again, it is totally up to the parent to respect that call and mutate the state; the child can only call methods exposed to it via passed-down props.

So let's see this in action. We're going to add a header that allows us to search our shows.

In Search.jsx, add the following:

```javascript
// inside div.search, above and sibling to the div that contains the shows
<header>
  <h1>svideo</h1>
  <input type='text' placeholder='Search' />
</header>
```

Now the UI is in place. You should see a little header bar at the top. Let's start tracking what's actually in the input.

So far we've been using stateless functional components. These are amazing sicne they're the least complicated and therefore have the smallest surface area for bugs for you. But now we need to graduate to a full React class. There are two ways to accomplish this: ES6 classes and React.createClass. The React team has announced their intent to deprecate React.createClass and therefore we're teaching ES6 classes today. You can still use createClass: you just have include [another package][create-class]. But I suggest you use ES6 since that's the future.

ES6 classes have a lot to them and we're not going to really cover them super in-depth. If you need a more complete briefing on ES6 classes, [check 2ality][classes].

So our goal here is to track the contents of the input with React. We want React to be the source of truth of what's the search query is, not what lives in the DOM. This seems like splitting hairs but it's important. With data you always want one go-to place to get the truth: any time you try to synchronize two sources of truth, it's inevitably a never-ending font of bugs. Suffice to say: we want it to live in React and then have the DOM reflect that truth.

Before we do that, let's refactor to use a class instead of a stateless functional component.

```javascript
import React, { Component } from 'react';
import preload from '../data.json';
import ShowCard from './ShowCard';

class Search extends Component {
  render() {
    return (
      <div className="search">
        <header>
          <h1>svideo</h1>
          <input type="text" placeholder="Search" />
        </header>
        <div>
          {preload.shows.map(show => <ShowCard key={show.imdbID} {...show} />)}
        </div>
      </div>
    );
  }
}

export default Search;
```

Your ESLint will yell since this should be a stateless functional component: ignore it for now. But this is equivalent. Now that we've done that, let's add our statefulness.

```javascript
  // add to top of Search class
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: 'this is a debug statement'
    };
  }

// replace header
<header>
  <h1>{this.state.searchTerm}</h1>
  <input value={this.state.searchTerm} type="text" placeholder="Search" />
</header>
```

You'll see some errors/warnings in the console. Ignore for now.

I replaced the brand momentarily so you can see the see the searchTerm change. You should see whatever you made the initial state for searchTerm show up as the brand. Neat, right?

Now your input should have the initial state of your searchTerm. Now try and type and/or delete anything. You can't! You broke the Internet! Just kidding. But to understand why this weird bug is happening you have to understand how React handles keypresses. Your state object on your component states that the value of searchTerm is `'this is the default searchTerm'`. When a keypress happens, React kicks off a re-render. Since nothing modified the value of searchTerm, it's still the same string and thus it re-renders the same string there. Your state object is the source of truth. So let's make the value of searchTerm bound to the value of the input.

In other words, two data binding is not free in React. This is an advantage because it makes React less magical and thus easier to understand. A lesser imporant facet is that it's also more performant.

```javascript
// add to constructor
this.handleSearchTermChange = this.handleSearchTermChange.bind(this);

// add method
handleSearchTermChange (event) {
  this.setState({ searchTerm: event.target.value })
}

// replace input
<input
  onChange={this.handleSearchTermChange}
  value={this.state.searchTerm}
  type="text"
  placeholder="Search"
/>
```

Now try typing in the input. As you see, the title is now reflective of whatever you type in the search input. So let's chat about what we did here. We made an event listener that handles the change events that the input throws off when it has a keypress. That event listener accepts an event that's technically a React synthetic event but its API looks just like a normal DOM event. In the event listener, we call `this.setState`, a method that allows you to mutate the state and then lets React re-render. If you don't call setState and instead mutate `this.state` yourself, React isn't privy to the fact the fact that you're changing stuff and thus doesn't know to re-render. In other words, never modify `this.state` directly and always just use setState. setState works like `Object.assign` in that it will do a merge of your objects (it's a shallow merge and not a deep merge) so you're free to just modify the keys you need to.

One bit of weirdness is the binding of context in the constructor. Yeah, I don't like it either. Let's talk about why you need it. Inside of `handleSearchTerm` you call `this.setState`. What `this` is in that context is important: it must refere to the instance of the Search class. So what context are in event listeners called in? The answer is not that one you need! (It's undefined in this case.) So you need to ensure that `this` refers to that Search component. There are several ways to accomplish this:

- On the input component, we could put `onChange={() =>this.handleSearchTermChange()}`. Since it's an arrow function, a new context won't be created and thus Search would be the context. This is bad because every time that render is called (which can vary from a lot to a whole 💩 ton) a new function is created. That _sucks_ for performance. Bind is not a cheap function call (depending on which JS engine you're in.) So don't do it. I show you because I see it in projects sometimes so I wanted to show you what's going on.
- We can do just what I showed you: bind it in the constructor. This is what I typically do.
- You can use `create-react-class` (the package I referred to earlier.) This autobinds the context for you.
- Use the [transform-class-properties][tcp] Babel transform. If I were doing a personal project I'd do this but probably not at my company. This leverages a stage 2 proposal of a feature to be added to JS: Public Class Fields. Instead of `handleSearchTermChange(event) { /* body */ }` you'd have `handleSearchTerm = () => { /* body * }`. I believe this feature will make the language, but until things reach stage 3 I'm uncomfortable adding it to a long-term-supported repo. Again, because it's an arrow function, the context will be correct.

So go back now and change the brand to the correct title.

Let's make the search actually _do_ something now. Since now we have our state being tracked, let's use it do a real time search on our titles.

```javascript
// replace div inside search which contains shows
<div>
  {preload.shows
    .filter(
      show =>
        `${show.title} ${show.description}`.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) >= 0
    )
    .map((show, index) => <ShowCard {...show} key={show.imdbID} id={index} />)}
</div>
```

This is a little clever but let's dissect the new filter line we added. We're looking at both the title and description lines to search on and using the indexOf method from strings to see if the searchTerm exists within the description or title. We use toUpperCase on both to make it case agnostic. And the filter method on arrays just filters out items in an array that the method returns false on. Now try typing in your searchBox. You should see it filter as you type. We could make this more efficient but I'll leave that to you in your own time.

If you're unfamiliar with filter, [check this out][filter]. If you're unfamiliar with arrow functions, [check this out][arrow]. If you're unfamiliar with indexOf, [look here][indexOf]. And finally, for template strings (the back ticks instead of the quotes for the strings) [look here][template].

[filter]: http://adripofjavascript.com/blog/drips/filtering-arrays-with-array-filter
[arrow]: http://www.2ality.com/2012/04/arrow-functions.html
[indexOf]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
[template]: https://developers.google.com/web/updates/2015/01/ES6-Template-Strings
[classes]: http://2ality.com/2015/02/es6-classes-final.html
[create-class]: http://2ality.com/2015/02/es6-classes-final.html
[tcp]: https://babeljs.io/docs/plugins/transform-class-properties/
