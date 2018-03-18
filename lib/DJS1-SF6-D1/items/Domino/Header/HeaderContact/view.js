/**
 * filename: HeaderContactView.jsx
 * developer: Domino
 * item: HeaderContact
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.HeaderContact', function( data ) {
	"use strict";

	return {tag: "div", attrs: {}, className:"headercontact", children: [
		 (function () {

			var ret = [];
            if ( data.entries )
				for (var i = 0; i < data.entries.length; i++) {

					var button = data.entries[i];

					if ( button.type == 'button' )
						ret.push({tag: "button", attrs: {href: button.url}, className: 'btn ' + button.class, children: [
							{tag: "span", attrs: {}, className: 'icon icon-' + button.icon}, 
                             (function () {
                                var ret2 = [];
                                if ( button.name ) {
                                    ret2.push({tag: "span", attrs: {}, className: button.hide, children: [ ' ' + button.name]});
                                }
                                return ret2;
                            })() 
						]});
					else if ( button.type == 'a' )
						ret.push({tag: "a", attrs: {href: button.url,target: '' + button.target}, className: 'btn ' + button.class, children: [
							{tag: "span", attrs: {}, className: 'icon icon-' + button.icon}, 
                             (function () {
                            var ret2 = [];
                            if ( button.name ) {
                                ret2.push({tag: "span", attrs: {}, className: button.hide, children: [ ' ' + button.name]});
                            }
                            return ret2;
                        })() 
						]});
					else if ( button.type == 'langs' )
						ret.push({tag: "div", attrs: {}, className:"langs", children: [
							 (function () {
								var ret2 = [];

								for (var j = 0; j < button.langs.length; j++) {
									var lang = button.langs[j];
									var active = ( button.domain == lang.domain ) ? 'lang active' : 'lang';
									//ret2.push(<a href="#" class={ 'flag' + lang.flag + active } target="_self"></a>);
                                    ret2.push({tag: "a", attrs: {href: lang.url}, className:active , children: [ lang.lang]});

								}
								return ret2;
							})() 
						]});

				}

            return ret;

		})() 
    ]}
} );
