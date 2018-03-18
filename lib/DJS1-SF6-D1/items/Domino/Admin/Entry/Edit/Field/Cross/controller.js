DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Cross', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            this.onEvent( document.querySelectorAll('.domino-cross-tabs-buttons li') , 'click', function (ev) {

                ev.preventDefault();

                var self = this,
                    ul = self.parentNode,
                    id = self.getAttribute("data-id"),
                    className = self.getAttribute("class");

                if ( className != 'is-active' ) {

                    // Buttons
                    ul.querySelector('li[class="is-active"]').removeAttribute('class');
                    self.setAttribute('class', 'is-active');

                    // Content
                    var newE = ul.nextSibling.querySelector('.domino-cross-tabs-panel[data-id="' + id + '"]');

                    if ( newE ) {
                        var content = ul.nextSibling;
                        if ( content )
                            content.querySelector('.domino-cross-tabs-panel.is-active').setAttribute('class', 'domino-cross-tabs-panel');
                        newE.setAttribute('class', 'domino-cross-tabs-panel is-active');
                    }
                }
            });

        }
    }
}));