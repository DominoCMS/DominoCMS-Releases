var DCDominoSignal = Class.extend( function() {
	return {
		construct: function () {
			this.numCallbacks = 0;
			this.callbacks = [];
			this.oneCallbacks = [];
		},
		destroy: function() {
			this.callbacks = [];
			this.oneCallbacks = [];
		},
		once: function (callback) {
			if (callback && typeof( callback ) === 'function') {
				this.oneCallbacks.push(callback);
			}
		},
		attach: function (callback) {
			if (callback && typeof( callback ) === 'function') {
				this.callbacks.push(callback);
				this.numCallbacks++;
			}
		},
		detach: function (callback) {
			for (var i = 0; i < this.numCallbacks; ++i) {
				if (this.callbacks[i] == callback) {
					this.callbacks.splice(i, 1);
					this.numCallbacks--;
					break;
				}
			}
		},
		trigger: function ( data ) {
			if( !data ) data = {};

			var oneCallbacks = this.oneCallbacks;
			this.oneCallbacks = [];

			for (var i = 0; i < this.callbacks.length; ++i) {
				this.callbacks[i].call( this, data );
			}

			for (var i = 0; i < oneCallbacks.length; i++) {
				oneCallbacks[i].call( this, data );
			}
		}
	}
} );