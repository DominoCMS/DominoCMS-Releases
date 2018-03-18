DominoViews.registerView( 'Domino.Admin.Login', function( data ) {
    "use strict";
	return <div>
			<div class="frontPage domino-admin-login">
                <div class="overlay">
				<div id="inner"></div>
			</div>
            </div>
			<component view="Domino.Admin.Footer" />
		</div>;
} );