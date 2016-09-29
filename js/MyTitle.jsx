const React = require('react')
const div = React.DOM.div
const h1 = React.DOM.h1

const MyTitle = React.createClass({
  render () {
    return (
      // can only return one component, hence why you would wrap them all in a div
      <div>
        <h1 style={ {color: this.props.color} }>
          {this.props.title}
        </h1>
      </div>
    )
  }
})

module.exports = MyTitle
