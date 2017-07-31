import React from 'react';
import { mount } from 'enzyme';
import serializer from '../';

const Bar = ({ text }) => <h1>{text}</h1>

const Foo = () => (
  <div>
    <span>Hello</span>
    <Bar text="some text" />
  </div>
)

it('Serializes components', () => {
  const wrapper = mount(<Foo />);
  expect(wrapper).toMatchSnapshot()
});

it('Serializes components when using find()', () => {
  const wrapper = mount(<Foo />);
  expect(wrapper.find('span')).toMatchSnapshot()
  expect(wrapper.find('Bar')).toMatchSnapshot()
});

it('Serializes components that render null', () => {
  const NullComponent = () => null
  const wrapper = mount(<NullComponent />);
  expect(wrapper).toMatchSnapshot()
});
