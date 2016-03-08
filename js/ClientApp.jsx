const React = require('react')
const Layout = require('./Layout')
const ReactRouter = require('react-router')
const { Router, browserHistory } = ReactRouter
const Store = require('./Store')
const { store } = Store
const reactRedux = require('react-redux')
const { Provider } = reactRedux

if (typeof module !== 'undefined' && module.require) {
  if (typeof require.ensure === 'undefined') {
    require.ensure = require('node-ensure')// shim for node.js
  }
}

const rootRoute = {
  component: Layout,
  path: '/',
  indexRoute: {
    getComponent (location, cb) {
      require.ensure([], (error) => {
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
        require.ensure([], (error) => {
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
        require.ensure([], (error) => {
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
        <Router routes={rootRoute} history={browserHistory} />
      </Provider>
    )
  }
}

// App.Routes = myRoutes
App.Routes = rootRoute
App.History = browserHistory

module.exports = App
