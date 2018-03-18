<?php
class DCLibModulesDominoIdentity {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        return $data;
    }
    function afterCreateAction ( $data ) {

        return $data;

    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        return $data;

    }
    function modulesParamsAction ( $data ) {

        global $site;

        $paramLevels = array();

        $site['entry'] = array(
            'type' => 'edit',
            'edit' => array(
                'developer' => $data['developer'],
                'module' => $data['module'],
                'id' => 1
            ),
            'actions' => array (
                'options' => array(),
                'buttons' => array(
                    'save' => array(
                        'value' => 'Shrani',
                        'icon' => 'save',
                        'position' => 'left',
                        'name' => 'save',
                        'type' => 'submit'
                    )
                )
            )
        );
/*
        if ( $data['module'] == 'Identities')
            $actions['buttons']['translate'] = array(
                'value' => 'Translate',
                'link' => '#',
                'icon' => 'translate',
                'position' => 'right',
                'type' => 'submit',
                'name' => 'translate'
            );
*/

        //$site['page']['editLink'] = $params['currentUrlClean'] . "?id=";
        //$site['page']['listLink'] = $params['currentUrlClean'];

        return $paramLevels;

    }
    public function siteVars(){

        global $config;
        global $site;

        $util = new DCUtil();

        $content = "<?php\n\n";

        $identity = $util->dominoSql( "select * FROM " . $config['db'] . ".DCDominoIdentity;", 'fetch_one');

        $content = "<?php\n\n";
        $content .= "return array(\n";
        $open = ( $identity["open"] == 1 ) ? "true" : "false";
        $content .= "\t'open' => ". $open .",\n";
        $content .= "\t'db' => '".$config["db"]."',\n";
        $content .= "\t'theme' => '".$identity["theme"]."',\n";
        $content .= "\t'ver' => '".$identity["version"]."',\n";
        $content .= "\t'username' => '".$identity["username"]."',\n";
        //$content .= "'admin' => '". ( $identity["admin"] == 1 ) ? 'true' : 'false' ."',\n";
        $content .= "\t'admin' => false,\n";
        //$content .= "\t'adminPassword' => '".$identity["password"]."',\n";
        $robots = $identity["robots"] ? $identity["robots"] : 'ALL';
        $content .= "\t'robots' => '". $robots ."',\n";


        $frontPage = $util->dominoSql( "select * FROM " . $config['db'] . ".DCDominoSiteIndex WHERE entry='".$identity["frontPageEntry"]."';", 'fetch_one');

        $content .= "\t'page' => array(\n";
        $content .= "\t\t'entryFront' => '".$frontPage["entry"]."',\n";
        $content .= "\t\t'idFront' => '".$frontPage["id"]."',\n";
        $content .= "\t\t'entry' => '".$frontPage["entry"]."',\n";
        $content .= "\t\t'developer' => 'Domino',\n"; //".$frontPage["developer"]." developer Domino breaks params
        $content .= "\t\t'module' => 'Content',\n"; // ".$frontPage["module"]." also breaks params
        $content .= "\t\t'id' => '".$frontPage["id"]."',\n";
        $content .= "\t\t'privacy' => '".$frontPage["privacy"]."',\n";
        $content .= "\t\t'status' => '".$frontPage["status"]."',\n";
        $content .= "\t\t'title' => '',\n";
        $content .= "\t\t'views' => array('".str_replace(",","','",$frontPage["views"])."'),\n";
        $content .= "\t\t'parent' => '".$frontPage["parent"]."',\n";
        $content .= "\t\t'parentDeveloper' => '".$frontPage["parentDeveloper"]."',\n";
        $content .= "\t\t'parentModule' => '".$frontPage["parentModule"]."',\n";
        $content .= "\t\t'parentId' => '".$frontPage["parentId"]."',\n";
        $content .= "\t),\n";

        $content .= "\t'google' => array(\n";
        $content .= "\t\t'analytics' => '".$identity["googleAnalytics"]."',\n";
        //$content .= "\t\t'verification' => '".$identity["googleVerification"]."',\n";
        $content .= "\t),\n";

        $content .= "\t'technology' => array(\n";
        $content .= "\t\t'id' => '".$identity["techApp"]."-".$identity["techTemplate"]."-".$identity["techModel"]."',\n";
        $content .= "\t\t'app' => '".$identity["techApp"]."',\n";
        $content .= "\t\t'template' => '".$identity["techTemplate"]."',\n";
        $content .= "\t\t'model' => '".$identity["techModel"]."',\n";
        $content .= "\t),\n";

        $content .= "\t'version' => array(\n";
        $content .= "\t\t'js' => '".$identity["verJs"]."',\n";
        $content .= "\t\t'css' => '".$identity["verCss"]."',\n";
        $content .= "\t),\n";

        $content .= "\t'email' => array(\n";
        $content .= "\t\t'stats' => '".$identity["emailAdmin"]."',\n";
        $content .= "\t\t'stats' => '".$identity["emailStats"]."',\n";
        $content .= "\t\t'order' => '".$identity["emailOrder"]."',\n";
        $content .= "\t\t'contact' => '".$identity["emailContact"]."',\n";

        if ( $identity["emailUsername"] ) {
            $content .= "\t\t'username' => '".$identity["emailUsername"]."',\n";
            $content .= "\t\t'password' => '".$identity["emailPassword"]."',\n";
            $content .= "\t\t'sender' => '".$identity["emailSender"]."',\n";
            $content .= "\t\t'smtp' => '".$identity["emailSmtp"]."'\n";
        }
        else {
            $coreIdentity = $util->dominoSql( "select * FROM " . $config['db'] . ".DCDominoIdentity WHERE username='domino';", 'fetch_one');
            $content .= "\t\t'username' => '".$coreIdentity["emailUsername"]."',\n";
            $content .= "\t\t'password' => '".$coreIdentity["emailPassword"]."',\n";
            $content .= "\t\t'sender' => '".$coreIdentity["emailSender"]."',\n";
            $content .= "\t\t'smtp' => '".$coreIdentity["emailSmtp"]."'\n";
        }

        $content .= "\t),\n";

        $domains = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoIdentityDomains;",'fetch_array');

        foreach ( $domains AS $domain ) {


            $contentDomain = $content;

            $contentDomain .= "\t'domain' => '".$domain["domain"]."',\n";
            $contentDomain .= "\t'urlType' => '".$domain["urlType"]."',\n";
            $contentDomain .= "\t'protocol' => '".$domain["protocol"]."',\n";

            $lang = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLanguages WHERE lang='" . $domain['lang'] . "';",'fetch_one');

            $contentDomain .= "\t'lang' => '".$domain['lang']."',\n";
            $contentDomain .= "\t'langMain' => '".$domain['lang']."',\n";
            $contentDomain .= "\t'langVar' => '".$lang["iso31662"]."',\n";
            $contentDomain .= "\t'langName' => '".$lang["name"]."',\n";
            $urlLang = ( $domain["urlType"] != 'noLang' ) ? '/'.$lang["iso31662"] : '';
            if ( ( $domain["urlType"] == 'noLangLang' ) )
                $urlLang = ( $domain['lang'] != $identity['langMain'] ) ? '/'.$lang["iso31662"] : '';

            $contentDomain .= "\t'urlLang' => '". $urlLang ."',\n";

            $domainLanguages = explode(",", $domain["languages"] );
            $domainLanguagesNum = count( $domainLanguages );

            // Lang vars
            $contentDomain .= "\t'languages' => array(\n";
            for ( $i = 0; $i < $domainLanguagesNum; $i++ ) {
                $theLang = $domainLanguages[$i];
                $lang = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLanguages WHERE lang='" . $theLang . "';",'fetch_one');
                $contentDomain .= "\t\t'".$lang["iso31662"]."' => array(\n";
                $contentDomain .= "\t\t\t'iso6391' => '".$lang["lang"]."',\n";
                $contentDomain .= "\t\t\t'iso6392' => '".$lang["iso6392"]."',\n";
                $contentDomain .= "\t\t\t'iso31662' => '".$lang["iso31662"]."',\n";
                $contentDomain .= "\t\t\t'name' => '".$lang["name"]."',\n";
                $contentDomain .= "\t\t),\n";
            }
            $contentDomain .= "),\n";

            // Title
            $contentDomain .= "\t'frontTitle' => array(\n";
            for ( $i = 0; $i < $domainLanguagesNum; $i++ ) {
                $theLang = $domainLanguages[$i];
                $title = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteTitle WHERE lang='" . $theLang . "';",'fetch_one');
                $contentDomain .= "\t\t'".$theLang."' => '". $title['name'] ."',\n";
            }
            $contentDomain .= "\t),\n";

            // Description
            $contentDomain .= "\t'frontDescription' => array(\n";
            for ( $i = 0; $i < $domainLanguagesNum; $i++ ) {
                $theLang = $domainLanguages[$i];
                $desc = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteTitle WHERE lang='" . $theLang . "';",'fetch_one');
                $contentDomain .= "\t\t'".$theLang."' => '". $desc['description'] ."',\n";
            }
            $contentDomain .= "\t),\n";

            // Author
            $contentDomain .= "\t'author' => array(\n";
            for ( $i = 0; $i < $domainLanguagesNum; $i++ ) {
                $theLang = $domainLanguages[$i];
                $author = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteTitle WHERE lang='" . $theLang . "';",'fetch_one');
                $contentDomain .= "\t\t'".$theLang."' => '". $author['author'] ."',\n";
            }

            $contentDomain .= "\t),\n";

            $contentDomain .= ");";

            $util->writeFile( $config["domainsRoot"] . $domain["domain"] .  '/variables.php', $contentDomain);

        }

    }
}