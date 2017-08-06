import React from 'react';
import preload from '../data.json';

const Search = () =>
	<div className="search">
		{preload.shows.map(show =>
			<h3>
				{show.title}
			</h3>
		)}
	</div>;

export default Search;

// just print the data like it is
// <pre>
//  <code>
//		{JSON.stringify(preload, null, 4)}}
//	</code>
// </pre>
