
DominoControllers.registerController( 'Domino.Admin.Header.Search', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {


         var self = this,
             searchInput = el.querySelector( 'input' ),
             searchButton = document.getElementById( 'DSearchFocus' ),
             results = document.querySelector( '.results' ),
             entries = document.querySelector( '.entries' ),
             input = document.querySelector('input[name=SearchTerm]'),
             mainContainer = document.querySelector('.search'),
             ButtonSearch = document.querySelector('dt');
         var resultsTitle = el.querySelector('.title');
         var entries = el.querySelector('.entries');

         self.onEvent( input , 'focus', function( ev ) {
          ev.preventDefault();
           results.style.display = 'block';

           //if( $('.DSearchForm .results').length )
            //$('.DSearchForm .results').css('display', 'block');
           //if( $('#SrcNotify').length ===  0 )
            //

         });


         var currentRequest = null;
         var delay = (function(){
             var timer = 0;
             return function(callback, ms){
                 clearTimeout (timer);
                 timer = setTimeout(callback, ms);
             };
         })();

         self.onEvent( input , 'keyup', function( ev ) {
             ev.preventDefault();

             var selfie = this;

             if( selfie.value.length < 2 ) {
                 resultsTitle.innerHTML = 'Za iskanje vnesite vsaj 2 znaka ...';
                 //$('.entries').remove();
             }
             else {
                 resultsTitle.innerHTML = 'Iskanje poteka';
                 if (currentRequest != null) {
                     currentRequest.abort();
                 }
             }

             delay(function(){

                 currentRequest = DominoApp.ajax({
                     view: view,
                     action: 'search',
                     data: {
                         'query': selfie.value
                     }
                 }).then( function( success ) {

                     if ( success.entries.length == 0 )
                         resultsTitle.innerHTML = 'Ni rezultatov, vpišite drug niz';
                     else
                         resultsTitle.innerHTML = 'Rezultati iskanja';


                     var ret = '';
                     if ( success.entries.length > 0 )
                         for ( var i = 0; i < success.entries.length; i++ ) {
                            var val = success.entries[i];
                            ret += '<li>';
                            ret += '<a href="' + val.link + '" title="' + val.name + '">';
                            ret += ( val.image_tag ) ? val.image_tag : '';
                            ret += '<strong>' + val.name + '</strong>';
                            ret += ( val.summary && val.summary.length ) ? '<br /><span>' + val.summary + '</span>' : '';
                            ret += '</a>';
                            ret += '</li>';
                         }
                     entries.innerHTML = ret;

                     self.onEvent( entries.querySelectorAll('a'), 'click', function( ev ) {
                         results.style.display = 'none';
                     });

                 });


             }, 300);


         });





        // window.addEventListener('mouseup', function(e) {

         // var target = getAncestor(event.target, mainContainer);
         // if (target !== null) {
          /// alert(target.nodeName);
          ///}

          //if ( (!mainContainer.is(e.target) && mainContainer.has(e.target).length === 0) && (!ButtonSearch.is(e.target) && ButtonSearch.has(e.target).length === 0) && (ContVal == '1px') ) {
            //mainContainer.style.display = 'none';
           //}
         /*
            var container = $(".DSearchForm");
            if ( (!container.is(e.target) && container.has(e.target).length === 0)) {
            $(".DSearchForm .results").hide();
            }
            */

       // }, false);


         self.onEvent( searchButton, 'click', function( ev ) {
          ev.preventDefault();

          DominoApp.ajax({
           view: 'Domino.Admin.Header.Search',
           action: 'search',
           data: {
            'query': searchInput.value
           }
          }).then( function( data ) {

           var l_cat = "";
           var arr_null_cat = [];
           var srcNotify = document.getElementById( 'SrcNotify' );
           //entries.remove();

           if ( ( typeof data == 'undefined' ) || ( data.length == 0 ) )
            srcNotify.innerHTML = 'Ni rezultatov, vpišite drug niz';
           else
            srcNotify.innerHTML = 'Rezultati iskanja';


           var content = '';
           for ( var i = 0; i < data.length; i++ ) {
            var val = data[i];
            content += '<li class="entries"><a class="IdentEntries" href="' + val.link + '" title="' + val.name + '">' + ((val.image_tag)?val.image_tag:'') + '<span><strong>' + val.name + '</strong>' + ((val.summary && val.summary.length)?'<br>'+val.summary:'') + '</span></a></li>';
           }

           srcNotify.innerHTML = content;



           var insert_func = function( key, val ) {
            if( val.category != l_cat ) {
             results.append('<li class="title entries">' + val.category + '</li>');
             l_cat = val.category;
            }


           };



          }, function( errorResponse ) {
          } );


         } );



         document.addEventListener('click', function(event) {
             var isClickInside = el.contains(event.target);

             if (!isClickInside) {
                 results.style.display = 'none';
             }
         });




        }
    }
} ) );


