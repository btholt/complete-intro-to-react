import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { string, func, object } from 'prop-types';
import { setSearchTerm } from './actionCreators';

class Landing extends React.Component {
  static propTypes = {
    searchTerm: string.isRequired,
    handleSearchTermChange: func.isRequired,
    history: object.isRequired // eslint-disable-line react/forbid-prop-types
  };
  goToSearch = event => {
    event.preventDefault();
    this.props.history.push('/search');
  };
  render() {
    return (
      <div className="landing">
        <h1>svideo</h1>
        <form onSubmit={this.goToSearch}>
          <input
            onChange={this.props.handleSearchTermChange}
            value={this.props.searchTerm}
            type="text"
            placeholder="Search"
          />
        </form>
        <Link to="/search">or Browse All</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({ searchTerm: state.searchTerm });

const mapDispatchToProps = dispatch => ({
  handleSearchTermChange(event) {
    dispatch(setSearchTerm(event.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
