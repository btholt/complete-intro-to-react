// const React = require('react')

// const MyTitle = (props) => (
//   <div>
//     <h1 style={{color: props.color}}>
//       {props.title}
//     </h1>
//   </div>
// )

// module.exports = MyTitle

// My work 
// Refers to npm install 
var React = require('react')

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


module.exports = MyTitle
