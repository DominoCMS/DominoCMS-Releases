
DominoControllers.registerController( 'Domino.Installer.Step1', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            var radiosServer = document.getElementsByName('serverType');
            for ( var i = 0; i < radiosServer.length; i++ ) {

                if ( radiosServer[i].value == data.serverType ) {
                    radiosServer[i].checked = true;
                    break;
                }
            }
            var radiosWorkingType = document.getElementsByName('workingType');
            for ( var i = 0; i < radiosServer.length; i++ ) {
                if ( radiosWorkingType[i].value == data.workingType ) {
                    radiosWorkingType[i].checked = true;
                    break;
                }
            }


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
                        //window.scrollTo(0, 0);

                        ScrollTo('top');
                        DominoApp.redirect(href);

                    }, function( errorResponse ) {
                    } );
                }
                else
                    document.getElementById('missing').className = 'missing';

            });

            // Close when clicked on a subpage
            this.onEvent(  document.getElementsByName('serverType'), 'change', function( ev ) {

                ev.preventDefault();

                var directives = document.querySelectorAll('.directives');
                for ( var i = 0; i < directives.length; i++) {
                    var directive = directives[i];
                    directive.className = 'directives';
                }

                var id = this.value;
                document.getElementById(id).className = 'directives is-active';

            });
        }
    }
} ) );