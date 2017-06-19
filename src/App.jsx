import React from 'react';
import { render } from 'react-dom';

const MyTitle = props =>
  <div>
    <h1 style={{ color: props.color }}>
      {props.myFavoriteShow}
    </h1>
  </div>;

const MyFirstComponent = () =>
  <div id="my-first-component">
    <MyTitle color="peru" myFavoriteShow="Game of Thrones" />
    <MyTitle color="burlywood" myFavoriteShow="Westworld" />
    <MyTitle color="rebeccapurple" myFavoriteShow="House of Cards" />
  </div>;

render(React.createElement(MyFirstComponent), document.getElementById('app'));
