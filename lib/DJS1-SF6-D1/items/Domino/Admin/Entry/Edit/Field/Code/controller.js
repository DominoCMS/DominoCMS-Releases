DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.Code', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            if ( data.element == "view" )
                var themode = "text/javascript"; //text/jsx, text/typescript-jsx
            else if ( data.element == "controller" )
                var themode = "javascript";
            else if ( data.element == "model" )
                var themode = "application/x-httpd-php";
            else if ( data.element == "viewSsr" )
                var themode = "application/x-httpd-php";
            else if ( data.element == "css" )
                var themode = "css";
            else if ( data.element == "theme" )
                var themode = "sass";
            else if ( data.element == "themeSettings" )
                var themode = "sass";


            var codeInstance = document.getElementById( 'CMirror' + data.element );
            var codeEditor = CodeMirror.fromTextArea( codeInstance, {
                lineNumbers: true,
                matchBrackets: true,
                mode: themode,
                indentUnit: 4,
                lineWrapping: true,
                indentWithTabs: true
            });

            // on and off handler like in jQuery
            codeEditor.on('change',function(cMirror){
                // get value right from instance
                codeInstance.value = cMirror.getValue();
            });

            //Data.push( { name: "blob_2", value: CMArr["blob_2"].getValue() } );

/*var barr = $("#TabContent"+Hash).find($("txtarea")).attr("id");
           CMArr[barr].refresh();
           */

        }
    }
}));