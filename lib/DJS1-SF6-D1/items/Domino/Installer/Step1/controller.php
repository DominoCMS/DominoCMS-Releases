<?php

class DominoInstallerStep1Controller {

    function indexAction( $data ) {

        return array(
            'serverType' => isset( $_SESSION['serverType'] ) ? $_SESSION['serverType'] : 'nginx',
            'workingType' => isset( $_SESSION['workingType'] ) ? $_SESSION['workingType'] : 'ide',
            'technology' => isset( $_SESSION['technology'] ) ? $_SESSION['technology'] : 'DJS1-SF6-D1'
        );
    }
    function submitAction( $data ) {

        foreach ( $data AS $key => $val )
            $_SESSION[$key] = $val;


        if ( isset( $_SESSION['folderPrivate'] ) )
            unset($_SESSION['folderPrivate']);
        if ( isset( $_SESSION['folderPublic'] ) )
            unset($_SESSION['folderPublic']);

    }


}