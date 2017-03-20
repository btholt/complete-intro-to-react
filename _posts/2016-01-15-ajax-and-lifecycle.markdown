---
title: "React Lifecycle Methods and AJAX with React"
---

Due to the structuring of our app, we haven't had to use React lifecycle methods despite the fact they're fairly common to use and thus important to know. One of the most compelling reasons to use lifecycle methods is to do AJAX. Once a component gets mounted to the page then we want to be able request data from the server. First let's discuss the lifecycle of a React component.

1. __constructor/getInitialState__ - This is where set up your components initial state. The former is for ES6 classes (that you'll see how to do at the end) and the latter is for the React.createClass method (that we've been using.)
1. __componentWillMount__ - This method runs right _before_ the component gets mounted. This one is not too common to use, but you will want to use it any time you want code to run both in node and in the browser.
1. __componentDidMount__ - This method runs right _after_ your component gets put into the DOM. This method _will not get run in node but will in the browser_. This makes it so your component can render first _then_ you can go get the data you need. In your component you can throw up a loader if you need to. Also if you need to interact with the DOM (like if you were wrapping D3 or a jQuery plugin) this would be the place to do it.
1. __componentWillUnmount__ - This method runs right before the component is taken off the DOM. Most common thing to do here is get rid of external event listeners or other things you need to clean up.

Cool! So let's make our Details page check the IMDB rating! Open Details.js.

```javascript
// import in axios
import axios from 'axios'

// add propType inside show
imdbID: string

// add getInitialState and componentDidMount to Details
getInitialState () {
  return {
    omdbData: {}
  }
},
componentDidMount () {
  axios.get(`http://www.omdbapi.com/?i=${this.props.show.imdbID}`)
    .then((response) => {
      console.log('response', response)
      this.setState({omdbData: response.data})
    })
    .catch((error) => {
      console.error('axios error', error)
    })
},

// add to render before return
let rating
if (this.state.omdbData.imdbRating) {
  rating = <h3>{this.state.omdbData.imdbRating}</h3>
} else {
  rating = <img src='/public/img/loading.png' alt='loading indicator' />
}

// add between year and poster
{rating}
```

We're requiring in [axios][axios] which is a great little promise-based AJAX client and using that to make requests to the Open Movie Database to find the IMDB ratings. If you go to your pages now you'll notice that the rating is showing up a little after the page renders. That's because it's being grabbed from the magical Internet tubes! As you can see, we did this componentDidMount so that the user could see UI before waiting on an AJAX request. Note that it won't get server-side rendered either because the server doesn't call componentDidMount.

That's it! That's all you need to need know about AJAX with React as well as the lifecycle methods!

[axios]: https://github.com/mzabriskie/axios
