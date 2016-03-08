/* eslint-env mocha */
const React = require('react')
const chai = require('chai')
const { expect } = chai
const Search = require ('../js/Search')
const ShowCard = require('../js/ShowCard')
const enzyme = require('enzyme')
const { shallow, mount } = enzyme
const data = require('../public/data')

describe('<Search />', () => {
  it('should render the brand', () => {
    const wrapper = shallow(<Search />)
    expect(wrapper.contains(<h1 className='brand'>svideo</h1>)).to.be.true
  })

  it('show render as many shows as there are data for', () => {
    const wrapper = shallow(<Search />)
    expect(wrapper.find(ShowCard).length).to.equal(data.shows.length)
  })

  it('should filter correctly given new state', () => {
    const wrapper = mount(<Search />)
    const input = wrapper.find('.search-input')
    input.node.value = 'house'
    input.simulate('change')
    expect(wrapper.state('searchTerm')).to.equal('house')
    expect(wrapper.find('.show-card').length).to.equal(2)
  })
})
