/**
 * filename: SlidezController.js
 * developer: Domino
 * item: Slidez
 * version: v1.0.0
 * date: 18. 7. 17
 */
DominoControllers.registerController( 'Domino.Slidez', DCDominoController.extend( function( _super ) {
	return {
        'indexAction': function ( el, view, data ) {

            var self = this;

           DominoAppOptions.modules['Domino.Slidez'] = data;

            // Actions

            this.onEvent( el.querySelectorAll('a') , 'click', function( ev ) {
                ev.preventDefault();
            });

            this.onEvent( el.querySelector('.slidePrev') , 'click', function( ev ) {
                self.goToSlide('prev','slide');
            });

            this.onEvent( el.querySelector('.slideNext') , 'click', function( ev ) {
                self.goToSlide('next','slide');
            });
            this.onEvent( el.querySelector('.slideDown a') , 'click', function( ev ) {
                $('html,body').animate({scrollTop: el.height()+(parseInt(DominoAppOptions['Domino.Slidez'].slide_down_options.extra,10)) }, DominoAppOptions['Domino.Slidez'].options.slide_down_options.duration,DominoApp.DominoSlidez.options.slide_down_options.easing);
            });

            /*$(document).scroll(function() {
             if ( DominoApp.DominoSlidez.SlidesLength ) {
             var y = $(document).scrollTop();
             DominoApp.DominoSlidez.HeadPos = parseInt(DominoApp.DominoSlidez.SlideBgPos,10) - ( y * DominoApp.DominoSlidez.options.factor ) * 0.2;
             DominoApp.DominoSlidez.SlideNew.css( {"background-position" : "50% " + DominoApp.DominoSlidez.options.HeadPos + "%" });
             }
             });*/

        },
        'goToSlide': function ( slide, transitionType ) {
            "use strict";
            var self = this;
            var el = DominoAppOptions.modules['Domino.Slidez'].el;

            DominoAppOptions.modules['Domino.Slidez'].oldSlides = el.querySelectorAll("article");

            for ( var i = 0; i < DominoAppOptions.modules['Domino.Slidez'].oldSlides.length; i++ )
                DCUtil.fadeOut( DominoAppOptions.modules['Domino.Slidez'].oldSlides[i].querySelector('.fade-content'), 500, 'Ease-In-Out' );

            // On every goToSlide first clearInterval if it exits, if active slides new will be set up
            if ( typeof DominoAppOptions.modules['Domino.Slidez'].animInterval !== 'undefined')
                clearInterval(DominoAppOptions.modules['Domino.Slidez'].animInterval);

            if ( DominoAppOptions.modules['Domino.Slidez'].activeSlides.length ) {

                var navHolder = DominoAppOptions.modules['Domino.Slidez'].navHolder;
                var slidesHolder = DominoAppOptions.modules['Domino.Slidez'].slidesHolder;
                var loaderHolder = DominoAppOptions.modules['Domino.Slidez'].loaderHolder;

                // Define new slide
                var slideNewNum = this.defineNewSlide( slide, DominoAppOptions.modules['Domino.Slidez'].slideNewNum );
                var newSlide = DominoAppOptions.modules['Domino.Slidez'].activeSlides[slideNewNum];

                // Manage navigation
                var navActive = navHolder.querySelector('.active');
                if ( navActive )
                    navActive.className = '';
                var navNew = el.querySelector('.nav a[data-num="' + DominoAppOptions.modules['Domino.Slidez'].slideNewNum + '"]');
                if ( navNew )
                    navNew.className = 'active';

                // Render new slide
                var newSlides =[];
                newSlides.push(newSlide);
                var slideData = { 'slides': newSlides };

                var renderView = DominoAppViews.attr('Domino.Slidez.Slide');
                var renderResult = renderView( slideData );
                b.updateChildren( slidesHolder , renderResult);

                //DominoAppOptions.modules['Domino.Slidez'].slideNew.stopPropagation();
                var slideNew = slidesHolder.querySelector('article:last-child');
                DominoAppOptions.modules['Domino.Slidez'].slideNew = slideNew;
                DominoAppOptions.modules['Domino.Slidez'].imageNew = slideNew.querySelector('img');

                if ( transitionType === 'page' )
                    var trans = DominoAppOptions.modules['Domino.Slidez'].transitionIn;
                else
                    var trans = DominoAppOptions.modules['Domino.Slidez'].transition;

                // Start before loading starts
                DCUtil.fadeIn( loaderHolder, 300, "Ease-In-Out" );

                // loading here
                if ( DominoAppOptions.modules['Domino.Slidez'].imageNew )
                    DominoAppOptions.modules['Domino.Slidez'].imageNew.onload = function() {

                        //this.remove();
                        DCUtil.fadeOut( loaderHolder, 300, "Ease-In-Out" );

                        // stop propagate first mofo
                        DCUtil.fadeIn( DominoAppOptions.modules['Domino.Slidez'].slideNew, trans.duration, trans.easing );

                        // then remove old slides ;
                        self.removeOldSlides();

                    }
                else {
                    DCUtil.fadeOut( loaderHolder, 300, "Ease-In-Out" );

                    // stop propagate first mofo
                    DCUtil.fadeIn( DominoAppOptions.modules['Domino.Slidez'].slideNew, trans.duration, trans.easing );



                    // then remove old slides ;
                    self.removeOldSlides();
                }

                if ( DominoAppOptions.modules['Domino.Slidez'].activeSlides.length > 1 )
                DominoAppOptions.modules['Domino.Slidez'].animInterval = setInterval( function(){
                    self.goToSlide('next','slide'); }, 12000 ); // set interval here

            }
            else {
                self.removeOldSlides();
            }


        },
		'refreshAction': function ( el, view, data ) {
			"use strict";

            var self = this;
            var navHolder = el.querySelector('.nav');
            var slidesHolder = el.querySelector('.slides');
            var loaderHolder = el.querySelector('.domino-spinner');
            DominoAppOptions.modules['Domino.Slidez'].el = el;
            DominoAppOptions.modules['Domino.Slidez'].navHolder = navHolder;
            DominoAppOptions.modules['Domino.Slidez'].loaderHolder = loaderHolder;
            DominoAppOptions.modules['Domino.Slidez'].slidesHolder = slidesHolder;
            DominoAppOptions.modules['Domino.Slidez'].activeSlides = data.slides;
            DominoAppOptions.modules['Domino.Slidez'].oldSlides = slidesHolder.querySelectorAll('article');

            // SET HEIGHT
            var height = data.options.height;
            el.firstChild.className = 'domino-slidez ' + height;


            // el.stop().attr('class', 'DominoSlidez height-'+ data.height );

            // MANAGE BUTTONS
            if ( DominoAppOptions.modules['Domino.Slidez'].buttons == true ) {
                var slidePrev = el.querySelector(".slidePrev");
                var slideNext = el.querySelector(".slideNext");

                if ( DominoAppOptions.modules['Domino.Slidez'].activeSlides.length > 1 ) {
                    DCUtil.fadeIn( slidePrev, 2000, "Ease-In-Out" );
                    DCUtil.fadeIn( slideNext, 2000, "Ease-In-Out" );
                }
                else {
                    DCUtil.fadeOut( slidePrev, 2000, "Ease-In-Out" );
                    DCUtil.fadeOut( slideNext, 2000, "Ease-In-Out" );
                }
            }

            // MANAGE NAVIGATION
            if ( DominoAppOptions.modules['Domino.Slidez'].nav == true ) {

                //navHolder.style.display = !height ? 'none' : 'block';

                // add new nav LI only if more than 1 new slide
                if ( DominoAppOptions.modules['Domino.Slidez'].activeSlides.length > 1 ) {
                    var docFragment = document.createElement('ul');
                    for ( var i = 0; i < data.slides.length; i++) {
                        var li = document.createElement("LI");
                        var a = document.createElement("A");
                        a.href = '#';
                        a.setAttribute('data-num',i);
                        var span = document.createElement("SPAN");
                        span.className = 'icon-status';
                        a.appendChild( span );
                        li.appendChild( a );
                        docFragment.appendChild( li );
                    }
                    navHolder.firstChild.innerHTML = docFragment.innerHTML;

                    DCUtil.fadeIn( navHolder, 2000, "Ease-In-Out" );
                    if ( navHolder.firstChild.querySelector('li:first-child a') )
                        navHolder.firstChild.querySelector('li:first-child a').className = 'active';

                    this.onEvent( el.querySelectorAll('.nav a') , 'click', function( ev ) {
                        ev.preventDefault();
                        var currentSlide = parseInt( this.getAttribute("data-num"),10);
                        if ( DominoAppOptions.modules['Domino.Slidez'].slideNewNum !== currentSlide )
                            self.goToSlide( currentSlide, 'slide' )
                    });

                }
                else
                    DCUtil.fadeOut( navHolder, 2000, "Ease-In-Out" ); // add stop animation first or do it in the fadeout function

            }

            self.goToSlide(0,'page');

        },
        'removeOldSlides': function (  ) {
            "use strict";

            if ( DominoAppOptions.modules['Domino.Slidez'].oldSlides )
                for ( var i = 0; i < DominoAppOptions.modules['Domino.Slidez'].oldSlides.length; i++ ) {
                    var oldSlide = DominoAppOptions.modules['Domino.Slidez'].oldSlides[i];

                    DCUtil.fadeOut( oldSlide, 500, "Ease-In-Out" );
                }

            setTimeout(function() {
                if ( DominoAppOptions.modules['Domino.Slidez'].oldSlides )
                    for ( var i = 0; i < DominoAppOptions.modules['Domino.Slidez'].oldSlides.length; i++ ) {
                        var oldSlide = DominoAppOptions.modules['Domino.Slidez'].oldSlides[i];
                        oldSlide.remove();
                    }
            }, 1500);
        },
        'defineNewSlide': function ( slide, slideNewNum ) {
            "use strict";

            if ( slide === 'next' ) {
                if( ( slideNewNum + 1 ) <  DominoAppOptions.modules['Domino.Slidez'].activeSlides.length )
                    slideNewNum = ( slideNewNum + 1 );
                else
                    slideNewNum = 0;
            }
            else if ( slide === 'prev' ) {
                if( ( slideNewNum - 1 ) >= 0 )
                    slideNewNum = ( slideNewNum - 1 );
                else
                    slideNewNum = ( DominoAppOptions.modules['Domino.Slidez'].activeSlides.length - 1 );
            }
            else
                slideNewNum = parseInt(slide,10);

            DominoAppOptions.modules['Domino.Slidez'].slideNewNum = slideNewNum;

            return slideNewNum;
        }
}
}));