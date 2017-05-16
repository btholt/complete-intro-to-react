---
title: "React Lifecycle Methods and AJAX with React"
---

Due to the structuring of our app, we haven't had to use React lifecycle methods despite the fact they're fairly common to use and thus important to know. One of the most compelling reasons to use lifecycle methods is to do AJAX. Once a component gets mounted to the page then we want to be able request data from the server. First let's discuss the lifecycle of a React component.

1. __constructor/getInitialState__ - This is where set up your components initial state. The former is for ES6 classes (which is what we've been doing) and the latter is for the React.createClass method (which is deprecated as of 15.5.)
1. __getDefaultProps__ - Often you want to give your components default props if the parent doesn't provide them. Have a button that you want to be able to be a variety of colors but want default to green? That's what you would put in here. In ES6 classes, this can just be static property that's an object of the default props.
1. __componentWillMount__ - This method runs right _before_ the component gets mounted. This one is not too common to use, but you will want to use it any time you want to ensure code to run both in node and in the browser.
1. __componentDidMount__ - This method runs right _after_ your component gets put into the DOM. This method _will not get run in node but will in the browser_. This makes it so your component can render first _then_ you can go get the data you need. In your component you can throw up a loader if you need to. Also if you need to interact with the DOM (like if you were wrapping D3 or a jQuery plugin) this would be the place to do it.
1. __componentWillReceiveProps__ - This method runs every time the React component receives new/different props from the parent. If some of the state you keep in your component is derived from the parent props, this is where you would take care of that. What if you keep a list of actors in a movie as state that you request from an API? If your parent passes you a new movie, you need to react to that and get new actors for the new movie. This would be an example of where to use this method.
1. __shouldComponentUpdate__ - This method returns a boolean letting React know if it should re-render the component. This is for performance purposes. If you have a component that will _never_ update (like a static logo or something) you can just return false here. Normally React is really fast at doing this diffs anyway so it's a good idea to only put in a shouldComponentUpdate method if it's actually a performance issue. Typically in the method body you would check the bare minimum of state that needs to have changed to warrant a re-render. We'll discuss this more in depth later.
1. __componentWillUnmount__ - This method runs right before the component is taken off the DOM. Most common thing to do here is get rid of external event listeners or other things you need to clean up.

Cool! So let's make our Details page check the IMDB rating! First let's make a nice loading spinner. Make a new file called Spinner.jsx and put this in there:

```javascript
// @flow
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Image = styled.img`
  animation: ${spin} 4s infinite linear;
  background-image: url(/public/img/loading.png);
`;

const Spinner = () => <Image src="/public/img/loading.png" alt="loading indicator" />;

export default Spinner;
```

This is how you do keyframe animations with styled-components. It's really cool because you'll get scoped animation and not have to worry about some polluted global namespace.

```javascript
// import in axios
import axios from 'axios'

// add propType inside show
imdbID: string

// add state and componentDidMount to Details
 state = {
  omdbData: { imdbRating: '' }
};
componentDidMount() {
  axios
    .get(`http://www.omdbapi.com/?i=${this.props.show.imdbID}`)
    .then((response: { data: { imdbRating: string } }) => {
      this.setState({ omdbData: response.data });
    });
}

// add to render before return
let rating;
if (this.state.omdbData.imdbRating) {
  rating = <h3>{this.state.omdbData.imdbRating}</h3>;
} else {
  rating = <Spinner />;
}

// add between year and poster
{rating}
```

We're requiring in [axios][axios] which is a great little promise-based AJAX client and using that to make requests to the Open Movie Database to find the IMDB ratings. If you go to your pages now you'll notice that the rating is showing up a little after the page renders. That's because it's being grabbed from the magical Internet tubes! As you can see, we did this componentDidMount so that the user could see UI before waiting on an AJAX request. Note that it won't get server-side rendered either because the server doesn't call componentDidMount.

That's it! That's all you need to need know about AJAX with React as well as the lifecycle methods!

[axios]: https://github.com/mzabriskie/axios
