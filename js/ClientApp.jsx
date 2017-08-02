const ce = React.createElement;

const MyTitle = function(props) {
	return ce('div', null, ce('h1', { style: { color: props.color } }, props.title));
};

const MyFirstComponent = function() {
	return ce(
		'div',
		{ id: 'my-first-component' },
		ce(MyTitle, { color: 'rebeccapurple', title: 'House of Cards' }),
		ce(MyTitle, { color: 'peru', title: 'Orange is the New Black' }),
		ce(MyTitle, { color: 'burlywood', title: 'Stranger Things' })
	);
};

const x = 5;

ReactDOM.render(ce(MyFirstComponent), document.getElementById('app'));
