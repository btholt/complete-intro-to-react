import { h, Component, cloneElement } from 'preact';
import { getChildMapping, mergeChildMappings } from './TransitionChildMapping';
import { assign, linkRef } from './util';


const identity = i => i;

export class TransitionGroup extends Component {
	static defaultProps = {
		component: 'span',
		childFactory: identity
	};

	refs = {};

	state = {
		children: getChildMapping(this.props.children || [])
	};

	componentWillMount() {
		this.currentlyTransitioningKeys = {};
		this.keysToEnter = [];
		this.keysToLeave = [];
	}

	componentDidMount() {
		let initialChildMapping = this.state.children;
		for (let key in initialChildMapping) {
			if (initialChildMapping[key]) {
				// this.performAppear(getKey(initialChildMapping[key], key));
				this.performAppear(key);
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		let nextChildMapping = getChildMapping(nextProps.children || []);
		let prevChildMapping = this.state.children;

		this.setState({
			children: mergeChildMappings(prevChildMapping, nextChildMapping)
		});

		let key;

		for (key in nextChildMapping) if (nextChildMapping.hasOwnProperty(key)) {
			let hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
			if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
				this.keysToEnter.push(key);
			}
		}

		for (key in prevChildMapping) if (prevChildMapping.hasOwnProperty(key)) {
			let hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
			if (prevChildMapping[key] && !hasNext && !this.currentlyTransitioningKeys[key]) {
				this.keysToLeave.push(key);
			}
		}
	}

	componentDidUpdate() {
		let keysToEnter = this.keysToEnter;
		this.keysToEnter = [];
		keysToEnter.forEach(this.performEnter);

		let keysToLeave = this.keysToLeave;
		this.keysToLeave = [];
		keysToLeave.forEach(this.performLeave);
	}

	performAppear(key) {
		this.currentlyTransitioningKeys[key] = true;

		let component = this.refs[key];

		if (component.componentWillAppear) {
			component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
		}
		else {
			this._handleDoneAppearing(key);
		}
	}

	_handleDoneAppearing(key) {
		let component = this.refs[key];
		if (component.componentDidAppear) {
			component.componentDidAppear();
		}

		delete this.currentlyTransitioningKeys[key];

		let currentChildMapping = getChildMapping(this.props.children || []);

		if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
			// This was removed before it had fully appeared. Remove it.
			this.performLeave(key);
		}
	}

	performEnter = (key) => {
		this.currentlyTransitioningKeys[key] = true;

		let component = this.refs[key];

		if (component.componentWillEnter) {
			component.componentWillEnter(this._handleDoneEntering.bind(this, key));
		}
		else {
			this._handleDoneEntering(key);
		}
	};

	_handleDoneEntering(key) {
		let component = this.refs[key];
		if (component.componentDidEnter) {
			component.componentDidEnter();
		}

		delete this.currentlyTransitioningKeys[key];

		let currentChildMapping = getChildMapping(this.props.children || []);

		if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
			// This was removed before it had fully entered. Remove it.
			this.performLeave(key);
		}
	}

	performLeave = (key) => {
		this.currentlyTransitioningKeys[key] = true;

		let component = this.refs[key];
		if (component.componentWillLeave) {
			component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
		}
		else {
			// Note that this is somewhat dangerous b/c it calls setState()
			// again, effectively mutating the component before all the work
			// is done.
			this._handleDoneLeaving(key);
		}
	};

	_handleDoneLeaving(key) {
		let component = this.refs[key];

		if (component.componentDidLeave) {
			component.componentDidLeave();
		}

		delete this.currentlyTransitioningKeys[key];

		let currentChildMapping = getChildMapping(this.props.children || []);

		if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
			// This entered again before it fully left. Add it again.
			this.performEnter(key);
		}
		else {
			let children = assign({}, this.state.children);
			delete children[key];
			this.setState({ children });
		}
	}

	render({ childFactory, transitionLeave, transitionName, transitionAppear, transitionEnter, transitionLeaveTimeout, transitionEnterTimeout, transitionAppearTimeout, component, ...props }, { children }) {
		// TODO: we could get rid of the need for the wrapper node
		// by cloning a single child
		let childrenToRender = [];
		for (let key in children) if (children.hasOwnProperty(key)) {
			let child = children[key];
			if (child) {
				let ref = linkRef(this, key),
					el = cloneElement(childFactory(child), { ref, key });
				childrenToRender.push(el);
			}
		}

		return h(component, props, childrenToRender);
	}
}
