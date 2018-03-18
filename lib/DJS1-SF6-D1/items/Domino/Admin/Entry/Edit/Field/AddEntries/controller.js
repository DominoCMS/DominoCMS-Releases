DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.AddEntries', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var buttons = el.querySelectorAll('.deleteAddEntry');
            for ( var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                this.onEvent( button , 'click', function( ev ) {
                    ev.preventDefault();

                    var self = this;

                    DominoApp.ajax({
                        view: view,
                        action: 'delete',
                        data: {
                            'id': self.getAttribute('href')
                        }
                    }).then( function( renderData ) {

                        //self.

                    }, function( errorResponse ) {
                    } );

                });
            }

            var buttons = el.querySelectorAll('.statusAddEntry');
            for ( var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                this.onEvent(button, 'click', function (ev) {
                    ev.preventDefault();

                    var self = this;
                    var boolVal = self.getAttribute('bool-val');

                    DominoApp.ajax({
                        view: view,
                        action: 'status',
                        data: {
                            'id': self.getAttribute('href'),
                            'status': boolVal
                        }
                    }).then(function (renderData) {

                        if (boolVal == 1)
                            self.querySelector('span').className = 'icon-status';
                        else
                            self.querySelector('span').className = 'icon-show';

                    }, function (errorResponse) {
                    });

                });
            }

        }
    }
}));