DominoControllers.registerController( 'Domino.Admin.Entry.List', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this,
                filterEntries = el.querySelector( '.filterEntries' );

            // Filter Entries

            var currentRequest = null;
            var delay = (function(){
                var timer = 0;
                return function(callback, ms){
                    clearTimeout (timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            // Filter entries

            self.onEvent( filterEntries , 'keyup', function( ev ) {
                ev.preventDefault();

                var selfie = this;

                if( selfie.value.length < 2 ) {
                    //resultsTitle.innerHTML = 'Za iskanje vnesite vsaj 2 znaka ...';
                    //$('.entries').remove();
                }
                else {
                    //resultsTitle.innerHTML = 'Iskanje poteka';
                    if (currentRequest != null) {
                        currentRequest.abort();
                    }
                }

                delay(function(){

                    currentRequest = DominoApp.ajax({
                        view: view,
                        action: 'filterEntries',
                        data: {
                            'list': data.list,
                            'query': selfie.value
                        }
                    }).then( function( success ) {


                        var view = el.querySelector('[view="Domino.Admin.Entry.List.List.Entries"]');

                        DominoApp.renderView( view, 'Domino.Admin.Entry.List.List.Entries', success.list );

                    });


                }, 300);


            });




        }
    }
} ) );