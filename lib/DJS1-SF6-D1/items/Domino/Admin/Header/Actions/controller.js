
DominoControllers.registerController( 'Domino.Admin.Header.Actions', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {


         var buttonExport = el.querySelector('dt').firstChild,
             itemsList = el.querySelector('dd').firstChild;

         this.onEvent( buttonExport, 'click', function( ev ) {

             if ( itemsList.className == 'hide' )
                 itemsList.className = '';
             else
                 itemsList.className = 'hide';

             return false;
         } );

         this.onEvent( document.getElementsByName('deployLink'), 'click', function( ev ) {
          ev.preventDefault();
          var self = this,
              type = self.getAttribute('data-id');

          self.setAttribute('class','red')
          DominoApp.ajax({
           view: view,
           action: 'deploy',
           data: {
            'type': type
           }
          }).then( function( data ) {
           self.setAttribute('class','green')

           setTimeout(function(){
            self.removeAttribute("class");
           }, 3000);

          }, function( errorResponse ) {
          } );

         } );

         /*document.addEventListener('click', function(event) {
             var isClickInside = el.contains(event.target);

             if (!isClickInside) {
                 results.style.display = 'none';
             }
         });*/

        }
    }
} ) );


