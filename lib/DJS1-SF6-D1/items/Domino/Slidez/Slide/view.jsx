/**
 * filename: SlidezSlideView.jsx
 * developer: Domino
 * item: SlidezSlide
 * version: v1.0.0
 * date: 18. 7. 17
 */
DominoViews.registerView( 'Domino.Slidez.Slide', function( data ) {
	"use strict";

	var ret = [];

	for ( var i = 0; i < data.slides.length; i++ ) {

		var slide = data.slides[i];
		//var hidden = ( i == 0 ) ? 'domino-theme slide showing' : 'domino-theme slide';
		/*if ( slide.component )
			ret.push(<component view={ slide.component } componentData={ slide.componentData } />);

		if ( slide.type )
			ret.push(<component view={ 'Domino.Slideshow.Types.' + slide.type } componentData={ slide } />);
*/
		//if ( slide.pic ) {

			//DominoApp['Domino.SlidezOptions'].options.slideBgPos = ( ( slide.pic.bgPosY ) ? slide.pic.bgPosY : '50%');

		var picStyle = slide.pic ? 'background-image:url(' + slide.pic.filename + ')' : '';

		ret.push(<article style="display:none;">
			<div class="container" style={ picStyle }>
				{ (function () {

					var ret2 = [];

					if ( slide.pic ) {
						if ( slide.pic.photographer ) {
							if ( slide.pic.photographer.link )
								ret2.push( <a class="photographer" href={ slide.pic.photographer.link }>{ slide.pic.photographer.name }</a> );
							else
								ret2.push( <span class="photographer">{ slide.pic.photographer.name }</span> );
						}
					}
					if ( slide.content )
						ret2.push( DCUtil.displayHtml( slide.content ) );

					if ( slide.pic )
						ret2.push( <img src={ slide.pic.filename } style="display:none;" /> );

					return ret2;

				})() }
			</div>
		</article>);
		//}


	}


	return ret;

});