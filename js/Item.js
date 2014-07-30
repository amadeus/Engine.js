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

	this.accel = Vector.coerce(this.accel);
	this.vel   = Vector.coerce(this.vel);
	this.pos   = Vector.coerce(this.pos);
};

Item.prototype = {

	color: '#ff0000',

	radius: 5,

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

		if (this.pos.x < this.radius) {
			this.vel.x *= -1;
			this.pos.x = this.radius;
		} else if (this.pos.x > engine.width - this.radius) {
			this.vel.x *= -1;
			this.pos.x = engine.width - this.radius;
		}

		if (this.pos.y < this.radius) {
			this.vel.y *= -1;
			this.pos.y = this.radius;
		} else if (this.pos.y > engine.height - this.radius) {
			this.vel.y *= -1;
			this.pos.y = engine.height - this.radius;
		}

		// Reset accel for next frame
		this.accel.mult(0);
	},

	draw: function(context, scale, engine){
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(
			this.pos.x  * scale,
			this.pos.y  * scale,
			this.radius * scale,
			0,
			Math.PI * 2,
			false
		);
		context.fill();
	}

};

return Item;

});
