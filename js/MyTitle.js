var React = require('react')
var div = React.DOM.div
var h1 = React.DOM.h1

var MyTitle = React.createClass({
  render () {
    return (
      // can only return one component, hence why you would wrap them all in a div
      div(null,
        h1({style: { color: this.props.color }}, this.props.title)
      div(null,
        h1({style: {color: this.props.color}}, this.props.title)
      )
    )
  }
})

module.exports = MyTitle
