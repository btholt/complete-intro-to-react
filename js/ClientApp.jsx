import React from 'react';
import { render } from 'react-dom';

const MyTitle = function(props) {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', { style: { color: props.color } }, props.title)
  );
};

const MyFirstComponent = function() {
  return React.createElement('div', null, [
    React.createElement(MyTitle, {
      title: 'stranger things',
      color: 'YellowGreen'
    }),
    React.createElement(MyTitle, {
      title: 'games of thrones',
      color: 'GreenYellow'
    }),
    React.createElement(MyTitle, {
      title: 'the voice',
      color: 'peru'
    })
  ]);
};
ReactDOM.render(
  React.createElement(MyFirstComponent),
  document.getElementById('app')
);
