<?php

class DominoInstallerStep4Controller {

    function indexAction( $data ) {

        return array(
            'theme' => isset( $_SESSION['theme'] ) ? $_SESSION['theme'] : ''
        );
    }
    function submitAction( $data ) {

        global $config;

        $util = new DCUtil();
        $installClass = new DominoInstallerController();

        foreach ( $data AS $key => $val )
            $_SESSION[$key] = $val;

        mysql_connect($_SESSION['dbHost'],$_SESSION['dbUsername'],$_SESSION['dbPassword']) or die('Cannot connect to the database, try again later<br>' . mysql_error());
        mysql_select_db($_SESSION['dbName']) or die('Cannot find database, try again later<br>' . mysql_error());
        mysql_query('set names utf8');

        // 1. Create design tables

        $installClass->insertSql( $config['installRoot'] . 'db/DCDominoModules.sql' );
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'ItemsComponents');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'ItemsSubitems');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Themes');

        // 2. install template files

        if ( $data['template'] == 'clean' ) {

            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Content');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Menu');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'SiteIndex');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'SiteSlugs');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'SiteTitle');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'ContentBlocks');

            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Items');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Views');
            $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'ViewsStructure');

        }
        else if ( $data['template'] == 'basic' ) {

            # 1. Create basic modules
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoContent.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoMenu.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoSiteIndex.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoSiteSlugs.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoSiteTitle.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoContentBlocks.sql' );

            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoItems.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoViews.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoViewsStructure.sql' );


            // Install a theme if it exists
            if ( $data['theme'] ) {

                $util->dominoSql("INSERT INTO " . $_SESSION['dbName'] . ".DCDominoThemes (developer,theme,status) VALUES ('Default','" . $data['theme'] . "','1');", 'insert');

                //  Create theme folders and files
                $util->makeDir($_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] . "identity/themes/" . $data['theme'] );
                $util->makeDir($_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] . "identity/themes/" . $data['theme'].'items/' );
                $util->makeDir($_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] . "identity/themes/" . $data['theme'].'items/Domino/' );

                $content = '// colors
                $primary-color: #6C0;
                $secondary-color: #333;
                ';
                $util->writeFile( $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] . "identity/themes/settings.scss", $content);
                //$content = file_get_contents('');
                $content = '';
                $util->writeFile( $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] . "identity/themes/framework.scss", $content );
                $content = '';
                $util->writeFile( $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] . "identity/themes/global.scss", '' );
            }

        }


        return array(
            'success' => "success"
        );
    }

}