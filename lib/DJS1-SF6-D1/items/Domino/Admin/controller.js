
DominoControllers.registerController( 'Domino.Admin', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( el, view, data ) {

			if ( data.auth !== true )
				DominoApp.redirect( data.redirect );

		}
	}
} ) );