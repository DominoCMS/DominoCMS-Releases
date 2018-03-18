
var DCDominoController = DCDominoComponent.extend( function( _super ) {
	return {
		// BASE
		construct: function () {
			_super.construct.call(this);

		},
		destroy: function () {
			_super.destroy.call(this);
		},

		// CONTROLLER SPECIFIC
		beforeAction: function (actionName) {
			var controllerName = DominoApp.routeHandler.controllerName;

			return true;
		},
		afterAction: function (actionName) {
			return true;
		}
	}
} );