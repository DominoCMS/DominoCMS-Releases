
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