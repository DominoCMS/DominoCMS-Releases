/**
 * filename: MenuMainController.js
 * developer: Domino
 * item: MenuMain
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoControllers.registerController( 'Domino.Header.MenuMain', DCDominoController.extend( function( _super )  {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;
            var button = el.children[0].firstChild;
            var li = el.querySelectorAll('li');
            var link = el.querySelectorAll('a');
            var arrows = document.getElementsByName('domino-menumain-arrows');
            var ul = el.children[0].children[1];


            // Responsive button switching
            self.onEvent( button , 'click', function( ev ) {
                ev.preventDefault();

                if ( ul.className == 'dropdown hidden' )
                    ul.className = 'dropdown';
                else
                    ul.className = 'dropdown hidden';

            });

            // Close when clicked on a subpage
            self.onEvent( link , 'click', function( ev ) {

                el.children[0].children[1].className = 'dropdown hidden';
                var ul = this.parentNode.parentNode;

                var arrow = ul.parentNode.firstChild;
                if ( arrow && arrow.className )
                    arrow.className = 'arrow icon-arrow_right';
                var arrow = this.prevSibling;
                if ( arrow && arrow.className )
                    arrow.className = 'arrow icon-arrow_right';

                if ( ul )
                    ul.className = 'dropdown hidden';

            });

            // Hover events
            for ( var i = 0; i < li.length; i++ ) {
                var btn = li[i];
                btn.onmouseover = function( event ) {
                    var ul = this.lastChild;
                    var arrow = this.firstChild;


                    var currentArrowDisplay = arrow.currentStyle ? arrow.currentStyle.display : getComputedStyle(arrow, null).display;

                    if ( ul && arrow )
                        if ( currentArrowDisplay != 'block' )
                            ul.className = 'dropdown';
                };

                btn.onmouseout = function( event ) {
                    var ul = this.lastChild;
                    var arrow = this.firstChild;
                    var currentArrowDisplay = arrow.currentStyle ? arrow.currentStyle.display : getComputedStyle(arrow, null).display;

                    if ( ul && arrow )
                        if ( currentArrowDisplay != 'block' )
                            ul.className = 'dropdown hidden';
                };
            }

            document.addEventListener('click', function(event) {
                var isClickInside = el.contains(event.target);

                if (!isClickInside)
                    ul.className = 'dropdown hidden';
            });

            // Close when clicked on a Arrows
            self.onEvent( arrows , 'click', function( ev ) {
                ev.preventDefault();
                var ul = this.parentNode.lastChild;
                if ( ul ) {
                    if ( ul.className == 'dropdown hidden' ) {
                        this.className = 'arrow icon-arrow_down';
                        ul.className = 'dropdown';
                    }
                    else {
                        this.className = 'arrow icon-arrow_right';
                        ul.className = 'dropdown hidden';
                    }

                }

            });


        },
        'refreshAction': function ( el, view, data ) {
            "use strict";

            var oldEntryEl = el.querySelector('li[data-entry].active');
            var eldEntry =  oldEntryEl ? oldEntryEl.getAttribute('data-entry') : null;

            if ( eldEntry != data ) {

                var oldEl = el.querySelector('li[data-entry].active');
                if ( oldEl )
                    oldEl.className = '';

                var activeEl = el.querySelector('li[data-entry="' + data + '"]');

                if ( activeEl )
                    activeEl.className = 'active';

            }
        }
    }
}));
