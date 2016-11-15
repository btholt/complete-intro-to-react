import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { setSearchTerm } from './actionCreators'
// import '../public/normalize.css'
// import '../public/style.css'
const { string, func, object } = React.PropTypes

const Landing = React.createClass({
  propTypes: {
    searchTerm: string,
    dispatch: func
  },
  contextTypes: {
    router: object
  },
  handleSearchTermChange (event) {
    this.props.dispatch(setSearchTerm(event.target.value))
  },
  goToSearch (event) {
    event.preventDefault()
    this.context.router.transitionTo('/search')
  },
  render () {
    return (
      <div className='landing'>
        <h1>svideo</h1>
        <form onSubmit={this.goToSearch}>
          <input onChange={this.handleSearchTermChange} value={this.props.searchTerm} type='text' placeholder='Search' />
        </form>
        <Link to='/search'>or Browse All</Link>
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
    searchTerm: state.searchTerm
  }
}

export default connect(mapStateToProps)(Landing)
