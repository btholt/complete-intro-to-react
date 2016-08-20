const React = require('react')

/* this is not a stateful component */
const Layout = (props) => (
  <div className='app-container'>
  {props.children}
  </div>
  )

const {element} = React.PropTypes

Layout.propTypes = {
  children: element.isRequired
}

module.exports = Layout
