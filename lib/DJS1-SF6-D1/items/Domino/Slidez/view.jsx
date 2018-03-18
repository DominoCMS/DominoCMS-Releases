
DominoViews.registerView( 'Domino.Slidez', function( data ) {
	"use strict";

	return <div class="domino-slidez">
				<div class="slides"></div>
				<div class="overlay"></div>
				<div class="domino-spinner">
					<div class="spinner-container container3">
					<div class="circle1"></div>
						<div class="circle2"></div>
						<div class="circle3"></div>
						<div class="circle4"></div>
					</div>
				</div>
		{ (function () {
			var ret = [];
			if ( data.buttons === true ) {
				ret.push(<a href="#" class="buttons slidePrev">
					<span class="icon-arrow_left"></span>
				</a>);
				ret.push(<a href="#" class="buttons slideNext">
					<span class="icon-arrow_right"></span>
				</a>);
			}
			if ( data.slideDown === true )
				ret.push(<div class="slideDown">
					<a href="#">
						<span class="icon-arrow_down"></span>
					</a>
				</div>);
			if ( data.nav === true )
				ret.push(<div class="nav">
					<ul></ul>
				</div>);

			return ret;
		})() }
		</div>
});