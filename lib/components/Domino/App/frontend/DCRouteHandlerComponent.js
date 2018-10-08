
var DCRouteHandlerComponent = DCDominoComponent.extend( function( _super ) {
    return {
        construct: function (_baseURL) {
            this.baseURL = _baseURL;
            this.defaultControllerName = this.controllerName = 'default';
            this.defaultControllerAction = this.controllerAction = 'index';
            this.activeController = null;
        },
        init: function () {
            // HANDLE INITIALIZATION DATA
            if (DominoApp['initVars']) {

            }
        },
        handleRoute: function (path) {
            // SPLIT THE PATH
            var splitPath = path.split('/');
            // SPLIT THE EXISTING PARAMETERS
            var urlparams = window.location.search.replace(/\?/g, '');
            var fullpath = urlparams ? path + '/' + urlparams : path;
            var splitParams = urlparams.split('&');
            var params = {};

            DominoAppOptions.path = fullpath;
            // BUILD THE PARAMETER OBJECT
            for (var p = 0; p < splitParams.length; p++) {
                var split = splitParams[p].split('=');
                if (split[0]) // can do nicer
                    params[split[0]] = split[1];
            }

            this.controllerName = this.defaultControllerName;
            this.controllerAction = this.defaultControllerAction;
            var controllerName = this.defaultControllerName + 'Controller';
            var actionName = this.defaultControllerAction + 'Action';

            var slugType = 'userFriendly'; // controllerAction
            if (slugType == 'controllerAction') {
                // CHECK FOR CONTROLLER / ACTION
                if (splitPath[0]) {
                    this.controllerName = splitPath[0];
                    controllerName = splitPath[0] + 'Controller';
                    splitPath.splice(0, 1);
                }

                if (splitPath[0]) {
                    this.controllerAction = splitPath[0];
                    actionName = splitPath[0] + 'Action';
                    splitPath.splice(0, 1);
                }
            }
            else {
                controllerName = 'indexController';
                actionName = 'indexAction';
            }

            if (DominoAppControllers[controllerName]) {
                DominoAppViewStack = [];
                var newController = new DominoAppControllers[controllerName]();

                if (newController[actionName]) {

                    if (newController.beforeAction(actionName)) {
                        if (this.activeController)
                            this.activeController.destroy();

                        this.activeController = newController;
                        // controller se kliče sedaj path in params zraven
                        var dataCont = [];
                        dataCont['path'] = path;
                        dataCont['params'] = params;
                        newController[actionName].call(newController, dataCont);

                        newController.afterAction(actionName);
                    }
                } else { // HANDLE 404
                    if (this.activeController)
                        this.activeController.destroy();

                    newController.destroy();

                    newController = new DominoAppControllers['indexController']();
                    this.activeController = newController;

                    newController['404Action']({
                        title: 'Not found',
                        message: 'Requested action "' + actionName + '" cannot be found for "' + controllerName + '" Controller.'
                    });
                }
            } else { // HANDLE 404
                DominoAppViewStack = [];

                if (this.activeController)
                    this.activeController.destroy();

                newController = new DominoAppControllers['indexController']();
                this.activeController = newController;

                newController['404Action']({
                    title: 'Not found',
                    message: 'Requested controller "' + controllerName + '" cannot be found.'
                });
            }
        }
    }
} );