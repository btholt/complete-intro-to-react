const React = require('react')
const ReactRouter = require('react-router')
const { Link, hashHistory } = ReactRouter
const { connector } = require('./Store')

class Landing extends React.Component {
  constructor (props) {
    super(props)

    this.handleTermEvent = this.handleTermEvent.bind(this)
  }
  handleTermEvent (event) {
    this.props.setSearchTerm(event.target.value)
  }
  goToSearch (event) {
    hashHistory.push('search')
    event.preventDefault()
  }
  render () {
    return (
      <div className='home-info'>
        <h1 className='title'>svideo</h1>
        <form onSubmit={this.goToSearch}>
          <input onChange={this.handleTermEvent} className='search' type='text' placeholder='Search' value={this.props.searchTerm} />
        </form>
        <Link to='/search' className='browse-all'>or Browse All</Link>
      </div>
    )
  }
}

Landing.propTypes = {
  setSearchTerm: React.PropTypes.func,
  searchTerm: React.PropTypes.string
}

module.exports = connector(Landing)
