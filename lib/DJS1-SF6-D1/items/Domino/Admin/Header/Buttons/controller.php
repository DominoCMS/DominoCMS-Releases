<?php

class DominoAdminHeaderButtonsController extends DCBaseController {


    function indexAction( $data ) {

        global $config;

        $util = new DCUtil();

        if ( $config['auth'] === true ) {

            $ret = array(
                'auth' => $config['auth']
            );

            return $ret;
        }
        else
            return array(
                'auth' => false
            );
    }

    function showModules ( $searchQuery ) {

        global $config;
        global $site;

        if ( $config['auth'] === true ) {
            global $params;

            $util = new DCUtil();

            $searchWhere = $searchQuery ? " AND module like '%$searchQuery%'" : '';

            $modules = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoModules WHERE status=1".$searchWhere." ORDER BY developer,module ASC;", 'fetch_array');
            if ( $modules )
                foreach ( $modules AS &$module ) {

                    $module = array(
                        'name' => $module['module'],
                        'link' => '/' . $config['dominoDir'] . $site['lang'] . '/modules?developer=' . $module['developer'] . '&module=' . $module['module'],
                    );
                }

            return $modules;
        }
        else
            return array(
                'auth' => false
            );
    }
    function refreshAction ( $data ) {


        global $config;

        if ( $config['auth'] === true ) {

            $ret = array(
                'auth' => true,
                'modules' => $this->showModules( '')
            );

            return $ret;
        }
        else
            return array(
                'auth' => false
            );

    }

}