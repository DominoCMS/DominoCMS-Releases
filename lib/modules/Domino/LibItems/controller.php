<?php
require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Identities/controller.php" );
class DCLibModulesDominoLibItems extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeFirstCreateAction ( $data ) {


    }
    function afterFirstCreateAction ( $data ) {

        return $data;
    }
    function beforeCreateAction ( $data ) {

        return $data;

    }
    function afterCreateAction ( $data ) {

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        global $config;
        global $site;

        $id = explode( "|", $data['entry']['id'] );

        // VIEW
        $filename = $config['libRoot'] . $site['technology'] . '/items/' . $id[0] . '/' . $id[1] . '/view.jsx';
        if ( file_exists( $filename ) ) {
            $file_contents = file_get_contents( $filename );
            $fh = fopen( $filename, "w" );
            fwrite( $fh, $data['formData']['view'] );
            fclose( $fh );

            // transpile to JS
        }

        // CONTROLLER
        $filename = $config['libRoot'] .  $site['technology'] . '/items/' . $id[0] . '/' . $id[1] . '/controller.js';
        if ( file_exists( $filename ) ) {
            $file_contents = file_get_contents( $filename );
            $fh = fopen( $filename, "w" );
            fwrite( $fh, $data['formData']['controller'] );
            fclose( $fh );
        }

        // MODEL
        $filename = $config['libRoot'] .  $site['technology'] . '/items/' . $id[0] . '/' . $id[1] . '/controller.php';
        if ( file_exists( $filename ) ) {
            $file_contents = file_get_contents( $filename );
            $fh = fopen( $filename, "w" );
            fwrite( $fh, $data['formData']['model'] );
            fclose( $fh );
        }

        // VIEW SSR
        $filename = $config['libRoot'] .  $site['technology'] . '/items/' . $id[0] . '/' . $id[1] . '/view.php';
        if ( file_exists( $filename ) ) {
            $file_contents = file_get_contents( $filename );
            $fh = fopen( $filename, "w" );
            fwrite( $fh, $data['formData']['viewSsr'] );
            fclose( $fh );
        }

        // THEME
        $filename = $config['libRoot'] .  $site['technology'] . '/items/' . $id[0] . '/' . $id[1] . '/component.scss';
        if ( file_exists( $filename ) ) {
            $file_contents = file_get_contents( $filename );
            $fh = fopen( $filename, "w" );
            fwrite( $fh, $data['formData']['theme'] );
            fclose( $fh );
        }
        $filename = $config['libRoot'] .  $site['technology'] . '/items/' . $id[0] . '/' . $id[1] . '/settings.scss';
        if ( file_exists( $filename ) ) {
            $file_contents = file_get_contents( $filename );
            $fh = fopen( $filename, "w" );
            fwrite( $fh, $data['formData']['themeSettings'] );
            fclose( $fh );
        }

        return $data;
    }
    function afterUpdateAction ( $data ) {

        return $data;

    }

}