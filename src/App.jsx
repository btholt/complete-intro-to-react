import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Landing from './Landing';

const FourOhFour = () => <h1>404</h1>;

const App = () =>
  <HashRouter>
    <div className="app">
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route default component={FourOhFour} />
      </Switch>
    </div>
  </HashRouter>;

render(React.createElement(App), document.getElementById('app'));
