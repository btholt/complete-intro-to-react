// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Landing = () =>
  <div className="landing">
    <h1>svideo</h1>
    <input type="text" placeholder="Search" />
    <Link to="/search">or Browse All</Link>
  </div>;

const mapStateToProps = state => ({ searchTerm: state.searchTerm });

export default connect(mapStateToProps)(Landing);
