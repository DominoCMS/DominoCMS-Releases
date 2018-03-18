DominoControllers.registerController( 'Domino.Admin.Entry.List.List', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            if ( data.moveToParent ) {

                var parEl = document.getElementById(data.moveToParent);

                if ( parEl ) {

                    var childTr = parEl.nextSibling;
                    var arrow = parEl.firstChild.firstChild;

                    data.options.parent = entry;

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.List',
                        action: ( data.options.type == 'index' ) ? 'entriesIndex' : 'entries',
                        data: {
                            'options': data.options,
                            'pagination': data.pagination,
                            'siteIndexHack': true
                        }
                    }).then( function( renderData ) {

                        DominoApp.renderView ( childTr.firstChild, 'Domino.Admin.Entry.List.List.Entries', renderData );
                        childTr.style.display = 'table-row';
                        arrow.className = 'arrow icon-arrow_down';
                        var bodyRect = document.body.getBoundingClientRect();
                        var elemRect = parEl.getBoundingClientRect();
                        var offset   = elemRect.top - bodyRect.top;
                        window.scrollTo(0, ( offset - 50 ) );

                    }, function( errorResponse ) {
                    } );

                }

            }



        }

    }
} ) );