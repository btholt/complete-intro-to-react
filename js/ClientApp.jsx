import React from 'react';
import { render } from 'react-dom';

const ce = React.createElement;

const MyTitle = ({ title, color }) => {
  return (
    <div>
      <h1 style={{ color: color }}>{title}</h1>
    </div>
  );
};

const MyFirstComponent = () => {
  return (
    <div id="my-first-component">
      <MyTitle title={'Game of Thrones'} color="YellowGreen" />
      <MyTitle title={'House of Cards'} color="GreenYellow" />
      <MyTitle title={'Avatar'} color="LimeGreen" />
      <MyTitle title={'Star Wars'} color="peru" />
    </div>
  );
};

render(ce(MyFirstComponent, MyTitle), document.getElementById('app'));
