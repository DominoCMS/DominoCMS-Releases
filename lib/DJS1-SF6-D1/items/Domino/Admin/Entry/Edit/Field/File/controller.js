DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.File', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var self = this;

            self.onEvent( document.getElementById('picUpload'), 'click', function( ev ) {
                ev.preventDefault();

                var fileSelect = document.querySelector('input[name="file"]');
                var files = fileSelect.files;
                var forms = [];

                var formData = null;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    formData = new FormData();
                    formData.append('identity', data.data.identity);
                    formData.append('mainDeveloper', data.data.mainDeveloper);
                    formData.append('mainModule', data.data.mainModule);
                    formData.append('mainId', data.data.mainId);
                    formData.append('developer', 'Domino');
                    formData.append('module', data.data.mainModule);
                    formData.append('type', 'Single');
                    formData.append('id', data.data.mainId);

                    // Add the file to the request.
                    formData.append('file', file);

                    forms.push(formData);

                }

                self.upload ( forms, 0, files.length );

            });


        },
        upload: function( formData, instance, all ) {

            var self = this;

            if ( instance < all ) {

                self.ajax(formData[instance]).then( function( data ) {

                    self.upload( formData, ( instance + 1 ), all );

                }, function( errorResponse ) {
                } );
            }

        },
        ajax: function( formData ) {
            "use strict";

            var headers = {};
            var url = '/upload.php';
            var deferred = new Deferred();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                DCUtil.networkReadyStateChange( request, deferred );
            };
            request.open( 'POST', url, true );
            for( var key in headers )
                if( headers.hasOwnProperty( key ) )
                    request.setRequestHeader( key, headers[ key ] );

            request.responseType = 'json';
            request.send( formData );
            return deferred.promise();

        }
    }
}));