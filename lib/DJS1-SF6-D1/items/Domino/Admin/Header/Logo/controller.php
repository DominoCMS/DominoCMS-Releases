<?php

class DominoAdminHeaderLogoController extends DCBaseController {

    function indexAction($data) {

        global $config;

        return array(
            'url' => '/'.$config['dominoDir']
        );

    }

}