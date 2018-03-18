
DominoControllers.registerController( 'Domino.Admin.Header.Account', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            if ( data.auth === true ) {

                var ButtonAccount = document.getElementById('ButtonAccount'),
                    itemsList = document.getElementById('account-list');

                this.onEvent( ButtonAccount, 'click', function( ev ) {
                    if (itemsList.style.display == 'none' || !itemsList.style.display )
                        itemsList.style.display = 'block';
                    else
                        itemsList.style.display = 'none';
                    return false;
                } );

                this.onEvent( itemsList.childNodes, 'click', function( ev ) {
                    itemsList.style.display = 'none';
                    return false;
                } );


                var onConfirm = function() {
                    DominoApp.redirect( data.entries[1].link );
                };
                this.onEvent( document.querySelector('.BtnLogout'), 'click', function( ev ) {
                    ev.preventDefault();
                    DominoApp.redirect( data.logout.link );

                    new DominoAlert(self, {
                        Title: "Odjava iz Domina",
                        Desc: "Se res želim odjaviti?",
                        Confirm: true,
                        Dismiss: true,
                        onConfirm: onConfirm
                    });
                });

                document.body.onclick = function( e ) {
                    if ( !ButtonAccount.contains(e.target) )
                        itemsList.style.display = 'none';

                    if ( !document.getElementById('buttonModules').contains(e.target) )
                        document.getElementById('modules-list').style.display = 'none';
                    if ( !document.querySelector('.search-holder').contains(e.target) )
                        document.querySelector('.results').style.display = 'none';


                }

            }

        }
    }
} ) );


