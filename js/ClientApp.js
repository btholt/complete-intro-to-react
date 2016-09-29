var div = React.DOM.div
var h1 = React.DOM.h1

var MyTitle = React.createClass({
  render () {
    return (
      // can only return one component, hence why you would wrap them all in a div
      div(null,
        h1({style: {color: this.props.color }}, this.props.title)
      )
    )
  }
})

var MyTitleFactory = React.createFactory(MyTitle)

var MyFirstComponent = (
  div(null,
    MyTitleFactory({title: 'Props are great', color: 'rebeccapurple'}),
    MyTitleFactory({title: 'Use props everywhere', color: 'peru'}),
    MyTitleFactory({title: 'Props are awesome', color: 'mediumaquamarine'})
  )
)

ReactDOM.render(MyFirstComponent, document.getElementById('app'))
