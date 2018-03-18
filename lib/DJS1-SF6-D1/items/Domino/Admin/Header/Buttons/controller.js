
DominoControllers.registerController( 'Domino.Admin.Header.Buttons', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {

         if ( data.auth === true ) {
             var buttonModules = document.getElementById('buttonModules'),
                 modulesList = document.getElementById('modules-list');

             this.onEvent(buttonModules, 'click', function (ev) {

                 if (modulesList.style.display == 'none' || !modulesList.style.display)
                     modulesList.style.display = 'block';
                 else
                     modulesList.style.display = 'none';
                 return false;
             });
         }

        },
        'refreshAction': function ( el, view, data ) {
             "use strict";

            if ( data.auth === true ) {
                var modulesList = document.getElementById('modules-list');

                document.getElementById('buttonModules').className = 'domino-tooltip';

                var pages = 4;

                var ret = '<ul>';
                for (var i = 0; i < data.modules.length; i++) {
                    var menu = data.modules[i];
                    ret += '<li><a href="' + menu.link + '"><span class="icon-' + menu.icon + '"></span>' + menu.name + '</a></li>';
                }
                ret += '</ul>';
                modulesList.innerHTML = ret;

                this.onEvent(modulesList.childNodes, 'click', function (ev) {
                    modulesList.style.display = 'none';
                    return false;
                });
            }

        }
    }
} ) );

