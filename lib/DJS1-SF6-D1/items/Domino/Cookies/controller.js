DominoControllers.registerController( 'Domino.Cookies', DCDominoController.extend( function( _super )  {
	return {
		'indexAction': function ( el, view, data ) {

			var self = this;

			self.onEvent( document.getElementById('cookiesAccept'), 'click', function( ev ) {
				ev.preventDefault();
				var self = this;

				DominoApp.ajax({
					view: 'Domino.Cookies',
					action: 'accept',
					data: {}
				}).then( function( data ) {

					var el = document.querySelector('.domino-cookies');
					el.style.display = 'none';

				}, function( errorResponse ) {
				} );

			});


		}
	}
}));