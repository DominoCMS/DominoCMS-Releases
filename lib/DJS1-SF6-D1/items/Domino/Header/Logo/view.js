/**
 * filename: LogoView.jsx
 * developer: Domino
 * item: Logo
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.Logo', function( data ) {
	"use strict";

	return {tag: "div", attrs: {}, className:"logo", children: [
		{tag: "a", attrs: {href: data.link}, className: data.class}
	]}
} );
