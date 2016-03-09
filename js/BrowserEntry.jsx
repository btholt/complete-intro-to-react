const React = require('react')
const ReactDOM = require('react-dom')
const { match } = require('react-router')
const App = require('./ClientApp')

match({history: App.History, routes: App.Routes}, (error, redirectLocation, renderProps) => {
  if (error) {
    return console.error('BrowserEntry match error', error)
  }
  ReactDOM.render(<App {...renderProps} />, document.getElementById('app'))
})

