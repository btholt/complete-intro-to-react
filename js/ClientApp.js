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
  )
)

ReactDOM.render(MyFirstComponent, document.getElementById('app'))
