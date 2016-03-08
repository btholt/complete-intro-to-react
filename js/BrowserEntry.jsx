const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./ClientApp')
const ReactRouter = require('react-router')
const { match } = ReactRouter

match({ history: App.History, routes: App.Routes }, (error, redirectLocation, renderProps) => {
  if (error) {
    return console.error('BrowserEntry require.ensure error', error)
  }
  ReactDOM.render(<App {...renderProps} />, document.getElementById('app'))
})
