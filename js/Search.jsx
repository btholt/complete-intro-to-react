import React, { Component } from 'react';
import preload from '../data.json';
import ShowCard from './ShowCard';

class Search extends Component {
  /* constructor(props){
    super(props);
    this.state={
      searchTerm:''
    } */

  state = {
    searchTerm: ''
  };

  handleSearchTermChange = e => {
    this.setState({
      searchTerm: e.target.value
    });
  };

  render() {
    return (
      <div className="search">
        <header>
          <h1>Svideo</h1>
          <input
            onChange={this.handleSearchTermChange}
            value={this.state.searchTerm}
            type="text"
            placeholder="search movie"
          />
        </header>
        <div>{preload.shows.map(show => <ShowCard key={show.imdbID} show={show} />)}</div>
      </div>
    );
  }
}

export default Search;
