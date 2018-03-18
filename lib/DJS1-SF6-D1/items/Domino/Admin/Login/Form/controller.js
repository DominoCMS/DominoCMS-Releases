
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