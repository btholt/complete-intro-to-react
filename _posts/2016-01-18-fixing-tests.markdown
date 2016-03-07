---
title: "Fixing Our Tests and Testing redux"
---

So we broke all of our tests. They all fail now. High five! This is a big reason why I'm hesitant to test UI code: I find my tests break all the time just because I'm rewriting markup or other code. None the less, let's refix our tests and add two for redux. As opposed to testing React which I don't do much of, I test the hell out of my redux code. redux code is very testable and you should cover all or nearly-all of your reducers with tests.

Cool, open our spec doc. Let's fix these tests one-at-a-time. For the last two tests, change their method calls from <code>it( ... )</code> to <code>xit( ... )</code>. This will prevent Mocha from running them so we can work on them one-at-a-time.

The first test is actually testing Header so let's move it to its own describe too.

{% highlight javascript %}
// change what's pulled in from enzyme
const { render } = enzyme

// more requires
const Header = require('../js/Header')
const Store = require('../js/Store')
const { store } = Store

// new describe
describe('<Header />', () => {
  it('should render the brand', () => {
    const wrapper = render(<Header store={store} />)
    expect(wrapper.find('h1.brand').text()).to.equal('svideo')
  })
})
{% endhighlight %}

So because of all the misdirection and wrapping components that accompany the react-redux bindings, we lost our ability to shallow render. As such, we have to fallback to our jsdom, render version. This is much slower. You can take the time to unwrap all the pieces to make the shallow version work; we're just not going to do it here.

Here we don't need to wrap <Header /> in a <Provider /> because while consuming the store, we're not actually going to test the interaction with redux, just the markup.

Let's move on to our first <Search /> test.

{% highlight javascript %}
// more requires
const ReactRedux = require('react-redux')
const { Provider } = ReactRedux

// delete ShowCard require

// inside it('search' ... )
const mockRoute = {
  shows: data.shows
}

it('should render as many shows as there are data for', () => {
  const wrapper = render(<Provider store={store}><Search route={mockRoute} /></Provider>)
  expect(wrapper.find('div.show-card').length).to.equal(data.shows.length)
})
{% endhighlight %}

We have to mock what react-router would give to the Search route. Other than than that, this look pretty familiar. We have to move from the friendly enzyme wrapper to the less-friendly [Cheerio][cheerio] wrapper.

Let's rewrite out last test.

{% highlight javascript %}
it('should filter correctly given new state', () => {
  store.dispatch({ type: 'setSearchTerm', value: 'house'})
  const wrapper = render(<Provider store={store}><Search route={mockRoute} /></Provider>)
  expect(wrapper.find('div.show-card').length).to.equal(2)
})
{% endhighlight %}

Here we're passing the state already into the component. Make sure the dispatch comes before the render so that the component will have the correct state when it goes to render.

## Testing redux

Let's add two more tests to show how to test redux. First we need to add a new line to Store because we really want to test our reducers.

{% highlight javascript %}
module.exports = { connector, store, reducer }
{% endhighlight %}

Now go back to App.spec

{% highlight javascript %}
// import reducer too
const { store, reducer } = Store

// add new suite
describe('Store', () => {
  it('should bootstrap', () => {
    const state = reducer(undefined, { type: '@@redux/INIT' })
    expect(state).to.deep.equal({ searchTerm: '' })
  })
})
{% endhighlight %}

Great, so now we know our reducer creates our app the way we want to. Let's make sure that the setSearchTerm action works too.

{% highlight javascript%}
it('should handle setSearchTerm actions', () => {
  const state = reducer({ searchTerm: 'some random string' }, { type: 'setSearchTerm', value: 'correct string'})
  expect(state).to.deep.equal({ searchTerm: 'correct string' })
})
{% endhighlight %}

That's it! Reducers are easy to test due to their functional nature. Something key with reducers is that they are __pure__ functions. Means that they don't modify any state around them (including the params you pass in.) They only perform a transformation and return a new items.

[cheerio]: http://cheeriojs.github.io/cheerio/