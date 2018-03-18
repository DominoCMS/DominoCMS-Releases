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
		return {tag: "header", attrs: {}, className:"domino-header", children: [
			{tag: "div", attrs: {}, className:"grid-container grid-x", children: [
				{tag: "div", attrs: {}, className:"small-12 cell", children: [
					{tag: "div", attrs: {view:"Domino.Header.Logo"}}, 
					{tag: "div", attrs: {view:"Domino.Header.MenuMain"}}, 
					{tag: "div", attrs: {view:"Domino.Header.MenuService"}}, 
					{tag: "div", attrs: {view:"Domino.Header.HeaderContact"}}
				]}
			]}
		]}
	else
		return {tag: "header", attrs: {}, className:"domino-header", children: [
			{tag: "div", attrs: {view:"Domino.Header.Logo"}}, 
			{tag: "div", attrs: {view:"Domino.Header.MenuMain"}}, 
			{tag: "div", attrs: {view:"Domino.Header.MenuService"}}, 
			{tag: "div", attrs: {view:"Domino.Header.HeaderContact"}}
		]}
} );
