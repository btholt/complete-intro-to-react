const React = require('react')
const Layout = require('./Layout')
const ReactRouter = require('react-router')
const { Router, browserHistory } = ReactRouter
const { Provider } = require('react-redux')
const { store } = require('./Store')

if (typeof module !== 'undefined' && module.require) {
  if (typeof require.ensure === 'undefined') {
    require.ensure = require('node-ensure')
  }
}

const rootRoute = {
  component: Layout,
  path: '/',
  indexRoute: {
    getComponent (location, cb) {
      require.ensure([], (_, error) => {
        if (error) {
          return console.error('ClientApp Landing require.ensure error', error)
        }
        cb(null, require('./Landing'))
      })
    }
  },
  childRoutes: [
    {
      path: 'search',
      getComponent (location, cb) {
        require.ensure([], (_, error) => {
          if (error) {
            return console.error('ClientApp Search require.ensure error', error)
          }
          cb(null, require('./Search'))
        })
      }
    },
    {
      path: 'details/:id',
      getComponent (location, cb) {
        require.ensure([], (_, error) => {
          if (error) {
            return console.error('ClientApp Details require.ensure error', error)
          }
          cb(null, require('./Details'))
        })
      }
    }
  ]
}

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={rootRoute} />
      </Provider>
    )
  }
}

App.Routes = rootRoute
App.History = browserHistory
module.exports = App
