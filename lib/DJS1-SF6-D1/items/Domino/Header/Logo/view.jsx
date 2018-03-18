/**
 * filename: LogoView.jsx
 * developer: Domino
 * item: Logo
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.Logo', function( data ) {
	"use strict";

	return <div class="logo">
		<a class={ data.class } href={ data.link }></a>
	</div>
} );