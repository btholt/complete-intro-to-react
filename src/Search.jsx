import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import ShowCard from './ShowCard';
import Header from './Header';

const Search = props =>
  <div className="search">
    <Header showSearch />
    <div>
      {props.shows
        .filter(show => `${show.title} ${show.description}`.toUpperCase().indexOf(props.searchTerm.toUpperCase()) >= 0)
        .map(show => <ShowCard key={show.imdbID} {...show} />)}
    </div>
  </div>;

Search.propTypes = {
  shows: arrayOf(
    shape({
      title: string,
      description: string,
      imdbID: string
    })
  ).isRequired
};

export const Unwrapped = Search;

const mapStateToProps = state => ({
  searchTerm: state.searchTerm
});

export default connect(mapStateToProps)(Search);
