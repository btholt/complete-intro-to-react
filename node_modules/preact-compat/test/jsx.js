import renderToString from 'preact-render-to-string';
import React from '../src';

describe('jsx', () => {
	it('should render react-style', () => {
		let jsx = (
			<div className="foo bar" data-foo="bar">
				<span id="some_id">inner!</span>
				{ ['a', 'b'] }
			</div>
		);

		expect(jsx.attributes).to.have.property('className', 'foo bar');

		let html = renderToString(jsx);

		expect(html).to.equal('<div class="foo bar" data-foo="bar"><span id="some_id">inner!</span>ab</div>');
	});
});
