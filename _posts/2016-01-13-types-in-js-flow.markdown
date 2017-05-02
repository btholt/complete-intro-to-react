---
title: "Flow: Types in JavaScript"
---

Welcome to the wild and mystical world of types in JavaScript. Types seem intimidating to many people but with a few basic concepts under our belt we can take advantage of 80% of the benefits. In other words, most of the beneftis of a type checker come from doing the most basic things. You can next-level crazy with types (see [Haskell][haskell] and [Idris][idris]) but here we're just, you know, going with the flow.

So what is a type? JavaScript has a few basic types that it uses: Number, String, Object, Array, Function, and a few others. Because an item is a String, there's certain things you know about it: you can always call `substr` on a String and it won't cause an error. However, if you try to call `substr` on a Number, you're going to get an error. At the most basic level, that's what a type checker like Flow is going to get for you. It's going to prevent those sorts of errors by informing you that you have a type mismatch.

What's magical about Flow is that most of this type checking is _free_. You don't have to do anything to get it. You don't have to declare the type! It just knows what type is should by how you initialize it. If I say `const x = 'string here'` it knows that x is a string; you don't need to tell it that. Only in certain situations do you need to inform Flow of the types.

So, let's get Flow into our code. First thing to do is run `yarn run flow -- init`. You can also install Flow globally and do that, but this is nice because it'll run flow from your dependencies. This will create a `.flowconfig` file for you which is often enough; often you don't need to customize that config at all. In my case today, styled-components is throwing errors that isn't useful so I'm going to add `<PROJECT_ROOT>/node_modules/styled-components/*` under `[ignore]`. Unlike ESLint, you do typically want to have Flow run on your dependencies to get those typings. However sometimes libraries ship broken types so you can just ignore them (like I did with styled-components.)

Luckily for us, there's [flow-typed][ft]. flow-typed is a repo of pre-typed common libraries for you and styled-components has an entry in there. Just `yarn global add flow-typed` and then run `flow-typed install styled-components@1.4.6` (or whatever version you have.) This will create a flow-typed directory that Flow already knows how to read from. In fact, check out the various type available to you. You should be able to grab types for react-router and react-router-dom too. Flow already has typings for React and react-dom.

Now you should be able to do `yarn run flow`. This likely isn't going to give you any errors back because we haven't opted-in any of our files to be type checked. Let's opt in Search.jsx. Add the [pragma][pragma] `// @flow` to the top of Search.jsx. Now run `yarn run flow` again. You should see an error that `handleSearchTermChange` is not annotated. Since Flow doesn't know how `handleSearchTermChange` is going to be invoked and with what parameters, it requires you to tell it beforehand. We do this by doing a type annotation.

Since we're including the Babel preset for React, we actually already are getting the Flow plugin. If we hadn't included `babel-preset-react` We'd have to go include the Flow plugin to do annotations. But it's there already.

So change in Search.jsx:

```javascript
handleSearchTermChange = (event: SyntheticKeyboardEvent &  { target: HTMLInputElement }) => {
  this.setState({ searchTerm: event.target.value });
}
```

What we've done here is add a type for the incoming parameter: a synthethic (React) keyboard event. This type is already built into Flow so we don't have to do anything more with it. Specifically we're interested win the `target` portion of it, so we identify that as well (target can technically be things other than an HTML input element.) By doing this we're ensuring we'll be ensuring this method is used properly. Run `yarn run flow` again and you should see `No errors!`. Congrats!

We've also made it so `handleSearchTerm` _must_ be called with a SyntheticKeyboardEvent item. If you try to invoke it without that being passed in, you'll fail when you run Flow. You can use [maybe types][maybe] to get around this.

What's cool is that despite not adding a lot, we actually opted in a lot of behind-the-scenes checking for free. For example, Flow is smart enough to know that `searchTerm` is a string based on the initial `state` we provide for the class. Go ahead and try and setState for searchTerm to be a number. Flow will now fail since it was expecting a string there. If you need to accommodate both numbers and strings, you can use what's called a [union type][union].

At this point it's useful to see if your editor has integration with Flow. Sublime's is lackluster but you can at least get it show you where you have Flow errors in real time (using the same SublimeLinter we used for ESLint.) If you're going to double-down on Flow, you may investigate [Nuclide][nuclide]. It's a package for [Atom][atom] that integrates with all of Facebook's tooling like React, React Native, Hack, and Flow. For now I'll be using just the Sublime tools.

Let's go opt-in ShowCard.jsx too! Add the `// @flow` pragma to the top. Here we've added propTypes from the prop-types library and with Flow those no longer serve a purpose: these types are known at compile time and thus don't need to be checked _again_ at run time. Thus let's modify ShowCard like so:

```javascript
// delete prop-types import

// replace ShowCard
const ShowCard = (
  props: {
    poster: string,
    title: string,
    year: string,
    description: string
  }
) => (
  <Wrapper>
    <Image alt={`${props.title} Show Poster`} src={`/public/img/posters/${props.poster}`} />
    <div>
      <h3>{props.title}</h3>
      <h4>({props.year})</h4>
      <p>{props.description}</p>
    </div>
  </Wrapper>
);
```

This is how you type functional components. Pretty cool, right? Now if you run Flow again you shouldn't see any issues. On a tangent, imagine showing that code to yourself pre-ES6. Doesn't even look like (old) JavaScript! But's powerful, expressive, and readable (in my opinion.)

You should be able to `// @flow` to the top of Landing and App and make no changes.

Add `// @flow` to the top of ClientApp.jsx. You'll start getting errors about module.hot which is a global variable given to you by Webpack. Right now (as of writing) flow-typed doesn't have types for Webpack's API but this can be a useful exercise in showing you how to define your own types. In your flow-typed folder, add a file called webpack.js (not in the npm directory.) Add the following:

```javascript
// @flow

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
};
```

Here we've declared a global variable called module which is an object that has a method called accept. accept takes two parameters: a string called path and a function called callback which returns undefined. accept itself returns undefined. There are several things you can put into these type definition files but I'll let you explore that on your own time!

Now our whole project is typed! We'll continue using Flow for the rest of this project but by no means are types required for React or any sort of JavaScript. It is extremely useful to have; you'll see here as you write code it's very useful to have the instant feedback that something is wrong with your code; once you start getting that it's hard to go back. But yeah, again, this is just one tool you could use to write React. It's not required.

[pragma]: https://en.wikipedia.org/wiki/Directive_(programming)
[maybe]: https://flow.org/en/docs/types/maybe/
[union]: https://flow.org/en/docs/types/unions/
[ft]: https://github.com/flowtype/flow-typed/tree/master/definitions/npm
[nuclide]: https://nuclide.io/docs/languages/flow/
[haskell]: https://www.haskell.org/
[idris]: https://www.idris-lang.org/
