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