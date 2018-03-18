<?php

class DominoAdminLogoutController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        global $site;

        $util = new DCUtil();

        unset($_SESSION['userId']);
        $util->unsetCookie('user');

        //$quote = $util->dominoSql("select author,content FROM " . $site['db'] . ".DCDominoQuotes WHERE lang='".$site['lang']."' ORDER BY RAND();",'fetch_one');

        return array(
            'redirect' => '/'.$config['dominoDir'].$site['lang'],
            //'quote' => $quote
        );

    }

}