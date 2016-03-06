const React = require('react')
const Landing = require('./Landing')
const Search = require('./Search')
const Layout = require('./Layout')
const Details = require('./Details')
const ReactRouter = require('react-router')
const data = require('../public/data')
const { Router, Route, hashHistory, IndexRoute } = ReactRouter
const Store = require('./Store')
const { store } = Store
const reactRedux = require('react-redux')
const { Provider } = reactRedux
const shows = data.shows || []

const MyRoutes = (props) => (
  <Route path='/' component={Layout}>
    <IndexRoute component={Landing} />
    <Route path='/search' component={Search} shows={shows} />
    <Route path='/details/:id' component={Details} onEnter={props.assignShow} />
  </Route>
)

class App extends React.Component {
  constructor (props) {
    super(props)

    this.assignShow = this.assignShow.bind(this)
  }
  assignShow (nextState, replace) {
    const show = data.shows[nextState.params.id]
    if (!show) {
      return replace('/')
    }
    Object.assign(nextState.params, show)
    return nextState
  }
  render () {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <MyRoutes assignShow={this.assignShow} />
        </Router>
      </Provider>
    )
  }
}

App.Routes = MyRoutes

module.exports = App
