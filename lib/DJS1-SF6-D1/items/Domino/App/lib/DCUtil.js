var DCUtil = {
	getParentAnchor: function( node ) {
		var cnode = node;
		while( cnode ) {
			if( cnode && cnode.parentNode && cnode.tagName === 'A' ) {
				return cnode;
			}

			cnode = cnode.parentNode;
		}
	},
	networkReadyStateChange: function( request, deferred ) {
		"use strict";
		if( request.readyState === 2 && request.status !== 200 ) {
			deferred.reject( request );
		} else
		if( request.readyState === 4 ) {
			if( request.status === 200 ) {
				deferred.resolve( request.response );
			} else
			if( request.status === 403 ) {
				switch( request.response.code ) {
					case 'NOT_LOGGED_IN':
						console.log( 'Login required' );
						DominoApp.redirect( [ 'user', 'login' ] );
						break;
					case 'NOT_ALLOWED':
						console.log( 'No permissions' );
						break;
				}
			} else {
				deferred.reject( request );
			}
		}
	},
	translate: function( data ) {
		"use strict";

		//console.log(data);

		var div = document.createElement('DIV');
		div.innerHTML = data;

		var ret = [];
		ret.push(div);
		return div;
	},
	displayHtml: function( data ) {
		"use strict";

		var htmlObject = document.createElement('div');
		htmlObject.innerHTML = data;

		return DCUtil.child(htmlObject.childNodes);

	},
	child: function( children ) {
		"use strict";

		var newObj = [];

		for ( var i = 0; i < children.length; i++ ) {
			var obj = children[i];
			if ( obj.nodeName == '#text' )
				newObj.push(obj.nodeValue)
			else
				newObj.push(
					{
						tag: obj.nodeName,
						attrs: DCUtil.attributes(obj.attributes),
						children: DCUtil.child(obj.childNodes)
					}
				);

		}
		return newObj;
	},
	attributes: function( attrs ) {
		"use strict";

		var newObj = [];

		for ( var i = 0; i < attrs.length; i++ ) {
			var obj = attrs[i];

			newObj[obj.nodeName] = obj.nodeValue;

			/*newObj.push({
				tag: obj.nodeName,
				attrs: obj.nodeValue,
				className if exists
			});*/


		}
		//console.log(newObj);
		return newObj;
	},
    fadeIn: function( el, speed, easing ) {
        "use strict";

        if ( typeof el  !== 'undefined' && el != null ) {

            speed = speed ? speed : 200;
        	var easing = easing ? easing : 'Ease-In-Out';

            el.style.webkitAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.MozAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.msAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.OAnimation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.animation = 'fadeInFromNone ' + speed + 'ms ' + easing;
            el.style.display = 'block';
			//el.style.display = null;
            //if ( el.style.display == 'none' )
              //  el.style.display = '';

            //el.style.transition="opacity 1s";
            //el.style.opacity="1";

            /*var tick = function () {
                el.style.opacity = +el.style.opacity + 0.01;

                if (+el.style.opacity < 1)
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                else
                    return true;
            };

            tick();*/
        }
    },
    fadeOut: function( el, speed, easing ) {
        "use strict";
        if ( typeof el !== 'undefined' && el != null ) {

        	speed = speed ? speed : 200;
            easing = easing ? easing : 'Ease-In-Out';
            el.style.webkitAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.MozAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.msAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.OAnimation = 'fadeOutToNone ' + speed + 'ms ' + easing;
            el.style.animation = 'fadeOutToNone ' + speed + 'ms ' + easing;

            setTimeout(function(){
                el.style.display = 'none';
			}, (speed-40));


            //el.style.transition="opacity 1s";
           // el.style.opacity="0";
            //el.style.display= 'none';

            /*el.style.opacity = 1;

            var tick = function() {
                el.style.opacity = +el.style.opacity - 0.01;

                if (+el.style.opacity > 0)
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                else
                    return true;
            };

            tick();*/
        }

    }
};