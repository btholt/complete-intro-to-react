import React from 'react'
import { Provider } from 'react-redux'
import { shallow, render } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import store from './store'
import { setSearchTerm } from './actionCreators'
import Search, { Unwrapped as UnwrappedSearch } from './Search'
import ShowCard from './ShowCard'
import preload from '../public/data.json'

test('Search snapshot test', () => {
  const component = shallow(<UnwrappedSearch shows={preload.shows} searchTerm='' />)
  const tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

test('Search should render a ShowCard for each show', () => {
  const component = shallow(<UnwrappedSearch searchTerm='' shows={preload.shows} />)
  expect(component.find(ShowCard).length).toEqual(preload.shows.length)
})

test('Search should render correct amount of shows based on search', () => {
  const searchWord = 'house'
  store.dispatch(setSearchTerm(searchWord))
  const component = render(<Provider store={store}><Search shows={preload.shows} /></Provider>)
  const showCount = preload.shows.filter((show) => `${show.title} ${show.description}`.toUpperCase().indexOf(searchWord.toUpperCase()) >= 0).length
  expect(component.find('.show-card').length).toEqual(showCount)
})
