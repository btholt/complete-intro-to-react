import React from 'react';
import { Link } from 'react-router-dom';
import { func, string, bool } from 'prop-types';

const Header = props => {
  let utilSpace;
  if (props.showSearch) {
    utilSpace = (
      <input type="text" placeholder="Search" value={props.searchTerm} onChange={props.handleSearchTermChange} />
    );
  } else {
    utilSpace = (
      <h2>
        <Link to="/search">
          Back
        </Link>
      </h2>
    );
  }
  return (
    <header>
      <h1>
        <Link to="/">
          svideo
        </Link>
      </h1>
      {utilSpace}
    </header>
  );
};

Header.propTypes = {
  showSearch: bool,
  handleSearchTermChange: func,
  searchTerm: string
};

Header.defaultProps = {
  showSearch: false,
  handleSearchTermChange() {},
  searchTerm: ''
};

export default Header;
