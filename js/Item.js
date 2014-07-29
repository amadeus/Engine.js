// This is meant as a simple example item to show off how the API should work
// It is recommended to duplicate this file as a framework for building new items
// There is no provided inheritance layer, for simplicity's sake
define([
	'lib/Vector',
	'lib/Util'
],
function(
	Vector,
	Util
){ 'use strict';

var Item = function(settings){
	Util.merge(this, settings);

	this.size  = Vector.coerce(this.size);
	this.accel = Vector.coerce(this.accel);
	this.vel   = Vector.coerce(this.vel);
	this.pos   = Vector.coerce(this.pos);
};

Item.prototype = {

	color: '#ff0000',

	size: {
		x: 10,
		y: 10
	},

	pos: {
		x: 0,
		y: 0
	},

	accel: {
		x: 0,
		y: 0
	},

	vel: {
		x: 0,
		y: 0
	},

	update: function(tick, items, engine){
		// Calculate accel

		this.vel.add(this.accel.mult(tick));
		this.pos.add(this.vel);

		if (this.pos.x < 0) {
			this.vel.x *= -1;
			this.pos.x = 0;
		} else if (this.pos.x > engine.width - this.size.x) {
			this.vel.x *= -1;
			this.pos.x = engine.width - this.size.x;
		}

		if (this.pos.y < 0) {
			this.vel.y *= -1;
			this.pos.y = 0;
		} else if (this.pos.y > engine.height - this.size.y) {
			this.vel.y *= -1;
			this.pos.y = engine.height - this.size.y;
		}

		// Reset accel for next frame
		this.accel.mult(0);
	},

	draw: function(context, scale, engine){
		context.fillStyle = this.color;
		context.fillRect(
			this.pos.x  * scale,
			this.pos.y  * scale,
			this.size.x * scale,
			this.size.y * scale
		);
	}

};

return Item;

});
