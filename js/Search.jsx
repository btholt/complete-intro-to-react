const React = require('react')
const data = require('../public/data')
const ShowCard = require('./ShowCard')

class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchTerm: ''
    }

    this.handleSearchTermChange = this.handleSearchTermChange.bind(this)
  }
  handleSearchTermChange (event) {
    this.setState({
      searchTerm: event.target.value
    })
  }
  randomMethod() {
    console.log('here')
  }
  render () {
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>svideo</h1>
          <input onChange={this.handleSearchTermChange} type='text' className='search-input' placeholder='Search' value={this.state.searchTerm} />
        </header>
        <div className='shows'>
          {data.shows
            .filter((show) => `${show.title} ${show.description}`.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) >= 0)
            .map((show) => (
            <ShowCard {...show} key={show.imdbID} />
          ))}
        </div>
      </div>
    )
  }
}

module.exports = Search
