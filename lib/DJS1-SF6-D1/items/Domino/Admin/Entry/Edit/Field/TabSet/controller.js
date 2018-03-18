DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.TabSet', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";

            var self = this;
            var lis = document.querySelectorAll('.domino-tabs li');


            self.onEvent(lis, 'click', function (ev) {

                ev.preventDefault();
                var self = this,
                    ul = self.parentNode,
                    id = self.getAttribute("data-id");


                ul.querySelector('li[class="is-active"]').removeAttribute('class');

                self.setAttribute('class', 'is-active');

                var newE = el.querySelector('.tabs-panel[data-id="' + id + '"]');

                if (newE) {

                    var activeE = newE.parentNode.parentNode;
                    if (!activeE)
                        activeE = newE.parentNode;

                    if (activeE)
                        activeE.querySelector(':scope > div > .tabs-panel.is-active').setAttribute('class', 'tabs-panel');
                    // .className.replace( new RegExp('(?:^|\\s)is-active(?!\\S)'), '' );
                    newE.setAttribute('class', 'tabs-panel is-active');
                }


            });

        }
    }
}));