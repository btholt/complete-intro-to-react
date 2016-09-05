const React = require('react')

const Layout = (props) => (
  <div className='app-container'>
    {props.children}
  </div>
)

const { element } = React.PropTypes

Layout.propTypes = {
  children: element
}

module.exports = Layout
