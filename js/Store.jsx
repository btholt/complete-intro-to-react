const redux = require('redux')
const reactRedux = require('react-redux')
const data = require('../public/data')

const SET_SEARCH_TERM = 'setSearchTerm'
const initialState = {
  searchTerm: '',
  shows: data.shows
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      const newState = {}
      Object.assign(newState, state, {searchTerm: action.value})
      return newState
    default:
      return state
  }
}

const store = redux.createStore(reducer, initialState, redux.compose(
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f
))
const mapStateToProps = (state) => ({ searchTerm: state.searchTerm, shows: data.shows })
const mapDispatchToProps = (dispatch) => {
  return {
    setSearchTerm: (term) => {
      dispatch({type: SET_SEARCH_TERM, value: term})
    }
  }
}

const connector = reactRedux.connect(mapStateToProps, mapDispatchToProps)

module.exports = { connector, store, reducer }
