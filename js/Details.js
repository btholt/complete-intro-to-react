import React from 'react'

const Details = React.createClass({
  render () {
    return (
      <div className='details'>
        <pre><code>
          {JSON.stringify(this.props, null, 4)}
        </code></pre>
      </div>
    )
  }
})

export default Details
