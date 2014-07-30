require.config({
	baseUrl: 'js/',

	shim: {
		// Add your shims here for libraries you
		// want to include that are not RequireJS
		// compatible. More details here:
		// http://requirejs.org/docs/api.html#config-shim
	}
});

require([
	'Engine',
	'Item',
	'lib/Util'
],
function(
	Engine,
	Item,
	Util
){ 'use strict';

var App = {

	instance: null,

	engineSettings: {
		background: '#000',
		clearColor: 'rgba(0,0,0,0.2)'
	},

	setup: function(){
		// Required... to run the engine
		this.engine = new Engine(this.engineSettings);

		// Every frame add one item until we hit 1000
		this.engine.onRun = function(tick, items, engine){
			if (items.length < 600) {
				engine.addItem(new Item({
					color: 'rgba(' +
						Util.randomInt(0,256) + ',' +
						Util.randomInt(0,256) + ',' +
						Util.randomInt(0,256) + ',0.5)',
					accel: {
						x: Util.randomFloat(-200, 200),
						y: Util.randomFloat(-200, 200)
					},
					pos: {
						x: engine.width  / 2,
						y: engine.height / 2
					}
				}));
			}
		};

		return this;
	},

	start: function(){
		this.engine.start();
		return this;
	}

};

App.setup().start();

});
