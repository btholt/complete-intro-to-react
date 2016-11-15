require('babel-register')

const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const ReactRouter = require('react-router')
const ServerRouter = ReactRouter.ServerRouter
const _ = require('lodash')
const fs = require('fs')
const port = 5050
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const App = require('./js/App').default

const server = express()

server.use('/public', express.static('./public'))

server.use((req, res) => {
  const context = ReactRouter.createServerRenderContext()
  let body = ReactDOMServer.renderToString(
    React.createElement(ServerRouter, {location: req.url, context: context},
      React.createElement(App)
    )
  )
  res.write(template({body: body}))
  res.end()
})

console.log('listening on ' + port)
server.listen(port)
