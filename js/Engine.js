define([
	'lib/Vector',
	'lib/Util',

	'polyfill/requestAnimationFrame',
	'polyfill/performance',
	'polyfill/Function.prototype.bind'
],
function(
	Vector,
	Util,
	requestAnimationFrame,
	performance
){ 'use strict';

var undef;

var Engine = function(settings){
	Util.merge(this, settings);

	this.setupCanvas();
	this.setupMouse();

	this.run = this.run.bind(this);

	this.items     = [];
	this.onPreRun  = [];
	this._deffered = [];
};

Engine.prototype = {

	mode  : '2d',
	scale : 1,
	fullscreen : true,
	background : '#fff',

	mouse: {
		x: -9999,
		y: -9999
	},

	setupCanvas: function(){
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext(this.mode);

		if (this.fullscreen) {
			this._handleResize = this._handleResize.bind(this);
			window.addEventListener('resize', this._handleResize, false);
		}
		this._handleResize();

		document.body.style.backgroundColor = this.background;

		return this;
	},

	setupMouse: function(){
		this.mouse = Vector.coerce(this.mouse);
		this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this), false);
	},

	start: function(){
		this.last = performance.now() / 1000;
		requestAnimationFrame(this.run);
		return this;
	},

	pause: function(){
		this.paused = true;
		return this;
	},

	resume: function(){
		this.paused = false;
		this.start();
		return this;
	},

	addItem: function(item){
		this.items.push(item);
		return this;
	},

	killItem: function(item){
		var indexOf = this._deffered.indexOf(item);
		if (indexOf >= 0) {
			return this;
		}
		this._deffered.push(item);
		return this;
	},

	run: function(){
		var i, items, deffered, preRun, scale, context, tick, _now, indexOf;

		if (this.paused) {
			return this;
		}

		items    = this.items;
		deffered = this._deffered;
		preRun   = this.onPreRun;
		scale    = this.scale;
		context  = this.context;

		_now  = performance.now() / 1000;
		tick = Math.min(_now - this.last, 0.02);

		if (this.mode === '2d' && this.clearColor) {
			this.context.fillStyle = this.clearColor;
			this.context.fillRect(
				0,
				0,
				this.width  * scale,
				this.height * scale
			);
		} else if (this.mode === '2d' && this.clearColor === undef) {
			this.context.clearRect(
				0,
				0,
				this.width  * scale,
				this.height * scale
			);
		}

		// Update cycle
		for (i = 0; i < items.length; i++) {
			items[i].update(tick, items, this);
		}

		// Draw cycle
		for (i = 0; i < items.length; i++) {
			items[i].draw(context, scale, this);
		}

		// Remove dead items
		if (deffered.length) {
			for (i = 0; i < deffered.length; i++) {
				indexOf = items.indexOf(deffered[i]);
				if (indexOf < 0) {
					continue;
				}
				items.splice(indexOf, 1);
			}

			deffered.length = 0;
		}

		if (this.onRun) {
			this.onRun(tick, items, this);
		}

		this.last = _now;

		requestAnimationFrame(this.run);
	},

	_handleResize: function(){
		this.scale  = window.devicePixelRatio || 1;

		if (this.fullscreen) {
			this.width  = window.innerWidth;
			this.height = window.innerHeight;
		} else {
			this.canvas.style.width  = this.width  + 'px';
			this.canvas.style.height = this.height + 'px';
			this.canvas.style.top  = '50%';
			this.canvas.style.left = '50%';
			this.canvas.style.margin = '-' +
				(this.height / 2) + 'px 0 0 -' +
				(this.width  / 2) + 'px';
		}

		this.canvas.width  = this.width  * this.scale;
		this.canvas.height = this.height * this.scale;
	},

	_handleMouseMove: function(event){
		this.mouse.x = event.layerX;
		this.mouse.y = event.layerY;
	}

};

return Engine;

});
