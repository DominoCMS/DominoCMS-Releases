<?php

class DominoAdminBreadCrumbsController extends DCBaseController {


    function indexAction ( $data ) {

        return $this->refreshAction( $data );
    }
    function refreshAction ( $data ) {

        global $params;
        $util = new DCUtil();

        $ret = array(
            'entries' => array()
        );
        $ret['entries'][] = array(
            'name' => '/',
            'link' => '/domino',
            'icon' => ''
        );

        foreach ( $params['levels'] AS $level ) {

            if ( $level['type'] != 'lang' )
                $ret['entries'][] = array(
                    'name' => $level['title'],
                    'link' => $level['url'],
                    'icon' => $level['icon']
                );
        }


        return $ret;
    }

}

