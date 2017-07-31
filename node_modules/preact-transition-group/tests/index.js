import { h, Component, render, rerender } from 'preact';
import TransitionGroup from 'src';

/* global describe,expect,it,sinon */

class Todo extends Component {
	componentWillEnter(done) {
		setTimeout(done, 20);
	}
	componentDidEnter() {}

	componentWillLeave(done) {
		setTimeout(done, 20);
	}
	componentDidLeave() {}

	render({ onClick, children }) {
		return <div onClick={onClick} class="item">{children}</div>;
	}
}

class TodoList extends Component {
	state = {
		items: ['hello', 'world', 'click', 'me']
	};

	handleAdd(item) {
		let { items } = this.state;
		items = items.concat(item);
		this.setState({ items });
	}

	handleRemove(i) {
		let { items } = this.state;
		items.splice(i, 1);
		this.setState({ items });
	}

	render(_, { items }) {
		return (
			<div>
				<TransitionGroup>
					{ items.map( (item, i) => (
						<Todo key={item} onClick={this.handleRemove.bind(this, i)}>
							{item}
						</Todo>
					)) }
				</TransitionGroup>
			</div>
		);
	}
}


const Nothing = () => null;


describe('TransitionGroup', () => {
	let container = document.createElement('div'),
		list, root;
	document.body.appendChild(container);

	let $ = s => [].slice.call(container.querySelectorAll(s));

	beforeEach( () => {
		root = render(<TodoList ref={c => list=c} />, container, root);
	});

	afterEach( () => {
		list = null;
		root = render(<Nothing />, container, root);
	});

	it('create works', () => {
		expect($('.item')).to.have.length(4);
	});

	it('enter works', done => {
		sinon.spy(Todo.prototype, 'componentWillEnter');
		sinon.spy(Todo.prototype, 'componentDidEnter');

		list.handleAdd('foo');
		// rerender();

		setTimeout( () => {
			expect($('.item')).to.have.length(5);
		});

		setTimeout( () => {
			expect($('.item')).to.have.length(5);
			expect(Todo.prototype.componentDidEnter).to.have.been.calledOnce;
			Todo.prototype.componentWillEnter.restore();
			Todo.prototype.componentDidEnter.restore();
			done();
		}, 40);
	});

	it('leave works', done => {
		sinon.spy(Todo.prototype, 'componentWillLeave');
		sinon.spy(Todo.prototype, 'componentDidLeave');

		list.handleRemove(0);
		// rerender();

		// make sure -leave class was added
		setTimeout( () => {
			expect($('.item')).to.have.length(4);
		});

		// then make sure it's gone
		setTimeout( () => {
			expect($('.item')).to.have.length(3);
			expect(Todo.prototype.componentDidLeave).to.have.been.calledOnce;
			Todo.prototype.componentWillLeave.restore();
			Todo.prototype.componentDidLeave.restore();
			done();
		}, 40);
	});

	// it('transitionLeave works', done => {
	// 	// this.timeout(5999);
	// 	list.handleAdd(Date.now());
	//
	// 	setTimeout( () => {
	// 		expect($('.item')).to.have.length(5);
	//
	// 		expect($('.item')[0].className).to.contain('example-enter');
	// 		expect($('.item')[0].className).to.contain('example-enter-active');
	// 	}, 100);
	//
	// 	setTimeout( () => {
	// 		expect($('.item')).to.have.length(5);
	//
	// 		expect($('.item')[0].className).not.to.contain('example-enter');
	// 		expect($('.item')[0].className).not.to.contain('example-enter-active');
	//
	// 		done();
	// 	}, 1400);
	// });
});
