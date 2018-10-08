var mainView = function( children ) {
	return {tag: "div", attrs: {id:"mainLayout"}, children: [ children.map( function( child ) {
			return child.renderFunc.call( child.renderController, child.renderParams );
		}) 
	]};
};
