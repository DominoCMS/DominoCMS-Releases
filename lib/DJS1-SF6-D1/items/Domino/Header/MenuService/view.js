/**
 * filename: MenuServiceView.jsx
 * developer: Domino
 * item: Header
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.MenuService', function( data ) {
	"use strict";

	return {tag: "nav", attrs: {}, className:"menuservice", children: [
		{tag: "button", attrs: {href:"#"}, children: [
			{tag: "span", attrs: {}, className:"icon-list"}
		]}, 
		{tag: "ul", attrs: {}, className:"hidden", children: [
			 (function () {

				var entries = [];
				for ( var i = 0; i < data['entries'].length; i++ ) {

					var entry = data['entries'][i];
					var active = ( entry.active == 1 ) ? 'active' : '';

					entries.push({tag: "li", attrs: {"data-entry": entry.entry}, className:active , children: [
						{tag: "a", attrs: {href: entry.link}, children: [ entry.name]}
					]});
				}
				return entries;

			})() 
		]}
	]}
});
