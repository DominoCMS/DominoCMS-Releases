
DominoControllers.registerController( 'Domino.Admin.BreadCrumbs', DCDominoController.extend( function( _super ) {
	return {
        'indexAction': function ( el, view, data ) {

            var self = this;
            el.style.display = 'none';

        },
        'refreshAction': function ( el, view, data ) {

            var self = this;

            if ( data.hide )
                DCUtil.fadeOut( el, 1000, "Ease-In-Out" );
            else {
                if ( el.style.display == 'none' )
                    DCUtil.fadeIn( el, 1000, "Ease-In-Out" );
            }

            var docFragment = document.createElement('ul');
            for ( var i = 0; i < data.entries.length; i++) {
                var entry = data.entries[i];

                var li = document.createElement("LI");
                var a = document.createElement("A");
                a.href = entry.link;
                if ( entry.icon ) {
                    var span = document.createElement("SPAN");
                    span.className = 'icon-' + entry.icon;
                    //span.innerText = '';
                    a.appendChild( span );
                }
                var span = document.createElement("SPAN");
                span.className = 'name';
                span.innerText = entry.name;
                a.appendChild( span );
                li.appendChild( a );
                docFragment.appendChild( li );
            }
            el.querySelector('ul').innerHTML = docFragment.innerHTML;


        }
	}
} ) );