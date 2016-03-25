const React = require('react')

class Details extends React.Component {
  render () {
    return (
      <div style={{textAlign: 'left'}} className='container'>
        <pre><code>
          {JSON.stringify(this.props.params, null, 4)}
        </code></pre>
      </div>
    )
  }
}

const { object } = React.PropTypes

Details.propTypes = {
  params: object.isRequired
}

module.exports = Details
