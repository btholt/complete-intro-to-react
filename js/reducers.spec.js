/* eslint-env node, jest */
import reducers from './reducers'

test('SET_SEARCH_STATE', () => {
  let state
  state = reducers({searchTerm: ''}, {type: 'SET_SEARCH_TERM', searchTerm: 'orange'})
  expect(state).toEqual({searchTerm: 'orange'})
})

test('@@INIT', () => {
  let state
  state = reducers(undefined, {})
  expect(state).toEqual({searchTerm: ''})
})
