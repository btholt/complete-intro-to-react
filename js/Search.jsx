import React from 'react';
import preload from '../data.json';

const Search = () =>
	<div className="search">
		<div>
			{preload.shows.map(show =>
				<div className="show-card">
					<img alt={`${show.title} Show Poster`} src={`/public/img/posters/${show.poster}`} />
					<div>
						<h3>
							{show.title}
						</h3>
						<h4>
							({show.year})
						</h4>
						<p>
							{show.description}
						</p>
					</div>
				</div>
			)}
		</div>
	</div>;

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
