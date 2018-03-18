/**
 * DominoCMS
 * www.dominocms.com
 * 0.9.9
 * 2017-04-02 17:21
 */

var DominoApp = null;
var DominoAppControllers = {};
var DominoAppViews = {};
var DominoAppComponents = {};
var DominoAppOptions = {
    path: null,
    activeTemplate: [],
    site: null,
    params: null,
    modules: {}
};
var DominoAppViewStack = [];

function ScrollTo( name ) {

    var theAnchor = document.getElementsByName(name);

    if ( typeof theAnchor[0] !== 'undefined' )
        ScrollToResolver( theAnchor[0] );
}

function ScrollToResolver(elem) {
    var jump = parseInt(elem.getBoundingClientRect().top * .2);
    document.body.scrollTop += jump;
    document.documentElement.scrollTop += jump;
    if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
        elem.lastjump = Math.abs(jump);
        setTimeout(function() { ScrollToResolver(elem);}, "20");
    } else {
        elem.lastjump = null;
    }
}

function scrollToValue(to, duration) {
    var start = document.documentElement.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

        userHasScrolled = false;
        window.onscroll = function (e)
        {
            userHasScrolled = true;
        }


    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        window.scrollTo ( 0, val );
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    if ( userHasScrolled )
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
var DominoAppBase = (function() {
    var DominoAppObject = null;
    var router = null;
    var routeHandler = null;
    var baseURL = '';

    var redrawCounter = 0;

    var handleRoute = function ( path ) {

        if ( routeHandler )
            routeHandler.handleRoute( path );
        else
            throw 'Route handler not registered. Register a handler';
    };

    var renderView = function () {
        if ( DominoAppObject )
            DominoAppObject.onBeforeRender.trigger();

        return mainView( DominoAppViewStack );
    };

    var onAfterRender = function () {
        DominoAppObject.onAfterRender.trigger();
    };

    var firstRenderFinished = function () {
        DominoAppObject.onBeforeFirstRender.trigger();
        // INITIALIZE ROUTE HANDLER COMPONENT
        if ( routeHandler.init )
            routeHandler.init();

        // INITIALIZE ROUTER
        router = Router( {
            '(.*)': handleRoute
        } );
        router.configure( {
            convert_hash_in_init: false,
            html5history: true,
            run_handler_in_init: false
        } ).init();

        // INITIALIZE GLOBAL ANCHOR CLICK HANDLER
        window.addEventListener( 'click', function ( ev ) {
            var anchor = null;
            if ( !ev.defaultPrevented && (anchor = DCUtil.getParentAnchor( ev.target )) && anchor.hasAttribute('href') && anchor.getAttribute( 'target' ) !== '_blank' && anchor.getAttribute('href').indexOf('blob:') == -1 && anchor.getAttribute('href').indexOf('data:') == -1 ) {

                var href = anchor.getAttribute( 'href' );

                var isEmailRegX = href.match(/mailto:/);
                var isTelRegX = href.match(/tel:/);
                var isHttpX = href.match(/http:/);
                var isHttpsX = href.match(/https:/);
                var ishashX = href.match(/#/);

                if ( isEmailRegX || isTelRegX || isHttpX || isHttpsX) {

                }
                else if ( ishashX ) {
                    ev.preventDefault();
                    var theHash = href.split('#');

                    if ( typeof theHash[1] !== 'undefined' && theHash[1] !== '' )
                        ScrollTo(theHash[1]);

                }
                else {
                    ev.preventDefault();
                    if( href != '#' && href != '/#' && href != ( '/' + DominoAppOptions.path || DominoAppOptions.path )  )
                        router.setRoute( anchor.getAttribute( 'href' ) );

                    window.scrollTo(0, 0);
                    //scrollToValue( 0, 1250 );
                }

            }
        } );

        DominoAppObject.onAfterFirstRender.trigger();
    };

    return Class.extend( function () {
        return {
            construct: function ( _baseURL ) {
                DominoAppObject = this;
                baseURL = _baseURL;
                this.routeHandler = routeHandler = new DCRouteHandlerComponent( baseURL );

                this.onBeforeFirstRender = new DCDominoSignal();
                this.onAfterFirstRender = new DCDominoSignal();
                this.onBeforeRender = new DCDominoSignal();
                this.onAfterRender = new DCDominoSignal();

                // REGISTER FIRST RENDER FINISHED
                this.onAfterRender.once( firstRenderFinished );

                // INITIALIZE ALL THE DATA FIELDS
                this.activeLocale = 'sl-SI';
                this.data = {};
                this.cache = {};

                // INIT VARIABLES
                this.initVars = window['DominoAppInitVars'] ? JSON.parse( window['DominoAppInitVars'] ) : {};

                // REGISTER BOBRIL
                b.init( renderView, document.body );
                // ATTACH AFTER FRAME EVENT
                b.setAfterFrame( onAfterRender );

            },
            renderView: function( el, viewName, renderData ) {
                "use strict";


                //if (typeof( renderController ) === 'string')
                var renderController = DominoAppViews.attr(viewName);
                //console.log(viewName);
                if (renderController)
                    var renderResult = renderController(renderData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

                el.innerHTML = "";
                b.updateChildren(el, renderResult);

                if ( DominoAppControllers[viewName] ) {
                    var newController = new DominoAppControllers[viewName]();
                    if ( newController['indexAction'] ) {
                        newController['indexAction'](el, viewName, renderData);
                    }
                }

                //return renderResult;

            },
            renderView2: function( el, viewName, renderData ) {
                "use strict";


                var renderController = DominoAppViews.attr(viewName);

                if (renderController)
                    var renderResult = renderController(renderData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

                renderResult['component'] = componentFactory;
                renderResult['data'] = {
                    'view': viewName,
                    'componentData': renderData
                };

                //b.updateChildren(el, renderResult);


            },
            renderViewInline: function( el, viewName, renderData ) {
                "use strict";

                var renderController = DominoAppViews.attr(viewName);

                if (renderController)
                    var renderResult = renderController(renderData);
                else {
                    console.log(renderController);
                    console.log(el);
                }
                if (!renderResult)
                    renderResult = {tag: 'div', key: Math.random()};

               b.updateChildren(el, renderResult);

                if ( DominoAppControllers[viewName] ) {

                    var newController = new DominoAppControllers[viewName]();

                    if ( newController['indexAction'] ) {
                        newController['indexAction'](el, viewName, renderData);


                    }
                }

            },
            redirect: function ( route, params ) {
                if ( Array.isArray( route ) )
                    route = '/' + route.join( '/' );

                if ( params ) {
                    route += '?' + Network.serialize( params );
                }
                // REDIRECT
                router.setRoute( route );
            },
            utils: {
                title: function (t) {
                    "use strict";

                    var title = document.getElementsByTagName('TITLE');
                    if ( !title ) {
                        var head = document.getElementsByTagName('HEAD')[0],
                            tl = document.createElement("title");
                        tl.appendChild(document.createTextNode(t));
                        head.appendChild(tl);
                    }
                    else
                        document.title = t; //title.text( t );

                },
                description: function( d ) {
                    var description = document.querySelector('meta[name="description"]');
                    if ( !description ) {
                        var head = document.getElementsByTagName('HEAD')[0],
                            meta = document.createElement("meta");
                        meta.setAttribute('name','description');
                        meta.setAttribute('content',d);
                        head.appendChild(meta);
                    }
                    else
                        description.setAttribute( 'content', d );
                },
                keywords: function( k ) {
                    var keywords = document.querySelector('meta[name="keywords"]'),
                        kw = k ? k : '';

                    if( !keywords ) {
                        var head = document.getElementsByTagName('HEAD')[0],
                            meta = document.createElement("meta");
                        meta.setAttribute('name','keywords');
                        meta.setAttribute('content',kw);
                        head.appendChild(meta);
                    }
                    else
                        keywords.setAttribute( 'content', kw );
                }
            },
            ajax: function ( data ) {
                "use strict";
                var deferred = new Deferred();

                var headers = {};
                var url = '/';
                var ajaxData = {
                    'type': 'ajax',
                    'view': data.view,
                    'action': data.action,
                    'site': ( data.site ) ? data.site : DominoAppOptions.site,
                    'params': ( data.params ) ? data.params : DominoAppOptions.params,
                    'identity': ( data.identity ) ? data.identity : DominoAppOptions.identity,
                    'data': data.data
                };

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    DCUtil.networkReadyStateChange( request, deferred );
                };
                request.open( 'POST', url, true );
                for( var key in headers )
                    if( headers.hasOwnProperty( key ) )
                        request.setRequestHeader( key, headers[ key ] );

                request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
                if ( data.contentType )
                    request.setRequestHeader( 'Content-Type', data.contentType );
                else
                    request.setRequestHeader( 'Content-Type', 'application/json' );

                request.responseType = 'json';
                request.send( JSON.stringify( ajaxData ) );

                return deferred.promise();
            },
            getAjax: function( url, headers, data ) {
                var deferred = new Deferred();

                headers = headers || {};
                data = data || {};

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    DCUtil.networkReadyStateChange( request, deferred );
                };
                request.open( 'GET', url, true );
                for( var key in headers )
                    if( headers.hasOwnProperty( key ) )
                        request.setRequestHeader( key, headers[ key ] );

                request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );

                request.responseType = 'json';
                request.send( JSON.stringify( data ) );

                return deferred.promise();
            }

        }
    } );
})();

addLoadEvent( function() {
    DominoApp = window['dominoapp'] = new DominoAppBase( '/' );
} );