var React = require('react')
var ReactDOM = require('react-dom')

var div = React.DOM.div
var MyTitle = require('./MyTitle')

var MyTitleFactory = React.createFactory(MyTitle)

var MyFirstComponent = (
  div(null,
    MyTitleFactory({title: 'Props are great', color: 'rebeccapurple'}),
    MyTitleFactory({title: 'Use props everywhere', color: 'peru'}),
    MyTitleFactory({title: 'Props are awesome', color: 'mediumaquamarine'})

var MyTitle = require('./MyTitle')

var div = React.DOM.div

var MyTitleFact = React.createFactory(MyTitle)
var ce = React.createElement

var MyFirstComponent = (
  div(null,
    MyTitleFact({title: 'Props are great!', color: 'rebeccapurple'}),
    React.createElement(MyTitle, {title: 'Use props everywhere!', color: 'mediumaquamarine'}),
    ce(MyTitle, {title: 'Props are the best!', color: 'peru'})
  )
)

ReactDOM.render(MyFirstComponent, document.getElementById('app'))
