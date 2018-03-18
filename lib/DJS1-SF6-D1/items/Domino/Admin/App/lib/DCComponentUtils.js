var componentFactory = {
	postRender: function( context, node ) {

		DominoApp.renderView2(node.element, context.data.view, context.data.componentData );

        if ( DominoAppControllers[context.data.view] ) {

            var newController = new DominoAppControllers[context.data.view]();
            if ( newController['indexAction'] ) {
                newController['indexAction'](node.element, context.data.view, context.data.componentData);
            }
        }

        // not working
        //node.element.removeAttribute("view");
        //node.element.removeAttribute("componentData");

	}
};
var br = function( componentName, componentParams, componentChildren ) {

	if ( componentName === 'component' && componentParams.view ) {

		if ( componentParams.componentData ) {
			// GET AJAX DATA

            var renderController = DominoAppViews.attr( componentParams.view );
			if ( !DominoAppViews.attr( componentParams.view ) )
				console.log( 'View not registered: ' + componentParams.view );

			if ( componentParams.action ) {

				var action = ( componentParams.action != '' ) ? componentParams.action : 'index';

				var deferred = new Deferred();

				DominoApp.ajax({
					view: componentParams.view,
					action: action,
					data: componentParams.componentData
				}).then( function( data ) {

					var retData = {
						tag: 'div',
						component: componentFactory,
						data: componentParams,
						attrs: { view: componentParams.view, componentData: '' },
						children: null
					};

					deferred.resolve( retData );

				}, function( errorResponse ) {
				} );

				return deferred.promise();
			}
			else {

                var renderController = DominoAppViews.attr(componentParams.view);

                if (renderController)
                    var renderResult = renderController(componentParams.componentData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

                renderResult['component'] = componentFactory;
                renderResult['data'] = componentParams;

				if ( !renderResult['attrs'] )
					renderResult['attrs'] = {};
                renderResult['attrs']['view'] = componentParams.view;
				renderResult['attrs']['componentData'] = '';
                return renderResult;

            }
		}
		else
			return { tag: 'div', attrs: { view: componentParams.view } };

	}
};