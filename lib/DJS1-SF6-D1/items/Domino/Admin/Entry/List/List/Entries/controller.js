DominoControllers.registerController( 'Domino.Admin.Entry.List.List.Entries', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {


            // if link redirect to it
            if ( data.options.link ) {

                function levelLink ( entries, indexes, level) {

                    var ind = indexes[level];

                    var levelData = entries[ind];
                    var lev = level + 1;
                    if ( ( indexes.length == lev ) && levelData.link )
                        return levelData.link;
                    else
                        return levelLink ( levelData.list.entries, indexes, lev );
                }

                this.onEvent( el.querySelectorAll('.click'), 'click', function( ev ) {
                    ev.preventDefault();

                    var thisLevelIndex = this.parentNode.getAttribute('index').split('|');

                    if ( thisLevelIndex && data.entries[0].link ) {

                        var link = levelLink( data.entries, thisLevelIndex, 0);

                        if ( link )
                            DominoApp.redirect( link );
                    }

                });

            }

            // if click on .click
            this.onEvent( el.querySelectorAll('.click'), 'click', function( ev ) {
                ev.preventDefault();
                var entry = this.parentNode.getAttribute('entry');

                var index = parseInt(this.parentNode.getAttribute('index'), 10 );

                var returns = data.options.return;

                if ( data.options.selectorId == 'addCrossModules' ) {
                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.Edit.Field.Cross',
                        action: 'addCrossModules',
                        data: {
                            'entry': entry
                        }
                    }).then( function( success ) {

                        // add tab li

                        // render cross view

                    });

                }
                else if ( data.options.selectorId == ( 'addCross' ) ) {

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.Edit.Field.Cross',
                        action: 'addCross',
                        data: {
                            'entry': entry
                        }
                    }).then( function( success ) {

                        // add row to the list


                    });

                }
                else
                    for ( var key in data.options.return ) {
                        if (!data.options.return.hasOwnProperty(key)) continue;
                        var returnColArr = data.options.return[key];
                        var returnColEl = returnColArr['element'];
                        var returnColName = returnColArr['name'];

                        var returnEntry = data.entries[index];


                        var returnKeys = document.getElementsByName(key);
                        for ( var i = 0; i < returnKeys.length; i++ ) {
                            var returnKey = returnKeys[i];
                            returnKey.value = returnEntry[returnColEl];

                            var miniSelSpan = document.getElementById('span' + key );
                            miniSelSpan.innerText = returnEntry.data ? returnEntry.data[0] : returnEntry.colName;
                        }
                    }

                var miniSel = document.getElementById('miniSel' + data.options.selectorId );
                if ( miniSel )
                    miniSel.style.display = 'none';

            });


            var rets = document.getElementsByName('returnEntry');
            for ( var i = 0; i < rets.length; i++ ) {
                this.onEvent(rets[i], 'click', function (ev) {
                    "use strict";
                    ev.preventDefault();
                    var returnValue = this.getAttribute('data-val');

                    var span = document.getElementsByName('span' + data.options.element);
                    if ( span[0] )
                        span[0].innerText = returnValue;

                    var inp = document.getElementsByName(data.options.element);
                    if ( inp[0] )
                        inp[0].value = returnValue;

                    var dd = document.querySelector('dd[name="miniSelector"][style="display: block;"]');
                    if ( dd )
                        dd.style.display = "none";

                });
            }



            var arrows = el.querySelectorAll('[name="arrow"]');

            for ( var i = 0; i < arrows.length; i++ ) {

                this.onEvent( arrows[i], 'click', function( ev ) {
                    ev.preventDefault();

                    var self = this;
                    var entry = this.getAttribute('entry');
                    var arrow = this.firstChild;
                    //var childEntries = document.querySelectorAll('tr[parent="' + entry + '"]'); // document.getElementsByName(entry);
                    //var childEntries = this.parentNode.parentNode.querySelectorAll('tr[parent="' + entry + '"]'); // document.getElementsByName(entry);
                    var childTr = this.parentNode.nextSibling;
                    var childEntries = childTr.firstChild.childNodes;

                    // if no children so ajax needed
                    if ( !childEntries.length ) {

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

                        }, function( errorResponse ) {
                        } );

                    }
                    else { // if no ajax but entries already exist
                        if ( childTr.style.display == 'table-row' ) {
                            childTr.style.display = 'none';
                            arrow.className = 'arrow icon-arrow_right';
                        }
                        else {
                            childTr.style.display = 'table-row';
                            arrow.className = 'arrow icon-arrow_down';
                        }

                    }



                });

            }

            // Pagination
            this.onEvent( el.querySelectorAll( '.paginate' ) , 'click', function( ev ) {
                ev.preventDefault();

                if ( this.getAttribute('class') == 'paginate' ) {

                    var page = this.getAttribute('name');

                    if ( page == 'pagePrev' )
                        data.pagination.currentPage = data.pagination.currentPage - 1;
                    else if ( page == 'pageNext' )
                        data.pagination.currentPage = data.pagination.currentPage + 1;
                    else
                        data.pagination.currentPage = page;

                    if ( data.pagination.currentPage == data.pagination.pages ) {
                        el.querySelector('[name="pageNext"]').className = 'paginate active';
                    }
                    if ( data.pagination.currentPage == 1 ) {
                        el.querySelector('[name="pagePrev"]').className = 'paginate active';
                    }

                    DominoApp.ajax({
                        view: 'Domino.Admin.Entry.List',
                        action: 'pageEntries',
                        data: data
                    }).then( function( success ) {


                        var view = el;

                        DominoApp.renderView( view, 'Domino.Admin.Entry.List.List.Entries', success.list );

                    });

                }


            });


        }

    }
} ) );