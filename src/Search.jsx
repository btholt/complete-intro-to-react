import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import ShowCard from './ShowCard';

class Search extends React.Component {
  propTypes = {
    shows: arrayOf(
      shape({
        title: string,
        description: string,
        imdbID: string
      })
    )
  };
  state = {
    searchTerm: ''
  };
  handleSearchTermChange = event => {
    this.setState({ searchTerm: event.target.value });
  };
  render() {
    return (
      <div className="search">
        <header>
          <h1>svideo</h1>
          <input
            onChange={this.handleSearchTermChange}
            type="text"
            placeholder="Search"
            value={this.state.searchTerm}
          />
        </header>
        <div>
          {this.props.shows
            .filter(
              show =>
                `${show.title} ${show.description}`.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) >= 0
            )
            .map(show => <ShowCard key={show.imdbID} {...show} />)}
        </div>
      </div>
    );
  }
}

export default Search;
