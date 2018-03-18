DominoControllers.registerController( 'Domino.Admin.Login.Forgot', DCDominoController.extend( function( _super ) {
    return {
     'indexAction': function ( el, view, data ) {

            /*
             var forgotFailed = el.find("#forgotFailed"),
             buttonSubmit = el.find('button[type="submit"]'),
             loadingHolder = el.find("#loadingHolder");

             this.on( 'input', 'focus', function( ev ) {
             buttonSubmit.removeClass('disabled');
             forgotFailed.hide();
             });

             this.on( '#forgotPassword', 'submit', function( ev ) {
             ev.preventDefault();

             var self = $(this),
             validateFormData = validateForm($(this));

             if ( validateFormData !== false ) {
             buttonSubmit.addClass('disabled');
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
             processing.remove( self.parent() );

             if ( success == 1 ) {
             self.addClass("hide");
             el.find("#forgotSuccess").removeClass("hide");
             }
             else
             forgotFailed.show();
             scrollToAnchor('success',130);
             }
             });
             }

             });
             */


        }
    }
} ) );

