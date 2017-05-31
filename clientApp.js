/* global React ReactDOM */

var div = React.DOM.div
var h1 = React.DOM.h1

var ce = React.createElement;

var MyTitle = function (props) {
  return (
    ce('div', null,
      ce('h1', {style: { color: props.color, fontWeight: 'bold', fontSize: '3em' }}, props.title)
    )
  );
};

var MyFirstComponent = function () {
  return (
    div(null,
      MyTitle({title: 'House of Cards', color: 'tomato'}),
      MyTitle({title: 'Orange is the New Black', color: 'blanchedalmond'}),
      MyTitle({title: 'Stranger Things', color: 'papayawhip'})
    )
  );
};

ReactDOM.render(
  ce(MyFirstComponent),
  document.getElementById("app")
);


// var MyTitle = function (props) {
//   return (
//     React.createElement('div', null,
//       React.createElement('h1', null, this.props.title)
//     )
//   );
// };

// var MyTitleFactory = React.createFactory(MyTitle)

// class myFirstComponent extends React.Component{
//   render() {
//     return (
//       div(null,
//         MyTitleFactory({title: 'asdf'}),
//         MyTitleFactory({title: 'wqer'}),
//         MyTitleFactory({title: '1234'}),
//         MyTitleFactory({title: 'zzxc'})
//         // MyTitleFactory({title: 'asdfasf'}),
//         // MyTitleFactory({title: '145823459072345'}),
//         // MyTitleFactory({title: 'qwproiuqwerpou'}),
//         // MyTitleFactory({title: 'zx,.nmzxcv,mn'})
//       )
//     )
//   }
// }

// var myFirstComponent = React.createClass({
//   render: function() {
//     return (
//       React.DOM.div(null,
//         React.DOM.h1(null, "This is a React component.")
//       )
//     )
//   }
// })

// ReactDOM.render(
//   React.createElement(myFirstComponent),
//   document.getElementById('app')
// )

