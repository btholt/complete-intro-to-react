const React = require('react')

const ShowCard = (props) => (
       <div className='show-card'>
      <img src={`public/img/posters/${props.poster}`} className='show-card-img'
      />
      <div className='show-card-text' >
        <h3 className='show-card-title'> {props.title}</h3>
        <h4 className='show-card-year'>({props.year})</h4>
        <p className='show-card-desription'>{props.description}</p>
      </div> 
    </div>
    )

const string = React.PropTypes.string

/*this is type hinting, tell react that showcard should have a prop called show 
passed to it*/
ShowCard.propTypes = {
  title: string.isRequired,
  description: string.isRequired,
  year: string.isRequired,
  poster: string.isRequired
}

module.exports = ShowCard
