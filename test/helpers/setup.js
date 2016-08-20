require('babel-register')
require('babel-polyfill')

/* setup a browser like environment for react to run in to simulate a browser */
global.document = require('jsdom').jsdom('<body><div id="app"></body>')
global.window = document.defaultView
global.navigator = window.navigator
