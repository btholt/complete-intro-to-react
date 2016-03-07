/* global React ReactDOM */

var MyTitle = require('./MyTitle')
var div = React.DOM.div

var e = React.createElement
var MyTitleFact = React.createFactory(MyTitle)

var MySecondComponent = (
  div(null,
    e(MyTitle, {title: 'Props are great!', color: 'peru'}),
    MyTitleFact({title: 'Use props everywhere!', color: 'rebeccapurple'}),
    React.createElement(MyTitle, {title: 'Props are the best!', color: 'mediumaquamarine'})
  )
)

ReactDOM.render(MySecondComponent, document.getElementById('app'))
