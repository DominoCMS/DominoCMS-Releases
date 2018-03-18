DominoControllers.registerController( 'Domino.Admin.Entry.Edit', DCDominoController.extend( function( _super ) {
    return {

        'indexAction': function ( el, view, data ) {
            "use strict";

            var self = this;

            self.onEvent( document.querySelectorAll('input,textarea'), 'focus', function (ev) {
                ev.preventDefault();

                var saveAction = document.getElementById('saveAction');

                if ( saveAction )
                    saveAction.className = '';

                var createAction = document.getElementById('createAction');
                if ( createAction )
                    createAction.className = '';

                var updateAction = document.getElementById('updateAction');
                if ( updateAction )
                    updateAction.className = '';

                var createOpenAction = document.getElementById('createOpenAction');
                if ( createOpenAction )
                    createOpenAction.className = '';


            });

            self.onEvent(document.getElementById('updateAction'), 'click', function (ev) {
                ev.preventDefault();


                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('editForm') );

                if ( validateFormData !== false ) {
                    this.className = "disabled";
                    DominoApp.ajax({
                        view: view,
                        action: 'update',
                        data: {
                            'options': data.options,
                            'formData': validateFormData
                        }
                    }).then( function( success ) {


                        DominoApp.redirect( data.actions.buttons.back.link );

                    });
                }



            });
            self.onEvent(document.getElementById('saveAction'), 'click', function (ev) {
                ev.preventDefault();

                if ( this.className != 'disabled' ) {

                    var DominoValidation = new DominoAppControllers['Domino.Validation']();
                    var validateFormData = DominoValidation.form( document.getElementById('editForm') );


                    if ( validateFormData !== false ) {

                        this.className = "disabled";

                        DominoApp.ajax({
                            view: view,
                            action: 'update',
                            data: {
                                'options': data.options,
                                'formData': validateFormData
                            }
                        }).then(function (success) {


                        });
                    }

                }

            });

            self.onEvent(document.getElementById('createAction'), 'click', function (ev) {
                ev.preventDefault();

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('editForm') );

                if ( validateFormData !== false ) {

                    DominoApp.ajax({
                        view: view,
                        action: 'create',
                        data: {
                            'options': data.options,
                            'open': false,
                            'formData': validateFormData
                        }
                    }).then(function (success) {


                        DominoApp.redirect(data.actions.buttons.back.link);

                    });
                }

            });

            self.onEvent(document.getElementById('createOpenAction'), 'click', function (ev) {
                ev.preventDefault();

                var DominoValidation = new DominoAppControllers['Domino.Validation']();
                var validateFormData = DominoValidation.form( document.getElementById('editForm') );

                if ( validateFormData !== false ) {

                    DominoApp.ajax({
                        view: view,
                        action: 'create',
                        data: {
                            'options': data.options,
                            'open': true,
                            'formData': validateFormData
                        }
                    }).then(function (success) {


                        DominoApp.redirect(success.link);

                    });
                }

            });

            self.onEvent(document.getElementById('sitemapAction'), 'click', function (ev) {
                ev.preventDefault();



                DominoApp.ajax({
                    view: view,
                    action: 'sitemap',
                    data: {}
                }).then( function( success ) {

                    alert('Sitemap updated successfuly!');

                });


            });

            self.onEvent(document.getElementById('translateAction'), 'click', function (ev) {
                ev.preventDefault();


                DominoApp.ajax({
                    view: view,
                    action: 'translate',
                    data: {
                        id: data.options.id
                    }
                }).then( function( success ) {

                    //alert('Translated successfuly');

                });


            });

        }

    }
    } ) );
