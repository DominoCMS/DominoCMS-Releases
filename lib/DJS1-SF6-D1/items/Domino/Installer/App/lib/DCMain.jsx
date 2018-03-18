var mainView = function( children ) {
	return <div id="mainLayout">{ children.map( function( child ) {
			return child.renderFunc.call( child.renderController, child.renderParams );
		} ) }
	</div>;
};