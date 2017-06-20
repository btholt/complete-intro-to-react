import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import ShowCard from './ShowCard';
import Header from './Header';

class Search extends React.Component {
  static propTypes = {
    shows: arrayOf(
      shape({
        title: string,
        description: string,
        imdbID: string
      })
    ).isRequired
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
        <Header showSearch searchTerm={this.state.searchTerm} handleSearchTermChange={this.handleSearchTermChange} />
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
