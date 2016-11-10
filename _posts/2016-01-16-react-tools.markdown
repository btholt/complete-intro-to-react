---
title: "React Tools"
---

So far we've been using pretty old school debugging technology: console.logs and just dumping stuff out to the DOM. There is an easier way! [React Dev Tools][github]! Grab it here for [Chrome][chrome] and [Firefox][firefox]. In _theory_ you can get the Chrome version working on Microsoft Edge, but good luck. If you're not using Chrome or Firefox, you're out of luck for now. They're talking about doing a standalone app but we'll see when that finally surfaces. I'll be talking about the Firefox version because that's the one I know the best but this should apply to Chrome just as well.

[github]: https://github.com/facebook/react-devtools
[chrome]: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
[firefox]: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

Dev Tools allow you to explore the virtual DOM of React as if it was just a normal DOM tree. You can see what props and states are in each component and even modify the state of components. The virtual DOM explorer is by-far the most useful part of it.

Find the Dev Tools in Firefox by opening the dev tools and the last tab (along side Console, Sources, Network, etc.) should be React on your page. If you don't see it try restarting your browser. If you _still_ don't see it, the tab won't show up if the extension can't detect React on the page. You may have a dated version of the dev tools. After that I'm not sure; it can be fickle sometimes.

Feel free to poke around a bit here to familiarize yourself with what the React Dev Tools can do. Here are a couple of tricks for you:

- If you right-click -> Inspect Element on something and then click the React tab, it will take you straight to that element in the virtual DOM.
- Select something in the virtual DOM in the React tab. Now go to the Console tab and type <code>$r</code>. It should be a reference to the element you have selected in the virtual DOM and you can manipulate it.
- As a side note, you can do the above trick with the normal DOM explorer with <code>$0</code>, <code>$1</code>, <code>$2</code>, <code>$3</code>, and <code>$4</code> instead where 0 is the last one you selected, 1 is the penultimate, etc. This is true in both Chrome and Firefox
- iframes and Chrome/Firefox extensions don't work with React Dev Tools as of writing.
- react-router v4 has _a lot_ of nesting.