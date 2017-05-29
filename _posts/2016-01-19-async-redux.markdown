---
title: "Async Redux"
---

Redux by default has no mechanism for handling asynchronous actions. This means you either need handle everything async in your React (gross) or we have to augment Redux to handle async code. The former is really a non-starter: the point of Redux is centralize state manipulation and not having the ability to do async is just silly. We're building interfaces and interfaces are inherently asynchronous.

Okay, so we've decided to augment Redux. How do we do that? Well, luckily, Redux has the ability to have middlewares, just like your server can. What we can do is add a middleware that can handle more than just action objects. There are a myriad of popular ones but we're going with the most popular, the simplest, and the easiest: redux-thunk. I'll venture to say that if you build any Redux app, rarely are you not going to include redux-thunk, even if you include one of the other async Redux middlewares. It's frequently useful, even beyond it's async applications.

So let's unpack the word thunk: it's a weird computer science term that seems more difficult than it actually is. Imagine you need to write a line of code that calculates the conversion from USD to EUR. You could write it:

```javascript
const dollars = 10
const conversionRate = 1.1
const euros = dollars * conversionRate
```

This code is a bit weak because we've statically defined the conversionRate. It would be better if we didn't have to define this value statically but instead could be determined whenever you accessed conversionRate (since currency exchange rates flucuate constantly.) What if we did:

```javascript
const dollars = 10
const conversionRate = function () { return 1.1 }
const euros = dollars * conversionRate()
```

Now we've wrapped conversionRate in a function. Even though the answer is unchanged, conversion is now a black box that we can swap out that 1.1 whenever. The value of the return of conversionRate isn't set until that function is actually called. conversionRate is now a **thunk**. It's a function wrapping a value.

The above is a silly example, but it with Redux this becomes a powerfuly feature. Instead of determining what action object you're going to dispatch at write time, you can determine what you're going dispatch conditionally or asynchronously. redux-thunk even let's you dispatch multiple actions! This can be useful if you have one action that leads to multiple, cascading changes. Super useful. So let's go change the Details page to use redux-thunk instead of local state. First, let's go include the redux-thunk middleware. Go store.js:

```javascript
// @flow
import { createStore, compose, applyMiddleware } from 'redux'; // add applyMiddleware
import thunk from 'redux-thunk'; // import
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk), // middleware
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )
);

export default store;
```

This is how you add more middlewares! Okay, so let's go add the _sync_ action to make it so we can store omdbData in our data store. This is a good distinction to make: you still will only modify your state via reducers, and reducers are only kicked off via dispatching action _synchronously_ to your root reducer. Always. So what we're doing is kicking off an async action which when it finishes will dispatch a sync action to the root reducer. We're just adding another step. So let's do our sync action. Go to actions.js:

```javascript
export const ADD_API_DATA = 'ADD_API_DATA';
```

Go to types.js

```javascript
// new action type
declare type ActionType = 'SET_SEARCH_TERM' | 'ADD_API_DATA';

// new action
export type Action = ActionT<'SET_SEARCH_TERM', string> | ActionT<'ADD_API_DATA', Show>;
```

We're expanding how many different types of actions we can have.

Now go to reducers.js:

```javascript
// at top
import { SET_SEARCH_TERM, ADD_API_DATA } from './actions';

const DEFAULT_STATE = {
  searchTerm: '',
  apiData: {}
};

// add new reducer
const apiData = (state = {}, action: Action) => {
  if (action.type === ADD_API_DATA) {
    return Object.assign({}, state, { [action.payload.imdbID]: action.payload });
  }
  return state;
};

// add new reducer
const rootReducer = combineReducers({ searchTerm, apiData });
```

Doing some deep merging, but really nothing new here.

You can can totally do this with the other style of reducers we were doing but as you can see you get really clean code this way. We should also talk about type refinement at this point and _why_ we went with the combineReducers style of writing Redux. There, where we check to see if action.type is ADD_API_DATA is called a type refinement in the eyes of Flow. As soon as we enter the body of that if statement, we are **positive** that the payload of that action is a Show and we're free to access all the data that a Show should have. We're positive because that's what our types dictate that to us. If we try to access `action.payload.imdbID` outside of that if statement, you'll get a Flow error because we are not yet certain of its type. It's a bit burdensome to get to this point but that assurance of the types is going to save you a bunch of run time errors.

Go to actionCreators.js:

```javascript
// @flow

import axios from 'axios';
import { SET_SEARCH_TERM, ADD_API_DATA } from './actions';

export function setSearchTerm(searchTerm: string) {
  return { type: SET_SEARCH_TERM, payload: searchTerm };
}

export function addAPIData(apiData: Show) {
  return { type: ADD_API_DATA, payload: apiData };
}

export function getAPIDetails(imdbID: string) {
  return (dispatch: Function) => {
    axios
      .get(`http://localhost:3000/${imdbID}`)
      .then(response => {
        dispatch(addAPIData(response.data));
      })
      .catch(error => {
        console.error('axios error', error); // eslint-disable-line no-console
      });
  };
}
```

First we add an action creator for our sync action, addAPIData. This is personal preference but I always make action creators that dispatch object a separate function. I could have done this directly inside of getOMDBDetails (and many people do) but I like keeping it separate for code organization and reuseability.

So let's unpack getAPIDetails. First this is to notice that it's a function that returns a function, a thunk. Redux will call this returned function (you call the outer one and pass that to dipatch) and pass into this returned function a dispatch function and a getState function. We don't need getState, but if your actionCreator needs to refer to the state of the Redux store, you'd call this function.

Inside of the returned function, we make our AJAX call and then dispatch an action via the addAPIData action creator with the new data. That's it! This is a pretty simple (and common) application of thunk, but you can get much more robust with it. Since you have a dispatch function, you're free to dispatch multiple actions, or not dispatch any at all, or conditionally dispatch one/many/none. Okay, so now head to Details.jsx to integrate it.

```javascript
// new imports
import { connect } from 'react-redux';
import { getOMDBDetails } from './actionCreators';

// delete axios import

// more propTypes (outside of show)
props: {
  rating: string,
  getAPIData: Function,
  show: Show
};

// replace componentDidMount
componentDidMount() {
  if (!this.props.rating) {
    this.props.getAPIData();
  }
}

// change state to props in render
if (this.props.rating) {
      rating = <h3>{this.props.rating}</h3>

// replace export at bottom
const mapStateToProps = (state, ownProps) => {
  const apiData = state.apiData[ownProps.show.imdbID] ? state.apiData[ownProps.show.imdbID] : {};
  return {
    rating: apiData.rating
  };
};

const mapDispatchToProps = (dispatch: Function, ownProps) => ({
  getAPIData() {
    dispatch(getAPIDetails(ownProps.show.imdbID));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
```

Okay, so now we have an interesting side effect of moving from React to Redux: when we were in React whenever we navigated away from a Details page, we lost the data we requested from the API and we'd have to re-request it anew every time we navigated to the page. Now since we've centralized to Redux, this data will survive page transitions. This means we need to be smart and only request data when we actually don't have it, hence the conditional in the componentDidMount method. If we already have data, no need to dispatch the action!

In the mapStateToProps, we're including the ownProps parameter. This is the props being passed down from its parent component which we need to select the correct show to pass in as props. It also has the benefit of making connect subscribe to props change so that mapStateToProps will change as the props change. If we suddenly switched the imdbID being passed in, this would still work just fine.

That's it! That's async Redux, or at least the simplest form of it. Like I alluded to earlier, there are several other ways of accomplishing async Redux. The other popular options include redux-promise where you dispatch promises, redux-observable where you dispatch observables, and redux-sagas where dispatch generators.

[combineReducers]: http://redux.js.org/docs/api/combineReducers.html
