
DominoControllers.registerController( 'Domino.Installer.Step3', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            // Close when clicked on a subpage
            this.onEvent( document.getElementById('goToNextStep') , 'click', function( ev ) {

                ev.preventDefault();

                var href = this.getAttribute('href');

                document.getElementById('missing').className = 'domino-missing hidden';
                document.getElementById('loading').className = 'domino-spinner';

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('submitForm') );

                if ( validateFormData !== false ) {
                    DominoApp.ajax({
                        view: view,
                        action: 'submit',
                        data: validateFormData
                    }).then( function( data ) {

                        ScrollTo('top');
                        DominoApp.redirect(href);

                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';



            });
        }
    }
} ) );