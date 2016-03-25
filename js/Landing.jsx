const React = require('react')
const { hashHistory } = require('react-router')
const { Link } = require('react-router')
const { connector } = require('./Store')

class Landing extends React.Component {
  constructor (props) {
    super(props)

    this.handleSearchTermEvent = this.handleSearchTermEvent.bind(this)
    this.gotoSearch = this.gotoSearch.bind(this)
  }
  handleSearchTermEvent (event) {
    this.props.setSearchTerm(event.target.value)
  }
  gotoSearch (event) {
    hashHistory.push('search')
    event.preventDefault()
  }
  render () {
    return (
      <div className='home-info'>
        <h1 className='title'>svideo</h1>
        <form onSubmit={this.gotoSearch}>
          <input value={this.props.searchTerm} onChange={this.handleSearchTermEvent} className='search' type='text' placeholder='Search' />
        </form>
        <Link to='/search' className='browse-all'> or Browse All</Link>
      </div>
    )
  }
}

const { func, string } = React.PropTypes

Landing.propTypes = {
  searchTerm: string,
  setSearchTerm: func
}

module.exports = connector(Landing)
