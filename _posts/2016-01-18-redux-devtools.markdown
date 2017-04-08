---
title: "redux Devtools"
---

One of the most compelling reason to use redux is its amazing debugging experience. redux has the _fantastic_ ability to do time-traveling debugging, meaning you can step forwards and backwards through actions you've dispatched. It's really powerful for debugging.

There are several ways to get it working but I'm going to show you the bare minimum to get up and running. Unlike React, there is some code you have to put in to get it working. Luckily, it's like two or three lines.

In Store.js put:

```javascript
import { createStore, compose } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer, compose(
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f
))

export default store
```

That's it for code! It just adds a middleware to redux that hooks into the dev tools. It's also doing a window check to make sure if you're unit testing or running your components in node that the window reference doesn't blow up.

Now go grab the [Chrome extension][chrome-extension] or [Firefox extension][firefox]. The Safari one is forthcoming. Good news is that you can actually just build the debugger into the page so it works everywhere. Bad news is I'm going to show you how since I've never done it. In any case, feel free to explore it on your time.

Okay, last bit: this doesn't work with the `file:///` protocol. But luckily we're using webpack-dev-server so it doesn't matter.

Now you should see three green circles with smaller orange circles circling the green ones on your Chrome or Firefox tool bar. Click on that and that should show you the redux tools. This allows you to play with the redux tools. I'll let you toy with them but suffice to say they're pretty impressive.

[chrome-extension]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
[http-server]: https://github.com/indexzero/http-server
[firefox]: https://addons.mozilla.org/en-US/firefox/addon/remotedev/
