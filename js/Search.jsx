// @flow

import React, { Component } from 'react';
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

  props: {
    shows: Array<Show>
  };

  handleSearchTermChange = (e: SyntheticKeyboardEvent & { target: HTMLInputElement }) => {
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
        <div>
          {this.props.shows
            .filter(
              show =>
                `${show.title} ${show.description}`.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) >= 0
            )
            .map(show => <ShowCard {...show} key={show.imdbID} />)}
        </div>
      </div>
    );
  }
}

export default Search;
