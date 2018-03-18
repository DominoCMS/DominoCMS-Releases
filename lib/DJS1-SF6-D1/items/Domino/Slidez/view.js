DominoViews.registerView( 'Domino.Slidez', function( data ) {
	"use strict";

	return {tag: "div", attrs: {}, className:"domino-slidez", children: [
				{tag: "div", attrs: {}, className:"slides"}, 
				{tag: "div", attrs: {}, className:"overlay"}, 
				{tag: "div", attrs: {}, className:"domino-spinner", children: [
					{tag: "div", attrs: {}, className:"spinner-container container3", children: [
					{tag: "div", attrs: {}, className:"circle1"}, 
						{tag: "div", attrs: {}, className:"circle2"}, 
						{tag: "div", attrs: {}, className:"circle3"}, 
						{tag: "div", attrs: {}, className:"circle4"}
					]}
				]}, 
		 (function () {
			var ret = [];
			if ( data.buttons === true ) {
				ret.push({tag: "a", attrs: {href:"#"}, className:"buttons slidePrev", children: [
					{tag: "span", attrs: {}, className:"icon-arrow_left"}
				]});
				ret.push({tag: "a", attrs: {href:"#"}, className:"buttons slideNext", children: [
					{tag: "span", attrs: {}, className:"icon-arrow_right"}
				]});
			}
			if ( data.slideDown === true )
				ret.push({tag: "div", attrs: {}, className:"slideDown", children: [
					{tag: "a", attrs: {href:"#"}, children: [
						{tag: "span", attrs: {}, className:"icon-arrow_down"}
					]}
				]});
			if ( data.nav === true )
				ret.push({tag: "div", attrs: {}, className:"nav", children: [
					{tag: "ul", attrs: {}}
				]});

			return ret;
		})() 
		]}
});
