---
title: "styled-components 💅"
---

You can do normal CSS (as we have doing so far) but there's been a recent interest in CSS-in-JS. There are several great approaches to this but we're going to use styled-components. The advantage of this is similar to what we see of doing JSX/React over separated templates and controllers: we get to mush together concerns for single components. If we do use CSS-in-JS, it means everything for a single component lives in a single place: we don't have to worry about including the right style sheets for the right components. It means if you include a component on a page, you get the markup, behavior, and style, guaranteed.

Let's talk about why this may be less than ideal. We have decades of browsers optimizing how to download, parse, and apply external style sheets. This way has been well thought out. I'm not saying we can't figure out how to optimize this path too; we just haven't yet. It's slower. This might be important to the performance of your app; it might not. You're also doubling your parse cost: we have to parse it as JS first, and then as CSS the second time. I think there's more around the tooling here: we can have our cake and eat it too. This is a relatively nascent idea: we'll figure it out if it pans out to be a good idea.

So the approach that styled-components takes is using ES6 tagged template literals. If this is your first encounter with them, you're not alone! It's outside the scope of this class to explore what they can do in-depth but as is customary, here's the [2ality article][2ality] on it. Suffice to say that tagged template literals is a peculiar way of invoking normal functions. In our case, we give a CSS string to a styled-component function, it does some processing based on that, and spits out a valid React component. We instead of using a {div,h1,img,input,span,etc.} use the React component. Whatever normal attributes you would have given to that HTML element, you give to the styled component and it works great! Let's style our ShowCard.

```javascript
import React from 'react';
import { string } from 'prop-types';
import styled from 'styled-components';

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

const ShowCard = props => (
  <Wrapper>
    <Image alt={`${props.title} Show Poster`} src={`/public/img/posters/${props.poster}`} />
    <div>
      <h3>{props.title}</h3>
      <h4>({props.year})</h4>
      <p>{props.description}</p>
    </div>
  </Wrapper>
);

ShowCard.propTypes = {
  poster: string.isRequired,
  title: string.isRequired,
  year: string.isRequired,
  description: string.isRequired
};

export default ShowCard;
```

Notice we created two different elements here: a div which we turned into Wrapper, and a img which we turned into Image. We associated some CSS with these two HTML elements and used them in our JSX. That's what styled-components are! You replace HTML elements with styled ones! Pretty cool, right? We won't do this for every component in our app since I want to focus more on the JS than I do on the CSS but I wanted to show you how to do it. It's fun to play with. If you were going to do some sort of CSS-in-JS solution, you'd probably want to be all-in on it.

We'll do some on the Details page but for now, let's go back to React-y stuff.

[2ality]: http://2ality.com/2016/11/computing-tag-functions.html
