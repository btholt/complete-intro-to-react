import React from 'react';
import { shallow } from 'enzyme';
import serializer from '../';

const Bar = ({ text }) => <h1>{text}</h1>

const Foo = () => (
  <div>
    <span>Hello</span>
    <Bar text="some text" />
  </div>
)

it('Serializes components', () => {
  const wrapper = shallow(<Foo />);
  expect(wrapper).toMatchSnapshot()
});

it('Serializes components when using find() and dive()', () => {
  const wrapper = shallow(<Foo />);
  expect(wrapper.find('span')).toMatchSnapshot()
  expect(wrapper.find('Bar').dive()).toMatchSnapshot()
});

it('Serializes components that render null', () => {
  const NullComponent = () => null
  const wrapper = shallow(<NullComponent />);
  expect(wrapper).toMatchSnapshot()
});
