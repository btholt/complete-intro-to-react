require("babel-register")

var express = require('express')
var React = require('react')
var ReactDOMServer = require('react-dom/server')
var ReactRouter = require('react-router')
var match = ReactRouter.match
var RouterContext = ReactRouter.RouterContext
var _ = require('lodash')
var fs = require('fs')

var port = 5050

var baseTemplate = fs.readFileSync('./index.html')
var ClientApp = require('./js/ClientApp.jsx')
var routes = ClientApp.Routes

var app = express()

app.use('/public', express.static('./public'))

app.use((req, res) => {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
    console.log(error, redirectLocation, renderProps)
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.status(200).send(ReactDOMServer.renderToString(React.createElement(RouterContext,renderProps)))
    } else {
      res.status(404).send('Not found')
    }
  })
});

console.log('listening on ' + port)
app.listen(port)
