# jest-serializer-enzyme

This is a serializer for Enzyme backed by [enzyme-to-json](https://github.com/adriantoine/enzyme-to-json), I suggest looking at `enzyme-to-json` for the implementation details

#### Install it
```
npm install --save-dev jest-serializer-enzyme
```

#### Add it to your jest config
```json
"jest": {
  "snapshotSerializers": ["<rootDir>/node_modules/jest-serializer-enzyme"]
}
```

More about Jest's snapshotSerializer config [here](http://facebook.github.io/jest/docs/configuration.html#snapshotserializers-array-string).

#### Enjoy

```javascript
import React from 'react';
import { shallow } from 'enzyme';

const Bar = ({ text }) => <p>{text}</p>

const Foo = () => (
  <div>
    <Bar text="The text" />
  </div>
);

it('Renders', () => {
  const wrapper = shallow(<Foo />);
  expect(wrapper).toMatchSnapshot();
});
```
