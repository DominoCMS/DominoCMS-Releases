DominoControllers.registerController( 'Domino.Admin.Login.Reset', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {

            /*

             var resetFailed = el.find("#resetFailed"),
             buttonSubmit = el.find('button[type="submit"]'),
             loadingHolder = el.find("#loadingHolder");

             this.on( 'input', 'focus', function( ev ) {
             buttonSubmit.removeClass('disabled');
             resetFailed.hide();
             });

             this.on( '#resetPassword', 'submit', function( ev ) {
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
             'formData': validateFormData
             },
             type: 'POST',
             dataType: 'json',
             success: function( data ) {

             var success = parseInt(data["success"],10);
             processing.remove( loadingHolder );

             if ( success == 1 ) {
             el.find('form').remove();
             el.find("#resetSuccess").show();
             }
             else
             resetFailed.show();

             scrollToAnchor('success',130);
             }
             });
             }

             });
             this.on('select,txtarea,input[type="text"],input[type="password"],input[type="hidden"],input[type="radio"]:checked,input[type="checkbox"]:checked', 'focusout', function( ev ) {
             validateOnQueue($(this));
             });
             */


        }
    }
} ) );