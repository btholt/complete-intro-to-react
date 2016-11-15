import React from 'react'
import { Link } from 'react-router'
const { string } = React.PropTypes

const ShowCard = React.createClass({
  propTypes: {
    poster: string.isRequired,
    title: string.isRequired,
    year: string.isRequired,
    description: string.isRequired,
    imdbID: string.isRequired
  },
  render () {
    return (
      <Link to={`/details/${this.props.imdbID}`}>
        <div className='show-card'>
          <img src={`/public/img/posters/${this.props.poster}`} />
          <div>
            <h3>{this.props.title}</h3>
            <h4>({this.props.year})</h4>
            <p>{this.props.description}</p>
          </div>
        </div>
      </Link>
    )
  }
})

export default ShowCard
