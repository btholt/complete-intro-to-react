---
title: "Fixing Our Tests and Testing Redux"
---

So we broke all of our tests. They all fail now. High five! This is a big reason why I'm hesitant to test UI code: I find my tests break all the time just because I'm rewriting markup or other code. Nonetheless, let's refix our tests and add two for Redux. As opposed to testing React which I don't do much of, I test the hell out of my Redux code. Redux code is very testable by design and you should cover all or nearly-all of your reducers with tests.

At the end of Search.js add:

```javascript
export const Unwrapped = Search
```

We need an "unconnected" version of Search to test. We're decoupling this from Redux so we can just test the React portion. It will still work without Redux as long as we pass in proper parameters. Go to Search.spec.js.

```javascript
// import the new Unwrapped Search as just Search
import { Unwrapped as UnwrappedSearch} from './Search'

// in the first test, change the shallow call
const component = shallow(<UnwrappedSearch shows={preload.shows} searchTerm='' />)

// in the second test, change the shallow call
const component = shallow(<UnwrappedSearch shows={preload.shows} searchTerm='' />)

// go ahead and comment out the last test so we can test these first two first
```

Once we provide the proper params, these tests will be able to pass again. The snapshot is going to fail because we wrapped Header with a connect but go ahead and run `npm run update-test` to take care of that.

Since the last test tests the integration of Header and Search which were previously married together, we're going to need to do two things: switch our render to be able to render Header inside of Search instead of just stubbing it out and we're going to have to bring in Redux and integrate that.

```javascript
// imports at top
import { Provider } from 'react-redux'
import store from './store'
import { setSearchTerm } from './actionCreators'
import { shallow, render } from 'enzyme' // add render import

// replace last test
test('Search should render correct amount of shows based on search', () => {
  const searchWord = 'house'
  store.dispatch(setSearchTerm(searchWord))
  const component = render(<Provider store={store}><Search shows={preload.shows} /></Provider>)
  const showCount = preload.shows.filter((show) => `${show.title.toUpperCase()} ${show.description.toUpperCase()}`.includes(searchWord.toUpperCase())).length
  expect(showCount).toEqual(component.find('.show-card').length)
})
```

We need to simulate events to Redux instead of to the DOM. Ultimately this isn't a big deal since you should be testing that action creator individually anyway. We also need to use Provider to make Redux work for Header since that's how Header and Search communicate now. Also, we can't do the ShowCard component trick anymore with render since it's not stubbing out ShowCard so we're just checking for the CSS class instead.

There's a layer deeper that you can go with Enzyme: static rendering with [Cheerio][cheerio]. If you need to do serious manipulation, this is the tool you need to go with. Be forewarned this slows down startup a lot since it brings in jsdom and it is slow as 💩 to start up.

Cool! Let's go test Redux now.

One of the primary reasons to use Redux is how testable it is. It was a big part of its design. Redux makes you create [pure functions][pure]. These functions are then able to pulled out and thoroughly tested. And, lucky for us, Redux dev tools now lets you generate test automatically! Open Search and paste the word "orange" in there. We paste it so it's one atomic operation. Open the Redux dev tools and select the last action. Click on the test tab. You'll see an automatically generated test! Copy that and paste it into reducers.spec.js. You may have to mess with the paths to get it correct. And get rid of the semi-colons!

```javascript
import reducers from './reducers'

test('SET_SEARCH_STATE', () => {
  let state
  state = reducers({searchTerm:''}, {type:'SET_SEARCH_TERM',searchTerm:'orange'})
  expect(state).toEqual({searchTerm:'orange'})
})
```

Free tests. All we have to do is recreate what we want to test, copy, paste, and commit! Pretty slick. In this particular case, it's not terribly interesting. But you can't beat how low effort it is to get a test out the door. And if you have to later throw this test away you won't care because it was a minute to create start-to-finish. And if you get more complex Redux actions you can save _a lot_ of time doing this. Let's also grab the @@INIT action to make sure we bootstrap the way we think.

```javascript
test('@@INIT', () => {
  let state
  state = reducers(undefined, {})
  expect(state).toEqual({searchTerm:''})
})
```

You can also test your actionCreators by making sure they craft their action objects correctly but I'll leave that to you. For now this is enough!

[cheerio]: http://cheeriojs.github.io/cheerio/
[pure]: http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/
