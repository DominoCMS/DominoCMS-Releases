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


        //$this->connectDb();
        $host = preg_replace('#^www\.#', '', rtrim($_SERVER['HTTP_HOST'],"/"));

        require_once ( $config['installRoot'] . "classes/DCBaseController.php" );
        require_once ( $config['installRoot'] . "classes/DCUtil.php" );
        require_once( $config['installRoot'] . "classes/DCParams.php" );
        require_once( $config['installRoot'] . "classes/DCJson.php" );
        require_once ( $config["installRoot"].'controllers.php');

        $site = require_once( $config['installRoot'] . "classes/DCSite.php" );

        /*// USER VARIABLES
        $usr = new DominoUsersController();
        $usr -> userId();
        $user = $usr -> userVars();
*/
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
            $_SESSION["activeTemplate"] = "";

            $return = "<!DOCTYPE HTML>";
            $return .= '<html lang="' . $config['lang'] . '">';
            $return .= "<head>";
            require_once ($config['installRoot'] . "classes/DCHeader.php");
            $header = new DCHeader();
            $return .= $header->header();

            $return .= '</head><body>';
            $return .= '<script type="text/javascript" src="/install/app.js"></script>';
            $return .= "</body></html>";

            echo $return;

        }
    }

    function deploy() {

        global $config;
        $util = new DCUtil();

        if ( isset( $_GET["deploy"] ) ) {

            // APP

            $content = file_get_contents( $config['itemsRoot'] . 'App/lib/DCFiber.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCLoader.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCPromise.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCSignal.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCComponentUtils.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCComponent.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCPolyfill.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCRouteHandlerComponent.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCViewUtils.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCUtil.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/DominoApp.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCController.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCControllerUtils.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCDirector.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCBobril.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCIndexController.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'App/lib/DCMain.js' , true) . "\r\n";


            // Views and controllers
            $content .= file_get_contents( $config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Validation/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Steps/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Steps/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Welcome/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Welcome/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step1/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step1/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step2/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step2/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step3/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step3/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step4/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step4/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step5/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Step5/controller.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Success/view.js' , true) . "\r\n";
            $content .= file_get_contents( $config['itemsRoot'] . 'Success/controller.js' , true) . "\r\n";

            $util->writeFile( $config["installRoot"] . "app.js", $content);

            // PHP
            $content = "<?php\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Steps/controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Step1/controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Step2/controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Step3/controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Step4/controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Step5/controller.php' , true), '<?php')  . "\r\n";
            $content .= ltrim ( file_get_contents( $config['itemsRoot'] . 'Success/controller.php' , true), '<?php') . "\r\n";

            $util->writeFile( $config["installRoot"] . "controllers.php", $content);

            // CSS

            $content = file_get_contents( $config['itemsRoot'] . 'component.scss' , true) . "\r\n";
            $content .= file_get_contents( $config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Base/Global/component.scss' , true) . "\r\n";
            $content .= file_get_contents( $config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Base/Forms/component.scss' , true) . "\r\n";


            require_once $config['libRoot'] . "components/Leafo/Scssphp/scss.inc.php";

            $scss = new Compiler();
            $scss->setFormatter('Leafo\ScssPhp\Formatter\Compressed');
            //$scss->setImportPaths( "" );
            $content = $scss->compile( $content );

            $util->writeFile( $config["installRoot"] . "style.css", $content);

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