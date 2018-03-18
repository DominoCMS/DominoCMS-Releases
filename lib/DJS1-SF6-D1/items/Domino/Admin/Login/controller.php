<?php

class DominoAdminLoginController extends DCBaseController {

    function indexAction($data) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth'],
            'title' => "Naslov",
            'redirect' => '/'.$config['dominoDir']
        );
    }

}