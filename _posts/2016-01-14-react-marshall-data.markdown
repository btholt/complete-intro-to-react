---
title: "Data in React"
---

So now we want to add a third page: a page where we can watch the trailer. This is going to be an application of what we know already.

Create a new file in js/ called Details.jsx. In Details put:

```javascript
// @flow

import React from 'react';

const Details = () => (
  <div className="details">
    <h1>lolhi</h1>
  </div>
);

export default Details;
```

In App.jsx, put your new route:

```javascript
// require your new route
import Details from './Details'

// add as last route in the nested routes
<Match pattern='/details/:id' component={Details} />
```

Here we've added a URL parameter using the colon. Now as a prop to Details you'll get whatever :id was. So now try to manually change the anchor on your url to be `http://localhost:8080/#/details/1`. You should see your new component here.

If you see a blank page and a 404 error in your console, chances are you need to add a leading slash to your script and link tags in your index.html file for the paths, `<&NegativeMediumSpace;script src="/public/bundle.js"></script>` and `<&NegativeMediumSpace;link rel="stylesheet" href="/public/style.css" />`.

Let's show you a neat debugging tip I totally stole from [Ryan Florence][ryflo]. replace that h1 with this:

```javascript
// instead of the h1 in render
```javascript
const Details = props => (
  <div className="details">
    <pre>
      <code>
        {JSON.stringify(props, null, 4)}
      </code>
    </pre>
  </div>
);
```

This is a useful way to dump your params to the page to see what react-router is giving you. This is __awesome__ for state too; it shows you in real time what your state looks like. We'll dig into React Tools here in a sec for even better debugging but for now let's keep trucking with our Details.jsx.

We're going to show all the details of a show on this page and be able to play the trailer. There's a _big_ problem here that we don't have that data on this page though; it's available in the Search route. We _could_ require in data.json here given that our data is available that way but that typically isn't the case: we typically get this data from the server. If that's the case, you don't want to make two AJAX requests to get the same data. In other words, we need to share this state between components. The way you do this is by pushing up the state to the highest common ancestor component. In this case, that'd be the router in App. So let's first refactor Search to still work while it pulls in that data from Search.

```javascript
// in App.jsx
// another import
import preload from '../data.json'

// modify the existing route
<Route path="/search" component={props => <Search shows={preload.shows} {...props} />} />
```

Now make Search use it
```javascript
// delete import preload from '../data.json'

// below imports, above class Search

type Show = {
  title: string,
  description: string,
  year: string,
  imdbID: string,
  poster: string,
  trailer: string
};

// add propTypes inside Search
props: {
  shows: Array<Show>
};

// change the map call instead of {preload.shows
{this.props.route.shows
```

Cool. Now it should still work but Search no longer imports the data but merely receives it as props. Now we can share this data with Details. Notice that Search has a function instead of a React component, but if you think about it a function that returns markup _is_ a React component, so this works. This allows us to pass in the shows as a parameter to Search. You'll see this pattern often with react-router v4.

You'll also notice we created a Show type to match our show data. This is called a [type alias][ta] This is awesome because now we can refer to objects as Shows and get all the typing along with that. Our first use of it was specifying that the props passed down was going to be an array of Shows. The syntax with Array has to do with a concept called [generic types][gt] which you are welcome to read about but beyond the scope of this class. You can do really cool and clever things with types and it's worth a dive down the rabbit's hole.

This Show type is going to be used across multiple files so it's worth it to make it a project-wide type like we did with Webpack's module. Go create a file called Show in flow-typed and move that type declaration in there (be sure to add `// @flow` at the top too.) Add `declare` before type so it says `declare type Show = { […]` so it's now a global. Remove it from Search.jsx. Everything should still work. You'll need to add this to your .eslintrc.json too:

```json
"globals": {
  "Show": true
}
```

It is a global type so it makes sense to need to do so. Do note with with Flow and ESLint integrations with editors, it can be slow to update. It can be frustrating when you think you fixed a problem and it hasn't resolved yet.

Now we're going to pass the correct show to the Details page. There's a bunch of ways to do this:

- We could pass all the shows and let Details select the correct show. This isn't great because Details is given an additional concern it doesn't need to have.
- We could create a callback in App that it passes to Details that Details calls with the correct ID and ClientApp hands back the correct show. This is slightly better but it's an odd API for getting data. Ideally we just hand down props and not a callback, especially since this isn't async.
- Or we could hook into react-router's ability to pass props down through stateless functions like we did with Search and just pass down the correct show. This is the best approach.

Add the following to App:

```javascript
// add at the imports at the top
import type { Match } from 'react-router-dom';

// replace Details Match component
<Route
  path="/details/:id"
  component={(props: { match: Match }) => {
    const selectedShow = preload.shows.find((show: Show) => props.params.id === show.imdbID);
    return <Details show={selectedShow} {...props} />;
  }}
/>
```

At the top we're importing types from types from the flow-typed file for react-router-dom. We'll use this type to refer to the match attribute of the props. This is how you import types if you need to in the future. In case it's apparent to you, this a Flow-specific feature; this import line of code gets stripped out by the Babel transform. In the code, we're finding the correct show and passing that to Search.

If you run flow, you'll notice we broke our tests. Here is yet another benefit of Flow: it'd be easy to forget how modifying the API for Search would break the tests. Flow is quick to get that. It derives that fact because we changed what props are being passed to Search. Clever!

This should put the correct show as one of the props that App passes down to Details. If you refresh the page, you should see it now. (You have to have a valid URL for a details page, like `<your localhost>/details/tt4574334`).

As an aside, I've found the _best_ way to organize React method component is the following

1. props / defaultProps/ props
1. constructor
1. Other lifecycle methods like componentDidUpdate (we'll talk about those in a sec)
1. Your methods you create (like assignShow)
1. render

Makes it easier to find things when you look for them.

So let's actually display some cool stuff:

```javascript
// @flow

import React from 'react';

const Details = (props: { show: Show }) => {
  const { title, description, year, poster, trailer } = props.show;
  return (
    <div className="details">
      <header>
        <h1>svideo</h1>
      </header>
      <section>
        <h1>{title}</h1>
        <h2>({year})</h2>
        <img src={`/public/img/posters/${poster}`} alt={`Poster for ${title}`} />
        <p>{description}</p>
      </section>
      <div>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;controls=0&amp;showinfo=0`}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Details;
```

// TODO START HERE

Now you should have some nice looking UI.

Well, now we have a header in two places. That's a **strong** indicator that you should make it's its own component. Let's abstract that in a component and use that in both places. Create a new file called Header.jsx and put this in there:

```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <h1>
      <Link to="/">
        svideo
      </Link>
    </h1>
  </header>
);

export default Header;
```

We're even going to throw in a link back to the home page for fun. Now open Details.jsx and put:

```javascript
// add to the top
import Header from './Header'

// replace <header>...</header>
<Header />
```

Let's put a back button on the Header so you can get back to Search after you reach it.

```javascript
// after the h1 inside .header
<h2>
  <Link to='/search'>
    Back
  </Link>
</h2>
```

So let's integrate this to Search. But it's not so simple since on Search we want the header to have a search input and on Details we want a back button. So let's see how to do that. In Header.jsx put:

```javascript
// @flow

import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props: { showSearch?: boolean, handleSearchTermChange?: Function, searchTerm?: string }) => {
  let utilSpace;
  if (props.showSearch) {
    utilSpace = (
      <input type="text" placeholder="Search" value={props.searchTerm} onChange={props.handleSearchTermChange} />
    );
  } else {
    utilSpace = (
      <h2 className="header-back">
        <Link to="/search">
          Back
        </Link>
      </h2>
    );
  }
  return (
    <header>
      <h1>
        <Link to="/">
          svideo
        </Link>
      </h1>
      {utilSpace}
    </header>
  );
};

Header.defaultProps = {
  showSearch: false,
  handleSearchTermChange: function noop() {},
  searchTerm: ''
};

export default Header;
```

In Search.jsx:

```javascript
// add to requires
import Header from './Header';

// replace <header></header>
<Header handleSearchTermChange={this.handleSearchTermChange} showSearch searchTerm={this.state.searchTerm} />
```

This is how you have a child component modify a parent's state: you pass down the callback and let it call the parent to let the parent modify the state. This also demonstrates how to conditionally show one component and not another.

Lastly let's make our show cards clickable.

```javascript
// @flow

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  width: 32%;
  border: 2px solid #333;
  border-radius: 4px;
  margin-bottom: 25px;
  padding-right: 10px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 46%;
  float: left;
  margin-right: 10px;
`;

const ShowCard = (
  props: {
    poster: string,
    title: string,
    year: string,
    description: string,
    imdbID: string
  }
) => (
  <Link to={`/details/${props.imdbID}`}>
    <Wrapper>
      <Image alt={`${props.title} Show Poster`} src={`/public/img/posters/${props.poster}`} />
      <div>
        <h3>{props.title}</h3>
        <h4>({props.year})</h4>
        <p>{props.description}</p>
      </div>
    </Wrapper>
  </Link>
);

export default ShowCard;
```

Oh 💩! We messed up our styles. The reason is that the way Link works is that it outputs an `<a>` tag. Luckily, we can even style that too! Try this:

```javascript
// replace styled.div with styled(Link)
const Wrapper = styled(Link)`

// add two lines to Wrapper's CSS, otherwise you'll get blue text styles
text-decoration: none;
color: black;
```

Now each of the cards should be clickable through to the details page and styled correctly!


[ryflo]: https://twitter.com/ryanflorence
[ta]: https://flow.org/en/docs/types/aliases/
[gt]: https://flow.org/en/docs/types/generics/
