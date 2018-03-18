

DominoControllers.registerController( 'indexController', DCDominoController.extend( function( _super ) {
	return {
		'indexAction': function ( data ) {

			var deferred = new Deferred();

			var urlparams = window.location.search.replace(/\?/g, '');
			var fullpath = urlparams ? data.path + '?' + urlparams : data.path;

			DominoApp.getAjax( '/' + fullpath, data.params, {} ).then( function( getData ) {

				DominoAppOptions.site = getData.site;
				DominoAppOptions.params = getData.params;
				DominoAppOptions.identity = getData.identity;




				if ( getData.params.debug )
					console.log('Debug: ' + getData.params.debug);

				if ( getData.params.error ) {
					DominoApp.renderView( document.getElementById("mainLayout"), getData.params.error.view, getData.params.error );
				}
				else {

					DominoApp.utils.title(getData.site.meta.title);
					DominoApp.utils.description(getData.site.meta.description);
					DominoApp.utils.keywords(getData.site.meta.keywords);
//var xx = 0;
					//DominoAppComponents = {};

					function FillViews ( placeholder ) {

						var el = null;
						var viewName = null;
						var componentData = null;
						var newController = null;

						var FindPlaceholder = placeholder.querySelectorAll('div[view]');
						if ( FindPlaceholder.length )
							//console.log(FindPlaceholder);
						for ( var index = 0; index < FindPlaceholder.length; index++ ) {
							el = FindPlaceholder[index];
							//console.log(el);
							viewName = el.getAttribute('view');
							componentData = el.hasAttribute('componentData');
							//console.log('fillViews: ' + viewName);
							if ( !viewName )
								console.log(el);

							if ( !componentData ) {
								DominoApp.renderView(el, viewName, getData.moduleData[viewName]);
								FillViews(el);
							}


						}
					}

					var placeholder;
					for ( var key = 0; key < getData.site.page.views.length; key++ ) {
						var registeredView = getData.site.page.views[key];

						if ( ( DominoAppOptions.activeTemplate[key] !== registeredView ) || ( key > 0 ) ) { //viewsNum === (key + 1)

							if ( key === 0 ) {
								DominoAppOptions.activeTemplate = [];
								placeholder = document.getElementById("mainLayout");
							}
							else
								placeholder = document.getElementById("inner");
							if (this.activeController)
								this.activeController.destroy();

							//newController.destroy();
							if ( placeholder ) {
								DominoApp.renderView( placeholder, registeredView, getData.moduleData[registeredView] );

								FillViews( placeholder );
								DominoAppOptions.activeTemplate[key] = registeredView;
							}

						}
					}

					// Refresh data
					if ( getData.refreshData )
						for ( var key in getData.refreshData )
							if (getData.refreshData.hasOwnProperty(key))
								if ( DominoAppControllers[key] ) {
									var refreshController = new DominoAppControllers[ key ]();
									if ( refreshController )
										if ( refreshController['refreshAction'] ) {

											var refreshEl = document.querySelector('div[view="' + key + '"]');

											if ( refreshEl )
                                                refreshController['refreshAction']( refreshEl, key, getData.refreshData[key] );
										}
								}

                    document.body.className = 'render';



					if( typeof( window.ga ) == 'function' ) {
                        window.ga('set', 'page', getData.params.currentUrl );
                        window.ga('send', 'pageview' );
                    }



					// reset inactive views
					//for ( var i = viewsNum; i < 4; i++ ) {
						//self.options.activeTemplate[i] = "";
						//$('[view="' + i + '"]').empty();
					//}

				}


				deferred.resolve( getData );


			}, function( errorResponse ) {
				// TODO: handle error
				console.log("we don't got it");
			} );

			return deferred.promise();
		},
		'404Action': function (params) {
			console.log('Running 404 with', params);
		}
	}
} ) );