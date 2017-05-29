---
title: "React Perf Tools"
---

As you app continues to grow, sometimes slow code paths can start to emerge. React is pretty good about being performant under normal loads but even React has its limits. One of the ways this can manifest itself is how often components are running through the re-render process without actually changing anything. These are called wasted renders. Normally you don't have to actually to worry about this: React handles a lot of wasted re-renders without slowing down the app at all and you can spend your time building features instead. It's helpful to glance at your performance data every once in a while but don't dwell too much on it.

So, as it stands, our code actually does have a code path that we can optimize. So let's go explore how we discover the problem and ultimately fix it.

First, open ClientApp.jsx and add:

```javascript
// before App import
import Perf from 'react-addons-perf';

// after App import
window.Perf = Perf;
Perf.start();
```

This is temporary code. You do not want to ship this in production. We'll use this to profile our code, get the useful info out of it and then remove it since it'd just be dead bloat in production.

So what we've done is import the React perf tools which will automatically hook into your React instance and track wasted renders for you. We're just setting it on the global window object so we can manipulate it directly in the console.

Now open your browser, and navigate around you webpage a bunch. Visit all the various ShowCard components, visit the home route, enter some search terms, delete the terms, enter different ones, etc. You want to cause the UI to change in all the various ways that are possible so we can see the slow code paths.

After you've sufficiently prodded your app, open you console and enter: `Perf.stop()` followed by `Perf.printWasted()`. You see a console table of the various wasted renders sorted by how many milliseconds are being wasted. Based on this you can find hot code paths and see what you can do to fix tihs.

In our case, it jumps out that our ShowCard is the greatest offender here: it's a component that once rendered never changes. There's nothing dynamic about any individual ShowCard. Armed with this information, there's an easy optimization to make here: shouldComponentUpdate.

Open ShowCard.jsx. Right now it's a function component so we can't add a lifecycle method like shouldComponentUpdate so we'll have to convert it to a class. Change the component to be:

```javascript
class ShowCard extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  props: {
    poster: string,
    title: string,
    year: string,
    description: string,
    imdbID: string,
  };
  render() {
    return (
      <Wrapper to={`/details/${this.props.imdbID}`}>
        <Image alt={`${this.props.title} Show Poster`} src={`/public/img/posters/${this.props.poster}`} />
        <div>
          <h3>{this.props.title}</h3>
          <h4>({this.props.year})</h4>
          <p>{this.props.description}</p>
        </div>
      </Wrapper>
    );
  }
}
```

Now whenever React goes to see if an individual instance of a ShowCard has changed, it'll run this function instead of running the render function and diffing against the last run of the render function. As you may imagine, this will go a lot faster.

Let's talk about the mechanics of shouldComponentUpdate. Almost all of the times I personally have used it, it has been just what you've seen here: returing false to ensure a component that doesn't needs to update doesn't go through the diffing process. There is a more advanced use case where perhaps updates only rely on a few pieces of state, props, or anything else. Here in shouldComponentUpdate, you could check those and only re-render if those changed. See the [React docs][docs] for more info.

Go back and profile your App again with the perf tools. You'll notice that ShowCard has disappeared from it.

This is a powerful and potentially bug-causing tool for you. Fathom later that we had dynamic content to ShowCard. If you call setState, nothing will happen until you remove or modify that shouldComponentUpdate method. Many people once they learn about shouldComponentUpdate will put it everywhere: don't. You'll cause more issues than you'll solve trying to solve perf problems that don't exist. React is normally fast enough as-is.

[docs]: https://facebook.github.io/react/docs/optimizing-performance.html#shouldcomponentupdate-in-action
