
var DCDominoComponent = Class.extend( function(){
    return {
        construct: function () {
            "use strict";
            this.delegates = [];
            this.events = [];
        },
        onEvent: function (el, eventName, callback, useCapture) {
            if (el) {
                if( Array.isArray( el ) ) {
                    for( var ei=0; ei<el.length; ei++ ) {
                        var e = el[ei];
                        var found = false;
                        for ( var i = 0, len = this.events.length; i < len; ++i ) {
                            if ( this.events[ i ].e == e && this.events[ i ].en == eventName && this.events[ i ].c == callback ) {
                                found = true;
                                break;
                            }
                        }

                        if ( !found ) {
                            this.events.push( { e: e, en: eventName, c: callback } );
                            //e.addEventListener( eventName, callback, useCapture ? true : false );

                            if (e.addEventListener){
                                e.addEventListener( eventName, callback, useCapture ? true : false);
                            } else if (e.attachEvent){
                                e.attachEvent('on' + evName, callback);
                            }

                        }
                    }
                } else {
                    var found = false;
                    for ( var i = 0, len = this.events.length; i < len; ++i ) {
                        if ( this.events[ i ].e == el && this.events[ i ].en == eventName && this.events[ i ].c == callback ) {
                            found = true;
                            break;
                        }
                    }

                    if ( !found ) {
                        this.events.push( { e: el, en: eventName, c: callback } );
                        //el.addEventListener( eventName, callback, useCapture ? true : false );
                        if (el.addEventListener){
                            el.addEventListener( eventName, callback, useCapture ? true : false);
                        } else if (el.attachEvent){
                            el.attachEvent('on' + evName, callback);
                        }
                    }
                }
            }
        },
        offEvent: function (el, eventName, callback) {
            if (el) {
                var found = false;
                for (var i = 0, len = this.events.length; i < len; ++i) {
                    if (this.events[i] && this.events[i].e == el && this.events[i].en == eventName) {
                        el.removeEventListener(eventName, callback ? callback : this.events[i].c);
                        this.events.splice(i, 1);
                        i--;
                    }
                }
            }

        },
        on: function (delegate, callback) {
            var found = false;
            for (var i = 0; i < this.delegates.length; i++) {
                if (this.delegates[i].delegate === delegate && this.delegates[i].callback === callback) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                delegate.attach(callback);
                this.delegates.push({delegate: delegate, callback: callback});
            }
        },
        off: function (delegate, callback) {
            for (var i = 0; i < this.delegates.length; i++) {
                if (this.delegates[i].delegate === delegate && this.delegates[i].callback === callback) {
                    this.delegates.splice(i, 1);
                    delegate.detach(callback);
                    break;
                }
            }
        },
        destroy: function () {
            // DETACH ALL THE DELEGATE LISTENERS
            if (this.delegates) {
                for (var i = 0; i < this.delegates.length; i++) {
                    this.delegates[i].delegate.detach(this.delegates[i].callback);
                }
                this.delegates = [];
            }

            // DETACH ALL THE EVENT LISTENERS
            var registeredEvents = this.events;
            for (var i = 0, len = registeredEvents.length; i < len; ++i) {
                var registeredEvent = registeredEvents[i];
                registeredEvent.e.removeEventListener(registeredEvent.en, registeredEvent.c);
            }
            this.events = [];
        },
        rewireEvents: function(oldEl, newEl) {
            "use strict";
            if(oldEl != newEl) {
                for (var i = 0; i < this.events.length; i++) {
                    var event = this.events[i];
                    if (event.e == oldEl) {
                        event.e = newEl;
                        oldEl.removeEventListener(event.en, event.c);
                        newEl.addEventListener(event.en, event.c);
                    }
                }
            }
        }
    }
} );