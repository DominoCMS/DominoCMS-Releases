
DominoControllers.registerController( 'Domino.ContentBlocks.Types.PicText', DCDominoController.extend( function( _super ) {
	return {
        'indexAction': function ( el, view, data ) {


			if ( data.subtype == 'rightBgLightbox' || data.subtype == 'leftBgLightbox' ) {

                var picLink = el.querySelector('a[dominolightbox]');

                this.onEvent( picLink, 'click', function( e ) {
                    e.preventDefault();

                    var pics = document.querySelectorAll('a[dominolightbox]');

                    var currentPic = 0;
                    for ( var i = 0; i < pics.length; i++ ) {

                        if (pics[i].href == this.href) {
                            currentPic = i;
                        	break;
                    	}
					}

                    var elemDiv = document.createElement('div');
                    elemDiv.id = 'dlightbox';
                    document.body.appendChild(elemDiv);

                    DominoApp.renderView( document.getElementById('dlightbox'), 'Domino.LightBox', {
                        'currentPic': currentPic,
                        'pictures': pics
                    } );


                });


            }



		}
	}
} ) );