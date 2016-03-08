const redux = require('redux')
const reactRedux = require('react-redux')

const SET_SEARCH_TERM = 'setSearchTerm'
const initialState = {searchTerm: ''}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return setSearchTermReducer(state, action)
    default:
      return state
  }
}

const setSearchTermReducer = (state, action) => {
  const newState = {}
  Object.assign(newState, state, {searchTerm: action.value})
  return newState
}

const store = redux.createStore(rootReducer, initialState, redux.compose(
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f
))

const mapStateToProps = (state) => {
  return { searchTerm: state.searchTerm }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setSearchTerm (term) {
      dispatch({type: SET_SEARCH_TERM, value: term})
    }
  }
}

const connector = reactRedux.connect(mapStateToProps, mapDispatchToProps)

module.exports = { connector, store, rootReducer }
