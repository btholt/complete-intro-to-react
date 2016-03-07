var div = React.DOM.div
var h1 = React.DOM.h1

var MyTitle = React.createClass({
  render () {
    return (
      div(null,
        h1({style: { color: this.props.color}}, this.props.title)
      )
    )
  }
})

var e = React.createElement
var MyTitleFact = React.createFactory(MyTitle)

var MySecondComponent = (
  div(null,
    e(MyTitle, {title: 'Props are great!', color: 'peru'}),
    MyTitleFact({title: 'Use props everywhere!', color: 'rebeccapurple'}),
    React.createElement(MyTitle, {title: 'Props are the best!', color: 'mediumaquamarine'})
  )
)

ReactDOM.render(MySecondComponent, document.getElementById('app'))





