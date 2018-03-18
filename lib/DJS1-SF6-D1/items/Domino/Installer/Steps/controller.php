<?php

class DominoInstallerStepsController {

    function indexAction($data) {

        global $config;


        return array();
    }
    function refreshAction( $data ) {

        global $site;


        return array(
            'url' => $site['url']
        );
    }

}