const React = require('react')
const ReactRouter = require('react-router')
const { Link } = ReactRouter

const Landing = () => (
  <div className='home-info'>
    <h1 className='title'>svideo</h1>
    <input className='search' type='text' placeholder='Search' />
    <Link to='/search' className='browse-all'>or Browse All</Link>
  </div>
)

module.exports = Landing
