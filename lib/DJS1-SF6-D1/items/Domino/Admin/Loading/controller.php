<?php

class DominoAdminLoadingController extends DCBaseController {

    function indexAction($data) {

        global $site;
        $util = new DCUtil();

        return array(
            'redirect' => '/domino/'. $site['lang']
        );
    }

}