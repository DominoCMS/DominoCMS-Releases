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
 * DominoCMS Open Source 1.0 Installer
 * www.dominocms.com
 * 1.0.0. b
 * 2018-02-26 21:48
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
        setTimeout(function() { ScrollToResolver(elem);}, "40");
    } else {
        elem.lastjump = null;
    }
}

var DominoAppViewStack = [];

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
                var url = '/install/';
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
                                                refreshController['refreshAction']( refreshEl, key, getData.refreshData[key] );
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
DominoViews.registerView( 'Domino.Installer', function( data ) {	"use strict";	return {tag: "div", attrs: {name:"top"}, className:"domino-installer", children: [            br("component", {view:"Domino.Installer.Steps"}),         	{tag: "div", attrs: {id:"inner"}}		]}} );


DominoControllers.registerController( 'Domino.Installer', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {




        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Steps', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"steps", children: [            {tag: "div", attrs: {id:"Step1"}, className:"step is-active", children: [                {tag: "h2", attrs: {}, children: ["Step 1"]},                 {tag: "h3", attrs: {}, children: ["Server"]}            ]},             {tag: "div", attrs: {id:"Step2"}, className:"step", children: [                {tag: "h2", attrs: {}, children: ["Step 2"]},                 {tag: "h3", attrs: {}, children: ["Db connect"]}            ]},             {tag: "div", attrs: {id:"Step3"}, className:"step", children: [                {tag: "h2", attrs: {}, children: ["Step 3"]},                 {tag: "h3", attrs: {}, children: ["User"]}            ]},             {tag: "div", attrs: {id:"Step4"}, className:"step", children: [                {tag: "h2", attrs: {}, children: ["Step 4"]},                 {tag: "h3", attrs: {}, children: ["Template"]}            ]},             {tag: "div", attrs: {id:"Step5"}, className:"step", children: [                {tag: "h2", attrs: {}, children: ["Step 5"]},                 {tag: "h3", attrs: {}, children: ["Success"]}            ]}        ]};} );


DominoControllers.registerController( 'Domino.Installer.Steps', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


        },
        'refreshAction': function ( el, view, data ) {

            var isactive = el.querySelector('.is-active');
            if ( isactive )
                isactive.className = 'step';

            var isactive = document.getElementById(data.url);
            if ( isactive )
                isactive.className = 'step is-active';


        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Welcome', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-installer", children: [        {tag: "div", attrs: {}, className:"welcome", children: [            {tag: "div", attrs: {}, className:"in", children: [                {tag: "h1", attrs: {}, children: ["Welcome to the world of"]},                 {tag: "img", attrs: {src:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyODMuNSA1Ni43IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyODMuNSA1Ni43OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qxe2ZpbGw6IzFENzFCODt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTExMy45LDMyLjZjMCw1LjYtNC4zLDkuOC0xMC4xLDkuOGMtNS44LDAtMTAtNC4yLTEwLTkuOGMwLTUuNiw0LjMtOS44LDEwLTkuOAoJCQlDMTA5LjYsMjIuOCwxMTMuOSwyNywxMTMuOSwzMi42eiBNOTguOSwzMi42YzAsMywyLjEsNS4xLDQuOSw1LjFjMi44LDAsNS0yLjEsNS01LjFjMC0zLTIuMS01LjEtNS01LjEKCQkJQzEwMSwyNy40LDk4LjksMjkuNiw5OC45LDMyLjZ6Ii8+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE0Mi43LDMwdjExLjloLTVWMzEuNmMwLTIuNy0xLjQtNC4yLTMuNi00LjJjLTIuMiwwLTMuOSwxLjQtMy45LDQuMnYxMC4yaC01VjMxLjZjMC0yLjctMS4zLTQuMi0zLjYtNC4yCgkJCWMtMi4xLDAtMy45LDEuNC0zLjksNC4ydjEwLjJoLTVWMjMuM2g0Ljl2Mi4yYzEuMy0yLDMuNC0yLjcsNS41LTIuN2MyLjcsMCw0LjksMS4yLDYuMSwzLjJjMS40LTIuNCwzLjktMy4yLDYuMy0zLjIKCQkJQzEzOS43LDIyLjgsMTQyLjcsMjUuNywxNDIuNywzMHoiLz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQ5LjEsNDEuOWgtNVYyMy4zaDVWNDEuOXoiLz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTY4LjUsMzB2MTEuOWgtNVYzMS42YzAtMi43LTEuMy00LjItMy42LTQuMmMtMi4xLDAtMy45LDEuNC0zLjksNC4ydjEwLjJoLTVWMjMuM2g0Ljl2Mi4yCgkJCWMxLjMtMiwzLjQtMi43LDUuNS0yLjdDMTY1LjUsMjIuOCwxNjguNSwyNS43LDE2OC41LDMweiIvPgoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODgsMzIuNmMwLDUuNi00LjMsOS44LTEwLjEsOS44Yy01LjgsMC0xMC00LjItMTAtOS44YzAtNS42LDQuMy05LjgsMTAtOS44QzE4My43LDIyLjgsMTg4LDI3LDE4OCwzMi42egoJCQkgTTE3MywzMi42YzAsMywyLjEsNS4xLDQuOSw1LjFjMi44LDAsNS0yLjEsNS01LjFjMC0zLTIuMS01LjEtNS01LjFDMTc1LjEsMjcuNCwxNzMsMjkuNiwxNzMsMzIuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODIsMTVINzAuOXYyMS4zbDUuNC0zLjlWMjBIODJjNS43LDAsOC40LDMuNSw4LjQsOC40YzAsNC45LTIuNyw4LjQtOC40LDguNGgtNC40bC02LjcsNUg4MgoJCQljOC40LDAsMTQtNS4zLDE0LTEzLjRTOTAuNCwxNSw4MiwxNXoiLz4KCTwvZz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNDkuOCwxOC4yYzAsMS44LTEuNCwzLjItMy4yLDMuMmMtMS44LDAtMy4yLTEuNC0zLjItMy4yYzAtMS44LDEuNC0zLjIsMy4yLTMuMgoJCUMxNDguNCwxNSwxNDkuOCwxNi40LDE0OS44LDE4LjJ6Ii8+CjwvZz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTYzLjcsMTguMUM2MCw3LjksNDQuMyw0LjMsMjguNiwxMEMxMi44LDE1LjcsMy4xLDI4LjYsNi44LDM4LjhDMTAuNSw0OSwyNi4zLDUyLjYsNDIsNDYuOQoJQzU3LjcsNDEuMiw2Ny40LDI4LjMsNjMuNywxOC4xeiBNMzYuOSw0MS44aC0xMWw2LjYtNWg0LjNjNS42LDAsOC40LTMuNSw4LjQtOC40YzAtNC45LTIuNy04LjQtOC40LTguNGgtNS42djEyLjNsLTUuMywzLjlWMTUuMWgxMQoJYzguNCwwLDEzLjksNS4zLDEzLjksMTMuNEM1MC44LDM2LjUsNDUuMyw0MS44LDM2LjksNDEuOHoiLz4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjc0LDIxLjdjLTEuOSwwLTMuNC0xLjUtMy40LTMuNGMwLTEuOSwxLjUtMy40LDMuNC0zLjRzMy40LDEuNSwzLjQsMy40QzI3Ny41LDIwLjEsMjc1LjksMjEuNywyNzQsMjEuN3oKCQkgTTI3NCwxNS4zYy0xLjYsMC0yLjksMS4zLTIuOSwyLjlzMS4zLDIuOSwyLjksMi45czIuOS0xLjMsMi45LTIuOVMyNzUuNiwxNS4zLDI3NCwxNS4zeiIvPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTI3Mi43LDE2LjVoMS42YzAuMiwwLDAuNCwwLDAuNiwwLjFjMC4yLDAuMSwwLjMsMC4xLDAuNCwwLjNjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjNjMCwwLjEsMC4xLDAuMywwLjEsMC40CgkJCXYwYzAsMC4xLDAsMC4zLTAuMSwwLjRjMCwwLjEtMC4xLDAuMi0wLjIsMC4zYy0wLjEsMC4xLTAuMiwwLjItMC4zLDAuMmMtMC4xLDAuMS0wLjIsMC4xLTAuMywwLjFsMC45LDEuM2gtMC43bC0wLjktMS4yaDBoLTAuOAoJCQlWMjBoLTAuNlYxNi41eiBNMjc0LjIsMTguMmMwLjIsMCwwLjQtMC4xLDAuNS0wLjJzMC4yLTAuMiwwLjItMC40djBjMC0wLjItMC4xLTAuMy0wLjItMC40Yy0wLjEtMC4xLTAuMy0wLjEtMC41LTAuMWgtMC45djEuMgoJCQlIMjc0LjJ6Ii8+Cgk8L2c+CjwvZz4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE0LjgsMjAuMWwtMy42LDIuNGMtMS42LTIuNC00LjMtMy45LTcuNS0zLjljLTUuNSwwLTkuNSw0LTkuNSw5LjhzNCw5LjgsOS41LDkuOGMzLjIsMCw1LjgtMS40LDcuNS0zLjkKCQlsMy41LDIuNmMtMi4zLDMuNC02LjMsNS40LTExLDUuNGMtOC4zLDAtMTQuMS01LjktMTQuMS0xMy45YzAtOCw1LjgtMTMuOSwxNC4xLTEzLjlDMjA4LjQsMTQuNSwyMTIuNywxNi42LDIxNC44LDIwLjF6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQ1LjUsNDEuOWgtNC4zVjE5LjhsLTcuOSwxOS41aC00LjZMMjIwLjksMjB2MTQuNGwtNC4zLTMuOVYxNWg2LjdsNy44LDE5LjJsNy44LTE5LjJoNi43VjQxLjl6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjY2LjgsMjFjLTIuMy0xLjUtNC44LTIuMy03LjUtMi4zYy0zLjYsMC02LDEuNi02LDRjMCwyLjIsMi4xLDMuMSw1LjYsMy42bDEuOSwwLjJjNC40LDAuNiw4LjcsMi40LDguNyw3LjQKCQljMCw1LjUtNSw4LjUtMTAuOCw4LjVjLTMuNiwwLTgtMS4yLTEwLjgtMy42bDIuNC0zLjVjMS44LDEuNyw1LjMsMyw4LjQsM2MzLjUsMCw2LjMtMS41LDYuMy00YzAtMi4xLTIuMS0zLjEtNi0zLjZsLTIuMS0wLjMKCQljLTQtMC42LTgtMi40LTgtNy40YzAtNS40LDQuOC04LjQsMTAuNi04LjRjMy45LDAsNywxLjEsOS43LDIuOUwyNjYuOCwyMXoiLz4KPC9nPgo8L3N2Zz4K",alt:""}},             {tag: "p", attrs: {}, children: ["This won't take long. Just a couple of easy steps and you're ready to ",{tag: "br", attrs: {}}, "Create your Future."]},                 {tag: "p", attrs: {}, children: [                    {tag: "a", attrs: {button:true,href:"?url=Step1"}, className:"button", children: ["Press to begin with installation"]}                ]}            ]}        ]}    ]};} );


DominoControllers.registerController( 'Domino.Installer.Welcome', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {



        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Step1', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"wrapper", children: [            {tag: "div", attrs: {}, className:"in", children: [                {tag: "h1", attrs: {}, children: ["Step 1"]},                 {tag: "h2", attrs: {}, children: ["First decisions"]},                 {tag: "form", attrs: {method:"post",id:"submitForm"}, children: [                    {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                        {tag: "legend", attrs: {}, children: ["Server type"]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "span", attrs: {}, className:"text", children: ["Select your server type:"]}                            ]}                        ]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell small-3", children: [                                {tag: "label", attrs: {}, children: [                                    {tag: "h2", attrs: {}, children: ["Nginx"]},                                     {tag: "input", attrs: {type:"radio",name:"serverType",value:"nginx",checked:true}}                                ]}                            ]},                             {tag: "div", attrs: {}, className:"cell small-3", children: [                                {tag: "label", attrs: {}, children: [                                    {tag: "h2", attrs: {}, children: ["Apache"]},                                     {tag: "input", attrs: {type:"radio",name:"serverType",value:"apache"}}                                ]}                            ]},                             {tag: "div", attrs: {}, className:"cell small-3", children: [                                {tag: "label", attrs: {}, children: [                                    {tag: "h2", attrs: {}, children: ["Windows IIS"]},                                     {tag: "input", attrs: {type:"radio",name:"serverType",value:"windows"}}                                ]}                            ]},                             {tag: "div", attrs: {}, className:"cell small-3", children: [                                {tag: "label", attrs: {}, children: [                                    {tag: "h2", attrs: {}, children: ["Other"]},                                     {tag: "input", attrs: {type:"radio",name:"serverType",value:"other"}}                                ]}                            ]}                        ]}                    ]},                     {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                        {tag: "legend", attrs: {}, children: ["Server directives"]},                         {tag: "div", attrs: {id:"nginx"}, className:"grid-x box",className:"directives is-active", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, children: ["These directives must be applied to your server block in order for DominoCMS and it's friendly url's to work."]},                                 {tag: "code", attrs: {}, children: ["location @rewrite {",{tag: "br", attrs: {}}, 
                                    "   rewrite ^/(.*)$ /index.php?url=$1;",{tag: "br", attrs: {}}, 
                                    "}"
                                ]}                            ]}                        ]},                         {tag: "div", attrs: {id:"apache"}, className:"grid-x box",className:"directives", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, children: ["These directives must be applied to your server block in order for DominoCMS and it's friendly url's to work."]},                                 {tag: "code", attrs: {}, children: ["Coming soon or let us on ",{tag: "a", attrs: {href:"https://github.com/dominocms",target:"_blank"}, children: ["GitHub"]}, "."]}                            ]}                        ]},                         {tag: "div", attrs: {id:"windows"}, className:"grid-x box",className:"directives", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, children: ["These rewrite rules must be applied to your web.config in order for DominoCMS and it's friendly url's to work."]},                                 {tag: "code", attrs: {}, children: ["Coming soon or let us on ",{tag: "a", attrs: {href:"https://github.com/dominocms",target:"_blank"}, children: ["GitHub"]}, "."]}                            ]}                        ]},                         {tag: "div", attrs: {id:"other"}, className:"grid-x box",className:"directives", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, children: ["What other servers should be included? Let us on ",{tag: "a", attrs: {href:"https://github.com/dominocms",target:"_blank"}, children: ["GitHub"]}, "."]}                            ]}                        ]}                    ]},                     {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                        {tag: "legend", attrs: {}, children: ["Technology pack"]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, className:"text", children: ["Currently only DJS1-SF6-D1 technology pack items are available in the library and store."+' '+
                                    "That means that current items are created on DJS1 (pure javascript, DominoJS), SF6 (Sass - Zurb Foundation 4 grid - not exclusive), D1 (DominoPhp, Php 5.4>). We suggest you currently use this technology pack. Read more about technologies in the ",{tag: "a", attrs: {href:"https://docs.dominocms.com/getting-started/technologies",target:"_blank"}, children: ["documentation"]}, "."]}                            ]}                        ]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell small-6", children: [                                {tag: "input", attrs: {type:"text",name:"technology",value: data.technology,"data-validate":"required"}}                            ]}                        ]}                    ]},                     {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                        {tag: "legend", attrs: {}, children: ["Working with"]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, className:"text", children: ["Currently we are still missing a php class to convert (JSX to JS) files, so a filewatcher must be applied to produce template views in your IDE. Creating template views in the DominoCMS panel is therefore not yet available."]},                                 {tag: "p", attrs: {}, children: ["Read more about the file watcher installation in the ",{tag: "a", attrs: {href:"https://docs.dominocms.com/installation/file-watchers",target:"_blank"}, children: ["documentation"]}, " or get it directly from ",{tag: "a", attrs: {href:"https://www.npmjs.com/package/jsx-bobril",target:"_blank"}, children: ["JSX-Bobril"]}, "."]}                            ]}                        ]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell small-6", children: [                                {tag: "label", attrs: {}, children: [                                    {tag: "h2", attrs: {}, children: ["IDE"]},                                     {tag: "p", attrs: {}, children: ["eg. PhpStorm, ..."]},                                     {tag: "input", attrs: {type:"radio",name:"workingType",value:"ide",checked:true}}                                ]}                            ]},                             {tag: "div", attrs: {}, className:"cell small-6", children: [                                {tag: "label", attrs: {}, children: [                                    {tag: "h2", attrs: {}, children: ["Through Domino panel"]},                                     {tag: "p", attrs: {}, children: ["Only content editing for now - php JSX transformer not yet available."]},                                     {tag: "input", attrs: {type:"radio",name:"workingType",value:"admin"}}                                ]}                            ]}                        ]}                    ]}                ]},                 {tag: "div", attrs: {id:"missing"}, className:"domino-missing hidden", children: [                    {tag: "p", attrs: {}, children: ["All required fields are not filled."]}                ]},                 {tag: "div", attrs: {id:"loading"}, className:"domino-spinner hidden", children: [                    {tag: "section", attrs: {}, className:"ctnr", children: [                        {tag: "div", attrs: {}, className:"ldr large", children: [                            {tag: "div", attrs: {}, className:"ldr-blk"},                             {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                             {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                             {tag: "div", attrs: {}, className:"ldr-blk"}                        ]}                    ]}                ]},                 {tag: "p", attrs: {}, children: [                    {tag: "a", attrs: {id:"goToNextStep",href:"?url=Step2"}, className:"button", children: ["Proceed to Step 2"]}                ]}            ]}        ]};} );


DominoControllers.registerController( 'Domino.Installer.Step1', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            var radiosServer = document.getElementsByName('serverType');
            for ( var i = 0; i < radiosServer.length; i++ ) {

                if ( radiosServer[i].value == data.serverType ) {
                    radiosServer[i].checked = true;
                    break;
                }
            }
            var radiosWorkingType = document.getElementsByName('workingType');
            for ( var i = 0; i < radiosServer.length; i++ ) {
                if ( radiosWorkingType[i].value == data.workingType ) {
                    radiosWorkingType[i].checked = true;
                    break;
                }
            }


            // Close when clicked on a subpage
            this.onEvent( document.getElementById('goToNextStep') , 'click', function( ev ) {

                ev.preventDefault();

                var href = this.getAttribute('href');

                document.getElementById('missing').className = 'domino-missing hidden';
                document.getElementById('loading').className = 'domino-spinner';

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('submitForm') );

                if ( validateFormData !== false ) {
                    DominoApp.ajax({
                        view: view,
                        action: 'submit',
                        data: validateFormData
                    }).then( function( data ) {
                        //window.scrollTo(0, 0);

                        ScrollTo('top');
                        DominoApp.redirect(href);

                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';

            });

            // Close when clicked on a subpage
            this.onEvent(  document.getElementsByName('serverType'), 'change', function( ev ) {

                ev.preventDefault();

                var directives = document.querySelectorAll('.directives');
                for ( var i = 0; i < directives.length; i++) {
                    var directive = directives[i];
                    directive.className = 'directives';
                }

                var id = this.value;
                document.getElementById(id).className = 'directives is-active';

            });
        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Step2', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"wrapper", children: [        {tag: "div", attrs: {}, className:"in", children: [            {tag: "h1", attrs: {}, children: ["Step 1"]},             {tag: "h2", attrs: {}, children: ["Setting up the config file and connect to db"]},             {tag: "form", attrs: {method:"post",id:"submitForm"}, children: [                {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                    {tag: "legend", attrs: {}, children: ["Database"]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["Write your connect details:"]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Host"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"dbHost",value: data.dbHost,placeholder:"localhost","data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Db name"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"dbName",value: data.dbName,placeholder:"db name","data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Username"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"dbUsername",value: data.dbUsername,placeholder:"","data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Password"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"dbPassword",value: data.dbPassword,placeholder:"","data-validate":"required"}}                        ]}                    ]}                ]},                 {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                    {tag: "legend", attrs: {}, children: ["Paths"]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["Set up your paths:"]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["It is recommended that you do not keep all of your files in the public folder. Define your private folder, where libraries and important files will be kept."]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Private folder"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"folderPrivate",value: data.folderPrivate,"data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Public folder"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"folderPublic",value: data.folderPublic,"data-validate":"required"}}                        ]}                    ]}                ]}            ]},             {tag: "div", attrs: {id:"missing"}, className:"domino-missing hidden", children: [                {tag: "p", attrs: {}, children: ["All required fields are not filled."]}            ]},             {tag: "div", attrs: {id:"dbfailed"}, className:"domino-missing hidden", children: [                {tag: "p", attrs: {}, children: ["Database connection failed, try again."]}            ]},             {tag: "div", attrs: {id:"loading"}, className:"domino-spinner hidden", children: [                {tag: "section", attrs: {}, className:"ctnr", children: [                    {tag: "div", attrs: {}, className:"ldr large", children: [                        {tag: "div", attrs: {}, className:"ldr-blk"},                         {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                         {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                         {tag: "div", attrs: {}, className:"ldr-blk"}                    ]}                ]}            ]},             {tag: "p", attrs: {}, children: [                {tag: "a", attrs: {href:"?url=Step1"}, className:"button", children: ["Back"]},                 {tag: "a", attrs: {id:"goToNextStep",href:"?url=Step3"}, className:"button", children: ["Proceed to Step 3"]}            ]}        ]}    ]};} );


DominoControllers.registerController( 'Domino.Installer.Step2', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {



            // Close when clicked on a subpage
            this.onEvent( document.getElementById('goToNextStep') , 'click', function( ev ) {

                ev.preventDefault();

                var href = this.getAttribute('href');

                document.getElementById('missing').className = 'domino-missing hidden';
                document.getElementById('dbfailed').className = 'domino-missing hidden';
                document.getElementById('loading').className = 'domino-spinner';

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('submitForm') );

                if ( validateFormData !== false ) {
                    DominoApp.ajax({
                        view: view,
                        action: 'submit',
                        data: validateFormData
                    }).then( function( ret ) {

                        if ( ret.success == 'noconnect' ) {
                            document.getElementById('dbfailed').className = 'domino-missing';
                            document.getElementById('dbfailed').innerText = ret.message;
                        }
                        else {
                            ScrollTo('top');
                            DominoApp.redirect(href);
                        }


                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';



            });
        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Step3', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"wrapper", children: [        {tag: "div", attrs: {}, className:"in", children: [            {tag: "h1", attrs: {}, children: ["Step 3"]},             {tag: "h2", attrs: {}, children: ["Creating a user and developer"]},             {tag: "form", attrs: {method:"post",id:"submitForm"}, children: [                {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                    {tag: "legend", attrs: {}, children: ["Domino user"]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["Let's create your root Domino user:"]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Firstname"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"firstname",value: data.firstname,placeholder:""}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Surname"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"surname",value: data.surname,placeholder:""}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["User email"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"email",value: data.email,placeholder:"","data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Username"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"username",value: data.username,placeholder:"","data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Password"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"password",name:"password",placeholder:"","data-validate":"required","data-validate-type":"password","data-validate-encrypt":"sha-256"}}                        ]}                    ]}                ]},                 {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                    {tag: "legend", attrs: {}, children: ["Developer"]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["To download items from the store or contribute to the community, you need your developer ID which will be available soon. Read more about developers in ",{tag: "a", attrs: {href:"https://docs.dominocms.com/getting-started/developers",target:"_blank"}, children: ["documentation"]}, "."]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Developer Username"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [                            {tag: "input", attrs: {type:"text",name:"developerUsername",value: data.developerUsername,placeholder:"latin chars, no spaces","data-validate":"required"}}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "span", attrs: {}, className:"title", children: ["Developer ID"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-8", children: [
                            "coming soon"
                        ]}                    ]}                ]}            ]},             {tag: "div", attrs: {id:"missing"}, className:"domino-missing hidden", children: [                {tag: "p", attrs: {}, children: ["All required fields are not filled."]}            ]},             {tag: "div", attrs: {id:"loading"}, className:"domino-spinner hidden", children: [                {tag: "section", attrs: {}, className:"ctnr", children: [                    {tag: "div", attrs: {}, className:"ldr large", children: [                        {tag: "div", attrs: {}, className:"ldr-blk"},                         {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                         {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                         {tag: "div", attrs: {}, className:"ldr-blk"}                    ]}                ]}            ]},             {tag: "p", attrs: {}, children: [                {tag: "a", attrs: {href:"?url=Step2"}, className:"button", children: ["Back"]},                 {tag: "a", attrs: {id:"goToNextStep",href:"?url=Step4"}, className:"button", children: ["Next"]}            ]}        ]}    ]};} );


DominoControllers.registerController( 'Domino.Installer.Step3', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            // Close when clicked on a subpage
            this.onEvent( document.getElementById('goToNextStep') , 'click', function( ev ) {

                ev.preventDefault();

                var href = this.getAttribute('href');

                document.getElementById('missing').className = 'domino-missing hidden';
                document.getElementById('loading').className = 'domino-spinner';

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('submitForm') );

                if ( validateFormData !== false ) {
                    DominoApp.ajax({
                        view: view,
                        action: 'submit',
                        data: validateFormData
                    }).then( function( data ) {

                        ScrollTo('top');
                        DominoApp.redirect(href);

                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';



            });
        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Step4', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"wrapper", children: [        {tag: "div", attrs: {}, className:"in", children: [            {tag: "h1", attrs: {}, children: ["Step 4"]},             {tag: "h2", attrs: {}, children: ["Select templates"]},             {tag: "form", attrs: {method:"post",id:"submitForm"}, children: [                {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                    {tag: "legend", attrs: {}, children: ["Usage"]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["Start clean or with a basic template"]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x grid-padding-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "label", attrs: {}, children: [                                {tag: "h2", attrs: {}, children: ["Basic site template"]},                                 {tag: "input", attrs: {type:"radio",name:"template",value:"basic",checked:true}}                            ]},                             {tag: "p", attrs: {}, children: ["DominoCMS will install with basic site blocks"]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "label", attrs: {}, children: [                                {tag: "h2", attrs: {}, children: ["Clean install"]},                                 {tag: "input", attrs: {type:"radio",name:"template",value:"clean"}}                            ]},                             {tag: "p", attrs: {}, children: ["DominoCMS will install with no Items, Themes, Modules or Components."]}                        ]},                         {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "label", attrs: {}, children: [                                {tag: "h2", attrs: {}, children: ["From Store - coming soon"]},                                 {tag: "input", attrs: {type:"radio",name:"template",value:"store",disabled:true}}                            ]},                             {tag: "p", attrs: {}, children: [
                                "You will be able to download a full site from the store right away."
                            ]}                        ]}                    ]}                ]},                 {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                    {tag: "legend", attrs: {}, children: ["Theme"]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell", children: [                            {tag: "span", attrs: {}, className:"text", children: ["Themes are custom scss settings and components with which you can design and colour for your MVC Items. ",{tag: "br", attrs: {}}, "Name your website theme:"]}                        ]}                    ]},                     {tag: "div", attrs: {}, className:"grid-x box", children: [                        {tag: "div", attrs: {}, className:"cell small-4", children: [                            {tag: "input", attrs: {type:"text",name:"theme",value: data.theme,placeholder:"eg. MyTheme","data-validate":"required"}}                        ]}                    ]}                ]}            ]},             {tag: "div", attrs: {id:"missing"}, className:"domino-missing hidden", children: [                {tag: "p", attrs: {}, children: ["All required fields are not filled."]}            ]},             {tag: "div", attrs: {id:"loading"}, className:"domino-spinner hidden", children: [            {tag: "section", attrs: {}, className:"ctnr", children: [                {tag: "div", attrs: {}, className:"ldr large", children: [                    {tag: "div", attrs: {}, className:"ldr-blk"},                     {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                     {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                     {tag: "div", attrs: {}, className:"ldr-blk"}                ]}            ]}        ]},                 {tag: "p", attrs: {}, children: [                    {tag: "a", attrs: {href:"?url=Step3"}, className:"button", children: ["Back"]},                     {tag: "a", attrs: {id:"goToNextStep",href:"?url=Step5"}, className:"button", children: ["Proceed to Step 5"]}                ]}            ]}        ]};} );


DominoControllers.registerController( 'Domino.Installer.Step4', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            // Close when clicked on a subpage
            this.onEvent( document.getElementById('goToNextStep') , 'click', function( ev ) {

                ev.preventDefault();

                var href = this.getAttribute('href');

                document.getElementById('missing').className = 'domino-missing hidden';
                document.getElementById('loading').className = 'domino-spinner';

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('submitForm') );

                if ( validateFormData !== false ) {
                    DominoApp.ajax({
                        view: view,
                        action: 'submit',
                        data: validateFormData
                    }).then( function( data ) {

                        ScrollTo('top');
                        DominoApp.redirect(href);

                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';


            });
        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Step5', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"wrapper", children: [            {tag: "div", attrs: {}, className:"in", children: [                {tag: "h1", attrs: {}, children: ["Step 5"]},                 {tag: "h2", attrs: {}, children: ["Domain and localization"]},                 {tag: "form", attrs: {method:"post",id:"submitForm"}, children: [                    {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                        {tag: "legend", attrs: {}, children: ["Domain"]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "span", attrs: {}, className:"text", children: ["Write the live domain you will be working on. If you leave it blank, your site will not be initialized, you will only be able to see the DominoCMS panel."]}                            ]}                        ]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell small-4", children: [                                {tag: "input", attrs: {type:"text",name:"domain",value: data.domain,placeholder:"mydomain.tld"}}                            ]}                        ]}                    ]},                     {tag: "fieldset", attrs: {}, className:"fieldset margin", children: [                        {tag: "legend", attrs: {}, children: ["Move /lib folder"]},                         {tag: "div", attrs: {}, className:"grid-x box", children: [                            {tag: "div", attrs: {}, className:"cell", children: [                                {tag: "p", attrs: {}, children: ["If your private folder is different than your public folder, move the whole folder with contents /lib to private."]}                            ]}                        ]}                    ]}                ]},                 {tag: "div", attrs: {id:"loading"}, className:"domino-spinner hidden", children: [                    {tag: "section", attrs: {}, className:"ctnr", children: [                        {tag: "div", attrs: {}, className:"ldr large", children: [                            {tag: "div", attrs: {}, className:"ldr-blk"},                             {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                             {tag: "div", attrs: {}, className:"ldr-blk an_delay"},                             {tag: "div", attrs: {}, className:"ldr-blk"}                        ]}                    ]}                ]},                 {tag: "div", attrs: {id:"missing"}, className:"domino-missing hidden", children: [                    {tag: "p", attrs: {}, children: ["All required fields are not filled."]}                ]},                 {tag: "p", attrs: {}, children: [                    {tag: "a", attrs: {href:"?url=Step4"}, className:"button", children: ["Back"]},                     {tag: "a", attrs: {id:"goToNextStep",href:"?url=Success"}, className:"button", children: ["Finish"]}                ]}            ]}        ]};} );


DominoControllers.registerController( 'Domino.Installer.Step5', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            // Close when clicked on a subpage
            this.onEvent( document.getElementById('goToNextStep') , 'click', function( ev ) {

                ev.preventDefault();

                var href = this.getAttribute('href');

                document.getElementById('missing').className = 'domino-missing hidden';
                document.getElementById('loading').className = 'domino-spinner';

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('submitForm') );

                if ( validateFormData !== false ) {
                    DominoApp.ajax({
                        view: view,
                        action: 'submit',
                        data: validateFormData
                    }).then( function( data ) {

                        ScrollTo('top');
                        DominoApp.redirect(href);

                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';


            });
        }
    }
} ) );
DominoViews.registerView( 'Domino.Installer.Success', function( data ) {	"use strict";	return {tag: "div", attrs: {}, className:"domino-installer", children: [        {tag: "div", attrs: {}, className:"welcome", children: [            {tag: "div", attrs: {}, className:"in", children: [                {tag: "img", attrs: {src:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyODMuNSA1Ni43IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyODMuNSA1Ni43OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qxe2ZpbGw6IzFENzFCODt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTExMy45LDMyLjZjMCw1LjYtNC4zLDkuOC0xMC4xLDkuOGMtNS44LDAtMTAtNC4yLTEwLTkuOGMwLTUuNiw0LjMtOS44LDEwLTkuOAoJCQlDMTA5LjYsMjIuOCwxMTMuOSwyNywxMTMuOSwzMi42eiBNOTguOSwzMi42YzAsMywyLjEsNS4xLDQuOSw1LjFjMi44LDAsNS0yLjEsNS01LjFjMC0zLTIuMS01LjEtNS01LjEKCQkJQzEwMSwyNy40LDk4LjksMjkuNiw5OC45LDMyLjZ6Ii8+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE0Mi43LDMwdjExLjloLTVWMzEuNmMwLTIuNy0xLjQtNC4yLTMuNi00LjJjLTIuMiwwLTMuOSwxLjQtMy45LDQuMnYxMC4yaC01VjMxLjZjMC0yLjctMS4zLTQuMi0zLjYtNC4yCgkJCWMtMi4xLDAtMy45LDEuNC0zLjksNC4ydjEwLjJoLTVWMjMuM2g0Ljl2Mi4yYzEuMy0yLDMuNC0yLjcsNS41LTIuN2MyLjcsMCw0LjksMS4yLDYuMSwzLjJjMS40LTIuNCwzLjktMy4yLDYuMy0zLjIKCQkJQzEzOS43LDIyLjgsMTQyLjcsMjUuNywxNDIuNywzMHoiLz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQ5LjEsNDEuOWgtNVYyMy4zaDVWNDEuOXoiLz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTY4LjUsMzB2MTEuOWgtNVYzMS42YzAtMi43LTEuMy00LjItMy42LTQuMmMtMi4xLDAtMy45LDEuNC0zLjksNC4ydjEwLjJoLTVWMjMuM2g0Ljl2Mi4yCgkJCWMxLjMtMiwzLjQtMi43LDUuNS0yLjdDMTY1LjUsMjIuOCwxNjguNSwyNS43LDE2OC41LDMweiIvPgoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODgsMzIuNmMwLDUuNi00LjMsOS44LTEwLjEsOS44Yy01LjgsMC0xMC00LjItMTAtOS44YzAtNS42LDQuMy05LjgsMTAtOS44QzE4My43LDIyLjgsMTg4LDI3LDE4OCwzMi42egoJCQkgTTE3MywzMi42YzAsMywyLjEsNS4xLDQuOSw1LjFjMi44LDAsNS0yLjEsNS01LjFjMC0zLTIuMS01LjEtNS01LjFDMTc1LjEsMjcuNCwxNzMsMjkuNiwxNzMsMzIuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODIsMTVINzAuOXYyMS4zbDUuNC0zLjlWMjBIODJjNS43LDAsOC40LDMuNSw4LjQsOC40YzAsNC45LTIuNyw4LjQtOC40LDguNGgtNC40bC02LjcsNUg4MgoJCQljOC40LDAsMTQtNS4zLDE0LTEzLjRTOTAuNCwxNSw4MiwxNXoiLz4KCTwvZz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNDkuOCwxOC4yYzAsMS44LTEuNCwzLjItMy4yLDMuMmMtMS44LDAtMy4yLTEuNC0zLjItMy4yYzAtMS44LDEuNC0zLjIsMy4yLTMuMgoJCUMxNDguNCwxNSwxNDkuOCwxNi40LDE0OS44LDE4LjJ6Ii8+CjwvZz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTYzLjcsMTguMUM2MCw3LjksNDQuMyw0LjMsMjguNiwxMEMxMi44LDE1LjcsMy4xLDI4LjYsNi44LDM4LjhDMTAuNSw0OSwyNi4zLDUyLjYsNDIsNDYuOQoJQzU3LjcsNDEuMiw2Ny40LDI4LjMsNjMuNywxOC4xeiBNMzYuOSw0MS44aC0xMWw2LjYtNWg0LjNjNS42LDAsOC40LTMuNSw4LjQtOC40YzAtNC45LTIuNy04LjQtOC40LTguNGgtNS42djEyLjNsLTUuMywzLjlWMTUuMWgxMQoJYzguNCwwLDEzLjksNS4zLDEzLjksMTMuNEM1MC44LDM2LjUsNDUuMyw0MS44LDM2LjksNDEuOHoiLz4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjc0LDIxLjdjLTEuOSwwLTMuNC0xLjUtMy40LTMuNGMwLTEuOSwxLjUtMy40LDMuNC0zLjRzMy40LDEuNSwzLjQsMy40QzI3Ny41LDIwLjEsMjc1LjksMjEuNywyNzQsMjEuN3oKCQkgTTI3NCwxNS4zYy0xLjYsMC0yLjksMS4zLTIuOSwyLjlzMS4zLDIuOSwyLjksMi45czIuOS0xLjMsMi45LTIuOVMyNzUuNiwxNS4zLDI3NCwxNS4zeiIvPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTI3Mi43LDE2LjVoMS42YzAuMiwwLDAuNCwwLDAuNiwwLjFjMC4yLDAuMSwwLjMsMC4xLDAuNCwwLjNjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjNjMCwwLjEsMC4xLDAuMywwLjEsMC40CgkJCXYwYzAsMC4xLDAsMC4zLTAuMSwwLjRjMCwwLjEtMC4xLDAuMi0wLjIsMC4zYy0wLjEsMC4xLTAuMiwwLjItMC4zLDAuMmMtMC4xLDAuMS0wLjIsMC4xLTAuMywwLjFsMC45LDEuM2gtMC43bC0wLjktMS4yaDBoLTAuOAoJCQlWMjBoLTAuNlYxNi41eiBNMjc0LjIsMTguMmMwLjIsMCwwLjQtMC4xLDAuNS0wLjJzMC4yLTAuMiwwLjItMC40djBjMC0wLjItMC4xLTAuMy0wLjItMC40Yy0wLjEtMC4xLTAuMy0wLjEtMC41LTAuMWgtMC45djEuMgoJCQlIMjc0LjJ6Ii8+Cgk8L2c+CjwvZz4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE0LjgsMjAuMWwtMy42LDIuNGMtMS42LTIuNC00LjMtMy45LTcuNS0zLjljLTUuNSwwLTkuNSw0LTkuNSw5LjhzNCw5LjgsOS41LDkuOGMzLjIsMCw1LjgtMS40LDcuNS0zLjkKCQlsMy41LDIuNmMtMi4zLDMuNC02LjMsNS40LTExLDUuNGMtOC4zLDAtMTQuMS01LjktMTQuMS0xMy45YzAtOCw1LjgtMTMuOSwxNC4xLTEzLjlDMjA4LjQsMTQuNSwyMTIuNywxNi42LDIxNC44LDIwLjF6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQ1LjUsNDEuOWgtNC4zVjE5LjhsLTcuOSwxOS41aC00LjZMMjIwLjksMjB2MTQuNGwtNC4zLTMuOVYxNWg2LjdsNy44LDE5LjJsNy44LTE5LjJoNi43VjQxLjl6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjY2LjgsMjFjLTIuMy0xLjUtNC44LTIuMy03LjUtMi4zYy0zLjYsMC02LDEuNi02LDRjMCwyLjIsMi4xLDMuMSw1LjYsMy42bDEuOSwwLjJjNC40LDAuNiw4LjcsMi40LDguNyw3LjQKCQljMCw1LjUtNSw4LjUtMTAuOCw4LjVjLTMuNiwwLTgtMS4yLTEwLjgtMy42bDIuNC0zLjVjMS44LDEuNyw1LjMsMyw4LjQsM2MzLjUsMCw2LjMtMS41LDYuMy00YzAtMi4xLTIuMS0zLjEtNi0zLjZsLTIuMS0wLjMKCQljLTQtMC42LTgtMi40LTgtNy40YzAtNS40LDQuOC04LjQsMTAuNi04LjRjMy45LDAsNywxLjEsOS43LDIuOUwyNjYuOCwyMXoiLz4KPC9nPgo8L3N2Zz4K",alt:""}, style:"max-width:300px;width:100%;"},                 {tag: "h1", attrs: {}, children: ["Success!"]},                 {tag: "p", attrs: {}, children: ["Your DominoCMS is all set up! Now you can procceed to the DominoCMS Panel or see the website."]},                 {tag: "p", attrs: {}, children: ["Don't forget to delete the /install directory!"]},                 {tag: "p", attrs: {}, children: [                    {tag: "a", attrs: {button:true,href:"/domino",target:"_blank"}, className:"button", children: ["Go to DominoCMS panel"]},                     {tag: "a", attrs: {button:true,href:"/"}, className:"button", children: ["Preview website"]}                ]}            ]}        ]}    ]};} );


DominoControllers.registerController( 'Domino.Installer.Success', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {



        }
    }
} ) );
