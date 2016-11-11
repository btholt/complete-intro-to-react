var div = React.DOM.div
	var h1 = React.DOM.h1

var MyTitle = React.createClass({
	render () {
		return (
			div(null,
				h1({style: {color: this.props.color}}, this.props.title)
				)
			)
	}
})

var MyTitleFact = React.createFactory(MyTitle)

	var MyFirstComponent = (
		div(null, MyTitleFact({title: "Props are great!", color: "mediumaquamarine"})
			)
		)


ReactDOM.render(MyFirstComponent, document.getElementById('app'))