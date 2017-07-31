(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('preact')) :
  typeof define === 'function' && define.amd ? define(['preact'], factory) :
  (global.PreactTransitionGroup = factory(global.preact));
}(this, (function (preact) {

function assign(obj, props) {
	for (var i in props) {
		if (props.hasOwnProperty(i)) obj[i] = props[i];
	}return obj;
}

function getKey(vnode, fallback) {
	var key = vnode.attributes && vnode.attributes.key;
	return key === null || key === undefined ? fallback : key;
}

function linkRef(component, name) {
	var cache = component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
	return cache[name] || (cache[name] = function (c) {
		component.refs[name] = c;
	});
}

function getChildMapping(children) {
	var out = {};
	for (var i = 0; i < children.length; i++) {
		if (children[i] != null) {
			var key = getKey(children[i], i.toString(36));
			out[key] = children[i];
		}
	}
	return out;
}

function mergeChildMappings(prev, next) {
	prev = prev || {};
	next = next || {};

	var getValueForKey = function (key) {
		return next.hasOwnProperty(key) ? next[key] : prev[key];
	};

	var nextKeysPending = {};

	var pendingKeys = [];
	for (var prevKey in prev) {
		if (next.hasOwnProperty(prevKey)) {
			if (pendingKeys.length) {
				nextKeysPending[prevKey] = pendingKeys;
				pendingKeys = [];
			}
		} else {
			pendingKeys.push(prevKey);
		}
	}

	var childMapping = {};
	for (var nextKey in next) {
		if (nextKeysPending.hasOwnProperty(nextKey)) {
			for (var i = 0; i < nextKeysPending[nextKey].length; i++) {
				var pendingNextKey = nextKeysPending[nextKey][i];
				childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
			}
		}
		childMapping[nextKey] = getValueForKey(nextKey);
	}

	for (var _i = 0; _i < pendingKeys.length; _i++) {
		childMapping[pendingKeys[_i]] = getValueForKey(pendingKeys[_i]);
	}

	return childMapping;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var identity = function (i) {
	return i;
};

var TransitionGroup$1 = function (_Component) {
	inherits(TransitionGroup, _Component);

	function TransitionGroup() {
		var _temp, _this, _ret;

		classCallCheck(this, TransitionGroup);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.refs = {}, _this.state = {
			children: getChildMapping(_this.props.children || [])
		}, _this.performEnter = function (key) {
			_this.currentlyTransitioningKeys[key] = true;

			var component = _this.refs[key];

			if (component.componentWillEnter) {
				component.componentWillEnter(_this._handleDoneEntering.bind(_this, key));
			} else {
				_this._handleDoneEntering(key);
			}
		}, _this.performLeave = function (key) {
			_this.currentlyTransitioningKeys[key] = true;

			var component = _this.refs[key];
			if (component.componentWillLeave) {
				component.componentWillLeave(_this._handleDoneLeaving.bind(_this, key));
			} else {
				_this._handleDoneLeaving(key);
			}
		}, _temp), possibleConstructorReturn(_this, _ret);
	}

	TransitionGroup.prototype.componentWillMount = function componentWillMount() {
		this.currentlyTransitioningKeys = {};
		this.keysToEnter = [];
		this.keysToLeave = [];
	};

	TransitionGroup.prototype.componentDidMount = function componentDidMount() {
		var initialChildMapping = this.state.children;
		for (var key in initialChildMapping) {
			if (initialChildMapping[key]) {
				this.performAppear(key);
			}
		}
	};

	TransitionGroup.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		var nextChildMapping = getChildMapping(nextProps.children || []);
		var prevChildMapping = this.state.children;

		this.setState({
			children: mergeChildMappings(prevChildMapping, nextChildMapping)
		});

		var key = void 0;

		for (key in nextChildMapping) {
			if (nextChildMapping.hasOwnProperty(key)) {
				var hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
				if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
					this.keysToEnter.push(key);
				}
			}
		}for (key in prevChildMapping) {
			if (prevChildMapping.hasOwnProperty(key)) {
				var hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
				if (prevChildMapping[key] && !hasNext && !this.currentlyTransitioningKeys[key]) {
					this.keysToLeave.push(key);
				}
			}
		}
	};

	TransitionGroup.prototype.componentDidUpdate = function componentDidUpdate() {
		var keysToEnter = this.keysToEnter;
		this.keysToEnter = [];
		keysToEnter.forEach(this.performEnter);

		var keysToLeave = this.keysToLeave;
		this.keysToLeave = [];
		keysToLeave.forEach(this.performLeave);
	};

	TransitionGroup.prototype.performAppear = function performAppear(key) {
		this.currentlyTransitioningKeys[key] = true;

		var component = this.refs[key];

		if (component.componentWillAppear) {
			component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
		} else {
			this._handleDoneAppearing(key);
		}
	};

	TransitionGroup.prototype._handleDoneAppearing = function _handleDoneAppearing(key) {
		var component = this.refs[key];
		if (component.componentDidAppear) {
			component.componentDidAppear();
		}

		delete this.currentlyTransitioningKeys[key];

		var currentChildMapping = getChildMapping(this.props.children || []);

		if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
			this.performLeave(key);
		}
	};

	TransitionGroup.prototype._handleDoneEntering = function _handleDoneEntering(key) {
		var component = this.refs[key];
		if (component.componentDidEnter) {
			component.componentDidEnter();
		}

		delete this.currentlyTransitioningKeys[key];

		var currentChildMapping = getChildMapping(this.props.children || []);

		if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
			this.performLeave(key);
		}
	};

	TransitionGroup.prototype._handleDoneLeaving = function _handleDoneLeaving(key) {
		var component = this.refs[key];

		if (component.componentDidLeave) {
			component.componentDidLeave();
		}

		delete this.currentlyTransitioningKeys[key];

		var currentChildMapping = getChildMapping(this.props.children || []);

		if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
			this.performEnter(key);
		} else {
			var children = assign({}, this.state.children);
			delete children[key];
			this.setState({ children: children });
		}
	};

	TransitionGroup.prototype.render = function render(_ref, _ref2) {
		var childFactory = _ref.childFactory;
		var transitionLeave = _ref.transitionLeave;
		var transitionName = _ref.transitionName;
		var transitionAppear = _ref.transitionAppear;
		var transitionEnter = _ref.transitionEnter;
		var transitionLeaveTimeout = _ref.transitionLeaveTimeout;
		var transitionEnterTimeout = _ref.transitionEnterTimeout;
		var transitionAppearTimeout = _ref.transitionAppearTimeout;
		var component = _ref.component;
		var props = objectWithoutProperties(_ref, ['childFactory', 'transitionLeave', 'transitionName', 'transitionAppear', 'transitionEnter', 'transitionLeaveTimeout', 'transitionEnterTimeout', 'transitionAppearTimeout', 'component']);
		var children = _ref2.children;

		var childrenToRender = [];
		for (var key in children) {
			if (children.hasOwnProperty(key)) {
				var child = children[key];
				if (child) {
					var ref = linkRef(this, key),
					    el = preact.cloneElement(childFactory(child), { ref: ref, key: key });
					childrenToRender.push(el);
				}
			}
		}return preact.h(component, props, childrenToRender);
	};

	return TransitionGroup;
}(preact.Component);
TransitionGroup$1.defaultProps = {
	component: 'span',
	childFactory: identity
};

return TransitionGroup$1;

})));
//# sourceMappingURL=preact-transition-group.js.map
