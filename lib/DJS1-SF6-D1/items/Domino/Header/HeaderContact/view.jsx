/**
 * filename: HeaderContactView.jsx
 * developer: Domino
 * item: HeaderContact
 * version: v1.0.0
 * date: 14. 8. 17
 */
DominoViews.registerView( 'Domino.Header.HeaderContact', function( data ) {
	"use strict";

	return <div class="headercontact">
		{ (function () {

			var ret = [];
            if ( data.entries )
				for (var i = 0; i < data.entries.length; i++) {

					var button = data.entries[i];

					if ( button.type == 'button' )
						ret.push(<button href={ button.url } class={ 'btn ' + button.class }>
							<span class={ 'icon icon-' + button.icon }></span>
                            { (function () {
                                var ret2 = [];
                                if ( button.name ) {
                                    ret2.push(<span class={ button.hide }>{ ' ' + button.name }</span>);
                                }
                                return ret2;
                            })() }
						</button>);
					else if ( button.type == 'a' )
						ret.push(<a href={ button.url } class={ 'btn ' + button.class } target={ '' + button.target }>
							<span class={ 'icon icon-' + button.icon }></span>
                            { (function () {
                            var ret2 = [];
                            if ( button.name ) {
                                ret2.push(<span class={ button.hide }>{ ' ' + button.name }</span>);
                            }
                            return ret2;
                        })() }
						</a>);
					else if ( button.type == 'langs' )
						ret.push(<div class="langs">
							{ (function () {
								var ret2 = [];

								for (var j = 0; j < button.langs.length; j++) {
									var lang = button.langs[j];
									var active = ( button.domain == lang.domain ) ? 'lang active' : 'lang';
									//ret2.push(<a href="#" class={ 'flag' + lang.flag + active } target="_self"></a>);
                                    ret2.push(<a href={ lang.url } class={ active }>{ lang.lang }</a>);

								}
								return ret2;
							})() }
						</div>);

				}

            return ret;

		})() }
    </div>
} );