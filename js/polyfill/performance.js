// A slightly code style modified version of
// performance.now polyfill from:
// https://gist.github.com/paulirish/5438650

define(function() { 'use strict';

if (typeof window.performance === 'undefined') {
	window.performance = {};
}

if (!window.performance.now) {
	var nowOffset = Date.now();

	if (
		window.performance.timing &&
		window.performance.timing.navigationStart
	) {
		nowOffset = window.performance.timing.navigationStart;
	}

	window.performance.now = function now(){
		return Date.now() - nowOffset;
	};
}

return window.performance;

});
