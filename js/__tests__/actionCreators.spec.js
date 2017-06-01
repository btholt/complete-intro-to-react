// @flow

import moxios from 'moxios';
import { setSearchTerm, addAPIData } from '../actionCreators';

test('setSearchTerm', () => {
  expect(setSearchTerm('New York')).toMatchSnapshot();
});

test('addAPIData', () => {
  expect(
    addAPIData({
      title: 'Stranger Things',
      year: '2016–',
      description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying forces in order to get him back.',
      poster: 'st.jpg',
      imdbID: 'tt4574334',
      trailer: '9Egf5U8xLo8',
      rating: '8.6'
    })
  ).toMatchSnapshot();
});
