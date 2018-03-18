DominoControllers.registerController( 'Domino.Admin.Login.Register', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {

            /*
             var registerFailed = el.find("#registerFailed"),
             userExist = el.find("#userExist"),
             buttonSubmit = el.find('button[type="submit"]'),
             loadingHolder = el.find("#loadingHolder");

             this.on( 'input', 'focus', function( ev ) {
             buttonSubmit.removeClass('disabled');
             registerFailed.hide();
             });

             this.on( '#registerForm', 'submit', function( ev ) {
             ev.preventDefault();

             var validateFormData = validateForm($(this));

             if ( validateFormData !== false ) {

             buttonSubmit.addClass('disabled');
             scrollToAnchor('success',200);
             var processing = new ajaxProcessing( loadingHolder, { size: 'large' });

             $.ajax( {
             url: '/ajax.php',
             data: {
             'Value': options.id,
             'type': "registerUser",
             'formData': validateFormData
             },
             type: 'POST',
             dataType: 'json',
             success: function( data ) {

             var success = parseInt(data["success"],10);
             processing.remove( loadingHolder );

             $('.unlogged').toggleClass("hide");
             $('.logged').toggleClass("hide").find("#userPlaceholder").html(data["user"]);

             if ( success === 0 ) {
             el.find('form').remove();
             el.find("#registerSuccess").show();
             }
             else if ( success === 1 ) {
             el.find('form').remove();
             el.find("#registerExists").show();
             }
             else {
             el.find("#registerFail").show();
             }
             }
             });
             }
             else
             registerFailed.show();
             });

             this.on( 'input[name="user[email]"]', 'focusout', function( ev ) {

             var self = $(this),
             emailVal = self.val();

             if ( emailVal ) {
             $.ajax( {
             url: '/ajax.php',
             data: {
             'Value': options.id,
             'type': "checkUserExist",
             'email': emailVal

             },
             type: 'POST',
             dataType: 'json',
             success: function( data ) {

             var success = parseInt(data["success"],10);

             if ( success === 1 ) {
             el.find('button[type="submit"]').prop('disabled', true);
             userExist.show();
             }
             else
             userExist.hide();
             }
             });
             }
             });

             this.on('select,txtarea,input[type="text"],input[type="password"],input[type="hidden"],input[type="radio"]:checked,input[type="checkbox"]:checked', 'focusout', function( ev ) {
             validateOnQueue($(this));
             });

             var clientAddress = el.find('input[name="client[address]"]'),
             clientAddressNr = el.find('input[name="client[address_nr]"]'),
             clientZip = el.find('input[name="client[zip]"]'),
             clientCity = el.find('input[name="client[city]"]'),
             inputDrop = '';

             this.on( 'input[name="client[address]"],input[name="client[zip]"],input[name="client[city]"]', 'focus', function( ev ) {
             var self = $(this),
             inputDrop = self.siblings('.inputDrop');

             if ( inputDrop.length == 0 ) {
             self.after('<ul class="inputDrop"></ul>');
             inputDrop = self.siblings('.inputDrop');
             }
             else
             inputDrop.show();

             $(document).mouseup(function (e) {
             var inputDropSib = inputDrop.siblings('input');

             if ( ( (!inputDrop.is(e.target) && inputDrop.has(e.target).length === 0) ) && ( (!inputDropSib.is(e.target) && inputDropSib.has(e.target).length === 0) ) )
             inputDrop.hide();
             });
             });

             this.on( 'input[name="client[address]"]', 'keyup', function( ev ) {

             var self = $(this);

             if ( self.val() ) {
             $.ajax( {
             url: '/ajax.php',
             data: {
             'Value': options.id,
             'type': "fillAddress",
             'zip': el.find('input[name="client[zip]"]').val(),
             'name': self.val()

             },
             type: 'POST',
             dataType: 'json',
             success: function( data ) {

             var ret = '';
             for ( var i = 0; i < data.length; i++ ) {
             var entry = data[i];

             ret += '<li data-address="' + entry.address + '" data-zip="' + entry.zip + '" data-city="' + entry.city + '"><a href="#">';
             ret += '' + entry.address + '<br />';
             ret += '<small>' + entry.zip + ' ' + entry.city + '</small>';
             ret += '</a></li>';
             }
             var inputDrop = self.siblings('.inputDrop');
             inputDrop.html( ret );

             }
             });
             }
             });

             this.on( 'input[name="client[zip]"],input[name="client[city]"]', 'keyup', function( ev ) {

             var self = $(this);

             if ( self.val() ) {
             $.ajax( {
             url: '/ajax.php',
             data: {
             'Value': options.id,
             'type': "fillZipCity",
             'name': self.val()

             },
             type: 'POST',
             dataType: 'json',
             success: function( data ) {


             var ret = '';
             for ( var i = 0; i < data.length; i++ ) {
             var entry = data[i];

             ret += '<li data-zip="' + entry.zip + '" data-city="' + entry.city + '"><a href="#">';
             ret += '<b>' + entry.zip + ' ' + entry.city + '</b>';
             ret += '</a></li>';
             }
             var inputDrop = self.siblings('.inputDrop');
             inputDrop.html( ret );

             }
             });
             }
             });

             this.on('.inputDrop a', 'click', function( ev ) {

             ev.preventDefault();

             var self = $(this),
             address = self.parent('li').attr('data-address'),
             zip = self.parent('li').attr('data-zip'),
             city = self.parent('li').attr('data-city'),
             inputDrop = self.parents('.inputDrop'),
             type = inputDrop.siblings('input').attr('data-type');

             if ( address )
             clientAddress.val(address);
             clientZip.val(zip);
             clientCity.val(city);

             inputDrop.hide();

             });
             */

        }
    }
} ) );