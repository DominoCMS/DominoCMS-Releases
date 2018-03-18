<?php

class DominoAdminHeaderController extends DCBaseController {

    function indexAction($data) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth']
        );

    }

}