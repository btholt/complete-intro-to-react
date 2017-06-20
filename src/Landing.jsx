import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { string, func } from 'prop-types';
import { setSearchTerm } from './actionCreators';

const Landing = props =>
  <div className="landing">
    <h1>svideo</h1>
    <input onChange={props.handleSearchTermChange} value={props.searchTerm} type="text" placeholder="Search" />
    <Link to="/search">or Browse All</Link>
  </div>;

Landing.propTypes = {
  searchTerm: string.isRequired,
  handleSearchTermChange: func.isRequired
};

const mapStateToProps = state => ({ searchTerm: state.searchTerm });

const mapDispatchToProps = dispatch => ({
  handleSearchTermChange(event) {
    dispatch(setSearchTerm(event.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
