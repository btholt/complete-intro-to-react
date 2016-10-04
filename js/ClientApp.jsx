// const React = require('react')
// const Layout = require('./Layout')
// const ReactRouter = require('react-router')
// const { Router, browserHistory } = ReactRouter
// const Store = require('./Store')
// const { store } = Store
// const reactRedux = require('react-redux')
// const { Provider } = reactRedux

// if (typeof module !== 'undefined' && module.require) {
//   if (typeof require.ensure === 'undefined') {
//     require.ensure = require('node-ensure')// shim for node.js
//   }
// }

// const rootRoute = {
//   component: Layout,
//   path: '/',
//   indexRoute: {
//     getComponent (location, cb) {
//       require.ensure([], () => {
//         cb(null, require('./Landing'))
//       })
//     }
//   },
//   childRoutes: [
//     {
//       path: 'search',
//       getComponent (location, cb) {
//         require.ensure([], () => {
//           cb(null, require('./Search'))
//         })
//       }
//     },
//     {
//       path: 'details/:id',
//       getComponent (location, cb) {
//         require.ensure([], () => {
//           cb(null, require('./Details'))
//         })
//       }
//     }
//   ]
// }

// class App extends React.Component {
//   render () {
//     return (
//       <Provider store={store}>
//         <Router routes={rootRoute} history={browserHistory} />
//       </Provider>
//     )
//   }
// }

// // App.Routes = myRoutes
// App.Routes = rootRoute
// App.History = browserHistory

// module.exports = App

// Above is the previous code written for lesson 
// Below is my code for the lesson 


var div = React.DOM.div 
var h1 = React.DOM.h1

var MyTitle = React.createClass({ 
  render() { 
    return ( 
      div(null, 
        h1({style: {color: this.props.color}}, this.props.title)
      )
    )
  }
})
//Creating factory 
var MyTitleFact = React.createFactory(MyTitle)
var ce = React.createElement 

      var MyFirstComponent = ( 
        div({style: {color: 'red'}}, 
          MyTitleFact({title: 'Props are great', color: 'rebeccapurple'}),
          React.createElement(MyTitle, {title: 'Use props everywhere', color: 'mediumaquamarine'}),
          ce(MyTitle, {title: 'Props are the best', color: 'papayawhip'})
          )
        )

      ReactDOM.render(MyFirstComponent, document.getElementById('app'))





