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