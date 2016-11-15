/* eslint react/prop-types:0 */
import React from 'react'
const div = React.DOM.div
const h1 = React.DOM.h1

const MyTitle = React.createClass({
  render () {
    const style = {color: this.props.color}
    return (
      <div>
        <h1 style={style}>
          {this.props.title}
        </h1>
      </div>
    )
  }
})

export default MyTitle
