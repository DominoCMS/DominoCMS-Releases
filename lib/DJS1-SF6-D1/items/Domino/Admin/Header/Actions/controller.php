<?php
class DominoAdminHeaderActionsController extends DCBaseController {

    function indexAction( $data ) {

    }
    function deployAction( $data ) {

        global $config;

        if ( $data['type'] == 'app' ) {
            require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Items/controller.php" );
            $deployItems = new DCLibModulesDominoItems();
            $ret = $deployItems->deployApp();
            return $ret;
        }
        else if ( $data['type'] == 'css' ) {
            require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Themes/controller.php" );
            $deployThemes = new DCLibModulesDominoThemes();
            $ret = $deployThemes->deployCss();
            return $ret;
        }

    }

}