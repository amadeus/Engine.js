// A slightly code style modified version of
// Date.now polyfill from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now

define(function(){ 'use strict';

if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

return Date.now;

});
