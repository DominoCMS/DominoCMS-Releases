
DominoControllers.registerController( 'Domino.Admin.Loading', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            //data.elementquerySelector('p').fadeOut( 2000, function () {});

            setTimeout( function() {
                DominoApp.redirect( data.redirect );
            }, 2000);


        }
    }
} ) );