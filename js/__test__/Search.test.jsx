import React from 'react';
import { shallow } from 'enzyme';
import Search from '../Search';

// console.log(process.env.NODE_ENV);

test('Search renders correctly', () => {
  const component = shallow(<Search />);
  expect(component).toMatchSnapshot();
});
