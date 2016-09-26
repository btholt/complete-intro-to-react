/* global React ReactDOM */
var div = React.DOM.div
var h1 = React.DOM.h1

var MyTitle = React.createClass({
  render () {
    return (
      div(null,
        h1({style: {color: this.props.color}}, this.props.title)
      )
    )
  }
})

var MyFirstComponent = (
  div(null,
    React.createElement(MyTitle, {title: 'props are great', color: 'rebeccapurple'}),
    React.createElement(MyTitle, {title: 'props are cool', color: 'peru'}),
    React.createElement(MyTitle, {title: 'props are ok', color: 'MediumAquaMarine'})
  )
)
ReactDOM.render(MyFirstComponent, document.getElementById('app'))
