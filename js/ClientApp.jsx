import React from 'react';
import { render } from 'react-dom';

const App = () =>
	<div className="app">
		<div className="landing">
			<h1>svideo</h1>
			<input type="text" placeholder="Search" />
			<a>or Browse All</a>
		</div>
	</div>;

render(<App />, document.getElementById('app'));
// first version
// const ce = React.createElement;

// const MyTitle = function(props) {
// 	return ce('div', null, ce('h1', { style: { color: props.color } }, props.title));
// };

// const MyFirstComponent = function() {
// 	return ce(
// 		'div',
// 		{ id: 'my-first-component' },
// 		ce(MyTitle, { color: 'rebeccapurple', title: 'House of Cards' }),
// 		ce(MyTitle, { color: 'peru', title: 'Orange is the New Black' }),
// 		ce(MyTitle, { color: 'burlywood', title: 'Stranger Things' }),
// 		ce(MyTitle, { color: 'lime', title: 'Silicon Valleys' })
// 	);
// };

// same lake bevor but other code

// const MyTitle = function(props) {
// 	return (
// 		<div>
// 			<h1 style={{ color: props.color }}>
// 				{props.title}
// 			</h1>
// 		</div>
// 	);
// };

// const MyFirstComponent = function() {
// 	return (
// 		<div id="my-first-component">
// 			<MyTitle title="House of Cards" color="rebeccapurple" />
// 			<MyTitle title="Orange is the New Black" color="peru" />
// 			<MyTitle title="Stranger Things" color="burlywood" />
// 			<MyTitle title="Silicon Valley" color="lime" />
// 		</div>
// 	);
// };

// render(ce(MyFirstComponent), document.getElementById('app'));
// render(<MyFirstComponent />, document.getElementById('app'));
