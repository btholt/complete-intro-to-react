import React, { Component } from 'react';
import preload from '../data.json';
import ShowCard from './ShowCard';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: 'this is some sort of debug statement'
    };

    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
  }

  handleSearchTermChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    return (
      <div className="search">
        <header>
          <h1>svideo</h1>
          <input
            onChange={this.handleSearchTermChange}
            type="text"
            placeholder="search"
          />
        </header>
        <div>
          {preload.shows.map(show => (
            <ShowCard show={show} key={show.imdbID} />
          ))}
        </div>
      </div>
    );
  }
}
export default Search;
