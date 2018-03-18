DominoViews.registerView( 'Domino.Admin.Header.Actions', function( data ) {	"use strict";	return {tag: "nav", attrs: {}, className:"deploy", children: [			{tag: "dt", attrs: {}, children: [				{tag: "a", attrs: {id:"button-export",href:"#",title:"Deploy"}, children: [					{tag: "span", attrs: {}, className:"icon-export"}				]}			]}, 			{tag: "dd", attrs: {}, children: [				{tag: "ul", attrs: {}, className:"hide", children: [					{tag: "li", attrs: {}, children: [						{tag: "a", attrs: {name:"deployLink","data-id":"app",href:"#"}, children: [
							"app"
						]}					]}, 					{tag: "li", attrs: {}, children: [						{tag: "a", attrs: {name:"deployLink","data-id":"css",href:"#"}, children: [
							"css"
						]}					]}				]}			]}		]}	} );
