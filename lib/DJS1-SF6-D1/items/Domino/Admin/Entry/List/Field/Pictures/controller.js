DominoControllers.registerController( 'Domino.Admin.Entry.List.Field.Pictures', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            //el.style.display = 'none';
/*
            self.onEvent( document.getElementById('picUploadButton'), 'click', function( ev ) {
                ev.preventDefault();

                var input = document.getElementById('filesPictures');

                for ( var i = 0; i < input.files.length; i++) {

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.Edit.Field.Pictures',
                        action: 'upload',
                        data: {
                            'file': input.files,
                            'name': input.files[i].name,
                            'type': input.files[i].type
                        }
                    }).then( function( data ) {



                    }, function( errorResponse ) {
                    } );


                }

            });
*/
        }
    }
}));