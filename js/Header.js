import React from 'react'
import { Link } from 'react-router'

const { func, bool, string } = React.PropTypes
Header.propTypes = {
  handleSearchTermChange: func,
  showSearch: bool,
  searchTerm: string
}

class Header extends React.Component {
  render () {
    return (
      <header>
        <h1>
          <Link to='/'>
            svideo
          </Link>
        </h1>
      </header>
    )
  }
}

export default Header
