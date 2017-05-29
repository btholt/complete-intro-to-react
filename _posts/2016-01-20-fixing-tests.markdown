---
title: "Fixing Our Tests and Testing Redux"
---

So we broke all of our tests. They all fail now. High five! This is a big reason why I'm hesitant to test UI code: I find my tests break all the time just because I'm rewriting markup or other code. Nonetheless, let's refix our tests and add two for Redux. As opposed to testing React which I don't do much of, I test the hell out of my Redux code. Redux code is very testable by design and you should cover all or nearly-all of your reducers with tests.

At the end of Search.jsx add:

```javascript
export const Unwrapped = Search
```

We need an "unconnected" version of Search to test. We're decoupling this from Redux so we can just test the React portion. It will still work without Redux as long as we pass in proper parameters. Go to Search.spec.jsx.

```javascript
// import the new Unwrapped Search as just Search
import Search, { Unwrapped as UnwrappedSearch } from '../Search';

// in the first test, change the shallow call
const component = shallow(<UnwrappedSearch shows={preload.shows} searchTerm='' />);

// in the second test, change the shallow call
const component = shallow(<UnwrappedSearch shows={preload.shows} searchTerm='' />);

// go ahead and comment out the last test so we can test these first two first
```

Once we provide the proper params, these tests will be able to pass again. The snapshot is going to fail because we wrapped Header with a connect but go ahead and run `npm run update-test` to take care of that.

Since the last test tests the integration of Header and Search which were previously married together, we're going to need to do two things: switch our render to be able to render Header inside of Search instead of just stubbing it out and we're going to have to bring in Redux and integrate that.

```javascript
// imports at top
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../store';
import { setSearchTerm } from '../actionCreators';
import { shallow, render } from 'enzyme' // add render import

// replace last test
test('Search should render correct amount of shows based on search', () => {
  const searchWord = 'New York';
  store.dispatch(setSearchTerm(searchWord));
  const component = render(
    <Provider store={store}>
      <MemoryRouter>
        <Search shows={preload.shows} />
      </MemoryRouter>
    </Provider>
  );
  const showCount = preload.shows.filter(show =>
    `${show.title.toUpperCase()} ${show.description.toUpperCase()}`.includes(searchWord.toUpperCase())
  ).length;
  expect(showCount).toEqual(component.find('.show-card').length);
});
```

We need to simulate events to Redux instead of to the DOM. Ultimately this isn't a big deal since you should be testing that action creator individually anyway. We also need to use Provider to make Redux work for Header since that's how Header and Search communicate now. Also, we can't do the ShowCard component trick anymore with render since it's not stubbing out ShowCard so we're just checking for the CSS class instead.

Since our ShowCard is using styled-components, we don't know what that CSS class is actually going to be. Luckily, we can add our own class on there. Go to ShowCard.jsx and add:

```javascript
// replace wrapper
<Wrapper className="show-card" to={`/details/${this.props.imdbID}`}>
  […]
</Wrapper>
``` 

Notice we also have to bring in react-router's MemoryRouter too. Since ShowCard has a Link in it, it depnds on a router being available. Since we're not in the DOM and not testing router-related functionality, it's enough to use the MemoryRouter which will allow it to work without having a DOM present. Super useful.

There's a layer deeper that you can go with Enzyme: static rendering with [Cheerio][cheerio]. If you need to do serious manipulation, this is the tool you need to go with. Be forewarned this slows down startup a lot since it brings in jsdom and it is slow as 💩 to start up.

Cool! Let's go test Redux now.

One of the primary reasons to use Redux is how testable it is. It was a big part of its design. Redux makes you create [pure functions][pure]. These functions are then able to pulled out and thoroughly tested. And, lucky for us, Redux dev tools now lets you generate test automatically! Open Search and paste the word "orange" in there. We paste it so it's one atomic operation. Open the Redux dev tools and select the last action. Click on the test tab. You'll see an automatically generated test! Copy that and paste it into reducers.spec.js. You may have to mess with the paths to get it correct. You also may have to modify the let to be a const to get ESLint to shut up. I also like to name the tests after their action name.

```javascript
import reducers from '../reducers';

test('SET_SEARCH_TERM', () => {
  const state = reducers({ searchTerm: '', apiData: {} }, { type: 'SET_SEARCH_TERM', payload: 'orange' });
  expect(state).toEqual({ searchTerm: 'orange', apiData: {} });
});
```

Free tests. All we have to do is recreate what we want to test, copy, paste, and commit! Pretty slick. In this particular case, it's not terribly interesting. But you can't beat how low effort it is to get a test out the door. And if you have to later throw this test away you won't care because it was a minute to create start-to-finish. And if you get more complex Redux actions you can save _a lot_ of time doing this. Let's also grab the @@INIT action to make sure we bootstrap the way we think.

```javascript
test('@@INIT', () => {
  const state = reducers(undefined, {});
  expect(state).toEqual({ searchTerm: '', apiData: {} });
});
```

Add one more for ADD_API_DATA after navigating to Details page:

```javascript
test('ADD_API_DATA', () => {
  const state = reducers(
    { searchTerm: 'orange', apiData: {} },
    {
      type: 'ADD_API_DATA',
      payload: {
        rating: '0.8',
        title: 'Orange Is the New Black',
        year: '2013–',
        description: 'The story of Piper Chapman, a woman in her thirties who is sentenced to fifteen months in prison after being convicted of a decade-old crime of transporting money for her drug-dealing girlfriend.',
        poster: 'oitnb.jpg',
        imdbID: 'tt2372162',
        trailer: 'th8WT_pxGqg'
      }
    }
  );
  expect(state).toEqual({
    searchTerm: 'orange',
    apiData: {
      tt2372162: {
        rating: '0.8',
        title: 'Orange Is the New Black',
        year: '2013–',
        description: 'The story of Piper Chapman, a woman in her thirties who is sentenced to fifteen months in prison after being convicted of a decade-old crime of transporting money for her drug-dealing girlfriend.',
        poster: 'oitnb.jpg',
        imdbID: 'tt2372162',
        trailer: 'th8WT_pxGqg'
      }
    }
  });
});
```

Let's go test our actionCreators. Create a new spec called `actionCreators.spec.js` and add this:

```javascript
// @flow

import { setSearchTerm, addAPIData } from '../actionCreators';

test('setSearchTerm', () => {
  expect(setSearchTerm('New York')).toMatchSnapshot();
});

test('addAPIData', () => {
  expect(
    addAPIData({
      rating: '0.8',
      title: 'Orange Is the New Black',
      year: '2013–',
      description: 'The story of Piper Chapman, a woman in her thirties who is sentenced to fifteen months in prison after being convicted of a decade-old crime of transporting money for her drug-dealing girlfriend.',
      poster: 'oitnb.jpg',
      imdbID: 'tt2372162',
      trailer: 'th8WT_pxGqg'
    })
  ).toMatchSnapshot();
});
```

Since actions are just objects that easily serializable, snapshots are perfect to test them. This way if their shape ever changes, you'll instantly know (if it somehow slips by Flow) and it'll be easy to update if that's anticipated.

Okay, now let's test our thunk. This is a bit trickier to test since we need to handle asynchronous behavior and mock out AJAX requests. Luckily [moxios][moxios] is a nice helper for axios for testing. Let's take a look at what that looks like:

```javascript
// at the top
import moxios from 'moxios';

// move this to an object that we can reuse
const oitnb = {
  rating: '0.8',
  title: 'Orange Is the New Black',
  year: '2013–',
  description: 'The story of Piper Chapman, a woman in her thirties who is sentenced to fifteen months in prison after being convicted of a decade-old crime of transporting money for her drug-dealing girlfriend.',
  poster: 'oitnb.jpg',
  imdbID: 'tt2372162',
  trailer: 'th8WT_pxGqg'
};

// modify the addAPIData test to use the object
test('addAPIData', () => {
  expect(addAPIData(oitnb)).toMatchSnapshot();
});

// at the bottom
test('getAPIDetails', (done: Function) => {
  const dispatchMock = jest.fn();
  moxios.withMock(() => {
    getAPIDetails(oitnb.imdbID)(dispatchMock);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: oitnb
        })
        .then(() => {
          expect(request.url).toEqual(`http://localhost:3000/${oitnb.imdbID}`);
          expect(dispatchMock).toBeCalledWith(addAPIData(oitnb));
          done();
        });
    });
  });
});
```
Notice we're providing a `done` function to the test. This is because this is an async test and without it the test will complete synchronously. We need it to wait until the async behavior completes.

The first thing in the function we're doing is creating a spy function with Jest. This is the same as what [sinon][sinon] does for you: it's a function we can use to make sure that the callbacks are being called with the write parameters and the correct amount of times.

Next we're calling `moxios.withMock`. This is specific to moxios and something you actually could achieve with Jest's mocking capabilites alone but since moxios exists it's an easy companion to use with axios. This will stub out the axios require inside of actionCreators.js and make it so it's mocked instead of actually trying to make an AJAX call.

Inside we invoke the actionCreators, first creating the thunk with the correct ID, then invoking the returned thunk with the mocked dispatch function. A bit weird, but it makes sense. The actionCreators returns a function (which typically Redux calls for you with its dispatch function) and we call it with our mock dispatch function.

After we invoke the thunk, we have to wait since it's async code, hence the wait function. Once inside there, we can inspect the moxios request, tell it what to respond with, and then examine that response after the promise it returns completes. This can be confusing due to the multiple levels of async we're dealing with to achieve the ability to test the dispatch params and the URL axios is calling, but I'd say with it. Now we can be certain the API request is happening to the URL we anticipate and it's creating appropriate action based on the API call made.

That's how you create a test for a thunk! As you may see, when you introduce Redux to a React codebase, it makes the data layers a bit easier to test (testing that async behavior in React would be tough; it's not too bad in Redux) but at the cost of making React much tougher to test due to the Redux integration. Again, make your own judgment call as to what's important to you. 

[cheerio]: http://cheeriojs.github.io/cheerio/
[pure]: http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/
