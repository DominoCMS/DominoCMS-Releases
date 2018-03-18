<?php


class DominoInstallerController {

    function indexAction($data) {

        global $config;


        return array();
    }
    function createModuleTable ( $db, $developer, $module ) {

        global $config;

        $util = new DCUtil();

        $insert = "CREATE TABLE IF NOT EXISTS ".$db.".`DC".$developer.$module."` (";

        $entries = '';
        // Add columns
        $cols = $util->dominoSql("select * FROM " . $db . ".DCDominoLibModulesCols WHERE developer='".$developer."' AND module='".$module."' ORDER BY `order` ASC;",'fetch_array');
        if ( $cols )
            foreach ( $cols AS $col ) {

                // List element
                $el = $util->dominoSql("select * FROM " . $db . ".DCDominoLibModulesElements WHERE developer='".$col['elementDeveloper']."' AND element='".$col['element']."';",'fetch_one');

                $entries .= "`".$el['element']."` ".$el['colType'];

                if ( $el['colLength'] )
                    $entries .= "(".$el['colLength'].")";

                $entries .= " ".$el['colNull'].",";

            }

        // Add dimension columns
        $dimensions = $util->dominoSql("select * FROM " . $db . ".DCDominoLibModulesDimensions WHERE developer='".$developer."' AND module='".$module."' ORDER BY level ASC;",'fetch_array');
        if ( $dimensions )
            foreach ( $dimensions AS $dimension ) {

                $el = $util->dominoSql("select * FROM " . $db . ".DCDominoLibModulesElements WHERE developer='".$dimension['elementDeveloper']."' AND element='".$dimension['element']."';",'fetch_one');
                $entries .= "`".$dimension['element']."` ".$el['colType']."(".$el['colLength'].") ".$el['colNull'].",";
            }

        // Add indexes
        $keys = $util->dominoSql("select * FROM " . $db . ".DCDominoLibModulesKeys WHERE developer='".$developer."' AND module='".$module."' ORDER BY `order` ASC;",'fetch_array');
        if ( $keys )
            foreach ( $keys AS $key ) {

                //KEY `id` (`id`),
                //KEY `name` (`name`),
                //KEY `lang` (`lang`)
            }

        $insert .= rtrim($entries,',').") ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        //print $insert."\n\r";
        $util->dominoSql( $insert, 'insert' );

    }
    // https://stackoverflow.com/questions/19751354/how-to-import-sql-file-in-mysql-database-using-php
    function insertSql ( $file ) {

        $lines = file( $file );
        // Loop through each line
        $templine = '';
        foreach ($lines as $line)  {
            // Skip it if it's a comment
            if (substr($line, 0, 2) == '--' || $line == '')
                continue;
            // Add this line to the current segment
            $templine .= $line;
            // If it has a semicolon at the end, it's the end of the query
            if (substr(trim($line), -1, 1) == ';') {
                // Perform the query
                mysql_query($templine) or print('Error performing query \'<strong>' . $templine . '\': ' . mysql_error() . '<br /><br />');
                // Reset temp variable to empty
                $templine = '';
            }
        }

    }
    function moveFilesAction ( $source, $destination ) {

        global $site;
        global $config;
        $util = new DCUtil();

        // update item from store

        // Get array of all source files
        $files = $util->scanFiles( $source );

        if ( !file_exists ( $destination ) )
            mkdir($destination );

        // Cycle through all source files
        $copy = array();
        foreach ( $files as $file ) {
            if (in_array($file, array(".",".."))) continue;
            //print $file;
            // If we copied this successfully, mark it for deletion
            $copy[] = $destination.$file;
            if ( !is_dir( $source.$file ) )
                copy($source.$file, $destination.$file);
            else {
                if (!file_exists($destination . $file))
                    mkdir( $destination . $file );
            }
        }

        // remove original
        $it = new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new RecursiveIteratorIterator($it,
            RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        rmdir($source);

        return $copy;
    }

}


class DominoInstallerStepsController {

    function indexAction($data) {

        global $config;


        return array();
    }
    function refreshAction( $data ) {

        global $site;


        return array(
            'url' => $site['url']
        );
    }

}


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


class DominoInstallerStep3Controller {

    function indexAction($data) {

        return array(
            'firstname' => isset( $_SESSION['firstname'] ) ? $_SESSION['firstname'] : '',
            'surname' => isset( $_SESSION['surname'] ) ? $_SESSION['surname'] : '',
            'username' => isset( $_SESSION['username'] ) ? $_SESSION['username'] : '',
            'email' => isset( $_SESSION['email'] ) ? $_SESSION['email'] : '',
            'developer' => isset( $_SESSION['developer'] ) ? $_SESSION['developer'] : '',
            'developerUsername' => isset( $_SESSION['developerUsername'] ) ? $_SESSION['developerUsername'] : ''
        );
    }
    function submitAction( $data ) {

        $util = new DCUtil();
        $installClass = new DominoInstallerController();

        foreach ( $data AS $key => $val ) {
            $_SESSION[$key] = $val;
        }

        mysql_connect($_SESSION['dbHost'],$_SESSION['dbUsername'],$_SESSION['dbPassword']) or die('Cannot connect to the database, try again later<br>' . mysql_error());
        mysql_select_db($_SESSION['dbName']) or die('Cannot find database, try again later<br>' . mysql_error());
        mysql_query('set names utf8');


        # Create User tables
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Users');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'UsersLoginFail');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'UsersLoginLog');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Developers');

        $hash = 'asdasds';

        // Insert user
        $util->dominoSql( "INSERT INTO " . $_SESSION['dbName'] . ".DCDominoUsers (id,email,username,password,firstname,surname,status) VALUES ('1','".$data['email']."','".$data['username']."','".$data['password']."','".$data['firstname']."','".$data['surname']."','1');", 'insert' );

        // Insert developer
        $util->dominoSql( "INSERT INTO " . $_SESSION['dbName'] . ".DCDominoDevelopers (id,username) VALUES ('','".$data['developerUsername']."');", 'insert' );

        // Create user vars
        $util->makeDir( $_SESSION['identityRoot'] . "modules/Domino/Users/" );
        $util->makeDir( $_SESSION['identityRoot'] . "modules/Domino/Users/1/" );

        $content = "<?php
return array(
    'id' => '1',
    'username' => '".$data['username']."',
    'name' => '".$data['firstname']."',
    'surname' => '".$data['surname']."'
);";

        $util->writeFile( $_SESSION['identityRoot'] . "modules/Domino/Users/1/variables.php", $content);


        return array(
            'success' => 'success'
        );
    }

}


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


class DominoInstallerSuccessController {

    function indexAction($data) {

        global $config;

        return array();
    }

}
