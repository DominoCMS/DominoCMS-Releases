
DominoControllers.registerController( 'Domino.Admin.Entry.Selector', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;

            var dd = el.getElementsByTagName("dd")[0];
            var dt = el.getElementsByTagName("dt")[0];

            dd.style.display = 'none';

            // display float and fill with data
            self.onEvent( dt, 'click', function (ev) {
                ev.preventDefault();

                if ( dd.style.display == 'none' || !dd.style.display ) {
                    dd.style.display = 'block';

                    if ( data.listData )
                        DominoApp.renderView ( dd, 'Domino.Admin.Entry.List', data.listData )
                    else
                        DominoApp.ajax({
                            view: 'Domino.Admin.Entry.List',
                            action: 'list',
                            data: data.listParams
                        }).then( function( renderData ) {

                            DominoApp.renderView ( dd, 'Domino.Admin.Entry.List', renderData )

                        }, function( errorResponse ) {
                        } );

                }
                else {
                    dd.style.display = 'none';
                    dd.innerHTML = '';
                }

            });

            document.addEventListener('click', function(event) {
                var isClickInside = el.contains(event.target);

                if (!isClickInside) {
                    dd.style.display = 'none';
                    dd.innerHTML = '';
                }
            });

        }
    }
} ) );
