<?php

class DominoInstallerStep5Controller {

    function indexAction($data) {

        return array(
            'domain' => isset( $_SESSION['domain'] ) ? $_SESSION['domain'] : ''
        );
    }
    function submitAction( $data ) {

        global $config;
        $installClass = new DominoInstallerController();
        $util = new DCUtil();

        $config1 = $config;
        $config = require_once( $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate'] ."/config/config.php" );
        $config['installRoot'] = $_SERVER["DOCUMENT_ROOT"] . '/install/';
        $config['itemsRoot'] = $_SERVER["DOCUMENT_ROOT"] .'/lib/DJS1-SF6-D1/items/Domino/Installer/';
        $config['libRoot'] = $_SERVER["DOCUMENT_ROOT"] .'/lib/';

        foreach ( $data AS $key => $val )
            $_SESSION[$key] = $val;

        mysql_connect($_SESSION['dbHost'],$_SESSION['dbUsername'],$_SESSION['dbPassword']) or die('Cannot connect to the database, try again later<br>' . mysql_error());
        mysql_select_db($_SESSION['dbName']) or die('Cannot find database, try again later<br>' . mysql_error());
        mysql_query('set names utf8');

        // Install remaining tables
        # Create and insert translations for EN
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Translations');
        $installClass->insertSql( $config['installRoot'] . 'db/translations/en/DCDominoTranslations.sql' );

        # Create Identity Tables
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Identity');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'IdentityLanguages');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'IdentityDomains');

        // Insert identity data
        $util->dominoSql("INSERT INTO " . $_SESSION['dbName'] . ".DCDominoIdentity (theme,`open`,techApp,techTemplate,techModel,frontPageEntry,languages,langMain,enableSeo) VALUES ('" . $_SESSION['developerUsername'] . "." . $_SESSION['theme'] . "','1','DJS1','SF6','D1','Domino.Content.1','en','en','1');", 'insert');

        // insert lang
        $util->dominoSql("INSERT INTO " . $_SESSION['dbName'] . ".DCDominoIdentityLanguages (lang,ordem) VALUES ('en','1');", 'insert');


        // Create public domains folder
        $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPublic'] . "/domains/" );

        $ret = array();
        // Insert domain
        if ( $data['domain'] ) {

            $util->dominoSql("INSERT INTO " . $_SESSION['dbName'] . ".DCDominoIdentityDomains (domain,languages,lang,langMain,urltype,urlLangStandard,protocol) VALUES ('" . $data['domain'] . "','en','en','en','noLang','iso31662','http');", 'insert');
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPublic'] . "/domains/" . $data['domain']);

            $util->makeDir($_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPublic'] . "/domains/" . $data['domain'] . "/upload/");
            $util->makeDir($_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPublic'] . "/domains/" . $data['domain'] . "/upload/modules");


            // 3. deploy app, theme and site vars

            require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Items/controller.php" );

            $classModulesItems = new DCLibModulesDominoItems();
            $ret['app'] = $classModulesItems->deployApp();

            require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Themes/controller.php" );

            $classModulesThemes = new DCLibModulesDominoThemes();
            $ret['css'] = $classModulesThemes->deployCss();

        }

        // 1. move lib here here - move yourself
        /*if ( $_SESSION['folderPrivate'] != $_SESSION['folderPublic'] )
            $installClass->moveFilesAction(
                $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPublic'],
                $_SERVER['DOCUMENT_ROOT'] . $_SESSION['folderPrivate']
            );*/

        return $ret;
    }

}