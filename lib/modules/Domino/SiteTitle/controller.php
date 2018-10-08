<?php
require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Identities/controller.php" );
class DCLibModulesDominoSiteTitle extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        $deploy = new DCLibModulesDominoIdentity();

        // Deploy site vars
        $deploy->siteVars();

        return $data;
    }
    function afterCreateAction ( $data ) {

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        $deploy = new DCLibModulesDominoIdentity();

        // Deploy site vars
        $deploy->siteVars();

        return $data;
    }

}