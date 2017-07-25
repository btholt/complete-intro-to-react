const ce = React.createElement

const MyTitle = function (props) {
	return (
		ce('div', null,
			ce('h1', { style: { color: props.color }}, props.title )
		)
	)
}

const MyFirstComponent = function () {
	return ce('div', null,
		ce(MyTitle, {title: 'Game of Thrones', color: 'YellowGreen' }),
		ce(MyTitle, {title: 'Stranger Things', color: 'peru' }),
		ce(MyTitle, {title: 'Silicon Valley', color: 'LimeGreen' })
	)
}

ReactDOM.render(
	ce(MyFirstComponent)
	document.getElementById('app')
)