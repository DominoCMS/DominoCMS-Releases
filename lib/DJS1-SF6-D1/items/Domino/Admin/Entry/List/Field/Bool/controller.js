DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Bool', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function ( el, view, data ) {
            "use strict";

            var self = this;

            self.onEvent( el.querySelector('a'), 'click', function( ev ) {
                ev.preventDefault();
                var self = this;
                var boolVal = self.getAttribute('bool-val');

                DominoApp.ajax({
                    view: view,
                    action: 'change',
                    data: {
                        'element': data.column.element,
                        'developer': data.column.developer,
                        'module': data.column.module,
                        'id': data.id,
                        'value': boolVal
                    }
                }).then( function( data ) {

                    if ( boolVal == 1 )
                        self.querySelector('span').className = 'icon-status';
                    else
                        self.querySelector('span').className = 'icon-show';

                }, function( errorResponse ) {
                } );

            });


        }
    }
}));