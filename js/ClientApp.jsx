const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const Search = require('./Search')
const Layout = require('./Layout')
const Details = require('./Details')
const ReactRouter = require('react-router')
const { Router, Route, hashHistory, IndexRoute } = ReactRouter
const data = require('../public/data')
const { Provider } = require('react-redux')
const { store } = require('./Store')

class App extends React.Component {
  assignShow (nextState, replace) {
    let show = data.shows.filter((show) => show.imdbID === nextState.params.id)
    if (show.length < 1) {
      return replace('/')
    }
    Object.assign(nextState.params, show[0])
    return nextState
  }
  render () {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Layout}>
          <IndexRoute component={Landing} />
          <Route path='/search' component={Search} shows={data.shows} />
          <Route path='/details/:id' component={Details} onEnter={this.assignShow} />
        </Route>
      </Router>
    )
  }
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'))
