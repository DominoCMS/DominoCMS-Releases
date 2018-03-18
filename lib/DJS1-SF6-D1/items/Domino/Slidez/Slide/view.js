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

		ret.push({tag: "article", attrs: {}, style:"display:none;", children: [
			{tag: "div", attrs: {}, className:"container",style:picStyle , children: [
				 (function () {

					var ret2 = [];

					if ( slide.pic ) {
						if ( slide.pic.photographer ) {
							if ( slide.pic.photographer.link )
								ret2.push( {tag: "a", attrs: {href: slide.pic.photographer.link}, className:"photographer", children: [ slide.pic.photographer.name]} );
							else
								ret2.push( {tag: "span", attrs: {}, className:"photographer", children: [ slide.pic.photographer.name]} );
						}
					}
					if ( slide.content )
						ret2.push( DCUtil.displayHtml( slide.content ) );

					if ( slide.pic )
						ret2.push( {tag: "img", attrs: {src: slide.pic.filename}, style:"display:none;"} );

					return ret2;

				})() 
			]}
		]});
		//}


	}


	return ret;

});
