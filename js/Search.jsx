import React, { Component } from 'react';
import preload from '../data.json';
import ShowCard from './ShowCard';

class Search extends Component {
	render() {
		return (
			<div className="search">
				<header>
					<h1>svideo</h1>
					<input type="text" placeholder="Search" />
				</header>
				<div>
					{preload.shows.map(show => <ShowCard key={show.imdbID} {...show} />)}
				</div>
			</div>
		);
	}
}

export default Search;

// just print the data like it is
// <pre>
//  <code>
//		{JSON.stringify(preload, null, 4)}}
//	</code>
// </pre>

// show the title of each element of the array
// {preload.shows.map(show =>
// 	<h3>
// 		{show.title}
// 	</h3>
// )}

// you can do it also this way and then you dont need in showcard to do
// it this way {props.show.title} you can just type {props.title} etc
// and erase line 21 and 26 in showcard 	show: shape({     	}).isRequired
// also delete shape on line 2

// <div className="search">
// 	{preload.shows.map(show => <ShowCard {...show} />)}
// </div>;

// or you can do each element like this title = {show.title} etc
