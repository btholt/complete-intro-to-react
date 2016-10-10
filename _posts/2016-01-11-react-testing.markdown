---
title: "Testing React with Mocha, Chai, and Enzyme"
---

So now we have a component worth testing so let's do that. We're going to be using the old standbys [Mocha][mocha] and [Chai][chai]. These principles will generally apply to AVA or Jasmine too but I rolled with Mocha due to the fact that I've used it for so long that it's easy for me teach.

We're also going to be using a testing helper from our friends at Airbnb called [Enzyme][enzyme]. Enzyme is just some helpers to make testing React components easier. You don't have to use it; the React testing utils are great too (and you can use both of them at the same time too.)

So, first things first. Create a directory called test. In our test environment, we need a few things to happen. We need JSX/ES6 transpilation to happen or our tests will crash on the unfamiliar syntax. We also need a fake DOM for React to interact with which we'll get from a library called [jsdom][jsdom].

So in your test directory, create another directory called helpers (these files are automatically excluded from being run as tests by Mocha) and create a file called setup.js. In setup.js, put

{% highlight javascript %}
require('babel-register')
require('babel-polyfill')

global.document = require('jsdom').jsdom('<body><div id="app"></div></body>')
global.window = document.defaultView
global.navigator = window.navigator
{% endhighlight %}

This little setup is totally lifted from [Kent C. Dodds][kcd]. Thanks Kent.

Now that we have our environment set up, let's get our tests set up as an npm script. Add the following to your scripts object in your package.json

{% highlight json %}
"test": "mocha --require test/helpers/setup.js",
{% endhighlight %}

You can add <code>-R nyan</code> to the end for fun too. This changes the reporter to be the [Nyan Cat][nyan] and I just can't help my self. There are other [reporters][reporters]. The <code>--require</code> part just makes sure that our setup gets run first before our specs too. I tend to leave it off since it doesn't report the tests that do pass and that's so satisfying for me

Great! Let's start writing some tests. For this workshop we're just going to shove all our tests into one spec but I encourage you to do split them up into different files as appropriately split-up files. Create a new file called App.spec.js. The .spec.js convention is just to let your future self / other coders know that this file corresponds to the whole app. In this case it's not significant what it's called (the naming is significant in other testing frameworks.)

In your new file, put:

{% highlight javascript %}
/* eslint-env mocha */
const chai = require('chai')
const { expect } = chai

describe('<Search />', () => {
  it('should pass', () => {
    expect(1 + 1 === 2).to.be.true
  })
})
{% endhighlight %}

The first line is to let eslint know that this file is run through Mocha and thus a certain of globals made available by Mocha are okay to use (like describe and it.) You'll have to put this pragma at the beginning of all your tests so it won't fail lint. Next we're requiring Chai which is our assertions library. I like the expect way of doing tests but you're okay to use assert or should. And then we're just setting up a stupid test to make sure it's all working. Run your test and you should see one test passing.

Now that our test is passing, let's make some real tests. Let's test to make sure that our branding is always showing up. Because branding is important, right? Delete our bogus test and put:

{% highlight javascript %}
/* eslint-env mocha */
const React = require('react')
const chai = require('chai')
const { expect } = chai
const Search = require('../js/Search')
const enzyme = require('enzyme')
const { shallow } = enzyme

describe('<Search />', () => {
  it('should render the brand', () => {
    const wrapper = shallow(<Search />)
    expect(wrapper.contains(<h1 className='brand'>svideo</h1>)).to.be.true
  })
})
{% endhighlight %}

So now we're pulling in Enzyme and using its shallow-rendering ability. This means it will render everything except its child composite component. In this case, the only composite components are the ShowCards so it won't reach down into the ShowCards to render them; just stubs. This is sufficient to test if the branding is there. A neat trick is to put <code>console.log(wrapper.debug())</code>. That will show you what it's dealing with. Let's add another more useful test.

{% highlight javascript %}
// add two more requires at the top
const ShowCard = require('../js/ShowCard')
const data = require('../public/data')

// add another test inside the describe
  it('should render as many shows as there are data for', () => {
    const wrapper = shallow(<Search />)
    expect(wrapper.find(ShowCard).length).to.equal(data.shows.length)
  })
{% endhighlight %}

Here we're testing to see if all the initial ShowCards are getting rendered. There should be a ShowCard for every show in the preload. Let's add one more to test the search functionality.

{% highlight javascript %}
// also pull out mount
const { shallow, mount } = enzyme

// add another test inside of describe
it('should filter correctly given new state', () => {
  const wrapper = mount(<Search />)
  const input = wrapper.find('.search-input')
  input.node.value = 'house'
  input.simulate('change')
  expect(wrapper.state('searchTerm')).to.equal('house')
  expect(wrapper.find('.show-card').length).to.equal(2)
})
{% endhighlight %}

Since we're now interacting with the App programmatically, we have to use the much slower and expensive mount which will use jsdom to simulate a real DOM. We're going to change the input and make sure the state changes and that the search works the way we expect by narrowing it down to the two pertinent results.

Cool! Now we have some unit tests in place. Now let's talk about my theory around unit testing and React: I never write tests like this. I don't test my UI code ever. My UI is ever shifting and in reality, I don't much care if my markup changes. I expect to as we design and iterate on the website. However I do test the hell out of my business logic which I'll separate into small modules. In any case, I've shown you how to test your React and I'll let you decide.

[jsdom]: https://github.com/tmpvar/jsdom
[enzyme]: http://airbnb.io/enzyme/index.html
[chai]: http://chaijs.com/
[mocha]: https://mochajs.org/
[kcd]: https://github.com/kentcdodds/react-ava-workshop/blob/master/other/setup-ava-tests.js
[nyan]: http://www.nyan.cat/
[reporters]: https://mochajs.org/#reporters