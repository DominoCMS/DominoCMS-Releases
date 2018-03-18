DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Cross.Entries', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;

            self.onEvent( document.querySelectorAll('.deleteFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'delete',
                    data: {
                        'entryRel': self.getAttribute('href'),
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });
            self.onEvent( document.querySelectorAll('#manualCrossFile'), 'click', function( ev ) {
                ev.preventDefault();

                var self = this;

                DominoApp.ajax({
                    view: view,
                    action: 'manualCross',
                    data: {
                        'newEntry': document.querySelector('input[name="newEntry"]').value,
                        'entry': data.data.mainDeveloper + '.' + data.data.mainModule + '.' + data.data.mainId
                    }
                }).then( function( renderData ) {

                    //self.

                }, function( errorResponse ) {
                } );

            });

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