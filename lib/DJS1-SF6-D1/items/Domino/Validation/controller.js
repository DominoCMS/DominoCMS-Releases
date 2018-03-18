/**
 * filename: ContactFormController.js
 * developer: Domino
 * item: ContactForm
 * version: v1.0.0
 * date: 19. 6. 17
 */
DominoControllers.registerController( 'Domino.Validation', DCDominoController.extend( function( _super )  {
	return {
		'indexAction': function ( el, view, data ) {
		},
		'isValidEmailAddress': function ( emailAddress ) {
			"use strict";
			var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
			return pattern.test(emailAddress);
		},
		'form': function ( el ) {

			var validate = 0, isValid, newData = {}, newValue,
				arrAdd = 0;

			var formData = [];

			var elements = el.elements;
			for ( var e = 0; e < elements.length; e++) {
				if (elements[e].name.length) {
					formData.push(elements[e]);
				}
			}

			for (var i = 0; i < formData.length; i++) {
                var field = formData[i];
                var fieldValidate = field.getAttribute('data-validate'),
                    fieldValidateType = field.getAttribute('data-validate-type'),
                    fieldValidateMsg = field.getAttribute('data-validate-message'),
                    fieldLabel = field.parentNode,
                    fieldError = field.nextSibling,
                    fieldEncrypt = field.getAttribute('data-validate-encrypt');

                if (field.getAttribute('type') === 'checkbox') {

                    if ( field.checked == true )
                        newValue = true;
                    else
                        newValue = false;
                }
                else if (field.getAttribute('type') === 'radio') {

                    if ( field.checked )
                        newValue = field.value;

                }
                else {

                    if (fieldValidate === 'required' && !fieldValidateType) {

                        if (fieldValidateType === 'email') {
                            var emailValidate = this.isValidEmailAddress(field.value)
                            validate += (emailValidate === true) ? 0 : 1;
                            isValid = emailValidate;

                            if (!field.value)
                                fieldValidateMsg = 'Vpišite manjkajoči e-mail.';
                            else if (emailValidate === false)
                                fieldValidateMsg = "Vnešen e-mail ni pravilen."
                            newValue = field.value;
                        }
                        else {
                            validate += !field.value ? 1 : 0;
                            isValid = field.value ? true : false;
                            fieldValidateMsg = !fieldValidateMsg ? 'Manjkajoče polje' : fieldValidateMsg;
                            newValue = field.value;
                        }

                    }
                    else if ( (fieldValidate === 'required') && ( (fieldValidateType === 'password') || (fieldValidateType === 'password_retype') ) )  {

                        isValid = true;

                        if (field.value.length > 6)
                            validate += 0;
                        else {
                            validate += 1;
                            isValid = false;
                            fieldValidateMsg = !field.value ? 'Vpišite geslo' : 'Vaše geslo mora biti daljše od 6 znakov';

                        }
                        if (fieldValidateType === 'password')
                            var originalPassword = field.value;

                        if (fieldValidateType === 'password_retype') {
                            if (field.value !== originalPassword) {
                                fieldValidateMsg = 'Gesli morata biti identični';
                                validate += 1;
                                isValid = false;
                            }
                        }


                        if (fieldEncrypt === 'sha-256')
                            newValue = Sha256.hash(field.value);
                        else if (fieldEncrypt === 'md5')
                            newValue = CryptoJS.MD5(field.value).toString();
                        else
                            newValue = field.value;

                    }
                    else
                        newValue = field.value;

                    /*if (fieldLabel.length) {
                        if (isValid === false) {
                            //field.addClass("is-invalid-input");
                            //fieldLabel.addClass("is-invalid-label");
                            //if (fieldError.length)
                            //fieldError.addClass("is-visible");
                            //else
                            //field.after('<span class="form-error is-visible">' + fieldValidateMsg + '</span>');
                        }
                        else {
                            //field.className("is-invalid-input");
                            //fieldLabel.removeClass("is-invalid-label");
                            //fieldError.removeClass("is-visible");
                        }
                    }
					else
						newValue = field.value;*/
				}

				if (field.name.indexOf('[') === -1)
					newData[field.name] = newValue;
				else {
					var res = field.name.split("["),
						first_key = res[0],
						res_2 = res[1].split(']')[0],
						res_3 = res_2.replace(/'/g, ''),
						res_4 = res_3.replace(/"/g, '');

					if (typeof newData[first_key] === 'undefined')
						newData[first_key] = {};
					var theVal = ( res_4 ) ? res_4 : arrAdd++;

					newData[first_key][theVal] = newValue;
				}
			}

			// This when returns false should stop the ajax from sending
			if ( validate > 0 )
				return false;
			else
				return newData;
		},
		'onQueue': function ( field ) {
			"use strict";

			var validate = 0, isValid, newData = {},
				fieldValidate = field.getAttribute('data-validate'),
				fieldValidateType = field.getAttribute('data-validate-type'),
				fieldValidateMsg = field.getAttribute('data-validate-message'),
				fieldLabel = field,
				fieldError = field;

			if (fieldValidate === 'required') {

				if (fieldValidateType === 'email') {
					var emailValidate = this.isValidEmailAddress(field.value);
					validate += ( emailValidate === true ) ? 0 : 1;
					isValid = emailValidate;

					if (!field.value)
						fieldValidateMsg = 'Vpišite manjkajoči e-mail.';
					else if (emailValidate === false)
						fieldValidateMsg = "Vnešen e-mail ni pravilen."

				}
				else if (( fieldValidateType === 'password') || ( fieldValidateType === 'password_retype' )) {

					isValid = true;

					if (field.value.length > 6)
						validate += 0;
					else {
						validate += 1;
						isValid = false;
						fieldValidateMsg = !field.value ? 'Vpišite geslo' : 'Vaše geslo mora biti daljše od 6 znakov';

					}


					if (fieldValidateType === 'password_retype') {
						var binder = field.attr("data-validate-bind");
						var originalPassword = $('input[name="' + binder + '"]').val();
						isValid = true;
						if (field.value !== originalPassword) {
							fieldValidateMsg = 'Gesli morata biti identični';
							validate += 1;
							isValid = false;
						}
					}

				}
				else {
					validate += !field.value ? 1 : 0;
					isValid = field.value ? true : false;
					fieldValidateMsg = !fieldValidateMsg ? 'Manjkajoče polje' : fieldValidateMsg;
				}

				if (fieldLabel.length) {
					if (isValid === false) {
						//field.addClass("is-invalid-input");
						//fieldLabel.addClass("is-invalid-label");
						//if (fieldError.length)
							//fieldError.addClass("is-visible");
						//else
							//field.after('<span class="form-error is-visible">' + fieldValidateMsg + '</span>');
					}
					else {
						//field.removeClass("is-invalid-input");
						//fieldLabel.removeClass("is-invalid-label");
						//fieldError.removeClass("is-visible");
					}
				}

			}


			if (validate > 0)
				return false;
			else
				return newData;
		}
	}

}));


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-256 implementation in JavaScript                (c) Chris Veness 2002-2014 / MIT Licence  */
/*                                                                                                */
/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';

var Sha256 = {};

Sha256.hash = function(msg) {
	// convert string to UTF-8, as SHA only deals with byte-streams
	msg = msg.utf8Encode();

	// constants [§4.2.2]
	var K = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];
	// initial hash value [§5.3.1]
	var H = [
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

	// PREPROCESSING

	msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

	// convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
	var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
	var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
	var M = new Array(N);

	for (var i=0; i<N; i++) {
		M[i] = new Array(16);
		for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
			M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
				(msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
		} // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
	}
	// add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
	// note: most significant word would be (len-1)*8 >>> 32, but since JS converts
	// bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
	M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
	M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


	// HASH COMPUTATION [§6.1.2]

	var W = new Array(64); var a, b, c, d, e, f, g, h;
	for (var i=0; i<N; i++) {

		// 1 - prepare message schedule 'W'
		for (var t=0;  t<16; t++) W[t] = M[i][t];
		for (var t=16; t<64; t++) W[t] = (Sha256.σ1(W[t-2]) + W[t-7] + Sha256.σ0(W[t-15]) + W[t-16]) & 0xffffffff;

		// 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
		a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

		// 3 - main loop (note 'addition modulo 2^32')
		for (var t=0; t<64; t++) {
			var T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
			var T2 =     Sha256.Σ0(a) + Sha256.Maj(a, b, c);
			h = g;
			g = f;
			f = e;
			e = (d + T1) & 0xffffffff;
			d = c;
			c = b;
			b = a;
			a = (T1 + T2) & 0xffffffff;
		}
		// 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
		H[0] = (H[0]+a) & 0xffffffff;
		H[1] = (H[1]+b) & 0xffffffff;
		H[2] = (H[2]+c) & 0xffffffff;
		H[3] = (H[3]+d) & 0xffffffff;
		H[4] = (H[4]+e) & 0xffffffff;
		H[5] = (H[5]+f) & 0xffffffff;
		H[6] = (H[6]+g) & 0xffffffff;
		H[7] = (H[7]+h) & 0xffffffff;
	}

	return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) +
		Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
};
Sha256.ROTR = function(n, x) {
	return (x >>> n) | (x << (32-n));
};
Sha256.Σ0  = function(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); };
Sha256.Σ1  = function(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); };
Sha256.σ0  = function(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  };
Sha256.σ1  = function(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); };
Sha256.Ch  = function(x, y, z) { return (x & y) ^ (~x & z); };
Sha256.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };
Sha256.toHexStr = function(n) {
	// note can't use toString(16) as it is implementation-dependant,
	// and in IE returns signed numbers when used on full words
	var s="", v;
	for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
	return s;
};
if (typeof String.prototype.utf8Encode == 'undefined') {
	String.prototype.utf8Encode = function() {
		return unescape( encodeURIComponent( this ) );
	};
}
if (typeof String.prototype.utf8Decode == 'undefined') {
	String.prototype.utf8Decode = function() {
		try {
			return decodeURIComponent( escape( this ) );
		} catch (e) {
			return this; // invalid UTF-8? return as-is
		}
	};
}
if (typeof module != 'undefined' && module.exports) module.exports = Sha256; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Sha256; }); // AMD