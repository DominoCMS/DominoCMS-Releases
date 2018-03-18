
DominoControllers.registerController( 'Domino.Admin.Logout', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            //data.elementquerySelector('p').fadeOut( 2000, function () {});
            //$( ".LogoutQuotes" ).fadeOut( 3000, function() {});

            setTimeout( function() {
                DominoApp.redirect( data.redirect );
            }, 3000);



        }
    }
} ) );
