/**
 * filename: MenuServiceView.jsx
 * developer: Domino
 * item: Header
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.MenuService', function( data ) {
	"use strict";

	return <nav class="menuservice">
		<button href="#">
			<span class="icon-list"></span>
		</button>
		<ul class="hidden">
			{ (function () {

				var entries = [];
				for ( var i = 0; i < data['entries'].length; i++ ) {

					var entry = data['entries'][i];
					var active = ( entry.active == 1 ) ? 'active' : '';

					entries.push(<li data-entry={ entry.entry } class={ active }>
						<a href={ entry.link }>{ entry.name }</a>
					</li>);
				}
				return entries;

			})() }
		</ul>
	</nav>
});