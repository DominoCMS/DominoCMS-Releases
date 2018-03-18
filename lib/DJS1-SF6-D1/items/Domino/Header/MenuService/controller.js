/**
 * filename: MenuServiceController.js
 * developer: Domino
 * item: MenuService
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoControllers.registerController( 'Domino.Header.MenuService', DCDominoController.extend( function( _super )  {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;
            var button = el.querySelector('button');


            self.onEvent( button , 'click', function( ev ) {
                ev.preventDefault();


                button.style.display = 'block';

                //menu.toggleClass('hidden');

            });

        },
        'refreshAction': function ( el, view, data ) {
            "use strict";


            var oldEntryEl = el.querySelector('li.active');
            var eldEntry =  oldEntryEl ? oldEntryEl.getAttribute('data-entry') : null;

            if ( eldEntry != data ) {

                var oldEl = el.querySelector('li.active');
                if ( oldEl )
                    oldEl.className = '';

                var activeEl = el.querySelector('li[data-entry="' + data + '"]');

                if ( activeEl )
                    activeEl.className = 'active';

            }


        }
    }
}));
