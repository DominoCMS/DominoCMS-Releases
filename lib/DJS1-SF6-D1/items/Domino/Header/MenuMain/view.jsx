/**
 * filename: MenuMainView.jsx
 * developer: Domino
 * item: MenuMain
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.MenuMain', function( data ) {
	"use strict";


	return <div class="menumain">
		<button href="#">
			<span class="icon-list"></span>
		</button>
		<ul class="dropdown hidden">
			{ (function () {

				var entries = [];
				for ( var i = 0; i < data['entries']['Domino.Menu.main'].length; i++ ) {

					var entry = data['entries']['Domino.Menu.main'][i];
					var active = ( entry.active == 1 ) ? 'active' : '';

					entries.push(<li data-entry={ entry.entry } class={ active }>
                        { (function () {

                            if ( entry.children.length ) {
                                var ul = [];

                                ul.push(<span name="domino-menumain-arrows" class="arrow icon-arrow_right"></span>);

                                return ul;
                            }

                        })() }
						<a href={ entry.link }>{ entry.name }</a>
						{ (function () {

							if ( entry.children.length ) {
								var ul = [];

								var subentries = [];
								for ( var j = 0; j < entry.children.length; j++ ) {

									var subentry = entry.children[j];
									var subactive = ( subentry.active == 1 ) ? 'active' : '';

									subentries.push(<li data-entry={ subentry.entry } class={ subactive }>
                                        { (function () {

                                            if ( subentry.children.length ) {
                                                var ul2 = [];
                                                ul2.push(<span name="domino-menumain-arrows" class="arrow icon-arrow_right"></span>);
                                                return ul2;
                                            }

                                        })() }
										<a href={ subentry.link }>{ subentry.name }</a>
										{ (function () {

											if ( subentry.children.length ) {
												var ul2 = [];

												var subentries2 = [];
												for ( var k = 0; k < subentry.children.length; k++ ) {

													var subentry2 = subentry.children[k];
													var subactive2 = ( subentry2.active == 1 ) ? 'active' : '';

													subentries2.push(<li data-entry={ subentry2.entry } class={ subactive2 }>
															<a href={ subentry2.link }>{ subentry2.name }</a>
															{ (function () {

																if ( subentry2.children.length ) {
																	var ul3 = [];

																	var subentries3 = [];
																	for ( var l = 0; l < subentry2.children.length; l++ ) {

																		var subentry3 = subentry2.children[l];
																		var subactive3 = ( subentry3.active == 1 ) ? 'active' : '';

																		subentries3.push(<li data-entry={ subentry3.entry } class={ subactive3 }>
																			<a href={ subentry3.link }>{ subentry3.name }</a>
																		</li>);
																	}
																	ul3.push(<ul class="dropdown hidden">{ subentries3 }</ul>);

																	return ul3;
																}

															})() }

														</li>);
													}

												ul2.push(<ul class="dropdown hidden">{ subentries2 }</ul>);

												return ul2;
											}

										})() }
									</li>);
								}

								ul.push(<ul class="dropdown hidden">{ subentries }</ul>);

								return ul;
							}

						})() }
					</li>);
				}

                entries.push(<div class="hide-for-medium">
                    { (function () {

                        var entries2 = [];
                        for ( var i = 0; i < data['entries']['Domino.Menu.service'].length; i++ ) {

                            var entry = data['entries']['Domino.Menu.service'][i];
                            var active = ( entry.active == 1 ) ? 'active' : '';

                            entries2.push(<li data-entry={ entry.entry } class={ active }>
                                <a href={ entry.link }>{ entry.name }</a>
                            </li>);
                        }
                        return entries2;

                    })() }
                </div>);
				return entries;

			})() }
        </ul>

	</div>
});