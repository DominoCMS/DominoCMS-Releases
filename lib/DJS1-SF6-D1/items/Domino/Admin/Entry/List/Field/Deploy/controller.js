DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Deploy', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function ( el, view, data ) {
            "use strict";

            var self = this;

            self.onEvent( el.querySelector('a'), 'click', function( ev ) {
                ev.preventDefault();
                var self = this;

                self.querySelector('span').className = 'icon-export red';

                DominoApp.ajax({
                    view: view,
                    action: 'deploy',
                    data: {
                        'element': data.column.element,
                        'developer': data.column.developer,
                        'module': data.column.module,
                        'id': data.entry
                    }
                }).then( function( data ) {

                    self.querySelector('span').className = 'icon-export green';

                    setTimeout(function(){
                        self.querySelector('span').className = 'icon-export';
                    }, 2000);

                }, function( errorResponse ) {
                } );

            });


        }
    }
}));