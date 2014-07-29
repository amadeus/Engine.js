define(function(){

var Util = {

	// Shallow merge all arguments into the first
	merge: function(){
		var base, objects, i, obj, key;
		objects = Array.prototype.slice.call(arguments, 0);
		base = objects.shift();

		for (i = 0; i < objects.length; i++) {
			obj = objects[i];

			if (!obj){
				continue;
			}

			for (key in obj) {
				if (obj[key] !== undefined) {
					base[key] = obj[key];
				}
			}
		}

		obj = undefined;
		objects = undefined;

		return base;
	},

	// A shallow clone API
	clone: function(ref){
		var clone = {}, key;
		for (key in ref) {
			clone[key] = ref[key];
		}
		return clone;
	},

	// Non-inclusive
	randomFloat: function(min, max){
		return Math.random() * (max - min) + min;
	},

	// Non-inclusive
	randomInt: function(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	},

	// Stolen from ImpactJS
	map: function(val, istart, istop, ostart, ostop){
		return ostart + (ostop - ostart) * ((val - istart) / (istop - istart));
	}
};

return Util;

});
