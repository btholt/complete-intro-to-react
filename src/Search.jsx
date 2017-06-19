import React from 'react';
import ShowCard from './ShowCard';
import preload from '../data.json';

class Search extends React.Component {
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
          {preload.shows
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
