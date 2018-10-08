<?php

class DominoAdminModulesParams {

    function levelAction( $data ) {

        global $config;
        global $params;
        global $site;
        $util = new DCUtil();

        // Params defined view editing
        if ( isset ( $site['page']['viewParent'] ) ) {

            $viewParent = explode( '.', $site['page']['viewParent']);
            $developer = isset( $viewParent[0] ) ? $viewParent[0] : '';
            $module = isset( $viewParent[1] ) ? $viewParent[1] : '';

            if ( $site['page']['id'] != 9 ) {
                require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Themes/controller.php" );
                $libModulesClass = 'DCLibModulesDominoThemes';
            }
            else {
                require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/" . $developer . "/" . $module . "/controller.php" );
                $libModulesClass = 'DCLibModules' . $developer . $module;
            }


            $entryEditClass = new $libModulesClass();

            return $entryEditClass->modulesParamsAction( array(
                'params' => $data,
                'developer' => $developer,
                'module' => $module
            ));

        }
        else die();


    }

}