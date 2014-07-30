# Engine.js

Engine.js is a very simplistic base framework for iterating and prototyping
various animations or simulations on a canvas tag using
`.requestAnimationFrame`.  The idea is that all you need is a canvas tag, a run
loop, a vector library, and a module system.

To get started, simply open up `index.html` in your favorite browser (that
supports the canvas tag) and pop into `App.js` to see how it works.  For more
in depth details into the structure, just keep on reading.


## RequireJS

The entire module system does depend on [RequreJS](http://requirejs.org) which
you should be at least somewhat familiar with before continuing.  RequireJS
provides the basic module system so that when you work, you never need to edit
the html file or worry about any sort of dependency order.  It also gives you
the nice advantage that if you ever wanted to distribute your work you could
simply run the RequireJS optimizer to build your project into a single file.

To fit within the design of this project, I recommend adding all new Item
modules directly into the js/ folder.  If you are adding any libraries, then I
would recommend you add them to the js/lib folder.  Remember to shim any
libraries that are not written for RequireJS.  See the [RequireJS
Docs](http://requirejs.org/docs/api.html#config-shim) for more information.


## App.js

App.js is your main entry point into Engine.js.  Below you will find a details
regarding its API.


### `App.engineSettings`

An object (or dictionary) enabling you to override many of the default settings
or even methods of Engine.  See the `Engine.js` documentation below for more
details.


### `App.setup`

This method should generally be your starting place.  It is provided as a means
to both instantiate the Engine class and also give you the opportunity to run
any setup code you would need.  This can range from instantiating Items (more
on them later) for the engine, to adding an `.onRun` method.  Feel free to add
any other method to the `App` object and then run those as necessary in your
setup method as well.


### `App.start`

This method starts the engine.  There should rarely be any reason to modify
this method.  Both `.setup` and `.start` get executed at the end of App.js.


## js/Engine.js

Engine is the meat and potatoes of the project.  It manages everything from
your run loop (a function executed 60 times a second), to adding and removing
items, to interpreting mouse or keyboard events to trigger things in your
simulations.

Generally speaking, unless you know what you are doing, there are only a small
handful of properties you should alter.  The recommended way to alter these
settings is to use the `App.engineSettings` API described above.  Any
properties you pass to that object will be merge into the Engine instance,
effectively overwriting them.


### `Engine.fullscreen`

By default, this is set to `true`.  It forces the canvas to fill the entire
browser window.  If set to `false`, you must provide a `width` and `height`.


### `Engine.width` &amp; `Engine.height`

If the aforementioned property is set to `true`, these values are set
automatically by the Engine based on the size of the browser window.  They will
also automatically adjust when the browser window is resized.  If
`Engine.fullscreen` is set to `false`, then they will not adjust on browser
resize and remain fixed to the values that where provided on Engine
instantiation.


### `Engine.mouse`

A series of mouse events are added that can be polled for cursor position and
whether the mouse button is down or not. `mouse.x` and `mouse.y` are integers
of the cursors last reported position (based on mouse move).  `mouse.down` is a
boolean that is `true` when the mouse button is pressed.


### `Engine.clearColor`

There are three possible values for this.  By default, `.clearColor` is
`undefined`.  This is the default behavior and will force the `.clearRect`
method to be called on the entire canvas every frame.  Generally speaking this
is what you want.  Another option is to pass a string representing a color.
This can be RGBA, RGB, Hex, etc.  When a color is specified then `.fillRect`
with the provided color will be used to 'clear' the canvas every frame instead
of `.clearRect`.  And finally, if you set `.clearColor` to `null`, then it will
bypass any clearing of the frame meaning every frame will be drawn on top of
the previous frames.


### `Engine.background`

By default this is empty, resulting in a browser defaulted white background.
If you set it to a string color value, it will set the `document.body` element
backgroundColor.


### `Engine.onRun`

This is an optional method you can add to the Engine instance during setup that
will get called at the end of every run loop.  You can see an example
implementation in `App.js`.


### `Engine.items`

`.items` is an array of all items added to the engine instance.  Generally
speaking you should never manipulate the items directly, instead you should use
the `.additem` and `.removeItem` methods below.  It is however, often very
useful to read data from other items and thus it is made available.


### `Engine.addItem`

This is used to add an Item to the engine.  Every Item you add MUST contain
both an `.update` and a `.draw` method.  These methods are then fired every
frame for every item added to the Engine.  To use it, simply pass your item
instance as the first argument.


### `Engine.removeItem`

This is similar to `.addItem`, you pass the instance you want to remove from
the `.items` array as the first argument.  However it should be noted that the
actual removal process is deferred until the end of the run loop.  This way the
`.update` and `.draw` calls for all the items won't incur any weird race
conditions.


### `Engine.run`

You will probably never need to touch this method, but it will be fired
approximately 60 times a second, and it performs a variety of important tasks
that are absolutely important to know and understand.

First, `.run` determines a new `tick` value based on the time since last frame.

Next, the canvas is cleared, based on the `.clearColor` value, or lack thereof.

With the canvas cleared, or not, every item in the `.items` array is iterated
through.

When `.update` is called, the item will be passed three arguments: `tick`,
`items`, and the engine instance.

`tick` is the amount of time that has passed since
the last frame.

`items` is an array of all items added to the simulation, including the item
currently updating.

The engine instance is passed to provide entry points to the engine should the
item need it (such as `.removeItem`, `.addItem`, or even the canvas `.width`
and `.height` properties.)

When `.draw` is fired, three arguments are also passed: `context`, `scale`, and
the engine instance.

`context` is the canvas context, to be used for the item's drawing.

`scale` is the auto defined property documented below.  Use this to scale your
drawing calls as necessary for retina displays.  Generally it will either be 1
or 2.  See `Item.js` for an example of how this is used

Like in the `.update` call, the engine instance is passed to provide entry
points to the engine should the item need it.

Finally, at the end of this, the `.onRun` method is fired if it exists.  It is
passed the exact same arguments as the `.update` method.


### `Engine.mode`

This describes the context to get from your canvas element.  Unless you want to
create a WebGL context, leave this as it is.


### `Engine.scale`

This is generally a property you should let Engine handle.  It will change
based on the `window.devicePixelRatio` specified by the browser.   It will get
set automatically and enables you to gracefully support retina resolution
visuals.


## js/Item.js

This file was provided purely for example.  It exhibits a classic Vector API
for moving around on the canvas.  Note the required `.update` and `.draw`
methods on the prototype.  Also notice how it utilizes the `scale` argument in
draw to accommodate for retina displays.

The recommended use case for this project is to make copies of the Item.js
file, manipulate as you see fit.  Then add them as requirements for your App.js
file and instantiate them in the `.setup` method.


## js/lib/Vector.js

This is a basic 2d vector library provided as it is often the starting place
for working in this environment.  Currently it is only a 2d vector library, but
porting it to 3d or adding your own would be quite trivial.
