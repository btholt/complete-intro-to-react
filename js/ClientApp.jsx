import React from 'react';
import { render } from 'react-dom';

const ce = React.createElement;

const MyTitle = function(props) {
  return ce(
    'div',
    null,
    ce('h1', { style: { color: props.color } }, props.title)
  );
};
const MyFirstComponent = function() {
  return ce(
    'div',
    { id: 'my-first-component' },
    ce('h1', null, 'This is my first component!'),
    ce(MyTitle, { title: 'Game of Thrones', color: 'YellowGreen' }),
    ce(MyTitle, { title: 'Rick and Morty', color: 'GreenYellow' }),
    ce(MyTitle, { title: 'Silicon Valley', color: 'peru' })
  );
};

render(ce(MyFirstComponent), document.getElementById('app'));
