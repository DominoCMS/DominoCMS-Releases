<?php
use Leafo\ScssPhp\Compiler;
class DCInit {

    function init() {

        global $config;
        global $site;
        global $params;
        global $user;

        $isAjax = false;

        if( isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest' ) // AJAX REQUEST
            $isAjax = true;

        // HACK: Kill this if the request is empty image ... if empty image, server thinks it is a website request, but keeps the image heather, hence fires bootstrap app for no reason
        if ( $_SERVER["HTTP_ACCEPT"] == "image/webp,image/*,*/*;q=0.8" )
            die();

        $this->connectDb();

        require_once ( $config['dominoAdminRoot'] . 'App/classes/DCBaseController.php' );
        require_once ( $config['libRoot'] . 'DJS1-SF6-D1/modules/Domino/Users/controller.php' );
        require_once ( $config['dominoAdminRoot'] . "App/classes/DCUtil.php" );
        require_once( $config['dominoAdminRoot'] . "App/classes/DCParams.php" );
        require_once( $config['dominoAdminRoot'] . "App/classes/DCJson.php" );
        require_once( $config['dominoAdminRoot'] . "App/classes/DCDate.php" );
        require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Translate/controller.php" );

        // USER VARIABLES
        $usr = new DCLibModulesDominoUsers();
        $usr -> userId();
        $user = $usr -> userVars();  

        $site = require_once( $config['dominoRoot'] ."variables.php" );
        
        // PARAMS
        $param = new DCParams();
        $params = $param->params();
        $util = new DCUtil();

        if ( $isAjax === true )  { // AJAX REQUEST, POST DATA 


            header("Content-Type: application/json");

            $data = json_decode(file_get_contents('php://input'), true);

            $json = new DCJson();
            $type = isset( $data['type'] ) ? $data['type'] : 'index';

            echo $json->{$type.'Result'}();

        }
        else { // DIRECT REQUEST, BOOTSTRAP APP

            $this->deploy();
            if ( isset( $params['error'] ) )
                $site['page']['views'] = array('Domino.Error');

            $_SESSION["activeTemplate"] = "";

            $return = "<!DOCTYPE HTML>";
            $return .= '<html lang="' . $site['lang'] . '">';
            $return .= "<head>";
            require_once ($config['dominoAdminRoot'] . "App/classes/DCHeader.php");
            $header = new DCHeader();
            $return .= $header->header();

            $return .= '</head><body name="top">';
            $return .= '<script type="text/javascript" src="/' . $config['dominoDir'] . 'app.js"></script>';
            $return .= "</body></html>";

            echo $return;

        }
    }
    function deploy() {

        global $config;
        $util = new DCUtil();

        if ( isset( $_GET["deploy"] ) ) {
            // APP

            $content = file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCFiber.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCLoader.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCPromise.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCSignal.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCComponentUtils.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCComponent.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCPolyfill.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCRouteHandlerComponent.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCViewUtils.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCUtil.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/DominoApp.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCController.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCControllerUtils.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCDirector.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCBobril.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCIndexController.js' , true) . "\r\n";
            $content .= file_get_contents( $config['dominoAdminRoot'] . 'App/lib/DCMain.js' , true) . "\r\n";


            $content .= file_get_contents( $config['libRoot'] . 'components/jaredreich/pell/pell.js' , true) . "\r\n";

            // Views and controllers

            $views = array('Domino.Base','Domino.Admin.Entry','Domino.Base.Global','Domino.Base.Forms','Domino.DominoFont','Domino.Validation','Domino.Admin','Domino.Admin.BreadCrumbs','Domino.Admin.Footer','Domino.Admin.Front','Domino.Admin.Header','Domino.Admin.Header.Account','Domino.Admin.Header.Actions','Domino.Admin.Header.Buttons','Domino.Admin.Header.Logo','Domino.Admin.Header.Search','Domino.Admin.Identities','Domino.Admin.LinkGrid','Domino.Admin.Loading','Domino.Admin.Login','Domino.Admin.Login.Logo','Domino.Admin.Login.Form','Domino.Admin.Logout','Domino.Admin.Modules','Domino.Admin.Sitemap','Domino.Admin.Entry.Edit','Domino.Admin.Entry.List','Domino.Admin.Entry.Selector',
                'Domino.Admin.Entry.Edit.Field','Domino.Admin.Entry.Edit.Title','Domino.Admin.Entry.Edit.Field.AddEntries','Domino.Admin.Entry.Edit.Field.Bool','Domino.Admin.Entry.Edit.Field.ChildEntries','Domino.Admin.Entry.Edit.Field.Code','Domino.Admin.Entry.Edit.Field.Cross','Domino.Admin.Entry.Edit.Field.Cross.Entries','Domino.Admin.Entry.Edit.Field.Cross.Files','Domino.Admin.Entry.Edit.Field.Cross.Pictures','Domino.Admin.Entry.Edit.Field.Date','Domino.Admin.Entry.Edit.Field.DateTime','Domino.Admin.Entry.Edit.Field.DisplayVarchar','Domino.Admin.Entry.Edit.Field.FieldSet','Domino.Admin.Entry.Edit.Field.File','Domino.Admin.Entry.Edit.Field.Files','Domino.Admin.Entry.Edit.Field.HorizontalBar','Domino.Admin.Entry.Edit.Field.NameUrlname','Domino.Admin.Entry.Edit.Field.Password','Domino.Admin.Entry.Edit.Field.Pictures','Domino.Admin.Entry.Edit.Field.Selector','Domino.Admin.Entry.Edit.Field.TabSet','Domino.Admin.Entry.Edit.Field.Text','Domino.Admin.Entry.Edit.Field.TextEditor','Domino.Admin.Entry.Edit.Field.Time','Domino.Admin.Entry.Edit.Field.Varchar',
                'Domino.Admin.Entry.List.Actions','Domino.Admin.Entry.List.Field','Domino.Admin.Entry.List.Field.Bool','Domino.Admin.Entry.List.Field.Date','Domino.Admin.Entry.List.Field.DateTime','Domino.Admin.Entry.List.Field.Delete','Domino.Admin.Entry.List.Field.Deploy','Domino.Admin.Entry.List.Field.Edit','Domino.Admin.Entry.List.Field.Files','Domino.Admin.Entry.List.Field.NameUrlname','Domino.Admin.Entry.List.Field.Order','Domino.Admin.Entry.List.Field.Picture','Domino.Admin.Entry.List.Field.Pictures','Domino.Admin.Entry.List.Field.Tab','Domino.Admin.Entry.List.Field.Text','Domino.Admin.Entry.List.Field.Time','Domino.Admin.Entry.List.Field.Varchar','Domino.Admin.Entry.List.List','Domino.Admin.Entry.List.List.Entries','Domino.Admin.Entry.List.Pagination','Domino.Admin.Entry.List.SubActions');

            $subitems = array(
                'Domino.Admin' => array ('Domino.Admin.Header','Domino.Admin.BreadCrumbs','Domino.Admin.Footer'),
                'Domino.Admin.Entry' => array (),
                'Domino.Admin.Header' => array( 'Domino.Admin.Header.Logo','Domino.Admin.Header.Actions','Domino.Admin.Header.Buttons','Domino.Admin.Header.Search','Domino.Admin.Header.Account' ),
                'Domino.Admin.Identities' => array ('Domino.Admin.BreadCrumbs'),
                'Domino.Admin.LinkGrid' => array ('Domino.Admin.BreadCrumbs'),
                'Domino.Admin.Login' => array ('Domino.Admin.Login.Logo','Domino.Admin.Footer'),
                'Domino.Admin.Modules' => array ('Domino.Admin.BreadCrumbs'),
                'Domino.Admin.Sitemap' => array ('Domino.Admin.BreadCrumbs'),
                'Domino.Base' => array ('Domino.Base.Global'),
            );

            $viewsNum = '';
            // CSS
            $cssContent = '';
            $cssContent .= file_get_contents( $config['libRoot'] . 'DJS1-SF6-D1/themes/Domino/Domino/settings.scss' , true) . "\r\n";
            $cssContent .= file_get_contents( $config['libRoot'] . 'DJS1-SF6-D1/themes/Domino/Domino/global.scss' , true) . "\r\n";


            foreach ( $views AS $view ) {

                $viewPath = str_replace('.', '/', $view);
                $viewArr = explode( '.', $view );
                $viewName = end ( $viewArr );
                //$controllerName = str_replace('.', '', $view).'Controller';

                $technology = 'DJS1-SF6-D1';
                $developer = $viewArr[0];
                $item = $viewArr[1];

                $newView = '';
                if ( count($viewArr) > 2 )
                    for ( $n = 2; $n < count($viewArr); $n++ )
                        $newView .= $viewArr[$n] . '/';

                $filename = $config['libRoot'] . $technology . '/items/' . $developer . '/' . $item . '/' . $newView;
                $filenameThemes = $config['libRoot'] . $technology . '/themes/Domino/Domino/items/' . $developer . '/' . $item . '/' . $newView;

                $fileView = $filename . 'view.js';
                //if ( file_exists( $fileView ) )
                   // print $fileView."\r\n";
                if ( file_exists( $fileView ) )
                    $content .= file_get_contents(  $fileView, true) . "\r\n";

                $fileController = $filename . 'controller.js';
                if ( file_exists( $fileController ) )
                    $content .= file_get_contents( $fileController, true) . "\r\n";


                $fileTheme = $filenameThemes . 'settings.scss';
                if ( file_exists( $fileTheme ) )
                    $cssContent .= file_get_contents( $fileTheme , true) . "\r\n";


                $fileTheme = $filename . 'component.scss';

                if ( file_exists( $fileTheme ) ) {
                    //print $fileTheme."\r\n";
                    $cssContent .= file_get_contents( $fileTheme , true) . "\r\n";
                }

                //if ( file_exists( $fileTheme ) )
                    //print $fileTheme."\r\n";
                $subviews = '';
                if ( isset ( $subitems[$view] ) ) {
                    $subviews = $subitems[$view];
                    $subviews = "'".implode ( "','" , $subviews)."'";
                }



                $viewsNum .= "'" . str_replace ('/', '.',$view ) . "' => array (" . $subviews . "),\n";

            }

            $util->writeFile( $config["dominoRoot"] . "app.js", $content);

            // Views
            $viewParams = '';
            //$viewParams .= "'".$view['developer'].".".$view['component']."' => ".$viewPars.",\n";

            $refreshViews = '';
            $refreshViews .= "'Domino.Admin.Header.Buttons',\n";
            $refreshViews .= "'Domino.Admin.BreadCrumbs',\n";


            ### Write views.php

            $Mod = "<?php\n";
            $Mod .= "return array( 'views' => array(\n";
            $Mod .= $viewsNum;
            $Mod .= "),\n";
            $Mod .= "'viewParams' => array(\n";
            $Mod .= rtrim( $viewParams ,',\n');
            $Mod .= "),\n";
            $Mod .= "'refreshViews' => array(\n";
            $Mod .= rtrim( $refreshViews ,',\n');
            $Mod .= ")
            );";
            $util->writeFile( $config['dominoRoot'] . 'views.php', $Mod );


            /*$content = file_get_contents( $config['includesRoot'] . 'Views/themes/component.scss' , true) . "\r\n";
            $content .= file_get_contents( $config['libRoot'] . 'items/Domino/Base/DJS1-SF6-D1/Global/themes/component.scss' , true) . "\r\n";
            $content .= file_get_contents( $config['libRoot'] . 'items/Domino/Base/DJS1-SF6-D1/Forms/themes/component.scss' , true) . "\r\n";

*/
            require_once $config['libRoot'] . "components/Leafo/Scssphp/scss.inc.php";

            $scss = new Compiler();
            $scss->setFormatter('Leafo\ScssPhp\Formatter\Compressed');
            //$scss->setImportPaths( "" );
            $content = $scss->compile( $cssContent );

            $util->writeFile( $config["dominoRoot"] . "style.css", $content);




        }
    }

    function connectDb() {
        global $config;

        ### Connecting to database
        mysql_connect($config['host'],$config['user'],$config['dbPass']) or die('Cannot connect to the database, try again later<br>' . mysql_error());
        mysql_select_db($config['db']) or die('Cannot find database, try again later<br>' . mysql_error());
        mysql_query('set names utf8');
    }

}