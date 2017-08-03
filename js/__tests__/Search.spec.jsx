import React from 'react'
import { shallow } from 'enzyme'
import preload from '../../data.json'
import Search from '../Search'
import ShowCard from '../ShowCard'

describe('Search', () => {
  it('renders correctly', () => {
    const component = shallow(<Search />)
    expect(component).toMatchSnapshot()
  })

  it('should render correct amount of shows', () => {
    const component = shallow(<Search />)
    expect(component.find(ShowCard).length).toEqual(preload.shows.length)
  })

  it('should render correct amount of shows based on search terms', () => {
    const searchWord = 'black'
    const component = shallow(<Search />)
    component.find('input').simulate('change', { target: { value: searchWord } })
    const showCount = preload.shows.filter(
      show => `${show.title} ${show.description}`.toUpperCase().indexOf(searchWord.toUpperCase()) >= 0,
    ).length
    expect(component.find(ShowCard).length).toEqual(showCount)
  })
})
