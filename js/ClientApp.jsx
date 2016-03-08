const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const Search = require('./Search')
const Layout = require('./Layout')
const Details = require('./Details')
const ReactRouter = require('react-router')
const { Router, Route, hashHistory, IndexRoute } = ReactRouter
const { Provider } = require('react-redux')
const { store } = require('./Store')

class App extends React.Component {
  render () {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Layout}>
          <IndexRoute component={Landing} />
          <Route path='/search' component={Search} />
          <Route path='/details/:id' component={Details} />
        </Route>
      </Router>
    )
  }
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'))
