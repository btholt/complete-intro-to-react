---
title: "React: State"
---

We've discussed props which all you to have immutable state passed from parents to children. However, as any seasoned UI developer will point out, interfaces are inherently stateful. You app at some level must contain some level of mutability. React gives you a very controlled window to introduce this mutability to be able to reason easily about this mutability aptly called state.

While props are passed down from parents and are immutable, state is created, read, and mutated all _inside of_ a component. In other words, if a component has state, that state cannot be mutated by a parent, child, or any other external influence; only that same component has access to the setState method which is the only way to mutate state. That component has the ability to expose methods to children that the child can call to let the parent know it should mutate its state, but again, it is totally up to the parent to respect that call and mutate the state; the child can only call methods exposed to it via passed-down props.

So let's see this in action. We're going to add a header that allows us to search our shows.

In Search.jsx, add the following:

{% highlight javascript %}
// inside div.container, above and sibling to div.shows
<header className='header'>
  <h1 className='brand'>svideo</h1>
  <input type='text' className='search-input' placeholder='Search' />
</header>
{% endhighlight %}

Now the UI is in place. Let's start tracking what's actually in the input. But in order to do that, we need to change a bit about our component.

So far we've exclusively been using what are called "stateless function components." This are awesome because they are the simplest form of a component. Also keep in mind these are relatively new to React (v0.14+). Now we're going to convert this to what's called the ES6 class syntax. Underneath I'll throw the older "createClass" syntax so you can compare; either works and some people prefer one over the other. I'll let you be the judge.

{% highlight javascript %}
// ES6 class syntax
const React = require('react')
const ShowCard = require('./ShowCard')
const data = require('../public/data')

class Search extends React.Component {
  render () {
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>svideo</h1>
          <input type='text' className='search-input' placeholder='Search' />
        </header>
        <div className='shows'>
          {data.shows.map((show, index) => (
            <ShowCard {...show} key={index} id={index} />
          ))}
        </div>
      </div>
    )
  }
}

module.exports = Search
{% endhighlight %}

{% highlight javascript %}
const React = require('react')
const ShowCard = require('./ShowCard')
const data = require('../public/data')

const Search = React.createClass({
  render () {
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>svideo</h1>
          <input type='text' className='search-input' placeholder='Search' />
        </header>
        <div className='shows'>
          {data.shows.map((show, index) => (
            <ShowCard {...show} key={index} id={index}/>
          ))}
        </div>
      </div>
    )
  }
})

module.exports = Search
{% endhighlight %}

They each have their advantages that I won't discuss at length. I'm going to be using the ES6 one from here on out so I suggest you do that (or else you'll have to translate the examples.) And you can mix-and-match the different syntaxes too.

After switching to this syntax, your code should still work, but now we can hook into other features that React components have. Namely we're going to add state. Let's do that now.

{% highlight javascript %}
class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchTerm: 'this is the default searchTerm'
    }
  }
  render () {
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>{this.state.searchTerm}</h1>
          <input type='text' className='search-input' placeholder='Search' />
        </header>
        <div className='shows'>
          {data.shows.map((show, index) => (
            <ShowCard {...show} key={index} id={index}/>
          ))}
        </div>
      </div>
    )
  }
}
{% endhighlight %}

Notice the constructor accepts props and passes that up to React via <code>super(props)</code>. A necessary evil of boilerplate, I'm afraid. Anytime you have initial state of any sort you need to put that line in. Luckily if you forget, React has a friendly runtime error message to remind you.

I replaced the brand momentarily so you can see the see the searchTerm change. You should see whatever you made the initial state for searchTerm show up as the brand. Neat, right? Alright, let's make it mutable now. Change the input in the header to be this:

{% highlight javascript %}
<input type='text' className='search-input' placeholder='Search' value={this.state.searchTerm} />
{% endhighlight %}

Cool! Now your input should have the initial state of your searchTerm. Now try and type and/or delete anything. You can't! You broke the Internet! Just kidding. But to understand why this weird bug is happening you have to understand how React handles keypresses. Your state object on your component states that the value of searchTerm is <code>'this is the default searchTerm'</code>. When a keypress happens, React kicks off a re-render. Since nothing modified the value of searchTerm, it's still the same string and thus it re-renders the same string there. Your state object is the source of truth. So let's make the value of searchTerm bound to the value of the input.

{% highlight javascript %}
class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchTerm: 'this is the default searchTerm'
    }

    this.handleSearchTermChange = this.handleSearchTermChange.bind(this)
  }
  handleSearchTermChange (event) {
    this.setState({ searchTerm: event.target.value })
  }
  render () {
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>{this.state.searchTerm}</h1>
          <input type='text' className='search-input' placeholder='Search' value={this.state.searchTerm} onChange={this.handleSearchTermChange} />
        </header>
        <div className='shows'>
          {data.shows.map((show, index) => (
            <ShowCard {...show} key={index} id={index}/>
          ))}
        </div>
      </div>
    )
  }
}
{% endhighlight %}

Now try typing in the input. As you see, the title is now reflective of whatever you type in the search input. So let's chat about what we did here. We made an event listener that handles the change events that the input throws off when it has a keypress. That event listener accepts an event that's technically a React synthetic event but its API looks just like a normal DOM event. In the event listener, we call <code>this.setState</code>, a method that allows you to mutate the state and then lets React re-render. If you don't call setState and instead mutate <code>this.state</code> yourself, React isn't privy to the fact the fact that you're changing stuff and thus doesn't know to re-render. In other words, never modify <code>this.state</code> directly and always just use setState. setState works like <code>Object.assign</code> in that it will do a merge of your objects (it's a shallow merge and not a deep merge) so you're free to just modify the keys you need to. Finally, in the constructor we added a line to bind the correct context of the event listener since we need to ensure that handleSearchTermChange is always called with the correct context.

So go back now and change the brand to the correct title.

Let's make the search actually _do_ something now. Since now we have our state being tracked, let's use it do a real time search on our titles.

{% highlight javascript %}
<div className='shows'>
  {data.shows
    .filter((show) => `${show.title} ${show.description}`.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) >= 0)
    .map((show, index) => (
      <ShowCard {...show} key={index} id={index} />
  ))}
</div>
{% endhighlight %}

This is a little clever but let's dissect the new filter line we added. We're looking at both the title and description lines to search on and using the indexOf method from strings to see if the searchTerm exists within the description or title. We use toUpperCase on both to make it case agnostic. And the filter method on arrays just filters out items in an array that the method returns false on. Now try typing in your searchBox. You should see it filter as you type. We could make this more efficient but I'll leave that to you in your own time.
