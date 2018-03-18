DominoControllers.registerController( 'Domino.Admin.Entry.Edit.Field.TextEditor', DCDominoController.extend( function( _super ) {
    return {

        indexAction: function (el, view, data) {
            "use strict";


            var ck_id = '';
            var ck_inst = '';
            var editors = new Array();
            var editSource = '';
            var saveSource = '';

            if ( data.dimensions && ( data.dimensional == true ) ) {

                var dimension = '';
                for ( var i = 0; i < data.dimensions.length; i++ ) {
                    dimension = data.dimensions[i];
                    ck_id = 'CK' + data.id + dimension.id;
                    ck_inst = 'CK123' + data.id + dimension.id;
                    editSource = 'editSource' + data.id + dimension.id;
                    saveSource = 'saveSource' + data.id + dimension.id;

                    var editor = window.pell.init({
                        element: document.getElementById(ck_inst),
                        defaultParagraphSeparator: 'p',
                        styleWithCSS: false,
                        onChange: function (html) {
                            //document.getElementById(ck_id).innerHTML = html
                            document.getElementById(ck_id).textContent = html
                        }
                    })

                    editor.content.innerHTML = data.data[dimension.id];

                    /*this.onEvent( document.getElementById(ck_id) , 'change', function( ev ) {

                        editor.content.innerHTML = this.value;

                    } );*/

                    this.onEvent( document.getElementById(editSource) , 'click', function( ev ) {

                        if ( document.getElementById(ck_id).style.display == 'block' ) {
                            document.getElementById(ck_id).style.display = 'none';
                            document.getElementById(ck_id).parentNode.style.display = 'none';
                            document.getElementById(ck_inst).style.display = 'block';
                        }
                        else {
                            document.getElementById(ck_id).style.display = 'block';
                            document.getElementById(ck_id).parentNode.style.display = 'block';
                            document.getElementById(ck_inst).style.display = 'none';
                        }


                    } );

                    this.onEvent( document.getElementById(saveSource) , 'click', function( ev ) {

                        editor.content.innerHTML = document.getElementById(ck_id).value;
                        document.getElementById(ck_id).style.display = 'none';
                        document.getElementById(ck_id).parentNode.style.display = 'none';
                        document.getElementById(ck_inst).style.display = 'block';

                    } );

                }

            }
            else {
                ck_id = 'CK' + data.id;
                ck_inst = 'CK123' + data.id;
                editSource = 'editSource' + data.id;
                saveSource = 'saveSource' + data.id;

                var editor = window.pell.init({
                    element: document.getElementById(ck_inst),
                    defaultParagraphSeparator: 'p',
                    styleWithCSS: false,
                    onChange: function (html) {
                        document.getElementById(ck_id).textContent = html
                    }
                })

                editor.content.innerHTML = data.data;

                this.onEvent( document.getElementById(editSource) , 'click', function( ev ) {

                    if ( document.getElementById(ck_id).style.display == 'block' ) {
                        document.getElementById(ck_id).style.display = 'none';
                        document.getElementById(ck_id).parentNode.style.display = 'none';
                        document.getElementById(ck_inst).style.display = 'block';
                    }
                    else {
                        document.getElementById(ck_id).style.display = 'block';
                        document.getElementById(ck_id).parentNode.style.display = 'block';
                        document.getElementById(ck_inst).style.display = 'none';
                    }


                } );

                this.onEvent( document.getElementById(saveSource) , 'click', function( ev ) {

                    editor.content.innerHTML = document.getElementById(ck_id).value;
                    document.getElementById(ck_id).style.display = 'none';
                    document.getElementById(ck_id).parentNode.style.display = 'none';
                    document.getElementById(ck_inst).style.display = 'block';

                } );

            }


        }
    }
}));
