var div = React.DOM.div
var h1 = React.DOM.h1

var MyTitle = React.createClass({
  render() {
    return (
      div(null,  //we dont have to have a div here
        h1({style: {color: this.props.color}}, this.props.title)
        ))
  }
})

var MyTitleFact = React.createFactory(MyTitle)
var ce = React.createElement

//we can use myTitle many times in MyFirstComponnent
//React.createElement(MyTitle, null) and MyTitleFact(null) and
// ce(MyTitle, null) are the same

var MyFirstComponent = (
    div(null,
      MyTitleFact({title: 'Props are great!', color: "rebeccapurple"}), // MyTitleFact(null)
      React.createElement(MyTitle, {title: 'Use props everywhere!', color: "mediumaquamarine"}), //React.createElement(MyTitle, null)
      ce(MyTitle, {title: 'Props are the best!', color: "peru"}) // ce(MyTitle, null)
    )
)

ReactDOM.render(MyFirstComponent, document.getElementById('app'))
