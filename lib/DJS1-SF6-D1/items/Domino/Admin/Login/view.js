DominoViews.registerView( 'Domino.Admin.Login', function( data ) {
    "use strict";
	return {tag: "div", attrs: {}, children: [
			{tag: "div", attrs: {}, className:"frontPage domino-admin-login", children: [
                {tag: "div", attrs: {}, className:"overlay", children: [
				{tag: "div", attrs: {id:"inner"}}
			]}
            ]}, 
			br("component", {view:"Domino.Admin.Footer"})
		]};
} );
