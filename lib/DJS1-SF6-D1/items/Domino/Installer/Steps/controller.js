
DominoControllers.registerController( 'Domino.Installer.Steps', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


        },
        'refreshAction': function ( el, view, data ) {

            var isactive = el.querySelector('.is-active');
            if ( isactive )
                isactive.className = 'step';

            var isactive = document.getElementById(data.url);
            if ( isactive )
                isactive.className = 'step is-active';


        }
    }
} ) );