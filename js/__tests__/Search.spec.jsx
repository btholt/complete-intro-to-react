// @flow

import React from 'react';
import { shallow } from 'enzyme';
import Search from '../Search';
import preload from '../../data.json';
import ShowCard from '../ShowCard';

test('Search renders correctly', () => {
  const component = shallow(<Search thing="ho" />);
  expect(component).toMatchSnapshot();
});

test('Search should render correct amount of shows', () => {
  const component = shallow(<Search />);
  expect(preload.shows.length).toEqual(component.find(ShowCard).length);
});

test('Search should render correct amount of shows based on search', () => {
  const searchWord = 'house';
  const component = shallow(<Search />);
  component.find('input').simulate('change', { target: { value: searchWord } });
  const showCount = preload.shows.filter(show =>
    `${show.title.toUpperCase()} ${show.description.toUpperCase()}`.includes(searchWord.toUpperCase())
  ).length;
  expect(showCount).toEqual(component.find(ShowCard).length);
});
