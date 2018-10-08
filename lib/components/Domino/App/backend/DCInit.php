<?php

class DCInit {

    function init() {

        global $config;
        global $site;
        global $params;
        global $user;

        $isAjax = false;

        if( isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest' ) // AJAX REQUEST
            $isAjax = true;

        // HACK: Kill this one if the request is empty image ... if empty image, server thinks it is a website request, but keeps the image heather, hence fires bootstrap app for no reason
        if ( $_SERVER["HTTP_ACCEPT"] == "image/webp,image/*,*/*;q=0.8" )
            die();

        require_once ( $config['includesRoot'] . 'backend/DCBaseController.php' );
        require_once ( $config['includesRoot'] . "backend/DCUtil.php" );
        require_once ( $config['includesRoot'] . "backend/DCParams.php" );
        require_once ( $config['includesRoot'] . "backend/DCJson.php" );
        require_once ( $config['includesRoot'] . 'backend/DCText.php' );
        require_once ( $config['includesRoot'] . 'backend/DCDate.php' );
        require_once ( $config['libRoot'] . 'backend/Domino/Users/controller.php' );
        require_once ( $config['libRoot'] . 'backend/Domino/Translate/controller.php' );

        $util = new DCUtil();
        $util->connectDb();

        $host = $this->getHost();

        //$site = ( $host == $config['hostAdmin'] ) ? require_once( $config['domainRoot'] ."/variables.php") : require_once("domains/".$host."/variables.php");
        $site = require_once("domains/".$host."/variables.php");
        $site['domainRoot'] = "domains/".$site['domain']."/";

        // USER VARIABLES
        $usr = new DCLibModulesDominoUsers();
        $usr -> userId();
        $user = $usr -> userVars();
        $param = new DCParams();
        $params = $param->params();



        if ( $isAjax === true )  { // AJAX REQUEST, POST DATA

            $open = $this->siteOpen( $site['open'] );

            // SITE OPEN
            if ( $open === false )
                die();

            header("Content-Type: application/json");

            $data = json_decode(file_get_contents('php://input'), true);

            $json = new DCJson();
            $type = isset( $data['type'] ) ? $data['type'] : 'index';

            echo $json->{$type.'Result'}();


        }
        else { // DIRECT REQUEST, BOOTSTRAP APP

            global $isBot;
            $isBot = $this->isBot();
            if ( isset( $_GET['bot'] ) )
                $isBot = true;

            if ( isset( $params['error'] ) ) {
                $isBot = true;
                $site['page']['views'] = array('Domino.Error');
            }

            $_SESSION["activeTemplate"] = "";

            $return = "<!DOCTYPE HTML>";
            $return .= '<html lang="' . $site['lang'] . '">';
            $return .= "<head>";

            // TODO: Implement custom header option here
            require_once ($config['includesRoot'] . "backend/DCHeader.php");
            $header = new DCHeader();
            $return .= $header->header();

            $return .= '</head><body name="top">';

            if ( $isBot == true ) {

                // add content blocks here
                require_once ($config['includesRoot'] . "backend/DCSSR.php");
                $ssr = new DCSSR();
                $return .= $ssr->renderSite();

            }
            else
                $return .= '<script type="text/javascript" src="/' . $site['domainRoot'] . 'app.js?v=' . $site['version']['js'] . '"></script>';

            if ( $isBot == true && isset( $site['google']['analytics'] ) ) {
                if ( $site['google']['analytics'] )
                    $return .= '<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');

ga(\'create\', \''.$site['google']['analytics'].'\', \'auto\');  // Replace with your property ID.
ga(\'send\', \'pageview\');

</script>
<!-- End Google Analytics -->';

            }

            // TODO: SSR javascript here

            $return .= "</body></html>";

            echo $return;

        }
    }
    function getHost(){

        $host = preg_replace('#^www\.#', '', rtrim($_SERVER['HTTP_HOST'],"/"));

        return $host;

    }

    function siteOpen( $open ) {

        global $config;

        if ( isset( $_GET["open"] ) )
            if ( $_GET["open"] == $config['adminPass'] )
                $_SESSION["open"] = true;

        return isset( $_SESSION["open"] ) ? true : $open;

    }

    function isBot() {


        global $isBot;

        if ( isset($isBot) )
            if ( $isBot == true )
                return true;


        // Set up bot mode
        if ( isset($_GET['bot']) ) {
            if ( $_GET['bot'] == 1 )
                $_SESSION['bot'] = 1;
            else
                unset($_SESSION['bot']);
        }

        if ( isset($_SESSION['bot']) )
            return true;


        // Set bot mode if browser IE  and lower than

        if ( strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false )
            return true;

        if (preg_match('/MSIE\s(?P<v>\d+)/i', @$_SERVER['HTTP_USER_AGENT'], $B) && $B['v'] <= 11) {
            return true;
        }

        /* BEAUTIFY */
        $bots = array("bot", "spider", "crawler", "facebook", "twitter", "google", "teoma", "alexa", "froogle", "gigabot", "inktomi",
            "looksmart", "url_spider_sql", "firefly", "nationaldirectory",
            "ask jeeves", "tecnoseek", "infoseek", "webfindbot", "girafabot",
            "www.galaxy.com", "googlebot", "scooter", "slurp",
            "msnbot", "appie", "fast", "webbug", "spade", "zyborg", "rabaz",
            "feedfetcher-google", "technoratisnoop", "rankivabot",
            "mediapartners-google", "sogou web spider", "webalta crawler","tweetmemebot",
            "butterfly","twitturls","me.dium","twiceler","facebookexternalhit/1.1","Facebot");

        $u_agent = strtolower($_SERVER['HTTP_USER_AGENT']);

        foreach($bots as $bot) {
            if(strpos($u_agent, $bot) !== false) {
                return true;
            }
        }

        return false;
    }


}