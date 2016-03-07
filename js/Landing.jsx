const React = require('react')
const ReactRouter = require('react-router')
const { Link, browserHistory } = ReactRouter
const Store = require('./Store')
const { connector } = Store

class Landing extends React.Component {
  constructor (props) {
    super(props)

    this.handleTermEvent = this.handleTermEvent.bind(this)
    this.goToSearch = this.goToSearch.bind(this)
  }
  handleTermEvent (e) {
    this.props.setSearchTerm(e.target.value)
  }
  goToSearch (e) {
    browserHistory.push('search')
    e.preventDefault()
  }
  render () {
    return (
      <div className='home-info'>
        <h1 className='title'>svideo</h1>
        <form onSubmit={this.goToSearch}>
          <input onChange={this.handleTermEvent} className='search' type='text' value={this.props.searchTerm} placeholder='Search' />
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
