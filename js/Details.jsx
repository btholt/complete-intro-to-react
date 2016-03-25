const React = require('react')

class Details extends React.Component {
  render () {
    const params = this.props.params || {}
    const { title, description, year, poster, trailer } = params
    return (
      <div className='container'>
        <header className='header'>
          <h1 className='brand'>svideo</h1>
        </header>
        <div className='video-info'>
          <h1 className='video-title'>{title}</h1>
          <h2 className='video-year'>({year})</h2>
          <img className='video-poster' src={`public/img/posters/${poster}`} />
          <p className='video-description'>{description}</p>
        </div>
        <div className='video-container'>
          <iframe src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;controls=0&amp;showinfo=0`} frameBorder='0' allowFullScreen></iframe>
        </div>
      </div>
    )
  }
}

const { object } = React.PropTypes

Details.propTypes = {
  params: object.isRequired
}

module.exports = Details
