import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Landing from './Landing';
import Search from './Search';
import Details from './Details';
import preload from '../data.json';

const FourOhFour = () => <h1>404</h1>;

const App = () =>
  <Provider store={store}>
    <div className="app">
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/search">
          <Search shows={preload.shows} />
        </Route>
        <Route path="/details/:id">
          {props => {
            const show = preload.shows.find(item => item.imdbID === props.match.params.id); // eslint-disable-line react/prop-types
            return <Details {...props} {...show} />;
          }}
        </Route>
        <Route default component={FourOhFour} />
      </Switch>
    </div>
  </Provider>;

export default App;
