---
title: "Testing React with Jest, Snapshots, and Enzyme"
---

**Note**: This is using Jest. If you want to see how to test React components using [Mocha][mocha], Chai, Sinon, and Enzyme, see the [previous version][v1] of this workshop.

Now that we have something worth testing, let's test it. We're going to be using Facebook's Jest (v15.1.1) to do it since it has some neat features. Go ahead and add the following to your npm scripts: <code>"test": "jest"</code>. Then go to your JS directory and create a file called Search.spec.js. I like to make my tests live right along side the files they test but I'm okay putting them in another directory: up to you. In either case Jest is smart enough to autodiscover them if you make the extension *.spec.js.

In Search.spec.js, put:

```javascript
import React from 'react'
import Search from './Search'
import renderer from 'react-test-renderer'

test('Search should search titles', () => {
  const component = renderer.create(<Search />)
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
```

This is a snapshot test and it's a super cool new feature of Jest. Jest is going to render out the component you tell it to and dump the state of that to a file. It's basically a free unit test that the computer generates for you. If the markup changes in the future unexpectedly, your unit test will fail and you'll see why it failed.

 So then you may ask, "What happens if I update the component on purpose?" Easy! You run the test again with the -u flag and it will write out new snapshots. Awesome! Also note you're supposed to commit snapshots to git.

 Okay, so go the CLI and run <code>npm t</code> (which is just short for npm run test or npm test, they all work the same.) You're going to get some error about import being a bad token; this is true since as of Node.js 7, V8 (the JS engine that power Node.js) still doesn't understand ES6 modules, but we still want to use them in dev so we need to do some special Babel transformations just for testing. Go to your .babelrc file and put this:

```json
{
  "presets": [
    "react",
    ["es2015", {modules: false}]
  ],
  "env": {
    "test": {
      "plugins": ["transform-es2015-modules-commonjs"]
    }
  }
}
```

This will add the correct Babel transformation when you are the test environment. Now let's make it so the jest command is run in the test environment (since by default it won't). Go back and change your line in your npm scripts to be <code>"test": "NODE_ENV=test jest"</code>. Now it will apply that extra transformation for you. Now try running npm t again and see what happens. If it still fails on the import token, run <code>npm t -- --no-cache</code>. The double dash means you want to pass parameters to whatever npm is running, in this case jest, so the command you're actually running is <code>jest --no-cache</code>. That's a useful trick to know. Then Jest likes to cache Babel transformations for ones it's already done so that you don't have to do it every time; this greatly speeds up running tests but it also doesn't check to see if you updated your .babelrc. So here we need to tell it to do so.

So now that you have a passing test, try modifiying Search and running it again. It'll give you a git diff type output and you can see what changed. If it's what you expect, you just re-run the command with -u at the end, <code>npm t -- -u</code>. Let's actually put that as an npm script so we don't have to remember that. Add <code>"update-test": "npm run test -- -u"</code> to your npm scripts in package.json.

Okay, so now we have a few problems with this test. First, if we modify ShowCard, it's going to fail this test, and I think that's a problem. As much as possible, we want a Search test to only fail if something in Search breaks, and we want ShowCard to fail if ShowCard breaks. Luckily we can do that with a tool called [Enzyme][enzyme] from Airbnb and a helper tool called enzyme-to-json meant to connect Enzyme and Jest's snapshot testing. I show you both so you can see the easiest, more standard of doing snapshot testing (with react-test-renderer) and the less standard but I suggest superior way of using enzyme-to-json. Also, react-test-renderer and Enzyme can't be imported into the same file and we need to use Enzyme for other tests later.

So modifiy your test to read:

```javascript
import React from 'react'
import Search from './Search'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

test('Search render correctly', () => {
  const component = shallow(<Search />)
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
```

Run npm t and you can see the difference. Instead of rendering out all the individual shows, we're rendering stubs of ShowCard with the props going into each of them. This ends up being preferable since if ShowCard breaks, it won't break _this_ test. Run <code>npm run update-test</code>. You should see it updated your snapshot and now you're good to keep going. Let's test that if we search on the Search component, it displays the correct amount of shows.

```javascript
// add two imports
import ShowCard from './ShowCard'
import preload from '../public/data.json'

// add new test at the bottom
test('Search should render correct amount of shows', () => {
  const component = shallow(<Search />)
  expect(preload.shows.length).toEqual(component.find(ShowCard).length)
})
```

Enzyme gives us lots of useful features. In this case, we can use it to do jQuery-like selections from our app. We can actually ask it, "How times does it use this React component". Logically, based on how our app works, it should have a ShowCard for each item in the preload data, so that's what we've checked here. Let's take it a step further and see if it searches correctly.

```javascript
// underneath the last test
test('Search should render correct amount of shows based on search', () => {
  const searchWord = 'house'
  const component = shallow(<Search />)
  component.find('input').simulate('change',{target:{value: searchWord}})
  const showCount = preload.shows.filter((show) => `${show.title.toUpperCase()} ${show.description.toUpperCase()}`.includes(searchWord.toUpperCase())).length
  expect(showCount).toEqual(component.find(ShowCard).length)
})
```

Here we're making sure that the UI displays the correct amount of ShowCards for how many shows it should match. If I were to take this a bit further, I would extract that filter function to a module, test that, and then import that same function into the production environment and the test environment. Here we're duplicating logic which isn't the best idea.

We're using Enzyme's simulate function which simulate's an event on the UI. Do note that as of present, this does _not_ simulate event bubbling: you need to trigger the event on the same element that has the listener. We're making sure that if we type into the search that it filters properly.

Enzyme has two other "depths" of rendering besides shallow: full DOM rendering and static page rendering. Full DOM uses [jsdom][jsdom] to put the React app into a DOM-like environment if you need to interact with the DOM APIs. Unless you really need this, avoid it. It's _much_ slower than shallow rendering because jsdom takes a long time to bootstrap and run. You can also do static rendering which uses [Cheerio][cheerio] to parse and interact with the resulting to HTML with a jQuery like environment. Again, I'd avoid this as it is much slower but if you need to do static analysis on the HTML, static rendering is the best way.

And now you get to hear my, Brian Holt's, opinion on unit testing in React: I don't. This is an unpopular opinion so please evaluate your own decision here. Because my markup changes so frequently as I seek to make the best user experience I can, tests are outdated as soon as they're finished. Thus testing markup is counterproductive because they're constantly failing and out-of-date. Rather, what I do is I extract important pieces of generally-useful pieces of logic and unit test the hell out of those. That way as my markup thrashes and changes, I can still re-use battle-tested pieces of logic to power the UI.

That being said, snapshot testing is _so_ easy and _so_ fast to update, it seems to be worth it to me. It's such a new technology that it still remains to be proved out but as of present it's something I recommend evaluating if it's a good for you.

At this point you can go create tests for the other components but you've been taught how and you can go do so yourself. We'll move on.

[jsdom]: https://github.com/tmpvar/jsdom
[enzyme]: http://airbnb.io/enzyme/index.html
[chai]: http://chaijs.com/
[mocha]: https://mochajs.org/
[cheerio]: https://cheerio.js.org/
[v1]: TODO
