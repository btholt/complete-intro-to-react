const React = require('react')
const data = require('../public/data')
const ShowCard = require('./ShowCard')

/* the following is a stateful component */
const Search = React.createClass({
  getInitialState () {
    return {
      searchTerm: ''
    }
  },
  /* this is the event handler */
  handleSearchTermEvent (event) {
    this.setState({searchTerm: event.target.value})
  },
  render () {
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>svideo</h1>
          <input value={this.state.searchTerm} className='search-input' type='text' placeholder='Search' 
          onChange={this.handleSearchTermEvent}/>
        </header>

      <div className='shows'>
        {data.shows
          .filter((s) => `${s.title} ${s.description}`.toUpperCase()
          .indexOf(this.state.searchTerm.toUpperCase()) >=0)
          .map((s) => (
          <ShowCard {...s} key={s.imdbID} />
        ))}
        </div>
      </div>
    )
  }
})



module.exports = Search
