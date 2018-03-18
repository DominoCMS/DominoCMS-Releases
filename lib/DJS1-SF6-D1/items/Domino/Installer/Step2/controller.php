<?php

class DominoInstallerStep2Controller {

    function indexAction( $data ) {

        if ( $_SESSION['serverType'] == 'apache' ) {
            $privFolder = '/../private/';
            $pubFolder = '/../html/';
        }
        else {
            $privFolder = '/../private/';
            $pubFolder = '/../web/';
        }

        return array(
            'dbHost' => isset( $_SESSION['dbHost'] ) ? $_SESSION['dbHost'] : 'localhost',
            'dbName' => isset( $_SESSION['dbName'] ) ? $_SESSION['dbName'] : '',
            'dbUsername' => isset( $_SESSION['dbUsername'] ) ? $_SESSION['dbUsername'] : '',
            'dbPassword' => isset( $_SESSION['dbPassword'] ) ? $_SESSION['dbPassword'] : '',
            'folderPrivate' => isset( $_SESSION['folderPrivate'] ) ? $_SESSION['folderPrivate'] : $privFolder,
            'folderPublic' => isset( $_SESSION['folderPublic'] ) ? $_SESSION['folderPublic'] : $pubFolder,
        );


    }
    function submitAction( $data ) {

        global $site;
        global $config;
        $util = new DCUtil();
        $installClass = new DominoInstallerController();

        foreach ( $data AS $key => $val )
            $_SESSION[$key] = $val;

        $isConnected = @mysql_connect($data['dbHost'],$data['dbUsername'],$data['dbPassword']);

        if ( $isConnected == false )
            return array( 'success' => 'noconnect',
                'message' => mysql_error() );
        else {

            mysql_select_db($data['dbName']) or die('Cannot find database, try again later<br>' . mysql_error());
            mysql_query('set names utf8');

            $content = "<?php
    return array(
        ### Script settings
        'dTime'         => 80000, 	// Time in seconds before a new hit from the same ip is a valid hit (0 to disable)

        ### Database settings
        'host'	        =>	'".$data['dbHost']."',
        'user'	        =>	'".$data['dbUsername']."',
        'dbPass'	    =>	'".$data['dbPassword']."',
        'db'	        =>	'".$data['dbName']."',
        'server'        =>	'".$_SESSION['serverType']."',
        'technology'    =>	'".$_SESSION['technology']."',
        'adminPass'     => '',
        'root' => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPrivate'] . "identities/domino/',
        'domainRoot'    => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPublic'] . "domains/domino/',


        ### Config code
        'ip'            => '',
        'includesRoot'  => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPrivate'] . "lib/DJS1-SF6-D1/items/Domino/App/',
        'domainsRoot'   => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPublic'] . "domains/',
        'identityRoot'  => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPrivate'] . "identity/',
        'libRoot'       => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPrivate'] . "lib/',
        'dominoDir'     => 'domino/',
        'dominoRoot'    => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPublic'] . "domino/',
        'dominoAppRoot' => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPrivate'] . "lib/DJS1-SF6-D1/items/Domino/Admin/App/',
        'dominoAdminRoot'   => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPrivate'] . "lib/DJS1-SF6-D1/items/Domino/Admin/',
        'libPublicRoot' => \$_SERVER['DOCUMENT_ROOT'] . '" . $data['folderPublic'] . "lib/',
        'auth'          => false, // false - not authenticated, true - authenticated

    );";

            $_SESSION['identityRoot'] = $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . 'identity/';
            
            // Create private folders
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "config/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/items/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/items/Domino/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/modules/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/modules/Domino/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/themes/" );
            $util->makeDir( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "identity/modules/Domino/" );


            // -> domains dir

            // Write config file
            $util->writeFile( $_SERVER['DOCUMENT_ROOT'] . $data['folderPrivate'] . "config/config.php", $content);

            // SetUp main database tables


            // Insert base sql

            # Create building tables
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLanguages.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibItems.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibItemsComponents.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibItemsSubitems.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModules.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesCols.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesColsMain.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesDimensions.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesElements.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesElementsNames.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesListStructure.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesStructure.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoLibModulesStructureNames.sql' );

            # create and insert Admin structure
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoAdminContent.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoAdminSiteIndex.sql' );
            $installClass->insertSql( $config['installRoot'] . 'db/DCDominoAdminSiteSlugs.sql' );


            # Create index tables
            $installClass->createModuleTable( $data['dbName'], 'Domino', 'SiteSlugs');
            $installClass->createModuleTable( $data['dbName'], 'Domino', 'Timestamps');

            # Create main tables
            $installClass->createModuleTable( $data['dbName'], 'Domino', 'Content');
            $installClass->createModuleTable( $data['dbName'], 'Domino', 'Menu');


            return array(
                'success' => 'success'
            );
        }

    }


}