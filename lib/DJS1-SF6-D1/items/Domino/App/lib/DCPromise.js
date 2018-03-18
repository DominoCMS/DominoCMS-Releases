var Deferred = function() {
	var _resolvedCallback = null;
	var _resolvedValue = null;

	var _rejectedCallback = null;
	var _rejectedValue = null;

	this.promise = function() {
		return {
			then: function( resolvedCallback, rejectedCallback ) {
				_resolvedCallback = resolvedCallback;
				_rejectedCallback = rejectedCallback;

				if( _resolvedValue && _resolvedCallback && typeof( _resolvedCallback ) === 'function' )
					_resolvedCallback( _resolvedValue );
				else
				if( _rejectedValue && _rejectedCallback && typeof( _rejectedCallback ) === 'function' )
					_rejectedCallback( _rejectedValue );

			}
		};
	};

	this.resolve = function( val ) {
		if( _resolvedCallback && typeof( _resolvedCallback ) === 'function' ) {
			_resolvedCallback( val );
		} else {
			_resolvedValue = val;
		}
	};

	this.reject = function( val ) {
		if( _rejectedCallback && typeof( _rejectedCallback ) === 'function' ) {
			_rejectedCallback( val );
		} else {
			_rejectedValue = val;
		}
	};

};