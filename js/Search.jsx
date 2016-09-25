const React = require('react')
const ShowCard = require('./ShowCard')
const Header = require('./Header')
const Store = require('./Store')
const { connector } = Store

class Search extends React.Component {
  render () {
    const searchTerm = this.props.searchTerm || ''
    return (
      <div className='container'>
        <Header showSearch />
        <div className='shows'>
          {this.props.shows
            .filter((show) => `${show.title} ${show.description}`.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0)
            .map((show, index) => (
              <ShowCard key={show.imdbID} id={index} {...show} />
          ))}
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  shows: React.PropTypes.arrayOf(React.PropTypes.object),
  searchTerm: React.PropTypes.string
}

module.exports = connector(Search)
