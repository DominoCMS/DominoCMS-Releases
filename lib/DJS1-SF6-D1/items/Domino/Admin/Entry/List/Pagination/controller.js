DominoControllers.registerController( 'Domino.Admin.Entry.List.Pagination', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;

            var paginate = el.querySelectorAll('.paginate');

            for ( var i = 0; i < paginate.length; i++ ) {
                var pag = paginate[i];

                self.onEvent( pag , 'click', function (ev) {
                    ev.preventDefault();



                });

            }

        }

    }
} ) );