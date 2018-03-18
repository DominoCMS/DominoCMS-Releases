DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Date', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var picker = new Pikaday({
                field: document.getElementById('date' + data.id ),
                format: 'DD.MM.YYYY'
            });



        }
    }
}));