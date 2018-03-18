/**
 * filename: MenuMainView.jsx
 * developer: Domino
 * item: MenuMain
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.MenuMain', function( data ) {
	"use strict";


	return {tag: "div", attrs: {}, className:"menumain", children: [
		{tag: "button", attrs: {href:"#"}, children: [
			{tag: "span", attrs: {}, className:"icon-list"}
		]}, 
		{tag: "ul", attrs: {}, className:"dropdown hidden", children: [
			 (function () {

				var entries = [];
				for ( var i = 0; i < data['entries']['Domino.Menu.main'].length; i++ ) {

					var entry = data['entries']['Domino.Menu.main'][i];
					var active = ( entry.active == 1 ) ? 'active' : '';

					entries.push({tag: "li", attrs: {"data-entry": entry.entry}, className:active , children: [
                         (function () {

                            if ( entry.children.length ) {
                                var ul = [];

                                ul.push({tag: "span", attrs: {name:"domino-menumain-arrows"}, className:"arrow icon-arrow_right"});

                                return ul;
                            }

                        })(),
						{tag: "a", attrs: {href: entry.link}, children: [ entry.name]}, 
						 (function () {

							if ( entry.children.length ) {
								var ul = [];

								var subentries = [];
								for ( var j = 0; j < entry.children.length; j++ ) {

									var subentry = entry.children[j];
									var subactive = ( subentry.active == 1 ) ? 'active' : '';

									subentries.push({tag: "li", attrs: {"data-entry": subentry.entry}, className:subactive , children: [
                                         (function () {

                                            if ( subentry.children.length ) {
                                                var ul2 = [];
                                                ul2.push({tag: "span", attrs: {name:"domino-menumain-arrows"}, className:"arrow icon-arrow_right"});
                                                return ul2;
                                            }

                                        })(),
										{tag: "a", attrs: {href: subentry.link}, children: [ subentry.name]}, 
										 (function () {

											if ( subentry.children.length ) {
												var ul2 = [];

												var subentries2 = [];
												for ( var k = 0; k < subentry.children.length; k++ ) {

													var subentry2 = subentry.children[k];
													var subactive2 = ( subentry2.active == 1 ) ? 'active' : '';

													subentries2.push({tag: "li", attrs: {"data-entry": subentry2.entry}, className:subactive2 , children: [
															{tag: "a", attrs: {href: subentry2.link}, children: [ subentry2.name]}, 
															 (function () {

																if ( subentry2.children.length ) {
																	var ul3 = [];

																	var subentries3 = [];
																	for ( var l = 0; l < subentry2.children.length; l++ ) {

																		var subentry3 = subentry2.children[l];
																		var subactive3 = ( subentry3.active == 1 ) ? 'active' : '';

																		subentries3.push({tag: "li", attrs: {"data-entry": subentry3.entry}, className:subactive3 , children: [
																			{tag: "a", attrs: {href: subentry3.link}, children: [ subentry3.name]}
																		]});
																	}
																	ul3.push({tag: "ul", attrs: {}, className:"dropdown hidden", children: [subentries3 ]});

																	return ul3;
																}

															})() 

														]});
													}

												ul2.push({tag: "ul", attrs: {}, className:"dropdown hidden", children: [subentries2 ]});

												return ul2;
											}

										})() 
									]});
								}

								ul.push({tag: "ul", attrs: {}, className:"dropdown hidden", children: [subentries ]});

								return ul;
							}

						})() 
					]});
				}

                entries.push({tag: "div", attrs: {}, className:"hide-for-medium", children: [
                     (function () {

                        var entries2 = [];
                        for ( var i = 0; i < data['entries']['Domino.Menu.service'].length; i++ ) {

                            var entry = data['entries']['Domino.Menu.service'][i];
                            var active = ( entry.active == 1 ) ? 'active' : '';

                            entries2.push({tag: "li", attrs: {"data-entry": entry.entry}, className:active , children: [
                                {tag: "a", attrs: {href: entry.link}, children: [ entry.name]}
                            ]});
                        }
                        return entries2;

                    })() 
                ]});
				return entries;

			})() 
        ]}

	]}
});
