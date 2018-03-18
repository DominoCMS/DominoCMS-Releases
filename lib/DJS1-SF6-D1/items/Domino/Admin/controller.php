<?php

class DominoAdminController extends DCBaseController {

    function indexAction($data) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth'],
            'redirect' => '/'.$config['dominoDir'].'en/login' //'si/prijava'

        );
    }

}