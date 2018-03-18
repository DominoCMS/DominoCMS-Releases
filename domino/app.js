var Class = (function () {

	// Baseline setup
	// --------------

	// Stores whether the object is being initialized. i.e., whether
	// to run the `init` function, or not.
	var initializing = false,

	// Keep a few prototype references around - for speed access,
	// and saving bytes in the minified version.
		ArrayProto = Array.prototype;

	// Helper function to copy properties from one object to the other.
	function copy(from, to) {
		var name;
		for (name in from) {
			if (from.hasOwnProperty(name)) {
				to[name] = from[name];
			}
		}
	}

	// The base `Class` implementation.
	function Fiber() {}

	// ###Extend
	//
	// Returns a subclass.
	Fiber.extend = function (fn) {
		// Keep a reference to the current prototye.
		var parent = this.prototype,

		// Invoke the function which will return an object literal used to
		// define the prototype. Additionally, pass in the parent prototype,
		// which will allow instances to use it.
			properties = fn(parent),

		// Stores the constructor's prototype.
			proto;

		// The constructor function for a subclass.
		function child() {
			if (!initializing) {
				// Custom initialization is done in the `init` method.
				this.construct.apply(this, arguments);
				// Prevent subsequent calls to `init`. Note: although a `delete
				// this.init` would remove the `init` function from the instance, it
				// would still exist in its super class' prototype.  Therefore,
				// explicitly set `init` to `void 0` to obtain the `undefined`
				// primitive value (in case the global's `undefined` property has
				// been re-assigned).
				this.construct = void 0;
			}
		}

		// Instantiate a base class (but only create the instance, without
		// running `init`). And, make every `constructor` instance an instance
		// of `this` and of `constructor`.
		initializing = true;
		proto = child.prototype = new this;
		initializing = false;

		// Add default `init` function, which a class may override; it should
		// call the super class' `init` function (if it exists);
		proto.construct = function () {
			if (typeof parent.construct === 'function') {
				parent.construct.apply(this, arguments);
			}
		};

		// Copy the properties over onto the new prototype.
		copy(properties, proto);

		// Enforce the constructor to be what we expect.
		proto.constructor = child;

		// Keep a reference to the parent prototype.
		// (Note: currently used by decorators and mixins, so that the parent
		// can be inferred).
		child.__base__ = parent;

		// Make this class extendable, this can be overridden by providing a
		// custom extend method on the proto.
		child.extend = child.prototype.extend || Class.extend;


		return child;
	};

	// Utilities
	// ---------

	// ###Proxy
	//
	// Returns a proxy object for accessing base methods with a given context.
	//
	// - `base`: the instance' parent class prototype.
	// - `instance`: a Class class instance.
	//
	// Overloads:
	//
	// - `Class.proxy( instance )`
	// - `Class.proxy( base, instance )`
	//
	Fiber.proxy = function (base, instance) {
		var name,
			iface = {},
			wrap;

		// If there's only 1 argument specified, then it is the instance,
		// thus infer `base` from its constructor.
		if (arguments.length === 1) {
			instance = base;
			base = instance.constructor.__base__;
		}

		// Returns a function which calls another function with `instance` as
		// the context.
		wrap = function (fn) {
			return function () {
				return base[fn].apply(instance, arguments);
			};
		};

		// For each function in `base`, create a wrapped version.
		for (name in base) {
			if (base.hasOwnProperty(name) && typeof base[name] === 'function') {
				iface[name] = wrap(name);
			}
		}
		return iface;
	};

	// ###Decorate
	//
	// Decorate an instance with given decorator(s).
	//
	// - `instance`: a Class class instance.
	// - `decorator[s]`: the argument list of decorator functions.
	//
	// Note: when a decorator is executed, the argument passed in is the super
	// class' prototype, and the context (i.e. the `this` binding) is the
	// instance.
	//
	//  *Example usage:*
	//
	//     function Decorator( base ) {
	//       // this === obj
	//       return {
	//         greet: function() {
	//           console.log('hi!');
	//         }
	//       };
	//     }
	//
	//     var obj = new Bar(); // Some instance of a Class class
	//     Class.decorate(obj, Decorator);
	//     obj.greet(); // hi!
	//
	Fiber.decorate = function (instance /*, decorator[s] */) {
		var i,
		// Get the base prototype.
			base = instance.constructor.__base__,
		// Get all the decorators in the arguments.
			decorators = ArrayProto.slice.call(arguments, 1),
			len = decorators.length;

		for (i = 0; i < len; i++) {
			copy(decorators[i].call(instance, base), instance);
		}
	};

	// ###Mixin
	//
	// Add functionality to a Class definition
	//
	// - `definition`: a Class class definition.
	// - `mixin[s]`: the argument list of mixins.
	//
	// Note: when a mixing is executed, the argument passed in is the super
	// class' prototype (i.e., the base)
	//
	// Overloads:
	//
	// - `Class.mixin( definition, mix_1 )`
	// - `Class.mixin( definition, mix_1, ..., mix_n )`
	//
	// *Example usage:*
	//
	//     var Definition = Class.extend(function(base) {
	//       return {
	//         method1: function(){}
	//       }
	//     });
	//
	//     function Mixin(base) {
	//       return {
	//         method2: function(){}
	//       }
	//     }
	//
	//     Class.mixin(Definition, Mixin);
	//     var obj = new Definition();
	//     obj.method2();
	//
	Fiber.mixin = function (definition /*, mixin[s] */) {
		var i,
		// Get the base prototype.
			base = definition.__base__,
		// Get all the mixins in the arguments.
			mixins = ArrayProto.slice.call(arguments, 1),
			len = mixins.length;

		for (i = 0; i < len; i++) {
			copy(mixins[i](base), definition.prototype);
		}
	};

	return Fiber;
})();

/**
 * DominoCMS
 * www.dominocms.com
 * 1.0.0
 * 2017-04-02 17:21
 */
function addLoadEvent(func) {

	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function () {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}

}

var Deferred = function() {
	var _resolvedCallback = null;
	var _resolvedValue = null;

	var _rejectedCallback = null;
	var _rejectedValue = null;

	this.promise = function() {
		return {
			then: function( resolvedCallback, rejectedCallback ) {
				_resolvedCallback = resolvedCallback;
				_rejectedCallback = rejectedCallback;

				if( _resolvedValue && _resolvedCallback && typeof( _resolvedCallback ) === 'function' )
					_resolvedCallback( _resolvedValue );
				else
				if( _rejectedValue && _rejectedCallback && typeof( _rejectedCallback ) === 'function' )
					_rejectedCallback( _rejectedValue );

			}
		};
	};

	this.resolve = function( val ) {
		if( _resolvedCallback && typeof( _resolvedCallback ) === 'function' ) {
			_resolvedCallback( val );
		} else {
			_resolvedValue = val;
		}
	};

	this.reject = function( val ) {
		if( _rejectedCallback && typeof( _rejectedCallback ) === 'function' ) {
			_rejectedCallback( val );
		} else {
			_rejectedValue = val;
		}
	};

};
var DCDominoSignal = Class.extend( function() {
	return {
		construct: function () {
			this.numCallbacks = 0;
			this.callbacks = [];
			this.oneCallbacks = [];
		},
		destroy: function() {
			this.callbacks = [];
			this.oneCallbacks = [];
		},
		once: function (callback) {
			if (callback && typeof( callback ) === 'function') {
				this.oneCallbacks.push(callback);
			}
		},
		attach: function (callback) {
			if (callback && typeof( callback ) === 'function') {
				this.callbacks.push(callback);
				this.numCallbacks++;
			}
		},
		detach: function (callback) {
			for (var i = 0; i < this.numCallbacks; ++i) {
				if (this.callbacks[i] == callback) {
					this.callbacks.splice(i, 1);
					this.numCallbacks--;
					break;
				}
			}
		},
		trigger: function ( data ) {
			if( !data ) data = {};

			var oneCallbacks = this.oneCallbacks;
			this.oneCallbacks = [];

			for (var i = 0; i < this.callbacks.length; ++i) {
				this.callbacks[i].call( this, data );
			}

			for (var i = 0; i < oneCallbacks.length; i++) {
				oneCallbacks[i].call( this, data );
			}
		}
	}
} );
var componentFactory = {
	postRender: function( context, node ) {

		DominoApp.renderView2(node.element, context.data.view, context.data.componentData );

        if ( DominoAppControllers[context.data.view] ) {

            var newController = new DominoAppControllers[context.data.view]();
            if ( newController['indexAction'] ) {
                newController['indexAction'](node.element, context.data.view, context.data.componentData);
            }
        }

        // not working
        //node.element.removeAttribute("view");
        //node.element.removeAttribute("componentData");

	}
};
var br = function( componentName, componentParams, componentChildren ) {

	if ( componentName === 'component' && componentParams.view ) {

		if ( componentParams.componentData ) {
			// GET AJAX DATA

            var renderController = DominoAppViews.attr( componentParams.view );
			if ( !DominoAppViews.attr( componentParams.view ) )
				console.log( 'View not registered: ' + componentParams.view );

			if ( componentParams.action ) {

				var action = ( componentParams.action != '' ) ? componentParams.action : 'index';

				var deferred = new Deferred();

				DominoApp.ajax({
					view: componentParams.view,
					action: action,
					data: componentParams.componentData
				}).then( function( data ) {

					var retData = {
						tag: 'div',
						component: componentFactory,
						data: componentParams,
						attrs: { view: componentParams.view, componentData: '' },
						children: null
					};

					deferred.resolve( retData );

				}, function( errorResponse ) {
				} );

				return deferred.promise();
			}
			else {

                var renderController = DominoAppViews.attr(componentParams.view);

                if (renderController)
                    var renderResult = renderController(componentParams.componentData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

                renderResult['component'] = componentFactory;
                renderResult['data'] = componentParams;

				if ( !renderResult['attrs'] )
					renderResult['attrs'] = {};
                renderResult['attrs']['view'] = componentParams.view;
				renderResult['attrs']['componentData'] = '';
                return renderResult;

            }
		}
		else
			return { tag: 'div', attrs: { view: componentParams.view } };

	}
};

var DCDominoComponent = Class.extend( function(){
	return {
		construct: function () {
			"use strict";
			this.delegates = [];
			this.events = [];
		},
		onEvent: function (el, eventName, callback, useCapture) {
			if (el) {
				if( Array.isArray( el ) ) {
					for( var ei=0; ei<el.length; ei++ ) {
						var e = el[ei];
						var found = false;
						for ( var i = 0, len = this.events.length; i < len; ++i ) {
							if ( this.events[ i ].e == e && this.events[ i ].en == eventName && this.events[ i ].c == callback ) {
								found = true;
								break;
							}
						}

						if ( !found ) {
							this.events.push( { e: e, en: eventName, c: callback } );
							e.addEventListener( eventName, callback, useCapture ? true : false );
						}
					}
				} else {
					var found = false;
					for ( var i = 0, len = this.events.length; i < len; ++i ) {
						if ( this.events[ i ].e == el && this.events[ i ].en == eventName && this.events[ i ].c == callback ) {
							found = true;
							break;
						}
					}

					if ( !found ) {
						this.events.push( { e: el, en: eventName, c: callback } );
						el.addEventListener( eventName, callback, useCapture ? true : false );
					}
				}
			}
		},
		offEvent: function (el, eventName, callback) {
			if (el) {
				var found = false;
				for (var i = 0, len = this.events.length; i < len; ++i) {
					if (this.events[i] && this.events[i].e == el && this.events[i].en == eventName) {
						el.removeEventListener(eventName, callback ? callback : this.events[i].c);
						this.events.splice(i, 1);
						i--;
					}
				}
			}

		},
		on: function (delegate, callback) {
			var found = false;
			for (var i = 0; i < this.delegates.length; i++) {
				if (this.delegates[i].delegate === delegate && this.delegates[i].callback === callback) {
					found = true;
					break;
				}
			}

			if (!found) {
				delegate.attach(callback);
				this.delegates.push({delegate: delegate, callback: callback});
			}
		},
		off: function (delegate, callback) {
			for (var i = 0; i < this.delegates.length; i++) {
				if (this.delegates[i].delegate === delegate && this.delegates[i].callback === callback) {
					this.delegates.splice(i, 1);
					delegate.detach(callback);
					break;
				}
			}
		},
		destroy: function () {
			// DETACH ALL THE DELEGATE LISTENERS
			if (this.delegates) {
				for (var i = 0; i < this.delegates.length; i++) {
					this.delegates[i].delegate.detach(this.delegates[i].callback);
				}
				this.delegates = [];
			}

			// DETACH ALL THE EVENT LISTENERS
			var registeredEvents = this.events;
			for (var i = 0, len = registeredEvents.length; i < len; ++i) {
				var registeredEvent = registeredEvents[i];
				registeredEvent.e.removeEventListener(registeredEvent.en, registeredEvent.c);
			}
			this.events = [];
		},
		rewireEvents: function(oldEl, newEl) {
			"use strict";
			if(oldEl != newEl) {
				for (var i = 0; i < this.events.length; i++) {
					var event = this.events[i];
					if (event.e == oldEl) {
						event.e = newEl;
						oldEl.removeEventListener(event.en, event.c);
						newEl.addEventListener(event.en, event.c);
					}
				}
			}
		}
	}
} );
/**
 * Created by pc on 24.7.2015.
 */
// IE8 [].map polyfill Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
	Array.prototype.map = function (callback, thisArg) {
		var a, k;
		// ReSharper disable once ConditionIsAlwaysConst
		if (_debug && this == null) {
			throw new TypeError("this==null");
		}
		var o = Object(this);
		var len = o.length >>> 0;
		if (_debug && typeof callback != "function") {
			throw new TypeError(callback + " isn't func");
		}
		a = new Array(len);
		k = 0;
		while (k < len) {
			var kValue, mappedValue;
			if (k in o) {
				kValue = o[k];
				mappedValue = callback.call(thisArg, kValue, k, o);
				a[k] = mappedValue;
			}
			k++;
		}
		return a;
	};
}
// Object create polyfill
if (!Object.create) {
	Object.create = function (o) {
		function f() { }
		f.prototype = o;
		return new f();
	};
}
// Object keys polyfill
if (!Object.keys) {
	Object.keys = (function (obj) {
		var keys = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				keys.push(i);
			}
		}
		return keys;
	});
}
if (!Object.prototype.attr) {
	Object.prototype.attr = function( namespace, value ) {
		"use strict";
		if( value !== undefined ) { // SETTER
			var arrPath = namespace.split( "." );
			var key = arrPath[0];
			var baseObj = this;

			for( var i=0; i<arrPath.length-1; i++ ) {
				key = arrPath[i];
				if ( !baseObj[ key ] )
					baseObj[ key ] = {};
				baseObj = baseObj[ key ];
			}

			baseObj[ key ] = value;
		} else { // GETTER
			var arrPath = namespace.split( "." );
			var baseObj = this;

			for( var i=0; i<arrPath.length; i++ ) {
				if( baseObj[arrPath[i]] !== undefined && baseObj[arrPath[i]] !== null )
					baseObj = baseObj[arrPath[i]];
				else {
					//console.warn( 'Object.attr:', 'unable to fetch object: ', namespace + '!', 'Object doesn\'t exist!' );
					return null;
				}
			}

			if( typeof(baseObj) === 'number' )
				return '' + baseObj;

			return baseObj;
		}
	};
}
// Array isArray polyfill
//if (!Array.isArray) {
	var objectToString = {}.toString;
	Array.isArray = (function (a) {
		var type = objectToString.call(a);
		switch( type ) {
			case "[object Array]":
			case "[object NodeList]":
				return true;
			break;
			default:
				return false;
			break;

		}
	});
//}

var DCRouteHandlerComponent = DCDominoComponent.extend( function( _super ) {
	return {
		construct: function (_baseURL) {
			this.baseURL = _baseURL;
			this.defaultControllerName = this.controllerName = 'default';
			this.defaultControllerAction = this.controllerAction = 'index';
			this.activeController = null;
		},
		init: function () {
			// HANDLE INITIALIZATION DATA
			if (DominoApp['initVars']) {

			}
		},
		handleRoute: function (path) {
			// SPLIT THE PATH
			var splitPath = path.split('/');
			// SPLIT THE EXISTING PARAMETERS
			var urlparams = window.location.search.replace(/\?/g, '');
			var fullpath = urlparams ? path + '/' + urlparams : path;
			var splitParams = urlparams.split('&');
			var params = {};

			DominoAppOptions.path = fullpath;
			// BUILD THE PARAMETER OBJECT
			for (var p = 0; p < splitParams.length; p++) {
				var split = splitParams[p].split('=');
				if (split[0]) // can do nicer
					params[split[0]] = split[1];
			}

			this.controllerName = this.defaultControllerName;
			this.controllerAction = this.defaultControllerAction;
			var controllerName = this.defaultControllerName + 'Controller';
			var actionName = this.defaultControllerAction + 'Action';

			var slugType = 'userFriendly'; // controllerAction
			if (slugType == 'controllerAction') {
				// CHECK FOR CONTROLLER / ACTION
				if (splitPath[0]) {
					this.controllerName = splitPath[0];
					controllerName = splitPath[0] + 'Controller';
					splitPath.splice(0, 1);
				}

				if (splitPath[0]) {
					this.controllerAction = splitPath[0];
					actionName = splitPath[0] + 'Action';
					splitPath.splice(0, 1);
				}
			}
			else {
				controllerName = 'indexController';
				actionName = 'indexAction';
			}

			if (DominoAppControllers[controllerName]) {
				DominoAppViewStack = [];
				var newController = new DominoAppControllers[controllerName]();

				if (newController[actionName]) {

					if (newController.beforeAction(actionName)) {
						if (this.activeController)
							this.activeController.destroy();

						this.activeController = newController;
						// controller se kliče sedaj path in params zraven
var dataCont = [];
						dataCont['path'] = path;
						dataCont['params'] = params;
						newController[actionName].call(newController, dataCont);

						newController.afterAction(actionName);
					}
				} else { // HANDLE 404
					if (this.activeController)
						this.activeController.destroy();

					newController.destroy();

					newController = new DominoAppControllers['indexController']();
					this.activeController = newController;

					newController['404Action']({
						title: 'Not found',
						message: 'Requested action "' + actionName + '" cannot be found for "' + controllerName + '" Controller.'
					});
				}
			} else { // HANDLE 404
				DominoAppViewStack = [];

				if (this.activeController)
					this.activeController.destroy();

				newController = new DominoAppControllers['indexController']();
				this.activeController = newController;

				newController['404Action']({
					title: 'Not found',
					message: 'Requested controller "' + controllerName + '" cannot be found.'
				});
			}
		}
	}
} );
var DominoViews = {
	registerView: function( namespace, viewImplementation ) {
		"use strict";

		var arrPath = namespace.split( "." );
		var baseObj = DominoAppViews;
		for( var i=0; i<arrPath.length; i++ ) {
			if( i < arrPath.length - 1 ) {
				if ( !baseObj[ arrPath[ i ] ] )
					baseObj[ arrPath[ i ] ] = {};
			} else { // last item
				baseObj[ arrPath[ i ] ] = viewImplementation;
			}

			baseObj = baseObj[ arrPath[i] ];
		}
	},
	returnView: function( namespace, params ) {
		"use strict";
		var arrPath = namespace.split( "." );
		var baseObj = DominoAppViews;

		for( var i=0; i<arrPath.length; i++ ) {
			if( !baseObj[ arrPath[ i ] ] ) {
				console.warn( '!DominoViews.renderView: View missing:', namespace );
				return [];
			}

			if( i == arrPath.length - 1 ) {
				return baseObj[ arrPath[ i ] ]( params );
			}

			baseObj = baseObj[ arrPath[i] ];
		}
	}
};
var DCUtil = {
	getParentAnchor: function( node ) {
		var cnode = node;
		while( cnode ) {
			if( cnode && cnode.parentNode && cnode.tagName === 'A' ) {
				return cnode;
			}

			cnode = cnode.parentNode;
		}
	},
	networkReadyStateChange: function( request, deferred ) {
		"use strict";
		if( request.readyState === 2 && request.status !== 200 ) {
			deferred.reject( request );
		} else
		if( request.readyState === 4 ) {
			if( request.status === 200 ) {
				deferred.resolve( request.response );
			} else
			if( request.status === 403 ) {
				switch( request.response.code ) {
					case 'NOT_LOGGED_IN':
						console.log( 'Login required' );
						DominoApp.redirect( [ 'user', 'login' ] );
						break;
					case 'NOT_ALLOWED':
						console.log( 'No permissions' );
						break;
				}
			} else {
				deferred.reject( request );
			}
		}
	},
	translate: function( data ) {
		"use strict";

		//console.log(data);

		var div = document.createElement('DIV');
		div.innerHTML = data;

		var ret = [];
		ret.push(div);
		return div;
	},
	displayHtml: function( data ) {
		"use strict";

		var htmlObject = document.createElement('div');
		htmlObject.innerHTML = data;

		return DCUtil.child(htmlObject.childNodes);

	},
	child: function( children ) {
		"use strict";

		var newObj = [];

		for ( var i = 0; i < children.length; i++ ) {
			var obj = children[i];
			if ( obj.nodeName == '#text' )
				newObj.push(obj.nodeValue)
			else
				newObj.push(
					{
						tag: obj.nodeName,
						attrs: DCUtil.attributes(obj.attributes),
						children: DCUtil.child(obj.childNodes)
					}
				);

		}
		return newObj;
	},
	attributes: function( attrs ) {
		"use strict";

		var newObj = [];

		for ( var i = 0; i < attrs.length; i++ ) {
			var obj = attrs[i];

			newObj[obj.nodeName] = obj.nodeValue;

			/*newObj.push({
				tag: obj.nodeName,
				attrs: obj.nodeValue,
				className if exists
			});*/


		}
		//console.log(newObj);
		return newObj;
	},
    fadeIn: function( el, speed, easing ) {
        "use strict";

        if ( typeof el  !== 'undefined' && el != null ) {

            speed = speed ? speed : 200;
        	var easing = easing ? easing : 'Ease-In-Out';

            el.style.webkitAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.MozAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.msAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.OAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.animation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.display = 'block';
			//el.style.display = null;
            //if ( el.style.display == 'none' )
              //  el.style.display = '';

            //el.style.transition="opacity 1s";
            //el.style.opacity="1";

            /*var tick = function () {
                el.style.opacity = +el.style.opacity + 0.01;

                if (+el.style.opacity < 1)
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                else
                    return true;
            };

            tick();*/
        }
    },
    fadeOut: function( el, speed, easing ) {
        "use strict";
        if ( typeof el !== 'undefined' && el != null ) {

        	speed = speed ? speed : 200;
            easing = easing ? easing : 'Ease-In-Out';
            el.style.webkitAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.MozAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.msAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.OAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.animation = 'fadeOutToNone ' + speed + 'ms ' + easing;

            setTimeout(function(){
                el.style.display = 'none';
			}, (speed-40));


            //el.style.transition="opacity 1s";
           // el.style.opacity="0";
            //el.style.display= 'none';

            /*el.style.opacity = 1;

            var tick = function() {
                el.style.opacity = +el.style.opacity - 0.01;

                if (+el.style.opacity > 0)
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                else
                    return true;
            };

            tick();*/
        }

    }
};
/**
 * DominoCMS
 * www.dominocms.com
 * 0.9.9
 * 2017-04-02 17:21
 */

var DominoApp = null;
var DominoAppControllers = {};
var DominoAppViews = {};
var DominoAppComponents = {};
var DominoAppOptions = {
    path: null,
    activeTemplate: [],
    site: null,
    params: null,
    modules: {}
};
var DominoAppViewStack = [];

function ScrollTo( name ) {

    var theAnchor = document.getElementsByName(name);

    if ( typeof theAnchor[0] !== 'undefined' )
        ScrollToResolver( theAnchor[0] );
}

function ScrollToResolver(elem) {
    var jump = parseInt(elem.getBoundingClientRect().top * .2);
    document.body.scrollTop += jump;
    document.documentElement.scrollTop += jump;
    if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
        elem.lastjump = Math.abs(jump);
        setTimeout(function() { ScrollToResolver(elem);}, "20");
    } else {
        elem.lastjump = null;
    }
}

function scrollToValue(to, duration) {
    var start = document.documentElement.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

        userHasScrolled = false;
        window.onscroll = function (e)
        {
            userHasScrolled = true;
        }


    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        window.scrollTo ( 0, val );
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    if ( userHasScrolled )
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
var DominoAppBase = (function() {
    var DominoAppObject = null;
    var router = null;
    var routeHandler = null;
    var baseURL = '';

    var redrawCounter = 0;

    var handleRoute = function ( path ) {

        if ( routeHandler )
            routeHandler.handleRoute( path );
        else
            throw 'Route handler not registered. Register a handler';
    };

    var renderView = function () {
        if ( DominoAppObject )
            DominoAppObject.onBeforeRender.trigger();

        return mainView( DominoAppViewStack );
    };

    var onAfterRender = function () {
        DominoAppObject.onAfterRender.trigger();
    };

    var firstRenderFinished = function () {
        DominoAppObject.onBeforeFirstRender.trigger();
        // INITIALIZE ROUTE HANDLER COMPONENT
        if ( routeHandler.init )
            routeHandler.init();

        // INITIALIZE ROUTER
        router = Router( {
            '(.*)': handleRoute
        } );
        router.configure( {
            convert_hash_in_init: false,
            html5history: true,
            run_handler_in_init: false
        } ).init();

        // INITIALIZE GLOBAL ANCHOR CLICK HANDLER
        window.addEventListener( 'click', function ( ev ) {
            var anchor = null;
            if ( !ev.defaultPrevented && (anchor = DCUtil.getParentAnchor( ev.target )) && anchor.hasAttribute('href') && anchor.getAttribute( 'target' ) !== '_blank' && anchor.getAttribute('href').indexOf('blob:') == -1 && anchor.getAttribute('href').indexOf('data:') == -1 ) {

                var href = anchor.getAttribute( 'href' );

                var isEmailRegX = href.match(/mailto:/);
                var isTelRegX = href.match(/tel:/);
                var isHttpX = href.match(/http:/);
                var isHttpsX = href.match(/https:/);
                var ishashX = href.match(/#/);

                if ( isEmailRegX || isTelRegX || isHttpX || isHttpsX) {

                }
                else if ( ishashX ) {
                    ev.preventDefault();
                    var theHash = href.split('#');

                    if ( typeof theHash[1] !== 'undefined' && theHash[1] !== '' )
                        ScrollTo(theHash[1]);

                }
                else {
                    ev.preventDefault();
                    if( href != '#' && href != '/#' && href != ( '/' + DominoAppOptions.path || DominoAppOptions.path )  )
                        router.setRoute( anchor.getAttribute( 'href' ) );

                    window.scrollTo(0, 0);
                    //scrollToValue( 0, 1250 );
                }

            }
        } );

        DominoAppObject.onAfterFirstRender.trigger();
    };

    return Class.extend( function () {
        return {
            construct: function ( _baseURL ) {
                DominoAppObject = this;
                baseURL = _baseURL;
                this.routeHandler = routeHandler = new DCRouteHandlerComponent( baseURL );

                this.onBeforeFirstRender = new DCDominoSignal();
                this.onAfterFirstRender = new DCDominoSignal();
                this.onBeforeRender = new DCDominoSignal();
                this.onAfterRender = new DCDominoSignal();

                // REGISTER FIRST RENDER FINISHED
                this.onAfterRender.once( firstRenderFinished );

                // INITIALIZE ALL THE DATA FIELDS
                this.activeLocale = 'sl-SI';
                this.data = {};
                this.cache = {};

                // INIT VARIABLES
                this.initVars = window['DominoAppInitVars'] ? JSON.parse( window['DominoAppInitVars'] ) : {};

                // REGISTER BOBRIL
                b.init( renderView, document.body );
                // ATTACH AFTER FRAME EVENT
                b.setAfterFrame( onAfterRender );

            },
            renderView: function( el, viewName, renderData ) {
                "use strict";


                //if (typeof( renderController ) === 'string')
                var renderController = DominoAppViews.attr(viewName);
                //console.log(viewName);
                if (renderController)
                    var renderResult = renderController(renderData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

                el.innerHTML = "";
                b.updateChildren(el, renderResult);

                if ( DominoAppControllers[viewName] ) {
                    var newController = new DominoAppControllers[viewName]();
                    if ( newController['indexAction'] ) {
                        newController['indexAction'](el, viewName, renderData);
                    }
                }

                //return renderResult;

            },
            renderView2: function( el, viewName, renderData ) {
                "use strict";


                var renderController = DominoAppViews.attr(viewName);

                if (renderController)
                    var renderResult = renderController(renderData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

                renderResult['component'] = componentFactory;
                renderResult['data'] = {
                    'view': viewName,
                    'componentData': renderData
                };

                //b.updateChildren(el, renderResult);


            },
            renderViewInline: function( el, viewName, renderData ) {
                "use strict";

                var renderController = DominoAppViews.attr(viewName);

                if (renderController)
                    var renderResult = renderController(renderData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

               b.updateChildren(el, renderResult);

                if ( DominoAppControllers[viewName] ) {

                    var newController = new DominoAppControllers[viewName]();

                    if ( newController['indexAction'] ) {
                        newController['indexAction'](el, viewName, renderData);


                    }
                }

            },
            redirect: function ( route, params ) {
                if ( Array.isArray( route ) )
                    route = '/' + route.join( '/' );

                if ( params ) {
                    route += '?' + Network.serialize( params );
                }
                // REDIRECT
                router.setRoute( route );
            },
            utils: {
                title: function (t) {
                    "use strict";

                    var title = document.getElementsByTagName('TITLE');
                    if ( !title ) {
                        var head = document.getElementsByTagName('HEAD')[0],
                            tl = document.createElement("title");
                        tl.appendChild(document.createTextNode(t));
                        head.appendChild(tl);
                    }
                    else
                        document.title = t; //title.text( t );

                },
                description: function( d ) {
                    var description = document.querySelector('meta[name="description"]');
                    if ( !description ) {
                        var head = document.getElementsByTagName('HEAD')[0],
                            meta = document.createElement("meta");
                        meta.setAttribute('name','description');
                        meta.setAttribute('content',d);
                        head.appendChild(meta);
                    }
                    else
                        description.setAttribute( 'content', d );
                },
                keywords: function( k ) {
                    var keywords = document.querySelector('meta[name="keywords"]'),
                        kw = k ? k : '';

                    if( !keywords ) {
                        var head = document.getElementsByTagName('HEAD')[0],
                            meta = document.createElement("meta");
                        meta.setAttribute('name','keywords');
                        meta.setAttribute('content',kw);
                        head.appendChild(meta);
                    }
                    else
                        keywords.setAttribute( 'content', kw );
                }
            },
            ajax: function ( data ) {
                "use strict";
                var deferred = new Deferred();

                var headers = {};
                var url = '/domino/';
                var ajaxData = {
                    'type': 'ajax',
                    'view': data.view,
                    'action': data.action,
                    'site': ( data.site ) ? data.site : DominoAppOptions.site,
                    'params': ( data.params ) ? data.params : DominoAppOptions.params,
                    'identity': ( data.identity ) ? data.identity : DominoAppOptions.identity,
                    'data': data.data
                };

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    DCUtil.networkReadyStateChange( request, deferred );
                };
                request.open( 'POST', url, true );
                for( var key in headers )
                    if( headers.hasOwnProperty( key ) )
                        request.setRequestHeader( key, headers[ key ] );

                request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
                if ( data.contentType )
                    request.setRequestHeader( 'Content-Type', data.contentType );
                else
                    request.setRequestHeader( 'Content-Type', 'application/json' );

                request.responseType = 'json';
                request.send( JSON.stringify( ajaxData ) );

                return deferred.promise();
            },
            getAjax: function( url, headers, data ) {
                var deferred = new Deferred();

                headers = headers || {};
                data = data || {};

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    DCUtil.networkReadyStateChange( request, deferred );
                };
                request.open( 'GET', url, true );
                for( var key in headers )
                    if( headers.hasOwnProperty( key ) )
                        request.setRequestHeader( key, headers[ key ] );

                request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );

                request.responseType = 'json';
                request.send( JSON.stringify( data ) );

                return deferred.promise();
            }

        }
    } );
})();

addLoadEvent( function() {
    DominoApp = window['dominoapp'] = new DominoAppBase( '/' );
} );

var DCDominoController = DCDominoComponent.extend( function( _super ) {
	return {
		// BASE
		construct: function () {
			_super.construct.call(this);

		},
		destroy: function () {
			_super.destroy.call(this);
		},

		// CONTROLLER SPECIFIC
		beforeAction: function (actionName) {
			var controllerName = DominoApp.routeHandler.controllerName;

			return true;
		},
		afterAction: function (actionName) {
			return true;
		}
	}
} );

var DominoControllers = {
	registerController: function( namespace, controllerImplementation ) {
		"use strict";

		var arrPath = namespace.split( "***" );
		var baseObj = DominoAppControllers;
		for( var i=0; i<arrPath.length; i++ ) {
			if( i < arrPath.length - 1 ) {
				if ( !baseObj[ arrPath[ i ] ] )
					baseObj[ arrPath[ i ] ] = {};
			} else { // last item
				baseObj[ arrPath[ i ] ] = controllerImplementation;
			}

			baseObj = baseObj[ arrPath[i] ];
		}
	}
};


//
// Generated on Tue Dec 16 2014 12:13:47 GMT+0100 (CET) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
// Version 1.2.6
//

	/*
	 * browser.js: Browser specific functionality for director.
	 *
	 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
	 * MIT LICENSE
	 *
	 */

	var dloc = document.location;

	function dlocHashEmpty() {
		// Non-IE browsers return '' when the address bar shows '#'; Director's logic
		// assumes both mean empty.
		return dloc.hash === '' || dloc.hash === '#';
	}

	var listener = {
		mode: 'modern',
		hash: dloc.hash,
		history: false,

		check: function () {
			var h = dloc.hash;
			if (h != this.hash) {
				this.hash = h;
				this.onHashChanged();
			}
		},

		fire: function () {
			if (this.mode === 'modern') {
				this.history === true ? window.onpopstate() : window.onhashchange();
			}
			else {
				this.onHashChanged();
			}
		},

		init: function (fn, history) {
			var self = this;
			this.history = history;

			if (!Router.listeners) {
				Router.listeners = [];
			}

			function onchange(onChangeEvent) {
				for (var i = 0, l = Router.listeners.length; i < l; i++) {
					Router.listeners[i](onChangeEvent);
				}
			}

			//note IE8 is being counted as 'modern' because it has the hashchange event
			if ('onhashchange' in window && (document.documentMode === undefined
				|| document.documentMode > 7)) {
				// At least for now HTML5 history is available for 'modern' browsers only
				if (this.history === true) {
					// There is an old bug in Chrome that causes onpopstate to fire even
					// upon initial page load. Since the handler is run manually in init(),
					// this would cause Chrome to run it twise. Currently the only
					// workaround seems to be to set the handler after the initial page load
					// http://code.google.com/p/chromium/issues/detail?id=63040
					//setTimeout(function() {
						window.onpopstate = onchange;
					//}, 500);
				}
				else {
					window.onhashchange = onchange;
				}
				this.mode = 'modern';
			}
			else {
				//
				// IE support, based on a concept by Erik Arvidson ...
				//
				var frame = document.createElement('iframe');
				frame.id = 'state-frame';
				frame.style.display = 'none';
				document.body.appendChild(frame);
				this.writeFrame('');

				if ('onpropertychange' in document && 'attachEvent' in document) {
					document.attachEvent('onpropertychange', function () {
						if (event.propertyName === 'location') {
							self.check();
						}
					});
				}

				window.setInterval(function () { self.check(); }, 50);

				this.onHashChanged = onchange;
				this.mode = 'legacy';
			}

			Router.listeners.push(fn);

			return this.mode;
		},

		destroy: function (fn) {
			if (!Router || !Router.listeners) {
				return;
			}

			var listeners = Router.listeners;

			for (var i = listeners.length - 1; i >= 0; i--) {
				if (listeners[i] === fn) {
					listeners.splice(i, 1);
				}
			}
		},

		setHash: function (s) {
			// Mozilla always adds an entry to the history
			if (this.mode === 'legacy') {
				this.writeFrame(s);
			}

			if (this.history === true) {
				window.history.pushState({}, document.title, s);
				// Fire an onpopstate event manually since pushing does not obviously
				// trigger the pop event.
				this.fire();
			} else {
				dloc.hash = (s[0] === '/') ? s : '/' + s;
			}
			return this;
		},

		writeFrame: function (s) {
			// IE support...
			var f = document.getElementById('state-frame');
			var d = f.contentDocument || f.contentWindow.document;
			d.open();
			d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
			d.close();
		},

		syncHash: function () {
			// IE support...
			var s = this._hash;
			if (s != dloc.hash) {
				dloc.hash = s;
			}
			return this;
		},

		onHashChanged: function () {}
	};

	var Router = function (routes) {
		if (!(this instanceof Router)) return new Router(routes);

		this.params   = {};
		this.routes   = {};
		this.methods  = ['on', 'once', 'after', 'before'];
		this.scope    = [];
		this._methods = {};

		this._insert = this.insert;
		this.insert = this.insertEx;

		this.historySupport = (window.history != null ? window.history.pushState : null) != null

		this.configure();
		this.mount(routes || {});
	};

	Router.prototype.init = function (r) {
		var self = this
			, routeTo;
		this.handler = function(onChangeEvent) {
			var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
			var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
			self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
		};

		listener.init(this.handler, this.history);

		if (this.history === false) {
			if (dlocHashEmpty() && r) {
				dloc.hash = r;
			} else if (!dlocHashEmpty()) {
				self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
			}
		}
		else {
			if (this.convert_hash_in_init) {
				// Use hash as route
				routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
				if (routeTo) {
					window.history.replaceState({}, document.title, routeTo);
				}
			}
			else {
				// Use canonical url
				routeTo = this.getPath();
			}

			// Router has been initialized, but due to the chrome bug it will not
			// yet actually route HTML5 history state changes. Thus, decide if should route.
			if (routeTo || this.run_in_init === true) {
				this.handler();
			}
		}

		return this;
	};

	Router.prototype.explode = function () {
		var v = this.history === true ? this.getPath() : dloc.hash;
		if (v.charAt(1) === '/') { v=v.slice(1) }
		return v.slice(1, v.length).split("/");
	};

	Router.prototype.setRoute = function (i, v, val) {
		var url = this.explode();

		if (typeof i === 'number' && typeof v === 'string') {
			url[i] = v;
		}
		else if (typeof val === 'string') {
			url.splice(i, v, s);
		}
		else {
			url = [i];
		}

		listener.setHash(url.join('/'));
		return url;
	};

//
// ### function insertEx(method, path, route, parent)
// #### @method {string} Method to insert the specific `route`.
// #### @path {Array} Parsed path to insert the `route` at.
// #### @route {Array|function} Route handlers to insert.
// #### @parent {Object} **Optional** Parent "routes" to insert into.
// insert a callback that will only occur once per the matched route.
//
	Router.prototype.insertEx = function(method, path, route, parent) {
		if (method === "once") {
			method = "on";
			route = function(route) {
				var once = false;
				return function() {
					if (once) return;
					once = true;
					return route.apply(this, arguments);
				};
			}(route);
		}
		return this._insert(method, path, route, parent);
	};

	Router.prototype.getRoute = function (v) {
		var ret = v;

		if (typeof v === "number") {
			ret = this.explode()[v];
		}
		else if (typeof v === "string"){
			var h = this.explode();
			ret = h.indexOf(v);
		}
		else {
			ret = this.explode();
		}

		return ret;
	};

	Router.prototype.destroy = function () {
		listener.destroy(this.handler);
		return this;
	};

	Router.prototype.getPath = function () {
		var path = window.location.pathname;
		if (path.substr(0, 1) !== '/') {
			path = '/' + path;
		}
		return path;
	};
	function _every(arr, iterator) {
		for (var i = 0; i < arr.length; i += 1) {
			if (iterator(arr[i], i, arr) === false) {
				return;
			}
		}
	}

	function _flatten(arr) {
		var flat = [];
		for (var i = 0, n = arr.length; i < n; i++) {
			flat = flat.concat(arr[i]);
		}
		return flat;
	}

	function _asyncEverySeries(arr, iterator, callback) {
		if (!arr.length) {
			return callback();
		}
		var completed = 0;
		(function iterate() {
			iterator(arr[completed], function(err) {
				if (err || err === false) {
					callback(err);
					callback = function() {};
				} else {
					completed += 1;
					if (completed === arr.length) {
						callback();
					} else {
						iterate();
					}
				}
			});
		})();
	}

	function paramifyString(str, params, mod) {
		mod = str;
		for (var param in params) {
			if (params.hasOwnProperty(param)) {
				mod = params[param](str);
				if (mod !== str) {
					break;
				}
			}
		}
		return mod === str ? "([._a-zA-Z0-9-%()]+)" : mod;
	}

	function regifyString(str, params) {
		var matches, last = 0, out = "";
		while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
			last = matches.index + matches[0].length;
			matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
			out += str.substr(0, matches.index) + matches[0];
		}
		str = out += str.substr(last);
		var captures = str.match(/:([^\/]+)/ig), capture, length;
		if (captures) {
			length = captures.length;
			for (var i = 0; i < length; i++) {
				capture = captures[i];
				if (capture.slice(0, 2) === "::") {
					str = capture.slice(1);
				} else {
					str = str.replace(capture, paramifyString(capture, params));
				}
			}
		}
		return str;
	}

	function terminator(routes, delimiter, start, stop) {
		var last = 0, left = 0, right = 0, start = (start || "(").toString(), stop = (stop || ")").toString(), i;
		for (i = 0; i < routes.length; i++) {
			var chunk = routes[i];
			if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && !~chunk.indexOf(stop, last) || !~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
				left = chunk.indexOf(start, last);
				right = chunk.indexOf(stop, last);
				if (~left && !~right || !~left && ~right) {
					var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
					routes = [ tmp ].concat(routes.slice((i || 1) + 1));
				}
				last = (right > left ? right : left) + 1;
				i = 0;
			} else {
				last = 0;
			}
		}
		return routes;
	}

	var QUERY_SEPARATOR = /\?.*/;

	Router.prototype.configure = function(options) {
		options = options || {};
		for (var i = 0; i < this.methods.length; i++) {
			this._methods[this.methods[i]] = true;
		}
		this.recurse = options.recurse || this.recurse || false;
		this.async = options.async || false;
		this.delimiter = options.delimiter || "/";
		this.strict = typeof options.strict === "undefined" ? true : options.strict;
		this.notfound = options.notfound;
		this.resource = options.resource;
		this.history = options.html5history && this.historySupport || false;
		this.run_in_init = this.history === true && options.run_handler_in_init !== false;
		this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
		this.every = {
			after: options.after || null,
			before: options.before || null,
			on: options.on || null
		};
		return this;
	};

	Router.prototype.param = function(token, matcher) {
		if (token[0] !== ":") {
			token = ":" + token;
		}
		var compiled = new RegExp(token, "g");
		this.params[token] = function(str) {
			return str.replace(compiled, matcher.source || matcher);
		};
		return this;
	};

	Router.prototype.on = Router.prototype.route = function(method, path, route) {
		var self = this;
		if (!route && typeof path == "function") {
			route = path;
			path = method;
			method = "on";
		}
		if (Array.isArray(path)) {
			return path.forEach(function(p) {
				self.on(method, p, route);
			});
		}
		if (path.source) {
			path = path.source.replace(/\\\//ig, "/");
		}
		if (Array.isArray(method)) {
			return method.forEach(function(m) {
				self.on(m.toLowerCase(), path, route);
			});
		}
		path = path.split(new RegExp(this.delimiter));
		path = terminator(path, this.delimiter);
		this.insert(method, this.scope.concat(path), route);
	};

	Router.prototype.path = function(path, routesFn) {
		var self = this, length = this.scope.length;
		if (path.source) {
			path = path.source.replace(/\\\//ig, "/");
		}
		path = path.split(new RegExp(this.delimiter));
		path = terminator(path, this.delimiter);
		this.scope = this.scope.concat(path);
		routesFn.call(this, this);
		this.scope.splice(length, path.length);
	};

	Router.prototype.dispatch = function(method, path, callback) {
		var self = this, fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""), invoked = this._invoked, after;
		this._invoked = true;
		if (!fns || fns.length === 0) {
			this.last = [];
			if (typeof this.notfound === "function") {
				this.invoke([ this.notfound ], {
					method: method,
					path: path
				}, callback);
			}
			return false;
		}
		if (this.recurse === "forward") {
			fns = fns.reverse();
		}
		function updateAndInvoke() {
			self.last = fns.after;
			self.invoke(self.runlist(fns), self, callback);
		}
		after = this.every && this.every.after ? [ this.every.after ].concat(this.last) : [ this.last ];
		if (after && after.length > 0 && invoked) {
			if (this.async) {
				this.invoke(after, this, updateAndInvoke);
			} else {
				this.invoke(after, this);
				updateAndInvoke();
			}
			return true;
		}
		updateAndInvoke();
		return true;
	};

	Router.prototype.invoke = function(fns, thisArg, callback) {
		var self = this;
		var apply;
		if (this.async) {
			apply = function(fn, next) {
				if (Array.isArray(fn)) {
					return _asyncEverySeries(fn, apply, next);
				} else if (typeof fn == "function") {
					fn.apply(thisArg, (fns.captures || []).concat(next));
				}
			};
			_asyncEverySeries(fns, apply, function() {
				if (callback) {
					callback.apply(thisArg, arguments);
				}
			});
		} else {
			apply = function(fn) {
				if (Array.isArray(fn)) {
					return _every(fn, apply);
				} else if (typeof fn === "function") {
					return fn.apply(thisArg, fns.captures || []);
				} else if (typeof fn === "string" && self.resource) {
					self.resource[fn].apply(thisArg, fns.captures || []);
				}
			};
			_every(fns, apply);
		}
	};

	Router.prototype.traverse = function(method, path, routes, regexp, filter) {
		var fns = [], current, exact, match, next, that;
		function filterRoutes(routes) {
			if (!filter) {
				return routes;
			}
			function deepCopy(source) {
				var result = [];
				for (var i = 0; i < source.length; i++) {
					result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
				}
				return result;
			}
			function applyFilter(fns) {
				for (var i = fns.length - 1; i >= 0; i--) {
					if (Array.isArray(fns[i])) {
						applyFilter(fns[i]);
						if (fns[i].length === 0) {
							fns.splice(i, 1);
						}
					} else {
						if (!filter(fns[i])) {
							fns.splice(i, 1);
						}
					}
				}
			}
			var newRoutes = deepCopy(routes);
			newRoutes.matched = routes.matched;
			newRoutes.captures = routes.captures;
			newRoutes.after = routes.after.filter(filter);
			applyFilter(newRoutes);
			return newRoutes;
		}
		if (path === this.delimiter && routes[method]) {
			next = [ [ routes.before, routes[method] ].filter(Boolean) ];
			next.after = [ routes.after ].filter(Boolean);
			next.matched = true;
			next.captures = [];
			return filterRoutes(next);
		}
		for (var r in routes) {
			if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && typeof routes[r] === "object" && !Array.isArray(routes[r]))) {
				current = exact = regexp + this.delimiter + r;
				if (!this.strict) {
					exact += "[" + this.delimiter + "]?";
				}
				match = path.match(new RegExp("^" + exact));
				if (!match) {
					continue;
				}
				if (match[0] && match[0] == path && routes[r][method]) {
					next = [ [ routes[r].before, routes[r][method] ].filter(Boolean) ];
					next.after = [ routes[r].after ].filter(Boolean);
					next.matched = true;
					next.captures = match.slice(1);
					if (this.recurse && routes === this.routes) {
						next.push([ routes.before, routes.on ].filter(Boolean));
						next.after = next.after.concat([ routes.after ].filter(Boolean));
					}
					return filterRoutes(next);
				}
				next = this.traverse(method, path, routes[r], current);
				if (next.matched) {
					if (next.length > 0) {
						fns = fns.concat(next);
					}
					if (this.recurse) {
						fns.push([ routes[r].before, routes[r].on ].filter(Boolean));
						next.after = next.after.concat([ routes[r].after ].filter(Boolean));
						if (routes === this.routes) {
							fns.push([ routes["before"], routes["on"] ].filter(Boolean));
							next.after = next.after.concat([ routes["after"] ].filter(Boolean));
						}
					}
					fns.matched = true;
					fns.captures = next.captures;
					fns.after = next.after;
					return filterRoutes(fns);
				}
			}
		}
		return false;
	};

	Router.prototype.insert = function(method, path, route, parent) {
		var methodType, parentType, isArray, nested, part;
		path = path.filter(function(p) {
			return p && p.length > 0;
		});
		parent = parent || this.routes;
		part = path.shift();
		if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
			part = regifyString(part, this.params);
		}
		if (path.length > 0) {
			parent[part] = parent[part] || {};
			return this.insert(method, path, route, parent[part]);
		}
		if (!part && !path.length && parent === this.routes) {
			methodType = typeof parent[method];
			switch (methodType) {
				case "function":
					parent[method] = [ parent[method], route ];
					return;
				case "object":
					parent[method].push(route);
					return;
				case "undefined":
					parent[method] = route;
					return;
			}
			return;
		}
		parentType = typeof parent[part];
		isArray = Array.isArray(parent[part]);
		if (parent[part] && !isArray && parentType == "object") {
			methodType = typeof parent[part][method];
			switch (methodType) {
				case "function":
					parent[part][method] = [ parent[part][method], route ];
					return;
				case "object":
					parent[part][method].push(route);
					return;
				case "undefined":
					parent[part][method] = route;
					return;
			}
		} else if (parentType == "undefined") {
			nested = {};
			nested[method] = route;
			parent[part] = nested;
			return;
		}
		throw new Error("Invalid route context: " + parentType);
	};



	Router.prototype.extend = function(methods) {
		var self = this, len = methods.length, i;
		function extend(method) {
			self._methods[method] = true;
			self[method] = function() {
				var extra = arguments.length === 1 ? [ method, "" ] : [ method ];
				self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
			};
		}
		for (i = 0; i < len; i++) {
			extend(methods[i]);
		}
	};

	Router.prototype.runlist = function(fns) {
		var runlist = this.every && this.every.before ? [ this.every.before ].concat(_flatten(fns)) : _flatten(fns);
		if (this.every && this.every.on) {
			runlist.push(this.every.on);
		}
		runlist.captures = fns.captures;
		runlist.source = fns.source;
		return runlist;
	};

	Router.prototype.mount = function(routes, path) {
		if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
			return;
		}
		var self = this;
		path = path || [];
		if (!Array.isArray(path)) {
			path = path.split(self.delimiter);
		}
		function insertOrMount(route, local) {
			var rename = route, parts = route.split(self.delimiter), routeType = typeof routes[route], isRoute = parts[0] === "" || !self._methods[parts[0]], event = isRoute ? "on" : rename;
			if (isRoute) {
				rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [ "" ])[0].length);
				parts.shift();
			}
			if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
				local = local.concat(parts);
				self.mount(routes[route], local);
				return;
			}
			if (isRoute) {
				local = local.concat(rename.split(self.delimiter));
				local = terminator(local, self.delimiter);
			}
			self.insert(event, local, routes[route]);
		}
		for (var route in routes) {
			if (routes.hasOwnProperty(route)) {
				insertOrMount(route, path.slice(0));
			}
		}
	};

/// <reference path="bobril.d.ts"/>
var DEBUG = false;
var b = (function (window, document) {
	function assert(shoudBeTrue, messageIfFalse) {
		if (DEBUG && !shoudBeTrue)
			throw Error(messageIfFalse || "assertion failed");
	}
	var isArray = Array.isArray;
	function createTextNode(content) {
		return document.createTextNode(content);
	}
	function createElement(name) {
		return document.createElement(name);
	}
	var hasTextContent = "textContent" in createTextNode("");
	function isObject(value) {
		return typeof value === "object";
	}
	function flatten(a) {
		if (!isArray(a)) {
			if (a == null || a === false || a === true)
				return [];
			return [a];
		}
		a = a.split(0);
		var alen = a.length;
		for (var i = 0; i < alen;) {
			var item = a[i];
			if (isArray(item)) {
				a.splice.apply(a, [i, 1].concat(item));
				alen = a.length;
				continue;
			}
			if (item == null || item === false || item === true) {
				a.splice(i, 1);
				alen--;
				continue;
			}
			i++;
		}
		return a;
	}
	var inSvg = false;
	var updateCall = [];
	var updateInstance = [];
	var setValueCallback = function (el, node, newValue, oldValue) {
		if (newValue !== oldValue)
			el["value"] = newValue;
	};
	function setSetValue(callback) {
		var prev = setValueCallback;
		setValueCallback = callback;
		return prev;
	}
	function newHashObj() {
		return Object.create(null);
	}
	var vendors = ["Webkit", "Moz", "ms", "O"];
	var testingDivStyle = document.createElement("div").style;
	function testPropExistence(name) {
		return typeof testingDivStyle[name] === "string";
	}
	var mapping = newHashObj();
	var isUnitlessNumber = {
		boxFlex: true,
		boxFlexGroup: true,
		columnCount: true,
		flex: true,
		flexGrow: true,
		flexNegative: true,
		flexPositive: true,
		flexShrink: true,
		fontWeight: true,
		lineClamp: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		strokeDashoffset: true,
		widows: true,
		zIndex: true,
		zoom: true,
	};
	function renamer(newName) {
		return function (style, value, oldName) {
			style[newName] = value;
			style[oldName] = undefined;
		};
	}
	;
	function renamerpx(newName) {
		return function (style, value, oldName) {
			if (typeof value === "number") {
				style[newName] = value + "px";
			}
			else {
				style[newName] = value;
			}
			style[oldName] = undefined;
		};
	}
	function pxadder(style, value, name) {
		if (typeof value === "number")
			style[name] = value + "px";
	}
	function ieVersion() {
		return document.documentMode;
	}
	function shimStyle(newValue) {
		var k = Object.keys(newValue);
		for (var i = 0, l = k.length; i < l; i++) {
			var ki = k[i];
			var mi = mapping[ki];
			var vi = newValue[ki];
			if (vi === undefined)
				continue; // don't want to map undefined
			if (mi === undefined) {
				if (DEBUG) {
					if (ki === "float" && window.console && console.error)
						console.error("In style instead of 'float' you have to use 'cssFloat'");
					if (/-/.test(ki) && window.console && console.warn)
						console.warn("Style property " + ki + " contains dash (must use JS props instead of css names)");
				}
				if (testPropExistence(ki)) {
					mi = (isUnitlessNumber[ki] === true) ? null : pxadder;
				}
				else {
					var titleCaseKi = ki.replace(/^\w/, function (match) { return match.toUpperCase(); });
					for (var j = 0; j < vendors.length; j++) {
						if (testPropExistence(vendors[j] + titleCaseKi)) {
							mi = ((isUnitlessNumber[ki] === true) ? renamer : renamerpx)(vendors[j] + titleCaseKi);
							break;
						}
					}
					if (mi === undefined) {
						mi = (isUnitlessNumber[ki] === true) ? null : pxadder;
						if (DEBUG && window.console && console.warn)
							console.warn("Style property " + ki + " is not supported in this browser");
					}
				}
				mapping[ki] = mi;
			}
			if (mi !== null)
				mi(newValue, vi, ki);
		}
	}
	function removeProperty(s, name) {
		s[name] = "";
	}
	function updateStyle(n, el, newStyle, oldStyle) {
		var s = el.style;
		if (isObject(newStyle)) {
			shimStyle(newStyle);
			var rule;
			if (isObject(oldStyle)) {
				for (rule in oldStyle) {
					if (!(rule in newStyle))
						removeProperty(s, rule);
				}
				for (rule in newStyle) {
					var v = newStyle[rule];
					if (v !== undefined) {
						if (oldStyle[rule] !== v)
							s[rule] = v;
					}
					else {
						removeProperty(s, rule);
					}
				}
			}
			else {
				if (oldStyle)
					s.cssText = "";
				for (rule in newStyle) {
					var v = newStyle[rule];
					if (v !== undefined)
						s[rule] = v;
				}
			}
		}
		else if (newStyle) {
			s.cssText = newStyle;
		}
		else {
			if (isObject(oldStyle)) {
				for (rule in oldStyle) {
					removeProperty(s, rule);
				}
			}
			else if (oldStyle) {
				s.cssText = "";
			}
		}
	}
	function setClassName(el, className) {
		if (inSvg)
			el.setAttribute("class", className);
		else
			el.className = className;
	}
	function updateElement(n, el, newAttrs, oldAttrs) {
		var attrName, newAttr, oldAttr, valueOldAttr, valueNewAttr;
		for (attrName in newAttrs) {
			newAttr = newAttrs[attrName];
			oldAttr = oldAttrs[attrName];
			if (attrName === "value" && !inSvg) {
				valueOldAttr = oldAttr;
				valueNewAttr = newAttr;
				oldAttrs[attrName] = newAttr;
				continue;
			}
			if (oldAttr !== newAttr) {
				oldAttrs[attrName] = newAttr;
				if (inSvg) {
					if (attrName === "href")
						el.setAttributeNS("http://www.w3.org/1999/xlink", "href", newAttr);
					else
						el.setAttribute(attrName, newAttr);
				}
				else if (attrName in el && !(attrName === "list" || attrName === "form")) {
					el[attrName] = newAttr;
				}
				else
					el.setAttribute(attrName, newAttr);
			}
		}
		for (attrName in oldAttrs) {
			if (oldAttrs[attrName] !== undefined && !(attrName in newAttrs)) {
				oldAttrs[attrName] = undefined;
				el.removeAttribute(attrName);
			}
		}
		if (valueNewAttr !== undefined) {
			setValueCallback(el, n, valueNewAttr, valueOldAttr);
		}
		return oldAttrs;
	}
	function pushInitCallback(c, aupdate) {
		var cc = c.component;
		if (cc) {
			if (cc[aupdate ? "postUpdateDom" : "postInitDom"]) {
				updateCall.push(aupdate);
				updateInstance.push(c);
			}
		}
	}
	function findCfg(parent) {
		var cfg;
		while (parent) {
			cfg = parent.cfg;
			if (cfg !== undefined)
				break;
			if (parent.ctx) {
				cfg = parent.ctx.cfg;
				break;
			}
			parent = parent.parent;
		}
		return cfg;
	}
	function setRef(ref, value) {
		if (ref == null)
			return;
		if (typeof ref === "function") {
			ref(value);
			return;
		}
		var ctx = ref[0];
		var refs = ctx.refs;
		if (!refs) {
			refs = newHashObj();
			ctx.refs = refs;
		}
		refs[ref[1]] = value;
	}
	function createNode(n, parentNode, createInto, createBefore) {
		var c = {
			tag: n.tag,
			key: n.key,
			ref: n.ref,
			className: n.className,
			style: n.style,
			attrs: n.attrs,
			children: n.children,
			component: n.component,
			data: n.data,
			cfg: n.cfg,
			parent: parentNode,
			element: undefined,
			ctx: undefined
		};
		var backupInSvg = inSvg;
		var component = c.component;
		var el;
		setRef(c.ref, c);
		if (component) {
			var ctx = { data: c.data || {}, me: c, cfg: findCfg(parentNode) };
			c.ctx = ctx;
			if (component.init) {
				component.init(ctx, c);
			}
			if (component.render) {
				component.render(ctx, c);
			}
		}
		var tag = c.tag;
		var children = c.children;
		if (tag === undefined) {
			if (typeof children === "string") {
				el = createTextNode(children);
				c.element = el;
				createInto.insertBefore(el, createBefore);
			}
			else {
				createChildren(c, createInto, createBefore);
			}
			if (component) {
				if (component.postRender) {
					component.postRender(c.ctx, c);
				}
				pushInitCallback(c, false);
			}
			return c;
		}
		else if (tag === "/") {
			var htmltext = children;
			if (htmltext === "") {
			}
			else if (createBefore == null) {
				var before = createInto.lastChild;
				createInto.insertAdjacentHTML("beforeend", htmltext);
				c.element = [];
				if (before) {
					before = before.nextSibling;
				}
				else {
					before = createInto.firstChild;
				}
				while (before) {
					c.element.push(before);
					before = before.nextSibling;
				}
			}
			else {
				el = createBefore;
				var elprev = createBefore.previousSibling;
				var removeEl = false;
				var parent = createInto;
				if (!el.insertAdjacentHTML) {
					el = parent.insertBefore(createElement("i"), el);
					removeEl = true;
				}
				el.insertAdjacentHTML("beforebegin", htmltext);
				if (elprev) {
					elprev = elprev.nextSibling;
				}
				else {
					elprev = parent.firstChild;
				}
				var newElements = [];
				while (elprev !== el) {
					newElements.push(elprev);
					elprev = elprev.nextSibling;
				}
				n.element = newElements;
				if (removeEl) {
					parent.removeChild(el);
				}
			}
			if (component) {
				if (component.postRender) {
					component.postRender(c.ctx, c);
				}
				pushInitCallback(c, false);
			}
			return c;
		}
		else if (inSvg || tag === "svg") {
			el = document.createElementNS("http://www.w3.org/2000/svg", tag);
			inSvg = true;
		}
		else if (!el) {
			el = createElement(tag);
		}
		createInto.insertBefore(el, createBefore);
		c.element = el;
		createChildren(c, el, null);
		if (component) {
			if (component.postRender) {
				component.postRender(c.ctx, c);
			}
		}
		if (c.attrs)
			c.attrs = updateElement(c, el, c.attrs, {});
		if (c.style)
			updateStyle(c, el, c.style, undefined);
		var className = c.className;
		if (className)
			setClassName(el, className);
		inSvg = backupInSvg;
		pushInitCallback(c, false);
		return c;
	}
	function normalizeNode(n) {
		var t = typeof n;
		if (t === "string") {
			return { children: n };
		}
		if (t === "boolean")
			return null;
		return n;
	}
	function createChildren(c, createInto, createBefore) {
		var ch = c.children;
		if (!ch)
			return;
		if (!isArray(ch)) {
			if (typeof ch === "string") {
				if (hasTextContent) {
					createInto.textContent = ch;
				}
				else {
					createInto.innerText = ch;
				}
				return;
			}
			ch = [ch];
		}
		ch = ch.slice(0);
		var i = 0, l = ch.length;
		while (i < l) {
			var item = ch[i];
			if (isArray(item)) {
				ch.splice.apply(ch, [i, 1].concat(item));
				l = ch.length;
				continue;
			}
			item = normalizeNode(item);
			if (item == null) {
				ch.splice(i, 1);
				l--;
				continue;
			}
			ch[i] = createNode(item, c, createInto, createBefore);
			i++;
		}
		c.children = ch;
	}
	function destroyNode(c) {
		setRef(c.ref, null);
		var ch = c.children;
		if (isArray(ch)) {
			for (var i = 0, l = ch.length; i < l; i++) {
				destroyNode(ch[i]);
			}
		}
		var component = c.component;
		if (component) {
			if (component.destroy)
				component.destroy(c.ctx, c, c.element);
		}
	}
	function removeNodeRecursive(c) {
		var el = c.element;
		if (isArray(el)) {
			var pa = el[0].parentNode;
			if (pa) {
				for (var i = 0; i < el.length; i++) {
					pa.removeChild(el[i]);
				}
			}
		}
		else if (el != null) {
			var p = el.parentNode;
			if (p)
				p.removeChild(el);
		}
		else {
			var ch = c.children;
			if (isArray(ch)) {
				for (var i = 0, l = ch.length; i < l; i++) {
					removeNodeRecursive(ch[i]);
				}
			}
		}
	}
	function removeNode(c) {
		destroyNode(c);
		removeNodeRecursive(c);
	}
	var roots = Object.create(null);
	function nodeContainsNode(c, n, resIndex, res) {
		var el = c.element;
		var ch = c.children;
		if (isArray(el)) {
			for (var ii = 0; ii < el.length; ii++) {
				if (el[ii] === n) {
					res.push(c);
					if (isArray(ch)) {
						return ch;
					}
					return null;
				}
			}
		}
		else if (el == null) {
			if (isArray(ch)) {
				for (var i = 0; i < ch.length; i++) {
					var result = nodeContainsNode(ch[i], n, resIndex, res);
					if (result !== undefined) {
						res.splice(resIndex, 0, c);
						return result;
					}
				}
			}
		}
		else if (el === n) {
			res.push(c);
			if (isArray(ch)) {
				return ch;
			}
			return null;
		}
		return undefined;
	}
	function vdomPath(n) {
		var res = [];
		if (n == null)
			return res;
		var rootIds = Object.keys(roots);
		var rootElements = rootIds.map(function (i) { return roots[i].e || document.body; });
		var nodeStack = [];
		rootFound: while (n) {
			for (var j = 0; j < rootElements.length; j++) {
				if (n === rootElements[j])
					break rootFound;
			}
			nodeStack.push(n);
			n = n.parentNode;
		}
		if (!n || nodeStack.length === 0)
			return res;
		var currentCacheArray = null;
		var currentNode = nodeStack.pop();
		rootFound2: for (j = 0; j < rootElements.length; j++) {
			if (n === rootElements[j]) {
				var rc = roots[rootIds[j]].c;
				for (var k = 0; k < rc.length; k++) {
					var rck = rc[k];
					var findResult = nodeContainsNode(rck, currentNode, res.length, res);
					if (findResult !== undefined) {
						currentCacheArray = findResult;
						break rootFound2;
					}
				}
			}
		}
		while (nodeStack.length) {
			currentNode = nodeStack.pop();
			if (currentCacheArray && currentCacheArray.length)
				for (var i = 0, l = currentCacheArray.length; i < l; i++) {
					var bn = currentCacheArray[i];
					var findResult = nodeContainsNode(bn, currentNode, res.length, res);
					if (findResult !== undefined) {
						currentCacheArray = findResult;
						currentNode = null;
						break;
					}
				}
			if (currentNode) {
				res.push(null);
				break;
			}
		}
		return res;
	}
	function getCacheNode(n) {
		var s = vdomPath(n);
		if (s.length == 0)
			return null;
		return s[s.length - 1];
	}
	function finishUpdateNode(n, c, component) {
		if (component) {
			if (component.postRender) {
				component.postRender(c.ctx, n, c);
			}
		}
		c.data = n.data;
		pushInitCallback(c, true);
	}
	function updateNode(n, c, createInto, createBefore, deepness) {
		var component = n.component;
		var backupInSvg = inSvg;
		var bigChange = false;
		var ctx = c.ctx;
		if (component && ctx != null) {
			if (ctx[ctxInvalidated] === frame) {
				deepness = Math.max(deepness, ctx[ctxDeepness]);
			}
			if (component.id !== c.component.id) {
				bigChange = true;
			}
			else {
				if (c.parent != undefined)
					ctx.cfg = findCfg(c.parent);
				if (component.shouldChange)
					if (!component.shouldChange(ctx, n, c) && !ignoringShouldChange)
						return c;
				ctx.data = n.data || {};
				c.component = component;
				if (component.render) {
					n = assign({}, n); // need to clone me because it should not be modified for next updates
					component.render(ctx, n, c);
				}
				c.cfg = n.cfg;
			}
		}
		if (DEBUG) {
			if (!((n.ref == null && c.ref == null) ||
				((n.ref != null && c.ref != null && (typeof n.ref === "function" || typeof c.ref === "function" ||
				n.ref[0] === c.ref[0] && n.ref[1] === c.ref[1]))))) {
				if (window.console && console.warn)
					console.warn("ref changed in child in update");
			}
		}
		var newChildren = n.children;
		var cachedChildren = c.children;
		var tag = n.tag;
		if (bigChange || (component && ctx == null)) {
		}
		else if (tag === "/") {
			if (c.tag === "/" && cachedChildren === newChildren) {
				finishUpdateNode(n, c, component);
				return c;
			}
		}
		else if (tag === c.tag) {
			if (tag === undefined) {
				if (typeof newChildren === "string" && typeof cachedChildren === "string") {
					if (newChildren !== cachedChildren) {
						var el = c.element;
						if (hasTextContent) {
							el.textContent = newChildren;
						}
						else {
							el.nodeValue = newChildren;
						}
						c.children = newChildren;
					}
				}
				else {
					if (deepness <= 0) {
						if (isArray(cachedChildren))
							selectedUpdate(c.children, createInto, createBefore);
					}
					else {
						c.children = updateChildren(createInto, newChildren, cachedChildren, c, createBefore, deepness - 1);
					}
				}
				finishUpdateNode(n, c, component);
				return c;
			}
			else {
				if (tag === "svg") {
					inSvg = true;
				}
				var el = c.element;
				if ((typeof newChildren === "string") && !isArray(cachedChildren)) {
					if (newChildren !== cachedChildren) {
						if (hasTextContent) {
							el.textContent = newChildren;
						}
						else {
							el.innerText = newChildren;
						}
						cachedChildren = newChildren;
					}
				}
				else {
					if (deepness <= 0) {
						if (isArray(cachedChildren))
							selectedUpdate(c.children, el, createBefore);
					}
					else {
						cachedChildren = updateChildren(el, newChildren, cachedChildren, c, null, deepness - 1);
					}
				}
				c.children = cachedChildren;
				finishUpdateNode(n, c, component);
				if (c.attrs || n.attrs)
					c.attrs = updateElement(c, el, n.attrs || {}, c.attrs || {});
				updateStyle(c, el, n.style, c.style);
				c.style = n.style;
				var className = n.className;
				if (className !== c.className) {
					setClassName(el, className || "");
					c.className = className;
				}
				inSvg = backupInSvg;
				return c;
			}
		}
		var parEl = c.element;
		if (isArray(parEl))
			parEl = parEl[0];
		if (parEl == null)
			parEl = createInto;
		else
			parEl = parEl.parentNode;
		var r = createNode(n, c.parent, parEl, findFirstNode(c));
		removeNode(c);
		return r;
	}
	function findFirstNode(c) {
		var el = c.element;
		if (el != null) {
			if (isArray(el))
				return el[0];
			return el;
		}
		var ch = c.children;
		if (!isArray(ch))
			return null;
		for (var i = 0; i < ch.length; i++) {
			el = findFirstNode(ch[i]);
			if (el)
				return el;
		}
		return null;
	}
	function findNextNode(a, i, len, def) {
		while (++i < len) {
			var ai = a[i];
			if (ai == null)
				continue;
			var n = findFirstNode(ai);
			if (n != null)
				return n;
		}
		return def;
	}
	function callPostCallbacks() {
		var count = updateInstance.length;
		for (var i = 0; i < count; i++) {
			var n = updateInstance[i];
			if (updateCall[i]) {
				n.component.postUpdateDom(n.ctx, n, n.element);
			}
			else {
				n.component.postInitDom(n.ctx, n, n.element);
			}
		}
		updateCall = [];
		updateInstance = [];
	}
	function updateNodeInUpdateChildren(newNode, cachedChildren, cachedIndex, cachedLength, createBefore, element, deepness) {
		cachedChildren[cachedIndex] = updateNode(newNode, cachedChildren[cachedIndex], element, findNextNode(cachedChildren, cachedIndex, cachedLength, createBefore), deepness);
	}
	function reorderInUpdateChildrenRec(c, element, before) {
		var el = c.element;
		if (el != null) {
			if (isArray(el)) {
				for (var i = 0; i < el.length; i++) {
					element.insertBefore(el[i], before);
				}
			}
			else
				element.insertBefore(el, before);
			return;
		}
		var ch = c.children;
		if (!isArray(ch))
			return null;
		for (var i = 0; i < ch.length; i++) {
			reorderInUpdateChildrenRec(ch[i], element, before);
		}
	}
	function reorderInUpdateChildren(cachedChildren, cachedIndex, cachedLength, createBefore, element) {
		var before = findNextNode(cachedChildren, cachedIndex, cachedLength, createBefore);
		var cur = cachedChildren[cachedIndex];
		var what = findFirstNode(cur);
		if (what != null && what !== before) {
			reorderInUpdateChildrenRec(cur, element, before);
		}
	}
	function reorderAndUpdateNodeInUpdateChildren(newNode, cachedChildren, cachedIndex, cachedLength, createBefore, element, deepness) {
		var before = findNextNode(cachedChildren, cachedIndex, cachedLength, createBefore);
		var cur = cachedChildren[cachedIndex];
		var what = findFirstNode(cur);
		if (what != null && what !== before) {
			reorderInUpdateChildrenRec(cur, element, before);
		}
		cachedChildren[cachedIndex] = updateNode(newNode, cur, element, before, deepness);
	}
	function updateChildren(element, newChildren, cachedChildren, parentNode, createBefore, deepness) {
		if (newChildren == null)
			newChildren = [];
		if (!isArray(newChildren)) {
			newChildren = [newChildren];
		}
		if (cachedChildren == null)
			cachedChildren = [];
		if (!isArray(cachedChildren)) {
			if (element.firstChild)
				element.removeChild(element.firstChild);
			cachedChildren = [];
		}
		newChildren = newChildren.slice(0);
		var newLength = newChildren.length;
		var cachedLength = cachedChildren.length;
		var newIndex;
		for (newIndex = 0; newIndex < newLength;) {
			var item = newChildren[newIndex];
			if (isArray(item)) {
				newChildren.splice.apply(newChildren, [newIndex, 1].concat(item));
				newLength = newChildren.length;
				continue;
			}
			item = normalizeNode(item);
			if (item == null) {
				newChildren.splice(newIndex, 1);
				newLength--;
				continue;
			}
			newChildren[newIndex] = item;
			newIndex++;
		}
		var newEnd = newLength;
		var cachedEnd = cachedLength;
		newIndex = 0;
		var cachedIndex = 0;
		while (newIndex < newEnd && cachedIndex < cachedEnd) {
			if (newChildren[newIndex].key === cachedChildren[cachedIndex].key) {
				updateNodeInUpdateChildren(newChildren[newIndex], cachedChildren, cachedIndex, cachedLength, createBefore, element, deepness);
				newIndex++;
				cachedIndex++;
				continue;
			}
			while (true) {
				if (newChildren[newEnd - 1].key === cachedChildren[cachedEnd - 1].key) {
					newEnd--;
					cachedEnd--;
					updateNodeInUpdateChildren(newChildren[newEnd], cachedChildren, cachedEnd, cachedLength, createBefore, element, deepness);
					if (newIndex < newEnd && cachedIndex < cachedEnd)
						continue;
				}
				break;
			}
			if (newIndex < newEnd && cachedIndex < cachedEnd) {
				if (newChildren[newIndex].key === cachedChildren[cachedEnd - 1].key) {
					cachedChildren.splice(cachedIndex, 0, cachedChildren[cachedEnd - 1]);
					cachedChildren.splice(cachedEnd, 1);
					reorderAndUpdateNodeInUpdateChildren(newChildren[newIndex], cachedChildren, cachedIndex, cachedLength, createBefore, element, deepness);
					newIndex++;
					cachedIndex++;
					continue;
				}
				if (newChildren[newEnd - 1].key === cachedChildren[cachedIndex].key) {
					cachedChildren.splice(cachedEnd, 0, cachedChildren[cachedIndex]);
					cachedChildren.splice(cachedIndex, 1);
					cachedEnd--;
					newEnd--;
					reorderAndUpdateNodeInUpdateChildren(newChildren[newEnd], cachedChildren, cachedEnd, cachedLength, createBefore, element, deepness);
					continue;
				}
			}
			break;
		}
		if (cachedIndex === cachedEnd) {
			if (newIndex === newEnd) {
				return cachedChildren;
			}
			// Only work left is to add new nodes
			while (newIndex < newEnd) {
				cachedChildren.splice(cachedIndex, 0, createNode(newChildren[newIndex], parentNode, element, findNextNode(cachedChildren, cachedIndex - 1, cachedLength, createBefore)));
				cachedIndex++;
				cachedEnd++;
				cachedLength++;
				newIndex++;
			}
			return cachedChildren;
		}
		if (newIndex === newEnd) {
			// Only work left is to remove old nodes
			while (cachedIndex < cachedEnd) {
				cachedEnd--;
				removeNode(cachedChildren[cachedEnd]);
				cachedChildren.splice(cachedEnd, 1);
			}
			return cachedChildren;
		}
		// order of keyed nodes ware changed => reorder keyed nodes first
		var cachedKeys = newHashObj();
		var newKeys = newHashObj();
		var key;
		var node;
		var backupNewIndex = newIndex;
		var backupCachedIndex = cachedIndex;
		var deltaKeyless = 0;
		for (; cachedIndex < cachedEnd; cachedIndex++) {
			node = cachedChildren[cachedIndex];
			key = node.key;
			if (key != null) {
				assert(!(key in cachedKeys));
				cachedKeys[key] = cachedIndex;
			}
			else
				deltaKeyless--;
		}
		var keyLess = -deltaKeyless - deltaKeyless;
		for (; newIndex < newEnd; newIndex++) {
			node = newChildren[newIndex];
			key = node.key;
			if (key != null) {
				assert(!(key in newKeys));
				newKeys[key] = newIndex;
			}
			else
				deltaKeyless++;
		}
		keyLess += deltaKeyless;
		var delta = 0;
		newIndex = backupNewIndex;
		cachedIndex = backupCachedIndex;
		var cachedKey;
		while (cachedIndex < cachedEnd && newIndex < newEnd) {
			if (cachedChildren[cachedIndex] === null) {
				cachedChildren.splice(cachedIndex, 1);
				cachedEnd--;
				cachedLength--;
				delta--;
				continue;
			}
			cachedKey = cachedChildren[cachedIndex].key;
			if (cachedKey == null) {
				cachedIndex++;
				continue;
			}
			key = newChildren[newIndex].key;
			if (key == null) {
				newIndex++;
				while (newIndex < newEnd) {
					key = newChildren[newIndex].key;
					if (key != null)
						break;
					newIndex++;
				}
				if (key == null)
					break;
			}
			var akpos = cachedKeys[key];
			if (akpos === undefined) {
				// New key
				cachedChildren.splice(cachedIndex, 0, createNode(newChildren[newIndex], parentNode, element, findNextNode(cachedChildren, cachedIndex - 1, cachedLength, createBefore)));
				delta++;
				newIndex++;
				cachedIndex++;
				cachedEnd++;
				cachedLength++;
				continue;
			}
			if (!(cachedKey in newKeys)) {
				// Old key
				removeNode(cachedChildren[cachedIndex]);
				cachedChildren.splice(cachedIndex, 1);
				delta--;
				cachedEnd--;
				cachedLength--;
				continue;
			}
			if (cachedIndex === akpos + delta) {
				// Inplace update
				updateNodeInUpdateChildren(newChildren[newIndex], cachedChildren, cachedIndex, cachedLength, createBefore, element, deepness);
				newIndex++;
				cachedIndex++;
			}
			else {
				// Move
				cachedChildren.splice(cachedIndex, 0, cachedChildren[akpos + delta]);
				delta++;
				cachedChildren[akpos + delta] = null;
				reorderAndUpdateNodeInUpdateChildren(newChildren[newIndex], cachedChildren, cachedIndex, cachedLength, createBefore, element, deepness);
				cachedIndex++;
				cachedEnd++;
				cachedLength++;
				newIndex++;
			}
		}
		// remove old keyed cached nodes
		while (cachedIndex < cachedEnd) {
			if (cachedChildren[cachedIndex] === null) {
				cachedChildren.splice(cachedIndex, 1);
				cachedEnd--;
				cachedLength--;
				continue;
			}
			if (cachedChildren[cachedIndex].key != null) {
				removeNode(cachedChildren[cachedIndex]);
				cachedChildren.splice(cachedIndex, 1);
				cachedEnd--;
				cachedLength--;
				continue;
			}
			cachedIndex++;
		}
		// add new keyed nodes
		while (newIndex < newEnd) {
			key = newChildren[newIndex].key;
			if (key != null) {
				cachedChildren.splice(cachedIndex, 0, createNode(newChildren[newIndex], parentNode, element, findNextNode(cachedChildren, cachedIndex - 1, cachedLength, createBefore)));
				cachedEnd++;
				cachedLength++;
				delta++;
				cachedIndex++;
			}
			newIndex++;
		}
		// Without any keyless nodes we are done
		if (!keyLess)
			return cachedChildren;
		// calculate common (old and new) keyless
		keyLess = (keyLess - Math.abs(deltaKeyless)) >> 1;
		// reorder just nonkeyed nodes
		newIndex = backupNewIndex;
		cachedIndex = backupCachedIndex;
		while (newIndex < newEnd) {
			if (cachedIndex < cachedEnd) {
				cachedKey = cachedChildren[cachedIndex].key;
				if (cachedKey != null) {
					cachedIndex++;
					continue;
				}
			}
			key = newChildren[newIndex].key;
			if (newIndex < cachedEnd && key === cachedChildren[newIndex].key) {
				if (key != null) {
					newIndex++;
					continue;
				}
				updateNodeInUpdateChildren(newChildren[newIndex], cachedChildren, newIndex, cachedLength, createBefore, element, deepness);
				keyLess--;
				newIndex++;
				cachedIndex = newIndex;
				continue;
			}
			if (key != null) {
				assert(newIndex === cachedIndex);
				if (keyLess === 0 && deltaKeyless < 0) {
					while (true) {
						removeNode(cachedChildren[cachedIndex]);
						cachedChildren.splice(cachedIndex, 1);
						cachedEnd--;
						cachedLength--;
						deltaKeyless++;
						assert(cachedIndex !== cachedEnd, "there still need to exist key node");
						if (cachedChildren[cachedIndex].key != null)
							break;
					}
					continue;
				}
				while (cachedChildren[cachedIndex].key == null)
					cachedIndex++;
				assert(key === cachedChildren[cachedIndex].key);
				cachedChildren.splice(newIndex, 0, cachedChildren[cachedIndex]);
				cachedChildren.splice(cachedIndex + 1, 1);
				reorderInUpdateChildren(cachedChildren, newIndex, cachedLength, createBefore, element);
				// just moving keyed node it was already updated before
				newIndex++;
				cachedIndex = newIndex;
				continue;
			}
			if (cachedIndex < cachedEnd) {
				cachedChildren.splice(newIndex, 0, cachedChildren[cachedIndex]);
				cachedChildren.splice(cachedIndex + 1, 1);
				reorderAndUpdateNodeInUpdateChildren(newChildren[newIndex], cachedChildren, newIndex, cachedLength, createBefore, element, deepness);
				keyLess--;
				newIndex++;
				cachedIndex++;
			}
			else {
				cachedChildren.splice(newIndex, 0, createNode(newChildren[newIndex], parentNode, element, findNextNode(cachedChildren, newIndex - 1, cachedLength, createBefore)));
				cachedEnd++;
				cachedLength++;
				newIndex++;
				cachedIndex++;
			}
		}
		while (cachedEnd > newIndex) {
			cachedEnd--;
			removeNode(cachedChildren[cachedEnd]);
			cachedChildren.splice(cachedEnd, 1);
		}
		return cachedChildren;
	}
	var hasNativeRaf = false;
	var nativeRaf = window.requestAnimationFrame;
	if (nativeRaf) {
		nativeRaf(function (param) { if (param === +param)
			hasNativeRaf = true; });
	}
	var now = Date.now || (function () { return (new Date).getTime(); });
	var startTime = now();
	var lastTickTime = 0;
	function requestAnimationFrame(callback) {
		if (hasNativeRaf) {
			nativeRaf(callback);
		}
		else {
			var delay = 50 / 3 + lastTickTime - now();
			if (delay < 0)
				delay = 0;
			window.setTimeout(function () {
				lastTickTime = now();
				callback(lastTickTime - startTime);
			}, delay);
		}
	}
	var ctxInvalidated = "$invalidated";
	var ctxDeepness = "$deepness";
	var fullRecreateRequested = true;
	var scheduled = false;
	var uptime = 0;
	var frame = 0;
	var lastFrameDuration = 0;
	var renderFrameBegin = 0;
	var regEvents = {};
	var registryEvents = {};
	function addEvent(name, priority, callback) {
		var list = registryEvents[name] || [];
		list.push({ priority: priority, callback: callback });
		registryEvents[name] = list;
	}
	function emitEvent(name, ev, target, node) {
		var events = regEvents[name];
		if (events)
			for (var i = 0; i < events.length; i++) {
				if (events[i](ev, target, node))
					return true;
			}
		return false;
	}
	function addListener(el, name) {
		if (name[0] == "!")
			return;
		var capture = (name[0] == "^");
		var eventName = name;
		if (capture) {
			eventName = name.slice(1);
		}
		function enhanceEvent(ev) {
			ev = ev || window.event;
			var t = ev.target || ev.srcElement || el;
			var n = getCacheNode(t);
			emitEvent(name, ev, t, n);
		}
		if (("on" + eventName) in window)
			el = window;
		el.addEventListener(eventName, enhanceEvent, capture);
	}
	var eventsCaptured = false;
	function initEvents() {
		if (eventsCaptured)
			return;
		eventsCaptured = true;
		var eventNames = Object.keys(registryEvents);
		for (var j = 0; j < eventNames.length; j++) {
			var eventName = eventNames[j];
			var arr = registryEvents[eventName];
			arr = arr.sort(function (a, b) { return a.priority - b.priority; });
			regEvents[eventName] = arr.map(function (v) { return v.callback; });
		}
		registryEvents = null;
		var body = document.body;
		for (var i = 0; i < eventNames.length; i++) {
			addListener(body, eventNames[i]);
		}
	}
	function selectedUpdate(cache, element, createBefore) {
		var len = cache.length;
		for (var i = 0; i < len; i++) {
			var node = cache[i];
			var ctx = node.ctx;
			if (ctx != null && ctx[ctxInvalidated] === frame) {
				var cloned = { data: ctx.data, component: node.component };
				cache[i] = updateNode(cloned, node, element, createBefore, ctx[ctxDeepness]);
			}
			else if (isArray(node.children)) {
				var backupInSvg = inSvg;
				if (node.tag === "svg")
					inSvg = true;
				selectedUpdate(node.children, node.element || element, findNextNode(cache, i, len, createBefore));
				inSvg = backupInSvg;
			}
		}
	}
	var beforeFrameCallback = function () { };
	var afterFrameCallback = function () { };
	function setBeforeFrame(callback) {
		var res = beforeFrameCallback;
		beforeFrameCallback = callback;
		return res;
	}
	function setAfterFrame(callback) {
		var res = afterFrameCallback;
		afterFrameCallback = callback;
		return res;
	}
	function findLastNode(children) {
		for (var i = children.length - 1; i >= 0; i--) {
			var c = children[i];
			var el = c.element;
			if (el != null) {
				if (isArray(el)) {
					var l = el.length;
					if (l === 0)
						continue;
					return el[l - 1];
				}
				return el;
			}
			var ch = c.children;
			if (!isArray(ch))
				continue;
			var res = findLastNode(ch);
			if (res != null)
				return res;
		}
		return null;
	}
	function update(time) {
		renderFrameBegin = now();
		initEvents();
		frame++;
		ignoringShouldChange = nextIgnoreShouldChange;
		nextIgnoreShouldChange = false;
		uptime = time;
		scheduled = false;
		beforeFrameCallback();
		var fullRefresh = false;
		if (fullRecreateRequested) {
			fullRecreateRequested = false;
			fullRefresh = true;
		}
		var rootIds = Object.keys(roots);
		for (var i = 0; i < rootIds.length; i++) {
			var r = roots[rootIds[i]];
			if (!r)
				continue;
			var rc = r.c;
			var insertBefore = findLastNode(rc);
			if (insertBefore != null)
				insertBefore = insertBefore.nextSibling;
			if (fullRefresh) {
				var newChildren = r.f();
				r.e = r.e || document.body;
				r.c = updateChildren(r.e, newChildren, rc, null, insertBefore, 1e6);
			}
			else {
				selectedUpdate(rc, r.e, insertBefore);
			}
		}
		callPostCallbacks();
		var r0 = roots["0"];
		afterFrameCallback(r0 ? r0.c : null);
		lastFrameDuration = now() - renderFrameBegin;
	}
	var nextIgnoreShouldChange = false;
	var ignoringShouldChange = false;
	function ignoreShouldChange() {
		nextIgnoreShouldChange = true;
		invalidate();
	}
	function invalidate(ctx, deepness) {
		if (fullRecreateRequested)
			return;
		if (ctx != null) {
			if (deepness == undefined)
				deepness = 1e6;
			if (ctx[ctxInvalidated] !== frame + 1) {
				ctx[ctxInvalidated] = frame + 1;
				ctx[ctxDeepness] = deepness;
			}
			else {
				if (deepness > ctx[ctxDeepness])
					ctx[ctxDeepness] = deepness;
			}
		}
		else {
			fullRecreateRequested = true;
		}
		if (scheduled)
			return;
		scheduled = true;
		requestAnimationFrame(update);
	}
	var lastRootId = 0;
	function forceInvalidate() {
		if (!scheduled)
			fullRecreateRequested = false;
		invalidate();
	}
	function addRoot(factory, element, parent) {
		lastRootId++;
		var rootId = "" + lastRootId;
		roots[rootId] = { f: factory, e: element, c: [], p: parent };
		forceInvalidate();
		return rootId;
	}
	function removeRoot(id) {
		var root = roots[id];
		if (!root)
			return;
		if (root.c.length) {
			root.c = updateChildren(root.e, [], root.c, null, null, 1e9);
		}
		delete roots[id];
	}
	function getRoots() {
		return roots;
	}
	var beforeInit = forceInvalidate;
	function init(factory, element) {
		removeRoot("0");
		roots["0"] = { f: factory, e: element, c: [], p: undefined };
		beforeInit();
		beforeInit = forceInvalidate;
	}
	function setBeforeInit(callback) {
		var prevBeforeInit = beforeInit;
		beforeInit = function () {
			callback(prevBeforeInit);
		};
	}
	function bubbleEvent(node, name, param) {
		while (node) {
			var c = node.component;
			if (c) {
				var ctx = node.ctx;
				var m = c[name];
				if (m) {
					if (m.call(c, ctx, param))
						return ctx;
				}
				m = c.shouldStopBubble;
				if (m) {
					if (m.call(c, ctx, name, param))
						break;
				}
			}
			node = node.parent;
		}
		return null;
	}
	function broadcastEventToNode(node, name, param) {
		if (!node)
			return null;
		var c = node.component;
		if (c) {
			var ctx = node.ctx;
			var m = c[name];
			if (m) {
				if (m.call(c, ctx, param))
					return ctx;
			}
			m = c.shouldStopBroadcast;
			if (m) {
				if (m.call(c, ctx, name, param))
					return null;
			}
		}
		var ch = node.children;
		if (isArray(ch)) {
			for (var i = 0; i < ch.length; i++) {
				var res = broadcastEventToNode(ch[i], name, param);
				if (res != null)
					return res;
			}
		}
		else {
			return broadcastEventToNode(ch, name, param);
		}
	}
	function broadcastEvent(name, param) {
		var k = Object.keys(roots);
		for (var i = 0; i < k.length; i++) {
			var ch = roots[k[i]].c;
			if (ch != null) {
				for (var j = 0; j < ch.length; j++) {
					var res = broadcastEventToNode(ch[j], name, param);
					if (res != null)
						return res;
				}
			}
		}
		return null;
	}
	function merge(f1, f2) {
		var _this = this;
		return function () {
			var params = [];
			for (var _i = 0; _i < arguments.length; _i++) {
				params[_i - 0] = arguments[_i];
			}
			var result = f1.apply(_this, params);
			if (result)
				return result;
			return f2.apply(_this, params);
		};
	}
	var emptyObject = {};
	function mergeComponents(c1, c2) {
		var res = Object.create(c1);
		for (var i in c2) {
			if (!(i in emptyObject)) {
				var m = c2[i];
				var origM = c1[i];
				if (i === "id") {
					res[i] = ((origM != null) ? origM : "") + "/" + m;
				}
				else if (typeof m === "function" && origM != null && typeof origM === "function") {
					res[i] = merge(origM, m);
				}
				else {
					res[i] = m;
				}
			}
		}
		return res;
	}
	function preEnhance(node, methods) {
		var comp = node.component;
		if (!comp) {
			node.component = methods;
			return node;
		}
		node.component = mergeComponents(methods, comp);
		return node;
	}
	function postEnhance(node, methods) {
		var comp = node.component;
		if (!comp) {
			node.component = methods;
			return node;
		}
		node.component = mergeComponents(comp, methods);
		return node;
	}
	function assign(target) {
		var sources = [];
		for (var _i = 1; _i < arguments.length; _i++) {
			sources[_i - 1] = arguments[_i];
		}
		if (target == null)
			target = {};
		var totalArgs = arguments.length;
		for (var i = 1; i < totalArgs; i++) {
			var source = arguments[i];
			if (source == null)
				continue;
			var keys = Object.keys(source);
			var totalKeys = keys.length;
			for (var j = 0; j < totalKeys; j++) {
				var key = keys[j];
				target[key] = source[key];
			}
		}
		return target;
	}
	function preventDefault(event) {
		var pd = event.preventDefault;
		if (pd)
			pd.call(event);
		else
			event.returnValue = false;
	}
	function cloneNodeArray(a) {
		a = a.slice(0);
		for (var i = 0; i < a.length; i++) {
			var n = a[i];
			if (isArray(n)) {
				a[i] = cloneNodeArray(n);
			}
			else if (isObject(n)) {
				a[i] = cloneNode(n);
			}
		}
		return a;
	}
	function cloneNode(node) {
		var r = assign({}, node);
		if (r.attrs) {
			r.attrs = assign({}, r.attrs);
		}
		if (isObject(r.style)) {
			r.style = assign({}, r.style);
		}
		var ch = r.children;
		if (ch) {
			if (isArray(ch)) {
				r.children = cloneNodeArray(ch);
			}
			else if (isObject(ch)) {
				r.children = cloneNode(ch);
			}
		}
		return r;
	}
	return {
		createNode: createNode,
		updateNode: updateNode,
		updateChildren: updateChildren,
		callPostCallbacks: callPostCallbacks,
		setSetValue: setSetValue,
		setStyleShim: function (name, action) { return mapping[name] = action; },
		init: init,
		addRoot: addRoot,
		removeRoot: removeRoot,
		getRoots: getRoots,
		setBeforeFrame: setBeforeFrame,
		setAfterFrame: setAfterFrame,
		setBeforeInit: setBeforeInit,
		isArray: isArray,
		uptime: function () { return uptime; },
		lastFrameDuration: function () { return lastFrameDuration; },
		now: now,
		frame: function () { return frame; },
		assign: assign,
		ieVersion: ieVersion,
		invalidate: invalidate,
		ignoreShouldChange: ignoreShouldChange,
		invalidated: function () { return scheduled; },
		preventDefault: preventDefault,
		vdomPath: vdomPath,
		getDomNode: findFirstNode,
		deref: getCacheNode,
		addEvent: addEvent,
		emitEvent: emitEvent,
		bubble: bubbleEvent,
		broadcast: broadcastEvent,
		preEnhance: preEnhance,
		postEnhance: postEnhance,
		cloneNode: cloneNode,
		shimStyle: shimStyle,
		flatten: flatten
	};
})(window, document);


DominoControllers.registerController( 'indexController', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( data ) {

			var deferred = new Deferred();

			var urlparams = window.location.search.replace(/\?/g, '');
			var fullpath = urlparams ? data.path + '?' + urlparams : data.path;

			DominoApp.getAjax( '/' + fullpath, data.params, {} ).then( function( getData ) {

				DominoAppOptions.site = getData.site;
				DominoAppOptions.params = getData.params;
				DominoAppOptions.identity = getData.identity;




				if ( getData.params.debug )
					console.log('Debug: ' + getData.params.debug);

				if ( getData.params.error ) {
					DominoApp.renderView( document.getElementById("mainLayout"), getData.params.error.view, getData.params.error );
				}
				else {

					DominoApp.utils.title(getData.site.meta.title);
					DominoApp.utils.description(getData.site.meta.description);
					DominoApp.utils.keywords(getData.site.meta.keywords);
//var xx = 0;
					//DominoAppComponents = {};

					function FillViews ( placeholder ) {

						var el = null;
						var viewName = null;
						var componentData = null;
						var newController = null;

						var FindPlaceholder = placeholder.querySelectorAll('div[view]');
						if ( FindPlaceholder.length )
							//console.log(FindPlaceholder);
						for ( var index = 0; index < FindPlaceholder.length; index++ ) {
							el = FindPlaceholder[index];
							//console.log(el);
							viewName = el.getAttribute('view');
							componentData = el.hasAttribute('componentData');
							//console.log('fillViews: ' + viewName);
							if ( !viewName )
								console.log(el);

							if ( !componentData ) {
								DominoApp.renderView(el, viewName, getData.moduleData[viewName]);
								FillViews(el);
							}


						}
					}

					var placeholder;
					for ( var key = 0; key < getData.site.page.views.length; key++ ) {
						var registeredView = getData.site.page.views[key];

						if ( ( DominoAppOptions.activeTemplate[key] !== registeredView ) || ( key > 0 ) ) { //viewsNum === (key + 1)

							if ( key === 0 ) {
								DominoAppOptions.activeTemplate = [];
								placeholder = document.getElementById("mainLayout");
							}
							else
								placeholder = document.getElementById("inner");
							if (this.activeController)
								this.activeController.destroy();

							//newController.destroy();
							if ( placeholder ) {
								DominoApp.renderView( placeholder, registeredView, getData.moduleData[registeredView] );

								FillViews( placeholder );
								DominoAppOptions.activeTemplate[key] = registeredView;
							}

						}
					}

					// Refresh data
					if ( getData.refreshData )
						for ( var key in getData.refreshData )
							if (getData.refreshData.hasOwnProperty(key))
								if ( DominoAppControllers[key] ) {
									var refreshController = new DominoAppControllers[ key ]();
									if ( refreshController )
										if ( refreshController['refreshAction'] ) {

											var refreshEl = document.querySelector('div[view="' + key + '"]');

											if ( refreshEl )
												refreshController['refreshAction']( refreshEl, "dsf", getData.refreshData[key] );

										}
								}

                    document.body.className = 'render';



					if( typeof( window.ga ) == 'function' ) {
                        window.ga('set', 'page', getData.params.currentUrl );
                        window.ga('send', 'pageview' );
                    }



					// reset inactive views
					//for ( var i = viewsNum; i < 4; i++ ) {
						//self.options.activeTemplate[i] = "";
						//$('[view="' + i + '"]').empty();
					//}

				}


				deferred.resolve( getData );


			}, function( errorResponse ) {
				// TODO: handle error
				console.log("we don't got it");
			} );

			return deferred.promise();
		},
		'404Action': function (params) {
			console.log('Running 404 with', params);
		}
	}
} ) );
var mainView = function( children ) {
	return {tag: "div", attrs: {id:"mainLayout"}, children: [ children.map( function( child ) {
			return child.renderFunc.call( child.renderController, child.renderParams );
		}) 
	]};
};

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.pell = {})));
}(this, (function (exports) { 'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var defaultParagraphSeparatorString = 'defaultParagraphSeparator';
    var formatBlock = 'formatBlock';
    var addEventListener = function addEventListener(parent, type, listener) {
        return parent.addEventListener(type, listener);
    };
    var appendChild = function appendChild(parent, child) {
        return parent.appendChild(child);
    };
    var createElement = function createElement(tag) {
        return document.createElement(tag);
    };
    var queryCommandState = function queryCommandState(command) {
        return document.queryCommandState(command);
    };
    var queryCommandValue = function queryCommandValue(command) {
        return document.queryCommandValue(command);
    };

    var exec = function exec(command) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return document.execCommand(command, false, value);
    };

    var defaultActions = {
        bold: {
            icon: '<b>B</b>',
            title: 'Bold',
            state: function state() {
                return queryCommandState('bold');
            },
            result: function result() {
                return exec('bold');
            }
        },
        italic: {
            icon: '<i>I</i>',
            title: 'Italic',
            state: function state() {
                return queryCommandState('italic');
            },
            result: function result() {
                return exec('italic');
            }
        },
        underline: {
            icon: '<u>U</u>',
            title: 'Underline',
            state: function state() {
                return queryCommandState('underline');
            },
            result: function result() {
                return exec('underline');
            }
        },
        strikethrough: {
            icon: '<strike>S</strike>',
            title: 'Strike-through',
            state: function state() {
                return queryCommandState('strikeThrough');
            },
            result: function result() {
                return exec('strikeThrough');
            }
        },
        heading1: {
            icon: '<b>H<sub>1</sub></b>',
            title: 'Heading 1',
            result: function result() {
                return exec(formatBlock, '<h1>');
            }
        },
        heading2: {
            icon: '<b>H<sub>2</sub></b>',
            title: 'Heading 2',
            result: function result() {
                return exec(formatBlock, '<h2>');
            }
        },
        paragraph: {
            icon: '&#182;',
            title: 'Paragraph',
            result: function result() {
                return exec(formatBlock, '<p>');
            }
        },
        quote: {
            icon: '&#8220; &#8221;',
            title: 'Quote',
            result: function result() {
                return exec(formatBlock, '<blockquote>');
            }
        },
        olist: {
            icon: '&#35;',
            title: 'Ordered List',
            result: function result() {
                return exec('insertOrderedList');
            }
        },
        ulist: {
            icon: '&#8226;',
            title: 'Unordered List',
            result: function result() {
                return exec('insertUnorderedList');
            }
        },
        code: {
            icon: '&lt;/&gt;',
            title: 'Code',
            result: function result() {
                return exec(formatBlock, '<pre>');
            }
        },
        line: {
            icon: '&#8213;',
            title: 'Horizontal Line',
            result: function result() {
                return exec('insertHorizontalRule');
            }
        },
        link: {
            icon: '&#128279;',
            title: 'Link',
            result: function result() {
                var url = window.prompt('Enter the link URL');
                if (url) exec('createLink', url);
            }
        },
        removeFormat: {
            icon: '&#164;',
            title: 'Clear formatting',
            result: function result() {
                return exec('removeFormat');
            }
        }/*,
        image: {
            icon: '&#128247;',
            title: 'Image',
            result: function result() {
                var url = window.prompt('Enter the image URL');
                if (url) exec('insertImage', url);
            }
        }*/
    };

    var defaultClasses = {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    };

    var init = function init(settings) {
        var actions = settings.actions ? settings.actions.map(function (action) {
            if (typeof action === 'string') return defaultActions[action];else if (defaultActions[action.name]) return _extends({}, defaultActions[action.name], action);
            return action;
        }) : Object.keys(defaultActions).map(function (action) {
            return defaultActions[action];
        });

        var classes = _extends({}, defaultClasses, settings.classes);

        var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';

        var actionbar = createElement('div');
        actionbar.className = classes.actionbar;
        appendChild(settings.element, actionbar);

        var content = settings.element.content = createElement('div');
        content.contentEditable = true;
        content.className = classes.content;
        content.oninput = function (_ref) {
            var firstChild = _ref.target.firstChild;

            if (firstChild && firstChild.nodeType === 3) exec(formatBlock, '<' + defaultParagraphSeparator + '>');else if (content.innerHTML === '<br>') content.innerHTML = '';
            settings.onChange(content.innerHTML);
        };
        content.onkeydown = function (event) {
            if (event.key === 'Tab') {
                event.preventDefault();
            } else if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
                setTimeout(function () {
                    return exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                }, 0);
            }
        };
        appendChild(settings.element, content);

        actions.forEach(function (action) {
            var button = createElement('button');
            button.className = classes.button;
            button.innerHTML = action.icon;
            button.title = action.title;
            button.setAttribute('type', 'button');
            button.onclick = function () {
                return action.result() && content.focus();
            };

            if (action.state) {
                var handler = function handler() {
                    return button.classList[action.state() ? 'add' : 'remove'](classes.selected);
                };
                addEventListener(content, 'keyup', handler);
                addEventListener(content, 'mouseup', handler);
                addEventListener(button, 'click', handler);
            }

            appendChild(actionbar, button);
        });

        if (settings.styleWithCSS) exec('styleWithCSS');
        exec(defaultParagraphSeparatorString, defaultParagraphSeparator);

        return settings.element;
    };

    var pell = { exec: exec, init: init };

    exports.exec = exec;
    exports.init = init;
    exports['default'] = pell;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
/**
 * filename: ContactFormController.js
 * developer: Domino
 * item: ContactForm
 * version: v1.0.0
 * date: 19. 6. 17
 */
DominoControllers.registerController( 'Domino.Validation', DCDominoController.extend( function( _super )  {
	return {
		'indexAction': function ( el, view, data ) {
		},
		'isValidEmailAddress': function ( emailAddress ) {
			"use strict";
			var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
			return pattern.test(emailAddress);
		},
		'form': function ( el ) {

			var validate = 0, isValid, newData = {}, newValue,
				arrAdd = 0;

			var formData = [];

			var elements = el.elements;
			for ( var e = 0; e < elements.length; e++) {
				if (elements[e].name.length) {
					formData.push(elements[e]);
				}
			}

			for (var i = 0; i < formData.length; i++) {
                var field = formData[i];
                var fieldValidate = field.getAttribute('data-validate'),
                    fieldValidateType = field.getAttribute('data-validate-type'),
                    fieldValidateMsg = field.getAttribute('data-validate-message'),
                    fieldLabel = field.parentNode,
                    fieldError = field.nextSibling,
                    fieldEncrypt = field.getAttribute('data-validate-encrypt');

                if (field.getAttribute('type') === 'checkbox') {

                    if ( field.checked == true )
                        newValue = true;
                    else
                        newValue = false;
                }
                else if (field.getAttribute('type') === 'radio') {

                    if ( field.checked )
                        newValue = field.value;

                }
                else {

                    if (fieldValidate === 'required' && !fieldValidateType) {

                        if (fieldValidateType === 'email') {
                            var emailValidate = this.isValidEmailAddress(field.value)
                            validate += (emailValidate === true) ? 0 : 1;
                            isValid = emailValidate;

                            if (!field.value)
                                fieldValidateMsg = 'Vpišite manjkajoči e-mail.';
                            else if (emailValidate === false)
                                fieldValidateMsg = "Vnešen e-mail ni pravilen."
                            newValue = field.value;
                        }
                        else {
                            validate += !field.value ? 1 : 0;
                            isValid = field.value ? true : false;
                            fieldValidateMsg = !fieldValidateMsg ? 'Manjkajoče polje' : fieldValidateMsg;
                            newValue = field.value;
                        }

                    }
                    else if ( (fieldValidate === 'required') && ( (fieldValidateType === 'password') || (fieldValidateType === 'password_retype') ) )  {

                        isValid = true;

                        if (field.value.length > 6)
                            validate += 0;
                        else {
                            validate += 1;
                            isValid = false;
                            fieldValidateMsg = !field.value ? 'Vpišite geslo' : 'Vaše geslo mora biti daljše od 6 znakov';

                        }
                        if (fieldValidateType === 'password')
                            var originalPassword = field.value;

                        if (fieldValidateType === 'password_retype') {
                            if (field.value !== originalPassword) {
                                fieldValidateMsg = 'Gesli morata biti identični';
                                validate += 1;
                                isValid = false;
                            }
                        }


                        if (fieldEncrypt === 'sha-256')
                            newValue = Sha256.hash(field.value);
                        else if (fieldEncrypt === 'md5')
                            newValue = CryptoJS.MD5(field.value).toString();
                        else
                            newValue = field.value;

                    }
                    else
                        newValue = field.value;

                    /*if (fieldLabel.length) {
                        if (isValid === false) {
                            //field.addClass("is-invalid-input");
                            //fieldLabel.addClass("is-invalid-label");
                            //if (fieldError.length)
                            //fieldError.addClass("is-visible");
                            //else
                            //field.after('<span class="form-error is-visible">' + fieldValidateMsg + '</span>');
                        }
                        else {
                            //field.className("is-invalid-input");
                            //fieldLabel.removeClass("is-invalid-label");
                            //fieldError.removeClass("is-visible");
                        }
                    }
					else
						newValue = field.value;*/
				}

				if (field.name.indexOf('[') === -1)
					newData[field.name] = newValue;
				else {
					var res = field.name.split("["),
						first_key = res[0],
						res_2 = res[1].split(']')[0],
						res_3 = res_2.replace(/'/g, ''),
						res_4 = res_3.replace(/"/g, '');

					if (typeof newData[first_key] === 'undefined')
						newData[first_key] = {};
					var theVal = ( res_4 ) ? res_4 : arrAdd++;

					newData[first_key][theVal] = newValue;
				}
			}

			// This when returns false should stop the ajax from sending
			if ( validate > 0 )
				return false;
			else
				return newData;
		},
		'onQueue': function ( field ) {
			"use strict";

			var validate = 0, isValid, newData = {},
				fieldValidate = field.getAttribute('data-validate'),
				fieldValidateType = field.getAttribute('data-validate-type'),
				fieldValidateMsg = field.getAttribute('data-validate-message'),
				fieldLabel = field,
				fieldError = field;

			if (fieldValidate === 'required') {

				if (fieldValidateType === 'email') {
					var emailValidate = this.isValidEmailAddress(field.value);
					validate += ( emailValidate === true ) ? 0 : 1;
					isValid = emailValidate;

					if (!field.value)
						fieldValidateMsg = 'Vpišite manjkajoči e-mail.';
					else if (emailValidate === false)
						fieldValidateMsg = "Vnešen e-mail ni pravilen."

				}
				else if (( fieldValidateType === 'password') || ( fieldValidateType === 'password_retype' )) {

					isValid = true;

					if (field.value.length > 6)
						validate += 0;
					else {
						validate += 1;
						isValid = false;
						fieldValidateMsg = !field.value ? 'Vpišite geslo' : 'Vaše geslo mora biti daljše od 6 znakov';

					}


					if (fieldValidateType === 'password_retype') {
						var binder = field.attr("data-validate-bind");
						var originalPassword = $('input[name="' + binder + '"]').val();
						isValid = true;
						if (field.value !== originalPassword) {
							fieldValidateMsg = 'Gesli morata biti identični';
							validate += 1;
							isValid = false;
						}
					}

				}
				else {
					validate += !field.value ? 1 : 0;
					isValid = field.value ? true : false;
					fieldValidateMsg = !fieldValidateMsg ? 'Manjkajoče polje' : fieldValidateMsg;
				}

				if (fieldLabel.length) {
					if (isValid === false) {
						//field.addClass("is-invalid-input");
						//fieldLabel.addClass("is-invalid-label");
						//if (fieldError.length)
							//fieldError.addClass("is-visible");
						//else
							//field.after('<span class="form-error is-visible">' + fieldValidateMsg + '</span>');
					}
					else {
						//field.removeClass("is-invalid-input");
						//fieldLabel.removeClass("is-invalid-label");
						//fieldError.removeClass("is-visible");
					}
				}

			}


			if (validate > 0)
				return false;
			else
				return newData;
		}
	}

}));


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-256 implementation in JavaScript                (c) Chris Veness 2002-2014 / MIT Licence  */
/*                                                                                                */
/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';

var Sha256 = {};

Sha256.hash = function(msg) {
	// convert string to UTF-8, as SHA only deals with byte-streams
	msg = msg.utf8Encode();

	// constants [§4.2.2]
	var K = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];
	// initial hash value [§5.3.1]
	var H = [
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

	// PREPROCESSING

	msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

	// convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
	var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
	var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
	var M = new Array(N);

	for (var i=0; i<N; i++) {
		M[i] = new Array(16);
		for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
			M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
				(msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
		} // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
	}
	// add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
	// note: most significant word would be (len-1)*8 >>> 32, but since JS converts
	// bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
	M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
	M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


	// HASH COMPUTATION [§6.1.2]

	var W = new Array(64); var a, b, c, d, e, f, g, h;
	for (var i=0; i<N; i++) {

		// 1 - prepare message schedule 'W'
		for (var t=0;  t<16; t++) W[t] = M[i][t];
		for (var t=16; t<64; t++) W[t] = (Sha256.σ1(W[t-2]) + W[t-7] + Sha256.σ0(W[t-15]) + W[t-16]) & 0xffffffff;

		// 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
		a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

		// 3 - main loop (note 'addition modulo 2^32')
		for (var t=0; t<64; t++) {
			var T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
			var T2 =     Sha256.Σ0(a) + Sha256.Maj(a, b, c);
			h = g;
			g = f;
			f = e;
			e = (d + T1) & 0xffffffff;
			d = c;
			c = b;
			b = a;
			a = (T1 + T2) & 0xffffffff;
		}
		// 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
		H[0] = (H[0]+a) & 0xffffffff;
		H[1] = (H[1]+b) & 0xffffffff;
		H[2] = (H[2]+c) & 0xffffffff;
		H[3] = (H[3]+d) & 0xffffffff;
		H[4] = (H[4]+e) & 0xffffffff;
		H[5] = (H[5]+f) & 0xffffffff;
		H[6] = (H[6]+g) & 0xffffffff;
		H[7] = (H[7]+h) & 0xffffffff;
	}

	return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) +
		Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
};
Sha256.ROTR = function(n, x) {
	return (x >>> n) | (x << (32-n));
};
Sha256.Σ0  = function(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); };
Sha256.Σ1  = function(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); };
Sha256.σ0  = function(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  };
Sha256.σ1  = function(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); };
Sha256.Ch  = function(x, y, z) { return (x & y) ^ (~x & z); };
Sha256.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };
Sha256.toHexStr = function(n) {
	// note can't use toString(16) as it is implementation-dependant,
	// and in IE returns signed numbers when used on full words
	var s="", v;
	for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
	return s;
};
if (typeof String.prototype.utf8Encode == 'undefined') {
	String.prototype.utf8Encode = function() {
		return unescape( encodeURIComponent( this ) );
	};
}
if (typeof String.prototype.utf8Decode == 'undefined') {
	String.prototype.utf8Decode = function() {
		try {
			return decodeURIComponent( escape( this ) );
		} catch (e) {
			return this; // invalid UTF-8? return as-is
		}
	};
}
if (typeof module != 'undefined' && module.exports) module.exports = Sha256; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Sha256; }); // AMD
DominoViews.registerView( 'Domino.Admin', function( data ) {	"use strict";	return {tag: "div", attrs: {}, children: [		{tag: "div", attrs: {}, className:"frontPage", children: [			{tag: "div", attrs: {}, className:"overlay", children: [			br("component", {view:"Domino.Admin.Header"}), 				br("component", {view:"Domino.Admin.BreadCrumbs"}), 			{tag: "div", attrs: {id:"inner"}, className:"inner"}		]}        ]}, 		br("component", {view:"Domino.Admin.Footer"})	]}} );


DominoControllers.registerController( 'Domino.Admin', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( el, view, data ) {

			if ( data.auth !== true )
				DominoApp.redirect( data.redirect );

		}
	}
} ) );
DominoViews.registerView( 'Domino.Admin.BreadCrumbs', function( data ) {	"use strict";	return {tag: "nav", attrs: {}, className:"domino-admin-breadcrumbs", children: [              {tag: "ul", attrs: {}, children: [                {tag: "li", attrs: {}, children: [                  {tag: "a", attrs: {href:"/domino"}, children: [                    {tag: "span", attrs: {}, className:"icon-domino"}                  ]}                ]},                    (function () {                      if ( data.entries ) {                          var ret = [];                          for (var i = 0; i < data.entries.length; i++ ) {                              var entry = data.entries[i];                              ret.push({tag: "li", attrs: {}, children: [                                  {tag: "a", attrs: {href: entry.link,title: entry.name}, children: [                                      {tag: "span", attrs: {}, className: 'icon-' + entry.icon},                                       {tag: "span", attrs: {}, className:"name", children: [ entry.name]}                                  ]}                              ]});                          }                          return ret;                      }                  })()               ]}            ]}} );


DominoControllers.registerController( 'Domino.Admin.BreadCrumbs', DCDominoController.extend( function( _super ) {
	return {
        'indexAction': function ( el, view, data ) {

            var self = this;
            el.style.display = 'none';

        },
        'refreshAction': function ( el, view, data ) {

            var self = this;

            if ( data.hide )
                DCUtil.fadeOut( el, 1000, "Ease-In-Out" );
            else {
                if ( el.style.display == 'none' )
                    DCUtil.fadeIn( el, 1000, "Ease-In-Out" );
            }

            var docFragment = document.createElement('ul');
            for ( var i = 0; i < data.entries.length; i++) {
                var entry = data.entries[i];

                var li = document.createElement("LI");
                var a = document.createElement("A");
                a.href = entry.link;
                if ( entry.icon ) {
                    var span = document.createElement("SPAN");
                    span.className = 'icon-' + entry.icon;
                    //span.innerText = '';
                    a.appendChild( span );
                }
                var span = document.createElement("SPAN");
                span.className = 'name';
                span.innerText = entry.name;
                a.appendChild( span );
                li.appendChild( a );
                docFragment.appendChild( li );
            }
            el.querySelector('ul').innerHTML = docFragment.innerHTML;


        }
	}
} ) );
DominoViews.registerView( 'Domino.Admin.Footer', function( data ) {	"use strict";	return {tag: "footer", attrs: {}, className:"domino-admin-footer", children: [		{tag: "div", attrs: {}, children: [
            "© ", data.year," ",{tag: "a", attrs: {href:"http://www.dominocms.com",target:"_blank"}, className:"footer-link", children: [ data.text]}, ", ", 'v' + data.ver," | ",{tag: "a", attrs: {href: data.license,target:"_blank"}, className:"footer-link", children: ["License"]}		]}	]}} );

DominoControllers.registerController( 'Domino.Admin.Footer', DCDominoController.extend( function( _super )  {
	return {
		'indexAction': function ( el, view, data ) {


		}
	}
}));
DominoViews.registerView( 'Domino.Admin.Front', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-admin-link-grid", children: [            {tag: "div", attrs: {}, className:"in", children: [                {tag: "div", attrs: {}, className:"grid-x grid-padding-x grid-container", children: [                    {tag: "div", attrs: {}, className:"small-12 cell title", children: [                        {tag: "h1", attrs: {}, children: ["Create your Future."]}                    ]}                ]},                 {tag: "div", attrs: {}, className:"grid-x grid-padding-x grid-container", children: [                     (function () {                        var ret = [];                        for ( var i = 0; i < data.entries.length; i++ ) {                            var entry = data.entries[i];                            ret.push({tag: "div", attrs: {}, className:"small-12 medium-6 large-3 cell front-buttons", children: [                                {tag: "a", attrs: {href: entry.link}, className:"holder", children: [                                    {tag: "span", attrs: {}, className: 'icon-' + entry.icon},                                     {tag: "span", attrs: {}, className:"name", children: [ entry.name]},                                     {tag: "span", attrs: {}, className:"desc", children: [ entry.subtitle]}                                ]}                            ]});                        }                        return ret;                    })()                 ]}            ]}        ]}} );

DominoControllers.registerController( 'Domino.Admin.Front', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            /*
                        if ( data.data.type === 'identity' ) {
                            var actionsHolder = el.find('.DominoActions');
                            new DominoActions(actionsHolder, {
                                    buttons: options.data.actions
                                }
                            );
                        }
            */

        }
    }
} ) );
DominoViews.registerView( 'Domino.Admin.Header', function( data ) {	"use strict";	return {tag: "header", attrs: {}, className:"domino-admin-header", children: [			br("component", {view:"Domino.Admin.Header.Logo"}), 			br("component", {view:"Domino.Admin.Header.Buttons"}), 			br("component", {view:"Domino.Admin.Header.Search"}),         	br("component", {view:"Domino.Admin.Header.Actions"}), 			br("component", {view:"Domino.Admin.Header.Account"})		]}} );


DominoControllers.registerController( 'Domino.Admin.Header', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( el, view, data ) {


		}
	}
} ) );
DominoViews.registerView( 'Domino.Admin.Header.Account', function( data ) {	"use strict";	if ( data.auth === true )		return {tag: "div", attrs: {}, children: [					{tag: "nav", attrs: {}, className:"header-button right", children: [						{tag: "dt", attrs: {}, children: [							{tag: "a", attrs: {id:"ButtonAccount",href:"#",title:"Uporabniški meni"}, className:"DominoTooltip", children: [								 (function () {									if ( data.pic )										return {tag: "span", attrs: {}, className:"image hide-for-small-only",style: 'background-image:url(' + pic + ');'};										else										return {tag: "span", attrs: {}, className:"image hide-for-small-only"}								})(),							  {tag: "span", attrs: {}, className:"name hide-for-small-only", children: [ data.auth_name," ", data.auth_surname]}, 							  {tag: "span", attrs: {}, className:"icon-login"}							]}						]}, 						{tag: "dd", attrs: {id:"account-list"}, className:"rt", children: [							{tag: "ul", attrs: {}, children: [							 (function () {								if ( data.entries ) {										var ret = [];										for ( var e = 0; e < data.entries.length; e++ ) {											var menu = data.entries[ e ];											ret.push( {tag: "li", attrs: {}, children: [												{tag: "a", attrs: {href: menu.link}, children: [{tag: "span", attrs: {}, className:"icon-{ menu.icon }"},  menu.name]}											]} );										}										return ret;								}							})() 							]}						]}					]}				]}} );


DominoControllers.registerController( 'Domino.Admin.Header.Account', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            if ( data.auth === true ) {

                var ButtonAccount = document.getElementById('ButtonAccount'),
                    itemsList = document.getElementById('account-list');

                this.onEvent( ButtonAccount, 'click', function( ev ) {
                    if (itemsList.style.display == 'none' || !itemsList.style.display )
                        itemsList.style.display = 'block';
                    else
                        itemsList.style.display = 'none';
                    return false;
                } );

                this.onEvent( itemsList.childNodes, 'click', function( ev ) {
                    itemsList.style.display = 'none';
                    return false;
                } );


                var onConfirm = function() {
                    DominoApp.redirect( data.entries[1].link );
                };
                this.onEvent( document.querySelector('.BtnLogout'), 'click', function( ev ) {
                    ev.preventDefault();
                    DominoApp.redirect( data.logout.link );

                    new DominoAlert(self, {
                        Title: "Odjava iz Domina",
                        Desc: "Se res želim odjaviti?",
                        Confirm: true,
                        Dismiss: true,
                        onConfirm: onConfirm
                    });
                });

                document.body.onclick = function( e ) {
                    if ( !ButtonAccount.contains(e.target) )
                        itemsList.style.display = 'none';

                    if ( !document.getElementById('buttonModules').contains(e.target) )
                        document.getElementById('modules-list').style.display = 'none';
                    if ( !document.querySelector('.search-holder').contains(e.target) )
                        document.querySelector('.results').style.display = 'none';


                }

            }

        }
    }
} ) );



DominoViews.registerView( 'Domino.Admin.Header.Actions', function( data ) {	"use strict";	return {tag: "nav", attrs: {}, className:"deploy", children: [			{tag: "dt", attrs: {}, children: [				{tag: "a", attrs: {id:"button-export",href:"#",title:"Deploy"}, children: [					{tag: "span", attrs: {}, className:"icon-export"}				]}			]}, 			{tag: "dd", attrs: {}, children: [				{tag: "ul", attrs: {}, className:"hide", children: [					{tag: "li", attrs: {}, children: [						{tag: "a", attrs: {name:"deployLink","data-id":"app",href:"#"}, children: [
							"app"
						]}					]}, 					{tag: "li", attrs: {}, children: [						{tag: "a", attrs: {name:"deployLink","data-id":"css",href:"#"}, children: [
							"css"
						]}					]}				]}			]}		]}	} );


DominoControllers.registerController( 'Domino.Admin.Header.Actions', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {


         var buttonExport = el.querySelector('dt').firstChild,
             itemsList = el.querySelector('dd').firstChild;

         this.onEvent( buttonExport, 'click', function( ev ) {

             if ( itemsList.className == 'hide' )
                 itemsList.className = '';
             else
                 itemsList.className = 'hide';

             return false;
         } );

         this.onEvent( document.getElementsByName('deployLink'), 'click', function( ev ) {
          ev.preventDefault();
          var self = this,
              type = self.getAttribute('data-id');

          self.setAttribute('class','red')
          DominoApp.ajax({
           view: view,
           action: 'deploy',
           data: {
            'type': type
           }
          }).then( function( data ) {
           self.setAttribute('class','green')

           setTimeout(function(){
            self.removeAttribute("class");
           }, 3000);

          }, function( errorResponse ) {
          } );

         } );

         /*document.addEventListener('click', function(event) {
             var isClickInside = el.contains(event.target);

             if (!isClickInside) {
                 results.style.display = 'none';
             }
         });*/

        }
    }
} ) );



DominoViews.registerView( 'Domino.Admin.Header.Buttons', function( data ) {	"use strict";	return {tag: "div", attrs: {}, children: [		{tag: "nav", attrs: {}, className:"header-button", children: [			{tag: "dt", attrs: {}, className:"w40", children: [				{tag: "a", attrs: {id:"buttonModules",href:"#",title:"Select module"}, className:"domino-tooltip", children: [					{tag: "span", attrs: {}, className:"icon-list"}				]}			]}, 			{tag: "dd", attrs: {id:"modules-list"}			}		]}	]}});


DominoControllers.registerController( 'Domino.Admin.Header.Buttons', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {

         if ( data.auth === true ) {
             var buttonModules = document.getElementById('buttonModules'),
                 modulesList = document.getElementById('modules-list');

             this.onEvent(buttonModules, 'click', function (ev) {

                 if (modulesList.style.display == 'none' || !modulesList.style.display)
                     modulesList.style.display = 'block';
                 else
                     modulesList.style.display = 'none';
                 return false;
             });
         }

        },
        'refreshAction': function ( el, view, data ) {
             "use strict";

            if ( data.auth === true ) {
                var modulesList = document.getElementById('modules-list');

                document.getElementById('buttonModules').className = 'domino-tooltip';

                var pages = 4;

                var ret = '<ul>';
                for (var i = 0; i < data.modules.length; i++) {
                    var menu = data.modules[i];
                    ret += '<li><a href="' + menu.link + '"><span class="icon-' + menu.icon + '"></span>' + menu.name + '</a></li>';
                }
                ret += '</ul>';
                modulesList.innerHTML = ret;

                this.onEvent(modulesList.childNodes, 'click', function (ev) {
                    modulesList.style.display = 'none';
                    return false;
                });
            }

        }
    }
} ) );


DominoViews.registerView( 'Domino.Admin.Header.Logo', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"logo", children: [			{tag: "a", attrs: {href: data.url}}		]}} );


DominoControllers.registerController( 'Domino.Admin.Header.Logo', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


        }
    }
} ) );



DominoViews.registerView( 'Domino.Admin.Header.Search', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"search", children: [				{tag: "div", attrs: {}, className:"search-holder", children: [					{tag: "form", attrs: {name:"DSearch",method:"post",action:""}, children: [						{tag: "div", attrs: {}, className:"focus", children: [							{tag: "div", attrs: {}, className:"icon", children: [								{tag: "a", attrs: {id:"DSearchFocus",href:"#"}, className:"icon-search"}							]}						]}, 						{tag: "input", attrs: {type:"text",name:"SearchTerm",id:"SearchInput",placeholder:"Išči svojo identiteto ...",title: data.trans.search,autocomplete:"off"}}, 						{tag: "div", attrs: {}, className:"results", children: [							{tag: "div", attrs: {id:"SrcNotify"}, className:"title", children: ["Za iskanje vnesite vsaj 2 znaka ..."]}, 							{tag: "ul", attrs: {}, className:"entries"}						]}						]}				]}			]}	} );


DominoControllers.registerController( 'Domino.Admin.Header.Search', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {


         var self = this,
             searchInput = el.querySelector( 'input' ),
             searchButton = document.getElementById( 'DSearchFocus' ),
             results = document.querySelector( '.results' ),
             entries = document.querySelector( '.entries' ),
             input = document.querySelector('input[name=SearchTerm]'),
             mainContainer = document.querySelector('.search'),
             ButtonSearch = document.querySelector('dt');
         var resultsTitle = el.querySelector('.title');
         var entries = el.querySelector('.entries');

         self.onEvent( input , 'focus', function( ev ) {
          ev.preventDefault();
           results.style.display = 'block';

           //if( $('.DSearchForm .results').length )
            //$('.DSearchForm .results').css('display', 'block');
           //if( $('#SrcNotify').length ===  0 )
            //

         });


         var currentRequest = null;
         var delay = (function(){
             var timer = 0;
             return function(callback, ms){
                 clearTimeout (timer);
                 timer = setTimeout(callback, ms);
             };
         })();

         self.onEvent( input , 'keyup', function( ev ) {
             ev.preventDefault();

             var selfie = this;

             if( selfie.value.length < 2 ) {
                 resultsTitle.innerHTML = 'Za iskanje vnesite vsaj 2 znaka ...';
                 //$('.entries').remove();
             }
             else {
                 resultsTitle.innerHTML = 'Iskanje poteka';
                 if (currentRequest != null) {
                     currentRequest.abort();
                 }
             }

             delay(function(){

                 currentRequest = DominoApp.ajax({
                     view: view,
                     action: 'search',
                     data: {
                         'query': selfie.value
                     }
                 }).then( function( success ) {

                     if ( success.entries.length == 0 )
                         resultsTitle.innerHTML = 'Ni rezultatov, vpišite drug niz';
                     else
                         resultsTitle.innerHTML = 'Rezultati iskanja';


                     var ret = '';
                     if ( success.entries.length > 0 )
                         for ( var i = 0; i < success.entries.length; i++ ) {
                            var val = success.entries[i];
                            ret += '<li>';
                            ret += '<a href="' + val.link + '" title="' + val.name + '">';
                            ret += ( val.image_tag ) ? val.image_tag : '';
                            ret += '<strong>' + val.name + '</strong>';
                            ret += ( val.summary && val.summary.length ) ? '<br /><span>' + val.summary + '</span>' : '';
                            ret += '</a>';
                            ret += '</li>';
                         }
                     entries.innerHTML = ret;

                     self.onEvent( entries.querySelectorAll('a'), 'click', function( ev ) {
                         results.style.display = 'none';
                     });

                 });


             }, 300);


         });





        // window.addEventListener('mouseup', function(e) {

         // var target = getAncestor(event.target, mainContainer);
         // if (target !== null) {
          /// alert(target.nodeName);
          ///}

          //if ( (!mainContainer.is(e.target) && mainContainer.has(e.target).length === 0) && (!ButtonSearch.is(e.target) && ButtonSearch.has(e.target).length === 0) && (ContVal == '1px') ) {
            //mainContainer.style.display = 'none';
           //}
         /*
            var container = $(".DSearchForm");
            if ( (!container.is(e.target) && container.has(e.target).length === 0)) {
            $(".DSearchForm .results").hide();
            }
            */

       // }, false);


         self.onEvent( searchButton, 'click', function( ev ) {
          ev.preventDefault();

          DominoApp.ajax({
           view: 'Domino.Admin.Header.Search',
           action: 'search',
           data: {
            'query': searchInput.value
           }
          }).then( function( data ) {

           var l_cat = "";
           var arr_null_cat = [];
           var srcNotify = document.getElementById( 'SrcNotify' );
           //entries.remove();

           if ( ( typeof data == 'undefined' ) || ( data.length == 0 ) )
            srcNotify.innerHTML = 'Ni rezultatov, vpišite drug niz';
           else
            srcNotify.innerHTML = 'Rezultati iskanja';


           var content = '';
           for ( var i = 0; i < data.length; i++ ) {
            var val = data[i];
            content += '<li class="entries"><a class="IdentEntries" href="' + val.link + '" title="' + val.name + '">' + ((val.image_tag)?val.image_tag:'') + '<span><strong>' + val.name + '</strong>' + ((val.summary && val.summary.length)?'<br>'+val.summary:'') + '</span></a></li>';
           }

           srcNotify.innerHTML = content;



           var insert_func = function( key, val ) {
            if( val.category != l_cat ) {
             results.append('<li class="title entries">' + val.category + '</li>');
             l_cat = val.category;
            }


           };



          }, function( errorResponse ) {
          } );


         } );



         document.addEventListener('click', function(event) {
             var isClickInside = el.contains(event.target);

             if (!isClickInside) {
                 results.style.display = 'none';
             }
         });




        }
    }
} ) );



DominoViews.registerView( 'Domino.Admin.Identities', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"grid-container", children: [				br("component", {view:"Domino.Admin.Entry.List",componentData:data })			]}} );


DominoControllers.registerController( 'Domino.Admin.Identities', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {



        }
    }
} ) );

DominoViews.registerView( 'Domino.Admin.LinkGrid', function( data ) {	"use strict";	return 	{tag: "div", attrs: {}, className:"domino-admin-link-grid", children: [                {tag: "div", attrs: {}, className:"in", children: [                    {tag: "div", attrs: {}, className:"grid-x grid-padding-x grid-container", children: [                        {tag: "div", attrs: {}, className:"small-12 cell title", children: [                                {tag: "h1", attrs: {}, children: [ data.title]}                            ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x grid-padding-x grid-container", children: [                             (function () {                                var ret = [];                                for ( var i = 0; i < data.entries.length; i++ ) {                                    var entry = data.entries[i];                                    ret.push({tag: "div", attrs: {}, className:"small-12 medium-6 large-3 cell front-buttons", children: [                                        {tag: "a", attrs: {href: entry.link}, className:"holder", children: [                                            {tag: "span", attrs: {}, className: 'icon-' + entry.icon},                                             {tag: "span", attrs: {}, className:"name", children: [ entry.name]},                                             {tag: "span", attrs: {}, className:"desc", children: [ entry.subtitle]}                                        ]}                                    ]});                                }                                return ret;                            })()                         ]}                ]}        ]}} );



DominoControllers.registerController( 'Domino.Admin.LinkGrid', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {



        }
    }
} ) );
DominoViews.registerView( 'Domino.Admin.Loading', function( data ) {
    "use strict";
	return {tag: "div", attrs: {}, className:"domino-admin-loading", children: [
		{tag: "div", attrs: {}, className:"in", children: [
			{tag: "p", attrs: {}, children: ["Create your Future."]}
		]}
	]};
} );


DominoControllers.registerController( 'Domino.Admin.Loading', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            //data.elementquerySelector('p').fadeOut( 2000, function () {});

            setTimeout( function() {
                DominoApp.redirect( data.redirect );
            }, 2000);


        }
    }
} ) );
DominoViews.registerView( 'Domino.Admin.Login', function( data ) {
    "use strict";
	return {tag: "div", attrs: {}, children: [
			{tag: "div", attrs: {}, className:"frontPage domino-admin-login", children: [
                {tag: "div", attrs: {}, className:"overlay", children: [
				{tag: "div", attrs: {id:"inner"}}
			]}
            ]}, 
			br("component", {view:"Domino.Admin.Footer"})
		]};
} );

DominoControllers.registerController( 'Domino.Admin.Login', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( el, view, data ) {

			if ( data.auth === true )
				DominoApp.redirect(data.redirect);

		}
	}
} ) );
DominoViews.registerView( 'Domino.Admin.Login.Logo', function( params ) {
	return {tag: "div", attrs: {}, className:"loginLogo", children: [
		{tag: "a", attrs: {href:"/domino"}}
	]};
} );


DominoControllers.registerController( 'Domino.Admin.Login.Logo', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( el, view, data ) {


		}
	}
} ) );
DominoViews.registerView('Domino.Admin.Login.Form', function (data) {
    "use strict";
    return {tag: "form", attrs: {id:"loginForm"}, children: [
        {tag: "div", attrs: {}, className:"loginForm", children: [
            {tag: "div", attrs: {}, className:"in", children: [
                br("component", {view:"Domino.Admin.Login.Logo"}), 
                {tag: "div", attrs: {}, className:"box", children: [
                    {tag: "div", attrs: {}, className:"grid-x grid-padding-x", children: [
                        {tag: "div", attrs: {}, className:"small-12 cell", children: [
                            {tag: "label", attrs: {}, children: [
                                {tag: "input", attrs: {type:"text",name:"username",placeholder:data.trans.emailUsername,"data-validate":"required","data-validate-message":data.trans.enterUsernameEmail}}
                            ]}
                        ]}
                    ]}, 
                    {tag: "div", attrs: {}, className:"grid-x grid-padding-x ", children: [
                        {tag: "div", attrs: {}, className:"small-8 cell end", children: [
                            {tag: "label", attrs: {}, children: [
                                {tag: "input", attrs: {type:"password",name:"password",placeholder:data.trans.password,"data-validate":"required","data-validate-type":"password","data-validate-encrypt":"sha-256","data-validate-message":data.trans.enterPassword}}
                            ]}
                        ]}, 
                        {tag: "div", attrs: {}, className:"small-4 cell", children: [
                            {tag: "button", attrs: {type:"submit"}, className:"button expanded", children: [
                                data.trans.loginSubmit
                            ]}
                        ]}
                    ]}, 
                    {tag: "div", attrs: {}, className:"loadingHolder"}, 
                    {tag: "div", attrs: {}, className:"loginFailed", children: [data.trans.userPasswordIncorrect]}

                ]}, 
                {tag: "div", attrs: {}, className:"created", children: ["Created by Dominik Černelič"]}
            ]}
        ]}
    ]};
});


DominoControllers.registerController( 'Domino.Admin.Login.Form', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( el, view, data ) {

			var self = this;
			var loginFailed = el.querySelector(".loginFailed"),
				buttonSubmit = el.querySelector('button[type="submit"]'),
				loadingHolder = el.querySelector(".loadingHolder");


			var formModule = document.getElementById("loginForm");

			self.onEvent( document.querySelector( '.button' ), 'click', function( ev ) {
				ev.preventDefault();

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( formModule );

				DominoApp.ajax({
					view: view,
					action: 'login',
					data: validateFormData
				}).then( function( data ) {

					//processing.remove(loadingHolder);
					if ( data.success ) {
						//loginFailed.show();
					}
					else
						DominoApp.redirect( data.redirect );


				}, function( errorResponse ) {
					// TODO: handle error
					console.log("we don't got it");
				} );


			} );



		}
	}
} ) );
DominoViews.registerView( 'Domino.Admin.Logout', function( data ) {
    "use strict";
	return {tag: "div", attrs: {}, className:"domino-admin-logout", children: [
			{tag: "div", attrs: {}, className:"in", children: [
				{tag: "h1", attrs: {}, children: ["See you soon."]}
    		]}
		]};
} );


DominoControllers.registerController( 'Domino.Admin.Logout', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            //data.elementquerySelector('p').fadeOut( 2000, function () {});
            //$( ".LogoutQuotes" ).fadeOut( 3000, function() {});

            setTimeout( function() {
                DominoApp.redirect( data.redirect );
            }, 3000);



        }
    }
} ) );

DominoViews.registerView( 'Domino.Admin.Modules', function( data ) {	"use strict";    return {tag: "div", attrs: {}, className:"grid-container domino-spacer", children: [			 (function () {				var ret = [];				if ( data.display == 'edit' )					ret.push( br("component", {view:"Domino.Admin.Entry.Edit",componentData: data.component}) );				else                    ret.push( br("component", {view:"Domino.Admin.Entry.List",componentData: data.component}) );				return ret;			})() 		]}} );


DominoControllers.registerController( 'Domino.Admin.Modules', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


        }
    }
} ) );

DominoViews.registerView( 'Domino.Admin.Sitemap', function( data ) {	"use strict";	return {tag: "div", attrs: {}, children: [	{tag: "div", attrs: {}, className:"grid-x grid-container grid-padding-x", children: [				{tag: "div", attrs: {}, className:"small-12 cell", children: [					{tag: "div", attrs: {}, className:"domino-spacer"}, 					{tag: "h1", attrs: {}, children: ["Vsebinsko drevo"]}, 					{tag: "div", attrs: {}, className:"grid-x", children: [						{tag: "div", attrs: {}, className:"large-6 cell", children: [                            br("component", {view:"Domino.Admin.Entry.List",componentData:data })							]}, 						{tag: "div", attrs: {}, className:"large-6 cell"						}					]}				]}			]}		]}} );


DominoControllers.registerController( 'Domino.Admin.Sitemap', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


        }
    }
} ) );

DominoViews.registerView( 'Domino.Admin.Entry.Edit', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-entryedit", children: [        {tag: "form", attrs: {id:"editForm",method:"post",enctype:"multipart/form-data"}, children: [             (function () {                var ret = [];                if ( data.actions )                    ret.push(br("component", {view:"Domino.Admin.Entry.List.Actions",componentData: data.actions}));                if ( data.subactions )                    ret.push(br("component", {view:"Domino.Admin.Entry.List.SubActions",componentData: data.subactions}));                return ret;            })(),            br("component", {view:"Domino.Admin.Entry.Edit.Title",componentData: data.title}),             {tag: "div", attrs: {}, className:"domino-entryedit-body", children: [             (function () {                var ret = [];                for (var i = 0; i < data.structure.length; i++) {                    var componentData = data.structure[i];                    componentData['dimensions'] = data.dimensions;                    ret.push(br("component", {view: 'Domino.Admin.Entry.Edit.Field.' + componentData.elementItem,componentData:componentData }));                }                return ret;ss            })()             ]}        ]}    ]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit', DCDominoController.extend( function( _super ) {
    return {

        'indexAction': function ( el, view, data ) {
            "use strict";

            var self = this;

            self.onEvent( document.querySelectorAll('input,textarea'), 'focus', function (ev) {
                ev.preventDefault();

                var saveAction = document.getElementById('saveAction');

                if ( saveAction )
                    saveAction.className = '';

                var createAction = document.getElementById('createAction');
                if ( createAction )
                    createAction.className = '';

                var updateAction = document.getElementById('updateAction');
                if ( updateAction )
                    updateAction.className = '';

                var createOpenAction = document.getElementById('createOpenAction');
                if ( createOpenAction )
                    createOpenAction.className = '';


            });

            self.onEvent(document.getElementById('updateAction'), 'click', function (ev) {
                ev.preventDefault();


                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('editForm') );

                if ( validateFormData !== false ) {
                    this.className = "disabled";
                    DominoApp.ajax({
                        view: view,
                        action: 'update',
                        data: {
                            'options': data.options,
                            'formData': validateFormData
                        }
                    }).then( function( success ) {


                        DominoApp.redirect( data.actions.buttons.back.link );

                    });
                }



            });
            self.onEvent(document.getElementById('saveAction'), 'click', function (ev) {
                ev.preventDefault();

                if ( this.className != 'disabled' ) {

                    var DominoValidation = new DominoAppControllers['Domino.Validation']();
                    var validateFormData = DominoValidation.form( document.getElementById('editForm') );


                    if ( validateFormData !== false ) {

                        this.className = "disabled";

                        DominoApp.ajax({
                            view: view,
                            action: 'update',
                            data: {
                                'options': data.options,
                                'formData': validateFormData
                            }
                        }).then(function (success) {


                        });
                    }

                }

            });

            self.onEvent(document.getElementById('createAction'), 'click', function (ev) {
                ev.preventDefault();

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('editForm') );

                if ( validateFormData !== false ) {

                    DominoApp.ajax({
                        view: view,
                        action: 'create',
                        data: {
                            'options': data.options,
                            'open': false,
                            'formData': validateFormData
                        }
                    }).then(function (success) {


                        DominoApp.redirect(data.actions.buttons.back.link);

                    });
                }

            });

            self.onEvent(document.getElementById('createOpenAction'), 'click', function (ev) {
                ev.preventDefault();

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('editForm') );

                if ( validateFormData !== false ) {

                    DominoApp.ajax({
                        view: view,
                        action: 'create',
                        data: {
                            'options': data.options,
                            'open': true,
                            'formData': validateFormData
                        }
                    }).then(function (success) {


                        DominoApp.redirect(success.link);

                    });
                }

            });

            self.onEvent(document.getElementById('sitemapAction'), 'click', function (ev) {
                ev.preventDefault();



                DominoApp.ajax({
                    view: view,
                    action: 'sitemap',
                    data: {}
                }).then( function( success ) {

                    alert('Sitemap updated successfuly!');

                });


            });

            self.onEvent(document.getElementById('translateAction'), 'click', function (ev) {
                ev.preventDefault();


                DominoApp.ajax({
                    view: view,
                    action: 'translate',
                    data: {
                        id: data.options.id
                    }
                }).then( function( success ) {

                    //alert('Translated successfuly');

                });


            });

        }

    }
    } ) );

DominoViews.registerView( 'Domino.Admin.Entry.List', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-entry-list", children: [         (function () {            var ret = [];            if ( data.actions )                ret.push(br("component", {view:"Domino.Admin.Entry.List.Actions",componentData: data.actions}));            if ( data.subactions )                ret.push(br("component", {view:"Domino.Admin.Entry.List.SubActions",componentData: data.subactions}));            return ret;        })(),		br("component", {view:"Domino.Admin.Entry.List.List",componentData: data.list})	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this,
                filterEntries = el.querySelector( '.filterEntries' );

            // Filter Entries

            var currentRequest = null;
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            // Filter entries

            self.onEvent( filterEntries , 'keyup', function( ev ) {
                ev.preventDefault();

                var selfie = this;

                if( selfie.value.length < 2 ) {
                    //resultsTitle.innerHTML = 'Za iskanje vnesite vsaj 2 znaka ...';
                    //$('.entries').remove();
                }
                else {
                    //resultsTitle.innerHTML = 'Iskanje poteka';
                    if (currentRequest != null) {
                        currentRequest.abort();
                    }
                }

                delay(function(){

                    currentRequest = DominoApp.ajax({
                        view: view,
                        action: 'filterEntries',
                        data: {
                            'list': data.list,
                            'query': selfie.value
                        }
                    }).then( function( success ) {


                        var view = el.querySelector('[view="Domino.Admin.Entry.List.List.Entries"]');

                        DominoApp.renderView( view, 'Domino.Admin.Entry.List.List.Entries', success.list );

                    });


                }, 300);


            });




        }
    }
} ) );
DominoViews.registerView( 'Domino.Admin.Entry.Selector', function( data ) {	"use strict";	var id = data.id ? data.id : '';    var icon = data.icon ? data.icon : 'icon-arrow_up';	return {tag: "div", attrs: {id:id }, className:"domino-miniselector", children: [		{tag: "dt", attrs: {}, children: [			{tag: "a", attrs: {href:"#"}, className:"add-button", children: [				{tag: "span", attrs: {}, className:icon }			]},              (function () {                var ret = [];                if ( data.form ) {                    var type = data.form.type ? data.form.type : 'hidden';                    ret.push({tag: "input", attrs: {type:type,value: data.form.value,name: data.form.element}, className:"mini-selector-input"});                    ret.push({tag: "div", attrs: {}, className:"sel", children: [                        {tag: "div", attrs: {id: 'span' + data.form.element}, className:"select", children: [ data.form.name]}                    ]});				}                return ret;            })() 		]}, 		{tag: "dd", attrs: {name:"miniSelector",id: 'miniSel' + id}}	]}} );


DominoControllers.registerController( 'Domino.Admin.Entry.Selector', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;

            var dd = el.getElementsByTagName("dd")[0];
            var dt = el.getElementsByTagName("dt")[0];

            dd.style.display = 'none';

            // display float and fill with data
            self.onEvent( dt, 'click', function (ev) {
                ev.preventDefault();

                if ( dd.style.display == 'none' || !dd.style.display ) {
                    dd.style.display = 'block';

                    if ( data.listData )
                        DominoApp.renderView ( dd, 'Domino.Admin.Entry.List', data.listData )
                    else
                        DominoApp.ajax({
                            view: 'Domino.Admin.Entry.List',
                            action: 'list',
                            data: data.listParams
                        }).then( function( renderData ) {

                            DominoApp.renderView ( dd, 'Domino.Admin.Entry.List', renderData )

                        }, function( errorResponse ) {
                        } );

                }
                else {
                    dd.style.display = 'none';
                    dd.innerHTML = '';
                }

            });

            document.addEventListener('click', function(event) {
                var isClickInside = el.contains(event.target);

                if (!isClickInside) {
                    dd.style.display = 'none';
                    dd.innerHTML = '';
                }
            });

        }
    }
} ) );

DominoViews.registerView( 'Domino.Admin.Entry.Edit.Title', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-entryedit-title", children: [		{tag: "dd", attrs: {}, children: [			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["Entry"]}, 				{tag: "li", attrs: {}, children: [ data.entry]}			]}, 			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["Developer"]}, 				{tag: "li", attrs: {}, children: [ data.developer]}			]}, 			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["Module"]}, 				{tag: "li", attrs: {}, children: [ data.module]}			]}, 			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["ID"]}, 				{tag: "li", attrs: {}, children: [ data.id]}			]}, 			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["Naslov"]}, 				{tag: "li", attrs: {}, children: [ data.name]}			]}, 			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["Avtor"]}, 				{tag: "li", attrs: {}, children: [ data.created.user]}			]}, 			{tag: "ul", attrs: {}, children: [				{tag: "li", attrs: {}, className:"tl", children: ["Datum stvaritve"]}, 				{tag: "li", attrs: {}, children: [ data.created.date]}			]}		]}	]};});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Title', DCDominoController.extend( function( _super ) {
    return {
        indexAction: function (el, view, data) {
            "use strict";

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.AddEntries', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"", children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field-title", children: [			{tag: "div", attrs: {}, className:"small-12 cell", children: [				{tag: "span", attrs: {}, className:"title", children: ["Identitete uporabnikov"]}			]}		]}, 		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 cell", children: [				{tag: "div", attrs: {id:"viewSelector0"}, className:"domino-miniselector", children: [					{tag: "dt", attrs: {}, children: [						{tag: "a", attrs: {href:"#"}, className:"add-button", children: [							{tag: "span", attrs: {}, className:"icon-arrow_up"}, 
							"Dodaj obstoječ vnos"
						]}					]}				]}			]}		]}, 		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field"		},              (function () {                var entries = [];                if ( data.data )                    for ( var i = 0; i < data.data.entries.length; i++ ) {                        var entry = data.data.entries[i];                        var icon = ( entry.status == 1 ) ? 'icon-show' : 'icon-status';                        entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [							{tag: "div", attrs: {}, className:"small-10 cell", children: [								{tag: "span", attrs: {}, className:"text", children: [ entry.name]}							]}, 							{tag: "div", attrs: {}, className:"small-2 cell", children: [								{tag: "a", attrs: {href: entry.link,"bool-val": entry.status}, className:"statusAddEntry title", children: [									{tag: "span", attrs: {}, className:icon }								]}, 								{tag: "a", attrs: {href: entry.link}, className:"deleteAddEntry title", children: [									{tag: "span", attrs: {}, className:"icon icon-delete"}								]}							]}						]});                    }                return entries;            })() 			]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.AddEntries', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var buttons = el.querySelectorAll('.deleteAddEntry');
            for ( var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                this.onEvent( button , 'click', function( ev ) {
                    ev.preventDefault();

                    var self = this;

                    DominoApp.ajax({
                        view: view,
                        action: 'delete',
                        data: {
                            'id': self.getAttribute('href')
                        }
                    }).then( function( renderData ) {

                        //self.

                    }, function( errorResponse ) {
                    } );

                });
            }

            var buttons = el.querySelectorAll('.statusAddEntry');
            for ( var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                this.onEvent(button, 'click', function (ev) {
                    ev.preventDefault();

                    var self = this;
                    var boolVal = self.getAttribute('bool-val');

                    DominoApp.ajax({
                        view: view,
                        action: 'status',
                        data: {
                            'id': self.getAttribute('href'),
                            'status': boolVal
                        }
                    }).then(function (renderData) {

                        if (boolVal == 1)
                            self.querySelector('span').className = 'icon-status';
                        else
                            self.querySelector('span').className = 'icon-show';

                    }, function (errorResponse) {
                    });

                });
            }

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Bool', function( data ) {	"use strict";	if ( data.horizontal ) {		var col1 = 'small-12 cell';		var col2 = 'small-12 cell';	}	else {		var col1 = 'small-12 medium-3 large-2 cell';		var col2 = 'small-4 medium-4 large-2 end cell';	}	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:col1 , children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:col2 , children: [				 (function () {					var ret = [];					/*if ( data.data == 1 ) {						ret.push(<label>							<input type="radio" name={ data.element } value="0" /> No <input type="radio" name={ data.element } value="1" checked /> Yes							</label>);						ret.push();					}					else {						ret.push(<label>							<input type="radio" name={ data.element } value="0" checked /> No <input type="radio" name={ data.element } value="1" /> Yes						</label>);					}*/					ret.push({tag: "input", attrs: {type:"text",name: data.element,value: data.data}});					return ret;				})() 				]}			]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Bool', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.ChildEntries', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-6 medium-4 large-2 cell", children: [				{tag: "a", attrs: {name:"newChildEntry",href:"#"}, className:"button", children: [{tag: "span", attrs: {}, className:"icon-new", children: ["New"]}]}			]}, 

		"Here come the Content modules"
			]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.ChildEntries', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Code', function( data ) {	"use strict";	if ( data.data )		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-8 end cell", children: [				{tag: "textarea", attrs: {id: 'CMirror' + data.element,name: data.element,rows:"15",placeholder: data.placeholder}, children: [ data.data.file]}			]}		]}	else        return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [            {tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [                {tag: "span", attrs: {}, className:"title", children: [ data.name]}            ]},             {tag: "div", attrs: {}, className:"small-12 medium-9 large-8 end cell", children: [                {tag: "textarea", attrs: {id: 'CMirror' + data.element,name: data.element,rows:"15",placeholder: data.placeholder}}            ]}        ]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Code', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            if ( data.element == "view" )
                var themode = "text/javascript"; //text/jsx, text/typescript-jsx
            else if ( data.element == "controller" )
                var themode = "javascript";
            else if ( data.element == "model" )
                var themode = "application/x-httpd-php";
            else if ( data.element == "viewSsr" )
                var themode = "application/x-httpd-php";
            else if ( data.element == "css" )
                var themode = "css";
            else if ( data.element == "theme" )
                var themode = "sass";
            else if ( data.element == "themeSettings" )
                var themode = "sass";


            var codeInstance = document.getElementById( 'CMirror' + data.element );
            var codeEditor = CodeMirror.fromTextArea( codeInstance, {
                lineNumbers: true,
                matchBrackets: true,
                mode: themode,
                indentUnit: 4,
                lineWrapping: true,
                indentWithTabs: true
            });

            // on and off handler like in jQuery
            codeEditor.on('change',function(cMirror){
                // get value right from instance
                codeInstance.value = cMirror.getValue();
            });

            //Data.push( { name: "blob_2", value: CMArr["blob_2"].getValue() } );

/*var barr = $("#TabContent"+Hash).find($("txtarea")).attr("id");
           CMArr[barr].refresh();
           */

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Cross', function( data ) {	"use strict";	return {tag: "div", attrs: {id:"cross"}, children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: ["Add cross module"]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				br("component", {view:"Domino.Admin.Entry.Selector",componentData: data.data.miniSelector})			]}			]},         {tag: "div", attrs: {}, className:"domino-cross-tabs", children: [			{tag: "ul", attrs: {}, className:"domino-cross-tabs-buttons", children: [				 (function () {					var entries = [];					if ( data.data )						for ( var i = 0; i < data.data.ModulesCrossed.length; i++ ) {							var entry = data.data.ModulesCrossed[i];                            var isactive = ( i == 0 ) ? 'is-active' : '';							entries.push( {tag: "li", attrs: {"data-id": 'CrossTabs' + entry.moduleRel}, className:isactive , children: [								{tag: "a", attrs: {href:"#"}, className:"selected", children: [ entry.moduleRel]}							]});						}					return entries;				})() 			]},             {tag: "div", attrs: {}, className:"domino-cross-tabs-content", children: [                 (function () {                    var entries = [];                    if ( data.data )                        for ( var i = 0; i < data.data.ModulesCrossed.length; i++ ) {                            var entry = data.data.ModulesCrossed[i];                            var isactive = ( i == 0 ) ? 'domino-cross-tabs-panel is-active' : 'domino-cross-tabs-panel';                            entries.push({tag: "div", attrs: {"data-id": 'CrossTabs' + entry.moduleRel}, className:isactive , children: [                                {tag: "h2", attrs: {}, children: [ entry.moduleRel]},                                 br("component", {view: 'Domino.Admin.Entry.Edit.Field.Cross.' + entry.type,componentData: entry.data})                            ]});                        }                    return entries;                })()             ]}        ]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Cross', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            this.onEvent( document.querySelectorAll('.domino-cross-tabs-buttons li') , 'click', function (ev) {

                ev.preventDefault();

                var self = this,
                    ul = self.parentNode,
                    id = self.getAttribute("data-id"),
                    className = self.getAttribute("class");

                if ( className != 'is-active' ) {

                    // Buttons
                    ul.querySelector('li[class="is-active"]').removeAttribute('class');
                    self.setAttribute('class', 'is-active');

                    // Content
                    var newE = ul.nextSibling.querySelector('.domino-cross-tabs-panel[data-id="' + id + '"]');

                    if ( newE ) {
                        var content = ul.nextSibling;
                        if ( content )
                            content.querySelector('.domino-cross-tabs-panel.is-active').setAttribute('class', 'domino-cross-tabs-panel');
                        newE.setAttribute('class', 'domino-cross-tabs-panel is-active');
                    }
                }
            });

        }
    }
}));
DominoViews.registerView('Domino.Admin.Entry.Edit.Field.Cross.Entries', function (data) {    "use strict";    return {tag: "div", attrs: {id:"pictures"}, children: [        {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [            {tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [                {tag: "span", attrs: {}, className:"title", children: ["Add entry"]}            ]},             {tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [                br("component", {view:"Domino.Admin.Entry.Selector",componentData: data.miniSelector})            ]}        ]},         br("component", {view:"Domino.Admin.Entry.List",componentData: data.list}),         {tag: "div", attrs: {id:"FilesHolder"}, children: [            (function () {                var entries = [];                if (data.data)                    for (var i = 0; i < data.data.entries.length; i++) {                        var entry = data.data.entries[i];                        entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [                            {tag: "div", attrs: {}, className:"small-6 medium-3 large-2 cell", children: [                                {tag: "a", attrs: {href:data.data.fileLink + entry.idRel,target:"_blank"}, children: [{tag: "span", attrs: {}, className:"title", children: [entry.entryRel]}]}                            ]},                             {tag: "div", attrs: {}, className:"small-6 medium-9 large-10 cell", children: [                                {tag: "a", attrs: {href:entry.entryRel}, className:"deleteFile", children: [{tag: "span", attrs: {}, className:"icon icon-delete"}]}                            ]}                        ]});                    }                return entries;            })()        ]}    ]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Cross.Entries', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            self.onEvent( document.querySelectorAll('.deleteFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'delete',
                    data: {
                        'entryRel': self.getAttribute('href'),
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });
            self.onEvent( document.querySelectorAll('#manualCrossFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'manualCross',
                    data: {
                        'newEntry': document.querySelector('input[name="newEntry"]').value,
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Cross.Files', function( data ) {	"use strict";	return {tag: "div", attrs: {id:"pictures"}, children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: ["Files"]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				{tag: "input", attrs: {type:"file",id:"filesInput",name:"files",value:"",placeholder:"",multiple:true}}			]}		]}, 		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell"			}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				{tag: "button", attrs: {id:"fileUploadButton"}, className:"button", children: ["Nalož"]}			]}		]},         {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [            {tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell"            },             {tag: "div", attrs: {}, className:"small-3 medium-6 end cell", children: [                {tag: "input", attrs: {type:"text",name:"newEntry",value:"Domino.Files.",placeholder:""}}            ]},             {tag: "div", attrs: {}, className:"small-3 medium-2 end cell", children: [                {tag: "button", attrs: {id:"manualCrossFile"}, className:"button", children: ["Povež"]}            ]}        ]}, 	{tag: "div", attrs: {id:"FilesHolder"}, children: [		 (function () {			var entries = [];			if ( data.data )                for ( var i = 0; i < data.data.entries.length; i++ ) {                    var entry = data.data.entries[i];                    entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [                        {tag: "div", attrs: {}, className:"small-6 medium-3 large-2 cell", children: [                            {tag: "a", attrs: {href: data.data.fileLink + entry.idRel,target:"_blank"}, children: [{tag: "span", attrs: {}, className:"title", children: [ entry.entryRel]}]}                        ]},                         {tag: "div", attrs: {}, className:"small-6 medium-9 large-10 cell", children: [                            {tag: "a", attrs: {href: entry.entryRel}, className:"deleteFile", children: [{tag: "span", attrs: {}, className:"icon icon-delete"}]}                        ]}                    ]});				}			return entries;		})() 	]}]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Cross.Files', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            self.onEvent( document.getElementById('fileUploadButton'), 'click', function( ev ) {
                ev.preventDefault();

                var fileSelect = document.getElementById('filesInput');
                var files = fileSelect.files;

                var forms = [];

                var formData = null;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    formData = new FormData();
                    formData.append('identity', data.data.identity);
                    formData.append('mainDeveloper', data.data.mainDeveloper);
                    formData.append('mainModule', data.data.mainModule);
                    formData.append('mainId', data.data.mainId);
                    formData.append('developer', 'Domino');
                    formData.append('module', 'Files');

                    // Add the file to the request.
                    formData.append('file', file);

                    forms.push(formData);

                }

                self.upload ( forms, 0, files.length );

            });
            self.onEvent( document.querySelectorAll('.deleteFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'delete',
                    data: {
                        'entryRel': self.getAttribute('href'),
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });
            self.onEvent( document.querySelectorAll('#manualCrossFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'manualCross',
                    data: {
                        'newEntry': document.querySelector('input[name="newEntry"]').value,
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });

        },
        upload: function( formData, instance, all ) {

            var self = this;

            if ( instance < all ) {

                self.ajax(formData[instance]).then( function( data ) {

                    self.upload( formData, ( instance + 1 ), all );

                }, function( errorResponse ) {
                } );
            }

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Cross.Pictures', function( data ) {	"use strict";	if ( !data.data.entries ) {		return {tag: "div", attrs: {id:"pictures"}, children: [			{tag: "p", attrs: {}, children: ["Najprej dodajte vnos in potem lahko dodajate slike."]}		]}	}	else		return {tag: "div", attrs: {id:"pictures"}, children: [			{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					{tag: "span", attrs: {}, className:"title", children: ["Pictures"]}				]}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [					{tag: "input", attrs: {type:"file",id:"filesPictures",name:"pics",value:"",placeholder:"",multiple:true}}				]}			]}, 			{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell"				}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [					{tag: "button", attrs: {id:"picUploadButton"}, className:"button", children: ["Nalož"]}				]}			]}, 			{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					br("component", {view:"Domino.Admin.Entry.Selector",componentData: data.data.miniSelector})				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-3 end cell", children: [					{tag: "input", attrs: {type:"text",name:"newEntry",value:"Domino.Pictures.",placeholder:""}}				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-1 end cell", children: [					{tag: "input", attrs: {type:"text",name:"newProfile",value:"",placeholder:"Profile"}}				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-1 end cell", children: [					{tag: "input", attrs: {type:"text",name:"newCover",value:"",placeholder:"Cover"}}				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-2 end cell", children: [					{tag: "button", attrs: {id:"manualCross"}, className:"button", children: ["Povež"]}				]}			]}, 		{tag: "div", attrs: {id:"PicturesHolder"}, children: [			 (function () {				var entries = [];				if ( data.data )					for ( var i = 0; i < data.data.entries.length; i++ ) {						var entry = data.data.entries[i];						entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [							{tag: "div", attrs: {}, className:"small-6 medium-3 large-2 cell", children: [								{tag: "a", attrs: {href: data.data.crossLink + entry.entryRel,target:"_blank"}, children: [{tag: "span", attrs: {}, className:"title", children: [ entry.entryRel]}]}							]}, 							{tag: "div", attrs: {}, className:"small-6 medium-9 large-10 cell", children: [								{tag: "a", attrs: {href: entry.entryRel}, className:"deletePicture", children: [{tag: "span", attrs: {}, className:"icon icon-delete"}]}							]}						]});					}				return entries;			})() 		]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Cross.Pictures', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            self.onEvent( document.getElementById('picUploadButton'), 'click', function( ev ) {
                ev.preventDefault();

                var fileSelect = document.getElementById('filesPictures');
                var files = fileSelect.files;

                var forms = [];

                var formData = null;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    formData = new FormData();
                    formData.append('identity', data.data.identity);
                    formData.append('mainDeveloper', data.data.mainDeveloper);
                    formData.append('mainModule', data.data.mainModule);
                    formData.append('mainId', data.data.mainId);
                    formData.append('developer', 'Domino');
                    formData.append('module', 'Pictures');

                    // Add the file to the request.
                    formData.append('file', file);

                    forms.push(formData);

                }

                self.upload ( forms, 0, files.length );

            });

            self.onEvent( document.querySelectorAll('.deletePicture'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'delete',
                    data: {
                        'entryRel': self.getAttribute('href'),
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });
            self.onEvent( document.querySelectorAll('#manualCross'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'manualCross',
                    data: {
                        'newEntry': document.querySelector('input[name="newEntry"]').value,
                        'newProfile': document.querySelector('input[name="newProfile"]').value,
                        'newCover': document.querySelector('input[name="newCover"]').value,
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });

        },
        upload: function( formData, instance, all ) {

            var self = this;

            if ( instance < all ) {

                self.ajax(formData[instance]).then( function( data ) {

                    self.upload( formData, ( instance + 1 ), all );

                }, function( errorResponse ) {
                } );
            }

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Date', function( data ) {	"use strict";	if ( data.horizontal ) {		var col1 = 'small-12 cell';		var col2 = 'small-12 cell';	}	else {		var col1 = 'small-12 medium-3 large-2 cell';		var col2 = 'small-12 medium-9 large-4 end cell';	}	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:col1 , children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:col2 , children: [				{tag: "input", attrs: {type:"text",id: 'date' + data.id,name: data.element,value: data.data,placeholder: data.placeholder}, style:"width:120px"}				]}			]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Date', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var picker = new Pikaday({
                field: document.getElementById('date' + data.id ),
                format: 'DD.MM.YYYY'
            });



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.DateTime', function( data ) {	"use strict";	if ( data.horizontal ) {		var col1 = 'small-12 cell';		var col2 = 'small-12 cell';	}	else {		var col1 = 'small-12 medium-3 large-2 cell';		var col2 = 'small-12 medium-9 large-4 end cell';	}	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [		{tag: "div", attrs: {}, className:col1 , children: [			{tag: "span", attrs: {}, className:"title", children: [ data.name]}		]}, 		{tag: "div", attrs: {}, className:col2 , children: [			{tag: "input", attrs: {type:"text",id: 'date' + data.id,name: data.element,value: data.data,placeholder: data.placeholder}, style:"width:120px"}		]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.DateTime', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var picker = new Pikaday({
                field: document.getElementById('date' + data.id ),
                format: 'DD.MM.YYYY'
            });

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.DisplayVarchar', function( data ) {	"use strict";	if ( data.horizontal ) {		var col1 = 'small-12 cell';		var col2 = 'small-12 cell';	}	else {		var col1 = 'small-12 medium-3 large-2 cell';		var col2 = 'small-12 medium-9 large-4 end cell';	}	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:col1 , children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:col2 , children: [				 data.data				]}			]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.DisplayVarchar', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.FieldSet', function( data ) {	"use strict";	return {tag: "fieldset", attrs: {}, className:"domino-fieldset", children: [		 (function () {			var ret = [];            if ( data.structureName )                ret.push({tag: "legend", attrs: {}, children: [ data.structureName]});			if ( data.name )				ret.push({tag: "legend", attrs: {}, children: [ data.name]});			for (var i = 0; i < data.children.length; i++) {				var componentData = data.children[i];				componentData['dimensions'] = data.dimensions;				ret.push(br("component", {view: 'Domino.Admin.Entry.Edit.Field.' + componentData.elementItem,componentData:componentData }));			}			return ret;		})() 	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.FieldSet', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.File', function( data ) {	"use strict";	return {tag: "div", attrs: {}, children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-6 end cell", children: [				{tag: "input", attrs: {type:"text",name: data.element,value: data.data.filename,placeholder: data.placeholder}}			]}		]},         {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [            {tag: "div", attrs: {}, className:"medium-offset-3 large-offset-2 small-8 medium-6 large-5 cell", children: [                {tag: "input", attrs: {type:"file",name:"file",placeholder:""}},                 {tag: "button", attrs: {id:"picUpload"}, className:"button", children: ["Nalož"]}            ]}        ]},          (function () {            var ret = [];            if ( data.data.thumb && data.data.mainModule == 'Pictures' )				ret.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [					{tag: "div", attrs: {}, className:"medium-offset-3 large-offset-2 small-8 medium-6 large-5 cell", children: [						{tag: "img", attrs: {src: data.data.thumb,alt:""}}					]}				]});            return ret;        })() 	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.File', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var self = this;

            self.onEvent( document.getElementById('picUpload'), 'click', function( ev ) {
                ev.preventDefault();

                var fileSelect = document.querySelector('input[name="file"]');
                var files = fileSelect.files;
                var forms = [];

                var formData = null;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    formData = new FormData();
                    formData.append('identity', data.data.identity);
                    formData.append('mainDeveloper', data.data.mainDeveloper);
                    formData.append('mainModule', data.data.mainModule);
                    formData.append('mainId', data.data.mainId);
                    formData.append('developer', 'Domino');
                    formData.append('module', data.data.mainModule);
                    formData.append('type', 'Single');
                    formData.append('id', data.data.mainId);

                    // Add the file to the request.
                    formData.append('file', file);

                    forms.push(formData);

                }

                self.upload ( forms, 0, files.length );

            });


        },
        upload: function( formData, instance, all ) {

            var self = this;

            if ( instance < all ) {

                self.ajax(formData[instance]).then( function( data ) {

                    self.upload( formData, ( instance + 1 ), all );

                }, function( errorResponse ) {
                } );
            }

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Files', function( data ) {	"use strict";	return {tag: "div", attrs: {id:"pictures"}, children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: ["Files"]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				{tag: "input", attrs: {type:"file",id:"filesInput",name:"files",value:"",placeholder:"",multiple:true}}			]}		]}, 		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell"			}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				{tag: "button", attrs: {id:"fileUploadButton"}, className:"button", children: ["Nalož"]}			]}		]},         {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [            {tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell"            },             {tag: "div", attrs: {}, className:"small-3 medium-6 end cell", children: [                {tag: "input", attrs: {type:"text",name:"newEntry",value:"Domino.Files.",placeholder:""}}            ]},             {tag: "div", attrs: {}, className:"small-3 medium-2 end cell", children: [                {tag: "button", attrs: {id:"manualCrossFile"}, className:"button", children: ["Povež"]}            ]}        ]}, 	{tag: "div", attrs: {id:"FilesHolder"}, children: [		 (function () {			var entries = [];			if ( data.data )                for ( var i = 0; i < data.data.entries.length; i++ ) {                    var entry = data.data.entries[i];                    entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [                        {tag: "div", attrs: {}, className:"small-6 medium-3 large-2 cell", children: [                            {tag: "a", attrs: {href: data.data.fileLink + entry.idRel,target:"_blank"}, children: [{tag: "span", attrs: {}, className:"title", children: [ entry.entryRel]}]}                        ]},                         {tag: "div", attrs: {}, className:"small-6 medium-9 large-10 cell", children: [                            {tag: "a", attrs: {href: entry.entryRel}, className:"deleteFile", children: [{tag: "span", attrs: {}, className:"icon icon-delete"}]}                        ]}                    ]});				}			return entries;		})() 	]}]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Files', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            self.onEvent( document.getElementById('fileUploadButton'), 'click', function( ev ) {
                ev.preventDefault();

                var fileSelect = document.getElementById('filesInput');
                var files = fileSelect.files;

                var forms = [];

                var formData = null;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    formData = new FormData();
                    formData.append('identity', data.data.identity);
                    formData.append('mainDeveloper', data.data.mainDeveloper);
                    formData.append('mainModule', data.data.mainModule);
                    formData.append('mainId', data.data.mainId);
                    formData.append('developer', 'Domino');
                    formData.append('module', 'Files');

                    // Add the file to the request.
                    formData.append('file', file);

                    forms.push(formData);

                }

                self.upload ( forms, 0, files.length );

            });
            self.onEvent( document.querySelectorAll('.deleteFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'delete',
                    data: {
                        'entryRel': self.getAttribute('href'),
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });
            self.onEvent( document.querySelectorAll('#manualCrossFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'manualCross',
                    data: {
                        'newEntry': document.querySelector('input[name="newEntry"]').value,
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });

        },
        upload: function( formData, instance, all ) {

            var self = this;

            if ( instance < all ) {

                self.ajax(formData[instance]).then( function( data ) {

                    self.upload( formData, ( instance + 1 ), all );

                }, function( errorResponse ) {
                } );
            }

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.HorizontalBar', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-entryedit-horizontalbar grid-x grid-padding-x", children: [ (function () {	var ret = [];	for (var i = 0; i < data.children.length; i++) {		var componentData = data.children[i];		componentData['dimensions'] = data.dimensions;		componentData['horizontal'] = true;		if ( componentData.elementItem == 'Date' || componentData.elementItem == 'Time' || componentData.elementItem == 'DateTime' || componentData.elementItem == 'Bool'  )			var cls = "small-6 medium-2 large-2 cell end";		else			var cls = "small-12 medium-3 large-4 cell end";		ret.push({tag: "div", attrs: {}, className:cls , children: [			br("component", {view: 'Domino.Admin.Entry.Edit.Field.' + componentData.elementItem,componentData:componentData })			]}		);	}		return ret;	})() ]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.HorizontalBar', DCDominoController.extend( function( _super ) {
    return {
        indexAction: function (el, view, data) {
            "use strict";

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.NameUrlname', function( data ) {	"use strict";	if ( data.dimensions && ( data.dimensional === true ) ) {		var ret = [];		for ( var i = 0; i < data.dimensions.length; i++ ) {			var dimension = data.dimensions[i];			var style = ( i == 0 ) ? '' : 'display:none';			ret.push({tag: "div", attrs: {name: 'dim' + dimension.id}, style:style , children: [				{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [					{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [						{tag: "span", attrs: {}, className:"title", children: [ data.name]}, " ",{tag: "span", attrs: {}, className:"dimension", children: [ dimension.name]}					]}, 					{tag: "div", attrs: {}, className:"small-12 medium-9 large-6 end cell", children: [						{tag: "input", attrs: {type:"text",name: dimension.id + '[name]',value: data.data[dimension.id]['name'],placeholder: data.placeholder}}					]}				]}, 				{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [					{tag: "div", attrs: {}, className:"medium-offset-3 large-offset-2 small-8 medium-6 large-5 cell", children: [						{tag: "input", attrs: {type:"text",name: dimension.id + '[urlname]',value: data.data[dimension.id]['urlname'],placeholder: data.data[dimension.id]['urlnamePlaceholder'] }}					]}				]}			]});		}		return ret;	}	else		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				{tag: "input", attrs: {type:"text",name: data.element,value: data.data,placeholder: data.placeholder}}			]}		]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.NameUrlname', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Password', function( data ) {	"use strict";	return {tag: "div", attrs: {}, children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [		{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [			{tag: "span", attrs: {}, className:"title", children: [ data.name]}		]}, 		{tag: "div", attrs: {}, className:"small-6 medium-4 large-3 end cell", children: [			{tag: "input", attrs: {type:"password",name: data.element,value:"","data-validate-type":"password","data-validate-encrypt":"sha-256",placeholder: data.placeholder}}		]}	]}, 		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"medium-offset-3 large-offset-2 small-6 medium-4 large-3 cell", children: [				{tag: "input", attrs: {type:"password",name:"password_retype",value:"","data-validate-type":"password_retype","data-validate-encrypt":"sha-256",placeholder: data.data['passwordRetype'] }}			]}		]}]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Password', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Pictures', function( data ) {	"use strict";	if ( !data.data.entries ) {		return {tag: "div", attrs: {id:"pictures"}, children: [			{tag: "p", attrs: {}, children: ["Najprej dodajte vnos in potem lahko dodajate slike."]}		]}	}	else		return {tag: "div", attrs: {id:"pictures"}, children: [			{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					{tag: "span", attrs: {}, className:"title", children: ["Pictures"]}				]}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [					{tag: "input", attrs: {type:"file",id:"filesPictures",name:"pics",value:"",placeholder:"",multiple:true}}				]}			]}, 			{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell"				}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [					{tag: "button", attrs: {id:"picUploadButton"}, className:"button", children: ["Nalož"]}				]}			]}, 			{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					br("component", {view:"Domino.Admin.Entry.Selector",componentData: data.data.miniSelector})				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-3 end cell", children: [					{tag: "input", attrs: {type:"text",name:"newEntry",value:"Domino.Pictures.",placeholder:""}}				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-1 end cell", children: [					{tag: "input", attrs: {type:"text",name:"newProfile",value:"",placeholder:"Profile"}}				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-1 end cell", children: [					{tag: "input", attrs: {type:"text",name:"newCover",value:"",placeholder:"Cover"}}				]}, 				{tag: "div", attrs: {}, className:"small-3 medium-2 end cell", children: [					{tag: "button", attrs: {id:"manualCross"}, className:"button", children: ["Povež"]}				]}			]}, 		{tag: "div", attrs: {id:"PicturesHolder"}, children: [			 (function () {				var entries = [];				if ( data.data )					for ( var i = 0; i < data.data.entries.length; i++ ) {						var entry = data.data.entries[i];						entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [							{tag: "div", attrs: {}, className:"small-6 medium-3 large-2 cell", children: [								{tag: "a", attrs: {href: data.data.crossLink + entry.entryRel,target:"_blank"}, children: [{tag: "span", attrs: {}, className:"title", children: [ entry.entryRel]}]}							]}, 							{tag: "div", attrs: {}, className:"small-6 medium-9 large-10 cell", children: [								{tag: "a", attrs: {href: entry.entryRel}, className:"deletePicture", children: [{tag: "span", attrs: {}, className:"icon icon-delete"}]}							]}						]});					}				return entries;			})() 		]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Pictures', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            self.onEvent( document.getElementById('picUploadButton'), 'click', function( ev ) {
                ev.preventDefault();

                var fileSelect = document.getElementById('filesPictures');
                var files = fileSelect.files;

                var forms = [];

                var formData = null;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    formData = new FormData();
                    formData.append('identity', data.data.identity);
                    formData.append('mainDeveloper', data.data.mainDeveloper);
                    formData.append('mainModule', data.data.mainModule);
                    formData.append('mainId', data.data.mainId);
                    formData.append('developer', 'Domino');
                    formData.append('module', 'Pictures');

                    // Add the file to the request.
                    formData.append('file', file);

                    forms.push(formData);

                }

                self.upload ( forms, 0, files.length );

            });

            self.onEvent( document.querySelectorAll('.deletePicture'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'delete',
                    data: {
                        'entryRel': self.getAttribute('href'),
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });
            self.onEvent( document.querySelectorAll('#manualCross'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'manualCross',
                    data: {
                        'newEntry': document.querySelector('input[name="newEntry"]').value,
                        'newProfile': document.querySelector('input[name="newProfile"]').value,
                        'newCover': document.querySelector('input[name="newCover"]').value,
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });

        },
        upload: function( formData, instance, all ) {

            var self = this;

            if ( instance < all ) {

                self.ajax(formData[instance]).then( function( data ) {

                    self.upload( formData, ( instance + 1 ), all );

                }, function( errorResponse ) {
                } );
            }

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Selector', function( data ) {	"use strict";	if ( data.horizontal ) {		var col1 = 'small-12 cell';		var col2 = 'small-12 cell';	}	else {		var col1 = 'small-12 medium-3 large-2 cell';		var col2 = 'small-12 medium-9 large-4 end cell';	}	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [		{tag: "div", attrs: {}, className:col1 , children: [			{tag: "span", attrs: {}, className:"title", children: [ data.name]}		]}, 		{tag: "div", attrs: {}, className:col2 , children: [            br("component", {view:"Domino.Admin.Entry.Selector",componentData: data.data})		]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Selector', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.TabSet', function( data ) {	"use strict";	var ret = [];	ret.push({tag: "div", attrs: {}, className:"domino-tabs row", children: [		{tag: "ul", attrs: {}, children: [			 (function () {				var ret2 = [];				for ( var i = 0; i < data.children.length; i++ ) {					var str = data.children[i],						active = ( i === 0 ) ? 'is-active' : '';					ret2.push({tag: "li", attrs: {"data-id": 'tab' + str.developer + str.module + str.id}, className:active , children: [						{tag: "a", attrs: {href:"#"}, children: [ str.name]}					]});				}				return ret2;			})() 		]}	]});	ret.push({tag: "div", attrs: {}, className:"domino-tabs-content", children: [		 (function () {			var ret2 = [];			for ( var i = 0; i < data.children.length; i++ ) {				var str = data.children[i],					active = ( i === 0 ) ? 'tabs-panel is-active' : 'tabs-panel';				ret2.push({tag: "div", attrs: {"data-id": 'tab' + str.developer + str.module + str.id}, className:active , children: [					 (function () {						var ret3 = [];						for (var j = 0; j < str.children.length; j++) {							var componentData = str.children[j];							componentData['dimensions'] = data.dimensions;							ret3.push(br("component", {view: 'Domino.Admin.Entry.Edit.Field.' + componentData.elementItem,componentData:componentData }));						}						return ret3;					})() 				]});			}			return ret2;		})() 	]});	return {tag: "div", attrs: {}, className:"domino-tabset", children: [ret," "]};});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.TabSet', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;
            var lis = document.querySelectorAll('.domino-tabs li');


            self.onEvent(lis, 'click', function (ev) {

                ev.preventDefault();
                var self = this,
                    ul = self.parentNode,
                    id = self.getAttribute("data-id");


                ul.querySelector('li[class="is-active"]').removeAttribute('class');

                self.setAttribute('class', 'is-active');

                var newE = el.querySelector('.tabs-panel[data-id="' + id + '"]');

                if (newE) {

                    var activeE = newE.parentNode.parentNode;
                    if (!activeE)
                        activeE = newE.parentNode;

                    if (activeE)
                        activeE.querySelector(':scope > div > .tabs-panel.is-active').setAttribute('class', 'tabs-panel');
                    // .className.replace( new RegExp('(?:^|\\s)is-active(?!\\S)'), '' );
                    newE.setAttribute('class', 'tabs-panel is-active');
                }


            });

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Text', function( data ) {	"use strict";	if ( data.dimensions && ( data.dimensional == true ) ) {		var ret = [];		for ( var i = 0; i < data.dimensions.length; i++ ) {			var dimension = data.dimensions[i];			var style = ( i == 0 ) ? '' : 'display:none';			ret.push({tag: "div", attrs: {name: 'dim' + dimension.id}, className:"grid-x grid-padding-x field",style:style , children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					{tag: "span", attrs: {}, className:"title", children: [ data.name]}, " ",{tag: "span", attrs: {}, className:"dimension", children: [ dimension.name]}				]}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [					{tag: "textarea", attrs: {name: dimension.id + '[' + data.element + ']',rows:"10",placeholder: data.placeholder}, children: [ data.data[dimension.id] ]}				]}			]});		}        return {tag: "div", attrs: {}, children: [ret ]};	}	else		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end cell", children: [				{tag: "textarea", attrs: {name: data.element,rows:"10",placeholder: data.placeholder}, children: [ data.data]}			]}		]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Text', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.TextEditor', function( data ) {	"use strict";	if ( data.dimensions && ( data.dimensional == true ) ) {		var ret = [];		for ( var i = 0; i < data.dimensions.length; i++ ) {			var dimension = data.dimensions[i];			var style = ( i == 0 ) ? '' : 'display:none';			ret.push({tag: "div", attrs: {name: 'dim' + dimension.id}, className:"grid-x grid-padding-x field",style:style , children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					{tag: "span", attrs: {}, className:"title", children: [ data.name]}, " ",{tag: "span", attrs: {}, className:"dimension", children: [ dimension.name]}				]}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-8 end cell", children: [                    {tag: "a", attrs: {id: 'editSource' + data.id + dimension.id,href:"#"}, className:"editSource", children: ["Edit source"]},                     {tag: "div", attrs: {id: 'CK123' + data.id + dimension.id}},                     {tag: "div", attrs: {id: 'editSourcePlaceholder' + data.id + dimension.id}, style:"display:none", children: [                        {tag: "textarea", attrs: {id: 'CK' + data.id + dimension.id,name: dimension.id + '[' + data.element + ']',rows:"15",placeholder: data.placeholder}, style:"display:none", children: [ data.data[dimension.id] ]},                         {tag: "a", attrs: {id: 'saveSource' + data.id + dimension.id,href:"#"}, className:"saveSource", children: ["Save source"]}                    ]}				]}			]});		}		return {tag: "div", attrs: {}, children: [ret ]};	}	else		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [				{tag: "span", attrs: {}, className:"title", children: [ data.name]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-8 end cell", children: [                {tag: "a", attrs: {id: 'editSource' + data.id,href:"#"}, className:"editSource", children: ["Edit source"]},                 {tag: "div", attrs: {id: 'CK123' + data.id}},             {tag: "div", attrs: {id: 'editSourcePlaceholder' + data.id}, style:"display:none", children: [				{tag: "textarea", attrs: {id: 'CK' + data.id,name: data.element,rows:"15",placeholder: data.placeholder}, style:"display:none", children: [ data.data]},                 {tag: "a", attrs: {id: 'saveSource' + data.id,href:"#"}, className:"saveSource", children: ["Save source"]}            ]}			]}		]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.TextEditor', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var ck_id = '';
            var ck_inst = '';
            var editors = new Array();
            var editSource = '';
            var saveSource = '';

            if ( data.dimensions && ( data.dimensional == true ) ) {

                var dimension = '';
                for ( var i = 0; i < data.dimensions.length; i++ ) {
                    dimension = data.dimensions[i];
                    ck_id = 'CK' + data.id + dimension.id;
                    ck_inst = 'CK123' + data.id + dimension.id;
                    editSource = 'editSource' + data.id + dimension.id;
                    saveSource = 'saveSource' + data.id + dimension.id;

                    var editor = window.pell.init({
                        element: document.getElementById(ck_inst),
                        defaultParagraphSeparator: 'p',
                        styleWithCSS: false,
                        onChange: function (html) {
                            //document.getElementById(ck_id).innerHTML = html
                            document.getElementById(ck_id).textContent = html
                        }
                    })

                    editor.content.innerHTML = data.data[dimension.id];

                    /*this.onEvent( document.getElementById(ck_id) , 'change', function( ev ) {

                        editor.content.innerHTML = this.value;

                    } );*/

                    this.onEvent( document.getElementById(editSource) , 'click', function( ev ) {

                        if ( document.getElementById(ck_id).style.display == 'block' ) {
                            document.getElementById(ck_id).style.display = 'none';
                            document.getElementById(ck_id).parentNode.style.display = 'none';
                            document.getElementById(ck_inst).style.display = 'block';
                        }
                        else {
                            document.getElementById(ck_id).style.display = 'block';
                            document.getElementById(ck_id).parentNode.style.display = 'block';
                            document.getElementById(ck_inst).style.display = 'none';
                        }


                    } );

                    this.onEvent( document.getElementById(saveSource) , 'click', function( ev ) {

                        editor.content.innerHTML = document.getElementById(ck_id).value;
                        document.getElementById(ck_id).style.display = 'none';
                        document.getElementById(ck_id).parentNode.style.display = 'none';
                        document.getElementById(ck_inst).style.display = 'block';

                    } );

                }

            }
            else {
                ck_id = 'CK' + data.id;
                ck_inst = 'CK123' + data.id;
                editSource = 'editSource' + data.id;
                saveSource = 'saveSource' + data.id;

                var editor = window.pell.init({
                    element: document.getElementById(ck_inst),
                    defaultParagraphSeparator: 'p',
                    styleWithCSS: false,
                    onChange: function (html) {
                        document.getElementById(ck_id).textContent = html
                    }
                })

                editor.content.innerHTML = data.data;

                this.onEvent( document.getElementById(editSource) , 'click', function( ev ) {

                    if ( document.getElementById(ck_id).style.display == 'block' ) {
                        document.getElementById(ck_id).style.display = 'none';
                        document.getElementById(ck_id).parentNode.style.display = 'none';
                        document.getElementById(ck_inst).style.display = 'block';
                    }
                    else {
                        document.getElementById(ck_id).style.display = 'block';
                        document.getElementById(ck_id).parentNode.style.display = 'block';
                        document.getElementById(ck_inst).style.display = 'none';
                    }


                } );

                this.onEvent( document.getElementById(saveSource) , 'click', function( ev ) {

                    editor.content.innerHTML = document.getElementById(ck_id).value;
                    document.getElementById(ck_id).style.display = 'none';
                    document.getElementById(ck_id).parentNode.style.display = 'none';
                    document.getElementById(ck_inst).style.display = 'block';

                } );

            }


        }
    }
}));

DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Time', function( data ) {	"use strict";	//if ( data.wrapper )		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 cell", children: [					{tag: "span", attrs: {}, className:"title", children: [ data.name]}				]}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-10 end cell", children: [					{tag: "input", attrs: {type:"text",name: data.element,value: data.data,placeholder: data.placeholder}, style:"width:80px"}					]}				]}	//else		//return <input type="text" name={ data.name } value={ data.value } placeholder={ data.placeholder } />});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Time', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Varchar', function( data ) {	"use strict";    if ( data.horizontal ) {        var col1 = 'small-12 cell';        var col2 = 'small-12 cell';    }    else {        var col1 = 'small-12 medium-3 large-2 cell';        var col2 = 'small-12 medium-9 large-4 end cell';    }	if ( data.dimensions && ( data.dimensional === true ) ) {		var ret = [];		for ( var i = 0; i < data.dimensions.length; i++ ) {			var dimension = data.dimensions[i];			var style = ( i == 0 ) ? '' : 'display:none';			ret.push({tag: "div", attrs: {name: 'dim' + dimension.id}, className:"grid-x grid-padding-x field",style:style , children: [				{tag: "div", attrs: {}, className:col1 , children: [					{tag: "span", attrs: {}, className:"title", children: [ data.name]}, " ",{tag: "span", attrs: {}, className:"dimension", children: [ dimension.name]}				]}, 				{tag: "div", attrs: {}, className:col2 , children: [					{tag: "input", attrs: {type:"text",name: dimension.id + '[' + data.element + ']',value: data.data[dimension.id],placeholder: data.placeholder}}				]}			]});		}		return ret;	}	else		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:col1 , children: [					{tag: "span", attrs: {}, className:"title", children: [ data.name]}				]}, 				{tag: "div", attrs: {}, className:col2 , children: [					{tag: "input", attrs: {type:"text",name: data.element,value: data.data,placeholder: data.placeholder}}					]}				]}});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Varchar', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            /*self.onEvent(el.querySelector('.field'), 'click', function (ev) {


                console.log("df");


            });*/
        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Actions', function( data ) {	"use strict";	if ( data )		return {tag: "div", attrs: {}, className:"grid-x domino-actions", children: [						 (function () {							if ( data.buttons ) {								var ret = [];								for (var key in data.buttons) {									// skip loop if the property is from prototype									if (!data.buttons.hasOwnProperty(key)) continue;									var entry = data.buttons[key];									ret.push({tag: "div", attrs: {}, className: 'shrink cell ' + entry.position, children: [										{tag: "a", attrs: {href: entry.link,id: key + 'Action',title: entry.value}, children: [											{tag: "span", attrs: {}, className: 'icon-' + entry.icon}, 											{tag: "span", attrs: {}, className:"hide-for-small-only", children: [ entry.value]}										]}									]});								}								return ret;							}						})() 				]}} );


DominoControllers.registerController( 'Domino.Admin.Entry.List.Actions', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, controller, data ) {

            var self = this;





        }
    }

}));

DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Bool', function( data ) {	"use strict";	var icon = ( data.data == 1 ) ? 'icon-show' : 'icon-status';	return {tag: "div", attrs: {}, className:"", children: [			{tag: "a", attrs: {href:"#","bool-val": data.data}, children: [				{tag: "span", attrs: {}, className:icon }			]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Bool', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function ( el, view, data ) {
            "use strict";

            var self = this;

            self.onEvent( el.querySelector('a'), 'click', function( ev ) {
                ev.preventDefault();
                var self = this;
                var boolVal = self.getAttribute('bool-val');

                DominoApp.ajax({
                    view: view,
                    action: 'change',
                    data: {
                        'element': data.column.element,
                        'developer': data.column.developer,
                        'module': data.column.module,
                        'id': data.id,
                        'value': boolVal
                    }
                }).then( function( data ) {

                    if ( boolVal == 1 )
                        self.querySelector('span').className = 'icon-status';
                    else
                        self.querySelector('span').className = 'icon-show';

                }, function( errorResponse ) {
                } );

            });


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Date', function( data ) {	"use strict";	return {tag: "span", attrs: {}, children: [ data.data]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Date', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.DateTime', function( data ) {	"use strict";	return {tag: "span", attrs: {}, children: [ data.data]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.DateTime', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Delete', function( data ) {	"use strict";		return {tag: "a", attrs: {href:"#"}, className:"edit", children: [				{tag: "span", attrs: {}, className:"icon-delete"}				]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Delete', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Deploy', function( data ) {	"use strict";	var icon = ( data.data == 1 ) ? 'icon-show' : 'icon-status';	return {tag: "div", attrs: {}, className:"", children: [			{tag: "a", attrs: {href:"#","bool-val": data.data}, children: [				{tag: "span", attrs: {}, className:"icon-export"}			]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Deploy', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function ( el, view, data ) {
            "use strict";

            var self = this;

            self.onEvent( el.querySelector('a'), 'click', function( ev ) {
                ev.preventDefault();
                var self = this;

                self.querySelector('span').className = 'icon-export red';

                DominoApp.ajax({
                    view: view,
                    action: 'deploy',
                    data: {
                        'element': data.column.element,
                        'developer': data.column.developer,
                        'module': data.column.module,
                        'id': data.entry
                    }
                }).then( function( data ) {

                    self.querySelector('span').className = 'icon-export green';

                    setTimeout(function(){
                        self.querySelector('span').className = 'icon-export';
                    }, 2000);

                }, function( errorResponse ) {
                } );

            });


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Edit', function( data ) {	"use strict";		return {tag: "div", attrs: {}, children: [			{tag: "a", attrs: {href: data.data.createBefore,title:"Create new before"}, className:"edit", children: [				{tag: "span", attrs: {}, className:"icon-arrow_up"}			]}, 			{tag: "a", attrs: {href: data.data.createAfter,title:"Create new after"}, className:"edit", children: [				{tag: "span", attrs: {}, className:"icon-arrow_down"}			]},              (function () {                var ret = [];               	if ( data.data.createInto )               		ret.push({tag: "a", attrs: {href: data.data.createInto,title:"Create new into"}, className:"edit", children: [                        {tag: "span", attrs: {}, className:"icon-arrow_right"}                    ]});                return ret;            })(),			{tag: "a", attrs: {href: data.link,title:"Edit","data-val": data.entry}, className:"edit", children: [				{tag: "span", attrs: {}, className:"icon-edit"}			]}		]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Edit', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.NameUrlname', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [		{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 columns", children: [			{tag: "span", attrs: {}, className:"title", children: [ data.structure.name]}		]}, 		{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end columns", children: [			{tag: "input", attrs: {type:"text",name: data.element,value: data.content,placeholder: data.structure.placeholder}}		]}	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.NameUrlname', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Order', function( data ) {	"use strict";	//if ( <span class="icon-list"></span>		return {tag: "div", attrs: {}, className:"icon-list", children: [				{tag: "span", attrs: {}, children: [ data.data]}				]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Order', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Picture', function( data ) {	"use strict";	return {tag: "span", attrs: {}, children: [		 (function () {			var ret = [];			if ( data.data.filename )				ret.push({tag: "img", attrs: {src: data.data.filename}});			return ret;		})() 	]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Picture', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Pictures', function( data ) {	"use strict";	return {tag: "div", attrs: {id:"pictures"}, children: [		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 columns", children: [				{tag: "span", attrs: {}, className:"title", children: ["qwe"]}			]}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end columns", children: [				{tag: "input", attrs: {type:"file",id:"filesPictures",name:"pics",value:"",placeholder:"",multiple:true}}			]}		]}, 		{tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [			{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 columns"			}, 			{tag: "div", attrs: {}, className:"small-12 medium-9 large-4 end columns", children: [				{tag: "button", attrs: {id:"picUploadButton"}, className:"button", children: ["Nalož"]}			]}		]}, 	{tag: "div", attrs: {id:"PicturesHolder"}, children: [		 (function () {			var entries = [];			if ( data.structure.data )				for ( var i = 0; i < data.structure.data.length; i++ ) {					var entry = data.structure.data[i];					entries.push({tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [						{tag: "div", attrs: {}, className:"small-6 medium-3 large-2", children: [							{tag: "span", attrs: {}, className:"title", children: ["asds"]}						]}, 						{tag: "div", attrs: {}, className:"small-6 medium-9 large-10", children: [							{tag: "span", attrs: {}, className:"title", children: [ entry.name]}						]}					]});				}			return entries;		})() 	]}]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Pictures', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            //el.style.display = 'none';
/*
            self.onEvent( document.getElementById('picUploadButton'), 'click', function( ev ) {
                ev.preventDefault();

                var input = document.getElementById('filesPictures');

                for ( var i = 0; i < input.files.length; i++) {

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.Edit.Field.Pictures',
                        action: 'upload',
                        data: {
                            'file': input.files,
                            'name': input.files[i].name,
                            'type': input.files[i].type
                        }
                    }).then( function( data ) {



                    }, function( errorResponse ) {
                    } );


                }

            });
*/
        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.Edit.Field.Tab', function( data ) {	"use strict";	return	{ (function () {		var ret = [];		for (var i = 0; i < data.structure.length; i++) {			var str = data.structure[i];			var componentData = {				'element': data.dimension ? data.dimension + '[' + str.element + ']' : str.element,				'structure': str,				'content': data.moduleData[str.element]			};			ret.push(br("component", {view: 'Domino.Admin.Entry.Edit.Field.' + str.elementItem,componentData:componentData }));		}		return ret;	})() }});

DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Tab', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Text', function( data ) {	"use strict";	var content = data.data.substring(0,30);	if ( data.column.clickable == 1 && data.link )		return {tag: "a", attrs: {href: data.link}, children: [content ]}	else		return {tag: "span", attrs: {}, children: [content ]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Text', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Time', function( data ) {	"use strict";	//if ( data.wrapper )		return {tag: "div", attrs: {}, className:"grid-x grid-padding-x field", children: [				{tag: "div", attrs: {}, className:"small-12 medium-3 large-2 columns", children: [					{tag: "span", attrs: {}, className:"title", children: [ data.structure.name]}				]}, 				{tag: "div", attrs: {}, className:"small-12 medium-9 large-10 end columns", children: [					{tag: "input", attrs: {type:"text",name: data.element,value: data.content,placeholder: data.structure.placeholder}, style:"width:80px;"}					]}				]}	//else		//return <input type="text" name={ data.name } value={ data.value } placeholder={ data.placeholder } />});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Time', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.Field.Varchar', function( data ) {	"use strict";	var linkType = "";    /*if ( data.options )        if ( data.options.link ) {            if ( data.options.link == 'returnEntry' )                var linkType = "returnEntry";        }*/	//if ( data.column.clickable == 1 && data.link )	//	return <div><a href={ data.link } name={ linkType } data-val={ data.entry }>{ data.data }</a></div>	//else		return {tag: "span", attrs: {name:linkType,"data-val": data.entry}, children: [ data.data]}});

DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Varchar', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";



        }
    }
}));
DominoViews.registerView( 'Domino.Admin.Entry.List.List', function( data ) {	"use strict";	return {tag: "table", attrs: {}, children: [		{tag: "thead", attrs: {}, children: [		{tag: "tr", attrs: {}, children: [			 (function () {				var ret = [];				ret.push( {tag: "th", attrs: {}, className:"tdArrow"} );				for ( var i = 0; i < data.columns.length; i++ ) {					var column = data.columns[i],						width = column.width ? 'width:' + column.width : '';					if ( ( column.structureType == 'order' ) || ( column.structureType == 'bool' ) || ( column.structureType == 'delete' ) || ( column.structureType == 'edit' ) || ( column.structureType == 'deploy' ) )						width = 'width:5%';					// add sortable					ret.push( {tag: "th", attrs: {}, style:width , children: [ column.name]} );				}				return ret;			})() 				]}			]}, 		br("component", {view:"Domino.Admin.Entry.List.List.Entries",componentData:data })	]}} );

DominoControllers.registerController( 'Domino.Admin.Entry.List.List', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            if ( data.moveToParent ) {

                var parEl = document.getElementById(data.moveToParent);

                if ( parEl ) {

                    var childTr = parEl.nextSibling;
                    var arrow = parEl.firstChild.firstChild;

                    data.options.parent = entry;

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.List',
                        action: ( data.options.type == 'index' ) ? 'entriesIndex' : 'entries',
                        data: {
                            'options': data.options,
                            'pagination': data.pagination,
                            'siteIndexHack': true
                        }
                    }).then( function( renderData ) {

                        DominoApp.renderView ( childTr.firstChild, 'Domino.Admin.Entry.List.List.Entries', renderData );
                        childTr.style.display = 'table-row';
                        arrow.className = 'arrow icon-arrow_down';
                        var bodyRect = document.body.getBoundingClientRect();
                        var elemRect = parEl.getBoundingClientRect();
                        var offset   = elemRect.top - bodyRect.top;
                        window.scrollTo(0, ( offset - 50 ) );

                    }, function( errorResponse ) {
                    } );

                }

            }



        }

    }
} ) );
DominoViews.registerView( 'Domino.Admin.Entry.List.List.Entries', function( data ) {	"use strict";	var fillData = function (entryData, level, levInd ) {		var ret = [];		if ( entryData.entries ) {            for (var i = 0; i < entryData.entries.length; i++) {				var entry = entryData.entries[i];				var disp = ( level == 0 ) ? '' : '';                var levelIndex = ( level == 0 ) ? i : levInd + '|' + i;                if ( ( entryData.pagination.pages > 1 ) && ( i == 0 ) )					ret.push({tag: "tr", attrs: {parent: entry.parent}, className:'pagination',style:disp , children: [{tag: "td", attrs: {colspan: entryData.columns.length + 1}, children: [br("component", {view:"Domino.Admin.Entry.List.Pagination",componentData: entryData.pagination})]}]});                if ( entry.data )                    ret.push({tag: "tr", attrs: {entry: entry.entry,index:levelIndex }, className: 'list level' + level,style:disp , children: [ (function () {                        var ret2 = [];                        if ( entry.hasChildren )                            ret2.push({tag: "td", attrs: {name:"arrow",entry: entry.entry}, className:"tdArrow", children: [{tag: "span", attrs: {}, className:"arrow icon-arrow_right"}]});                        else                            ret2.push({tag: "td", attrs: {}, className:"tdArrow"});                        if ( entry.data ) {                            for (var col = 0; col < entryData.columns.length; col++) {                                var colData = entry.data[col],                                    column = entryData.columns[col],                                    clickable = ( column.clickable == true ) ? 'click' : '';                                var cData = {                                    options: data.options,                                    column: column,                                    data: colData,                                    link:  entry['link'],                                    id: entry['id'],                                    entry: entry.entry                                };                                ret2.push({tag: "td", attrs: {}, className:clickable , children: [br("component", {view: 'Domino.Admin.Entry.List.Field.' + column['structureItem'],componentData:cData })]});                                //ret2.push(<td class={ clickable }><a href={ entry.link }>{ colData }</a></td>);                            }                        }                        else                            ret2.push({tag: "td", attrs: {entry: entry.entry,colspan: entryData.columns.length}, children: [ entry['colName']," ",{tag: "small", attrs: {}, children: [ entry.entry]}]});                        return ret2;                    })() ]});                else                    ret.push({tag: "tr", attrs: {entry: entry.entry,index:levelIndex }, className:'list root',style:disp , children: [ (function () {                            var ret2 = [];                            if ( entry.hasChildren )                                ret2.push({tag: "td", attrs: {name:"arrow",entry: entry.entry}, children: [{tag: "span", attrs: {}, className:"arrow icon-arrow_right"}]});                            return ret2;                        })(),                        {tag: "td", attrs: {colspan: entryData.columns.length}, className:"click", children: [                             entry['colName']," ",{tag: "small", attrs: {}, children: [ entry.entry]}                        ]}                    ]});                var theEntry = false;                if ( entry.list )                    if ( entry.list.entries )                        if ( entry.list.entries.length > 0 )                            theEntry = true;                if ( entry.hasChildren && theEntry === false )                    ret.push({tag: "tr", attrs: {parent: entry.parent}, style:"display:none",className:"children", children: [{tag: "td", attrs: {colspan: entryData.columns.length + 1}}]});                else if ( entry.hasChildren && theEntry === true ) {                    ret.push({tag: "tr", attrs: {parent: entry.parent}, style:"display:none",className:"children", children: [                        {tag: "td", attrs: {colspan: entryData.columns.length + 1}, children: [{tag: "table", attrs: {}, children: [{tag: "tbody", attrs: {}, children: [ fillData( entry.list , (level + 1), levelIndex) ]}]}]}                    ]});                }			}		}		//var r = [];            return ret ;		//return r;	}        return {tag: "tbody", attrs: {}, children: [ fillData ( data, 0, 0) ]};} );

DominoControllers.registerController( 'Domino.Admin.Entry.List.List.Entries', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            // if link redirect to it
            if ( data.options.link ) {

                function levelLink ( entries, indexes, level) {

                    var ind = indexes[level];

                    var levelData = entries[ind];
                    var lev = level + 1;
                    if ( ( indexes.length == lev ) && levelData.link )
                        return levelData.link;
                    else
                        return levelLink ( levelData.list.entries, indexes, lev );
                }

                this.onEvent( el.querySelectorAll('.click'), 'click', function( ev ) {
                    ev.preventDefault();

                    var thisLevelIndex = this.parentNode.getAttribute('index').split('|');

                    if ( thisLevelIndex && data.entries[0].link ) {

                        var link = levelLink( data.entries, thisLevelIndex, 0);

                        if ( link )
                            DominoApp.redirect( link );
                    }

                });

            }

            // if click on .click
            this.onEvent( el.querySelectorAll('.click'), 'click', function( ev ) {
                ev.preventDefault();
                var entry = this.parentNode.getAttribute('entry');

                var index = parseInt(this.parentNode.getAttribute('index'), 10 );

                var returns = data.options.return;

                if ( data.options.selectorId == 'addCrossModules' ) {
                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.Edit.Field.Cross',
                        action: 'addCrossModules',
                        data: {
                            'entry': entry
                        }
                    }).then( function( success ) {

                        // add tab li

                        // render cross view

                    });

                }
                else if ( data.options.selectorId == ( 'addCross' ) ) {

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.Edit.Field.Cross',
                        action: 'addCross',
                        data: {
                            'entry': entry
                        }
                    }).then( function( success ) {

                        // add row to the list


                    });

                }
                else
                    for ( var key in data.options.return ) {
                        if (!data.options.return.hasOwnProperty(key)) continue;
                        var returnColArr = data.options.return[key];
                        var returnColEl = returnColArr['element'];
                        var returnColName = returnColArr['name'];

                        var returnEntry = data.entries[index];


                        var returnKeys = document.getElementsByName(key);
                        for ( var i = 0; i < returnKeys.length; i++ ) {
                            var returnKey = returnKeys[i];
                            returnKey.value = returnEntry[returnColEl];

                            var miniSelSpan = document.getElementById('span' + key );
                            miniSelSpan.innerText = returnEntry.data ? returnEntry.data[0] : returnEntry.colName;
                        }
                    }

                var miniSel = document.getElementById('miniSel' + data.options.selectorId );
                if ( miniSel )
                    miniSel.style.display = 'none';

            });


            var rets = document.getElementsByName('returnEntry');
            for ( var i = 0; i < rets.length; i++ ) {
                this.onEvent(rets[i], 'click', function (ev) {
                    "use strict";
                    ev.preventDefault();
                    var returnValue = this.getAttribute('data-val');

                    var span = document.getElementsByName('span' + data.options.element);
                    if ( span[0] )
                        span[0].innerText = returnValue;

                    var inp = document.getElementsByName(data.options.element);
                    if ( inp[0] )
                        inp[0].value = returnValue;

                    var dd = document.querySelector('dd[name="miniSelector"][style="display: block;"]');
                    if ( dd )
                        dd.style.display = "none";

                });
            }



            var arrows = el.querySelectorAll('[name="arrow"]');

            for ( var i = 0; i < arrows.length; i++ ) {

                this.onEvent( arrows[i], 'click', function( ev ) {
                    ev.preventDefault();

                    var self = this;
                    var entry = this.getAttribute('entry');
                    var arrow = this.firstChild;
                    //var childEntries = document.querySelectorAll('tr[parent="' + entry + '"]'); // document.getElementsByName(entry);
                    //var childEntries = this.parentNode.parentNode.querySelectorAll('tr[parent="' + entry + '"]'); // document.getElementsByName(entry);
                    var childTr = this.parentNode.nextSibling;
                    var childEntries = childTr.firstChild.childNodes;

                    // if no children so ajax needed
                    if ( !childEntries.length ) {

                        data.options.parent = entry;

                        DominoApp.ajax({
                            view: 'Domino.Admin.Entry.List',
                            action: ( data.options.type == 'index' ) ? 'entriesIndex' : 'entries',
                            data: {
                                'options': data.options,
                                'pagination': data.pagination,
                                'siteIndexHack': true
                            }
                        }).then( function( renderData ) {

                            DominoApp.renderView ( childTr.firstChild, 'Domino.Admin.Entry.List.List.Entries', renderData );
                            childTr.style.display = 'table-row';
                            arrow.className = 'arrow icon-arrow_down';

                        }, function( errorResponse ) {
                        } );

                    }
                    else { // if no ajax but entries already exist
                        if ( childTr.style.display == 'table-row' ) {
                            childTr.style.display = 'none';
                            arrow.className = 'arrow icon-arrow_right';
                        }
                        else {
                            childTr.style.display = 'table-row';
                            arrow.className = 'arrow icon-arrow_down';
                        }

                    }



                });

            }

            // Pagination
            this.onEvent( el.querySelectorAll( '.paginate' ) , 'click', function( ev ) {
                ev.preventDefault();

                if ( this.getAttribute('class') == 'paginate' ) {

                    var page = this.getAttribute('name');

                    if ( page == 'pagePrev' )
                        data.pagination.currentPage = data.pagination.currentPage - 1;
                    else if ( page == 'pageNext' )
                        data.pagination.currentPage = data.pagination.currentPage + 1;
                    else
                        data.pagination.currentPage = page;

                    if ( data.pagination.currentPage == data.pagination.pages ) {
                        el.querySelector('[name="pageNext"]').className = 'paginate active';
                    }
                    if ( data.pagination.currentPage == 1 ) {
                        el.querySelector('[name="pagePrev"]').className = 'paginate active';
                    }

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.List',
                        action: 'pageEntries',
                        data: data
                    }).then( function( success ) {


                        var view = el;

                        DominoApp.renderView( view, 'Domino.Admin.Entry.List.List.Entries', success.list );

                    });

                }


            });


        }

    }
} ) );
DominoViews.registerView( 'Domino.Admin.Entry.List.Pagination', function( data ) {	"use strict";    if ( data.translate )        return {tag: "div", attrs: {}, className:"domino-pagination grid-x", children: [                    {tag: "div", attrs: {}, className:"small-12 medium-6 cell", children: [                         '' + data.translate.page," ",{tag: "span", attrs: {}, className:"pagination-current", children: [ '' + data.currentPage]}, " ", data.translate.pageOf," ",{tag: "span", attrs: {}, className:"pagination-all", children: [ '' + data.pages]}, " (", data.translate.allEntries,": ",{tag: "span", attrs: {}, className:"pagination-entries", children: [ '' + data.numEntries]}, ")"
                    ]},                      {tag: "div", attrs: {}, className:"small-12 medium-6 cell text-right", children: [                        {tag: "a", attrs: {href:"",name:"pagePrev"}, className: data.currentPage == 1 ? 'paginate active' : 'paginate', children: [                            {tag: "span", attrs: {}, className:"icon-arrow_left"}                        ]},                           (function () {                             var ret = [];                             for ( var i = 0; i < data.pages; i++ ) {                                 var page = i + 1;                                 var active = ( page == data.currentPage ) ? 'paginate active' : 'paginate';                                 // add sortable                                 ret.push( {tag: "a", attrs: {href: '' + page,name: '' + page}, className:active , children: [ '' + page]} );                             }                             return ret;                         })(),                        {tag: "a", attrs: {href:"",name:"pageNext"}, className: data.currentPage == data.pages ? 'paginate active' : 'paginate', children: [                            {tag: "span", attrs: {}, className:"icon-arrow_right"}                        ]}                    ]}        ]}} );

DominoControllers.registerController( 'Domino.Admin.Entry.List.Pagination', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;

            var paginate = el.querySelectorAll('.paginate');

            for ( var i = 0; i < paginate.length; i++ ) {
                var pag = paginate[i];

                self.onEvent( pag , 'click', function (ev) {
                    ev.preventDefault();



                });

            }

        }

    }
} ) );
DominoViews.registerView( 'Domino.Admin.Entry.List.SubActions', function( data ) {	"use strict";	if ( data )		if ( data.buttons )		return {tag: "div", attrs: {}, className:"domino-subactions grid-x grid-padding-x", children: [						 (function () {							if ( data.buttons ) {								var ret = [];								for (var key in data.buttons) {									// skip loop if the property is from prototype									if (!data.buttons.hasOwnProperty(key)) continue;									var entry = data.buttons[key];									if ( key == 'filterEntries')										ret.push({tag: "div", attrs: {}, className:"pad shrink cell", children: [											{tag: "input", attrs: {type:"text",name:"FilterEntries",autocomplete:"off",placeholder:"Filtriraj ..."}, className:"filterEntries"}										]});									else if ( key == 'langSwitcher')										ret.push({tag: "div", attrs: {}, className: 'pad shrink cell ' + entry.position, children: [												 (function () {													var ret2 = [];													if ( data.dimensions.length )														ret2.push({tag: "span", attrs: {}, className:"text", children: ["Select language"]});													else {                                                        ret2.push({tag: "span", attrs: {}, className:"text", children: ["Language"]});                                                        ret2.push({tag: "a", attrs: {href:"#",lang: data.lang,disabled:true}, className:"is-active", children: [ data.lang]});													}													for ( var i = 0; i < data.dimensions.length; i++ ) {														var dimension = data.dimensions[i];														var buttonClass = ( dimension.id == data.lang ) ? 'is-active' : '';														ret2.push({tag: "a", attrs: {lang: dimension.id,name:"langSwitcher",href:"#"}, className:buttonClass , children: [ dimension.name]});													}													return ret2;												})() 										]});								}								return ret;							}						})() 				]}} );


DominoControllers.registerController( 'Domino.Admin.Entry.List.SubActions', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;

            self.onEvent( document.querySelectorAll('a[name="langSwitcher"]'), 'click', function( ev ) {
                ev.preventDefault();
                var self = this;
                // hide old lang
                var oldLangBtn = el.querySelector('a.is-active');
                if ( oldLangBtn) {
                    var oldLang = oldLangBtn.getAttribute('lang');
                    var oldLangDivs = document.querySelectorAll('div[name="' + 'dim' + oldLang + '"]');
                    if ( oldLangDivs )
                        for ( var i = 0; i < oldLangDivs.length; i++ )
                            oldLangDivs[i].style.display = "none";
                    oldLangBtn.removeAttribute('class');

                    // show new lang
                    var newLang = self.getAttribute('lang');
                    var newLangDivs = document.querySelectorAll('div[name="' + 'dim' + newLang + '"]');
                    if ( newLangDivs)
                        for ( var i = 0; i < newLangDivs.length; i++ )
                            newLangDivs[i].removeAttribute('style');
                    self.setAttribute('class', 'is-active');
                }
            });



        }
    }

}));

