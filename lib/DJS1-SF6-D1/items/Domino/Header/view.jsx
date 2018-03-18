/**
 * filename: HeaderView.jsx
 * developer: Domino
 * item: Header
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header', function( data ) {
	"use strict";

	if ( data.container )
		return <header class="domino-header">
			<div class="grid-container grid-x">
				<div class="small-12 cell">
					<div view="Domino.Header.Logo" />
					<div view="Domino.Header.MenuMain" />
					<div view="Domino.Header.MenuService" />
					<div view="Domino.Header.HeaderContact" />
				</div>
			</div>
		</header>
	else
		return <header class="domino-header">
			<div view="Domino.Header.Logo" />
			<div view="Domino.Header.MenuMain" />
			<div view="Domino.Header.MenuService" />
			<div view="Domino.Header.HeaderContact" />
		</header>
} );