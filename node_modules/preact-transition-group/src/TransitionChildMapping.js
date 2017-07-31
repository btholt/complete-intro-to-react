/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *	Additional credit to the Author of rc-css-transition-group: https://github.com/yiminghe
 *	File originally extracted from the React source, converted to ES6 by https://github.com/developit
 */

import { getKey } from './util';


export function getChildMapping(children) {
	let out = {};
	for (let i=0; i<children.length; i++) {
		if (children[i]!=null) {
			let key = getKey(children[i], i.toString(36));
			out[key] = children[i];
		}
	}
	return out;
}


export function mergeChildMappings(prev, next) {
	prev = prev || {};
	next = next || {};

	let getValueForKey = key => next.hasOwnProperty(key) ? next[key] : prev[key];

	// For each key of `next`, the list of keys to insert before that key in
	// the combined list
	let nextKeysPending = {};

	let pendingKeys = [];
	for (let prevKey in prev) {
		if (next.hasOwnProperty(prevKey)) {
			if (pendingKeys.length) {
				nextKeysPending[prevKey] = pendingKeys;
				pendingKeys = [];
			}
		}
		else {
			pendingKeys.push(prevKey);
		}
	}

	let childMapping = {};
	for (let nextKey in next) {
		if (nextKeysPending.hasOwnProperty(nextKey)) {
			for (let i=0; i<nextKeysPending[nextKey].length; i++) {
				let pendingNextKey = nextKeysPending[nextKey][i];
				childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
			}
		}
		childMapping[nextKey] = getValueForKey(nextKey);
	}

	// Finally, add the keys which didn't appear before any key in `next`
	for (let i=0; i<pendingKeys.length; i++) {
		childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
	}

	return childMapping;
}
