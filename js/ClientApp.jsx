import React from 'react';
import { render } from 'react-dom';

const MyTitle = function MyTitle(props) {
  return (
    <div>
      <h1 style={{ color: props.color }}>{props.title}</h1>
    </div>
  );
};

const MyFirstComponent = function MyFirstComponent() {
  return (
    <div id="my-first-component">
      <MyTitle title="Game of Thrones" color="YellowGreen" />
      <MyTitle title="Stranger Things" color="GreenYellow" />
      <MyTitle title="Rick and Morty" color="burlywood" />
      <MyTitle title="Silicon Valley" color="peru" />
    </div>
  );
};

render(<MyFirstComponent />, document.getElementById('app'));
