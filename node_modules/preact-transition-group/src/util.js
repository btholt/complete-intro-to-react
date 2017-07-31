import { h } from 'preact';

export function assign(obj, props) {
	for (let i in props) if (props.hasOwnProperty(i)) obj[i] = props[i];
	return obj;
}

export function getKey(vnode, fallback) {
	let key = vnode.attributes && vnode.attributes.key;
	return key===null || key===undefined ? fallback : key;
}

export function linkRef(component, name) {
	let cache = component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
	return cache[name] || (cache[name] = c => {
		component.refs[name] = c;
	});
}
