<?php

class DominoAdminEntryEditFieldNameUrlnameController extends DCBaseController {

    function indexAction( $data ) {


    }
    public function structureData ( $entry, $data ) {

        global $site;
        global $config;
        $util = new DCUtil();

        $ret = array();

        foreach ( $data['dimensions'] AS $dimension ) {

            if ( $data['moduleData']['id'] == 'new' ) {
                $name = "";
                $urlname = array(
                    'urlname' => ''
                );
            }
            else {
                $name = $data['moduleData'][$dimension['id']]['name'];
                $urlnameSql = $util->dominoSql("SELECT * FROM " . $site['db'] . ".DCDominoSiteSlugs WHERE entry='".$data['moduleData']['developer'].".".$data['moduleData']['module'].".".$data['moduleData']['id']."' AND lang='".$dimension['id']."';",'fetch_one');
                $urlname = $urlnameSql ? $urlnameSql : array(
                    'urlname' => ''
                );
            }
            $ret[$dimension['id']] = array(
                'name' => $name,
                'urlname' => $urlname['urlname'],
                'urlnamePlaceholder' => 'urlname'
            );
        }

        return $ret;

    }
    public function prepareInsert ( $col, $data, $libModule, $dimension ) {

        global $identity;
        global $config;
        $util = new DCUtil();
        $name = trim($dimension ? $data[$dimension]['name'] : $data['name'] );

        if ( $name ) {
            $urlNameGen = $this->urlNameGen( $name );

            $urlname = $this->uniqueUrlname(array(
                'db' => $identity['db'],
                'lang' => $dimension,
                'urlname' => $urlNameGen,
                'newUrlname' => $urlNameGen,
                'level' => 0,
                'developer' => $data['developer'],
                'module' => $data['module'],
                'id' => $data['id'],
                'parent' => $data['parent']
            ));



        }
        else
            $urlname = '';

        $path = $util->urlPath(array(
            "db" => $identity['db'],
            "parent" => array(
                'developer' => $data['parentDeveloper'],
                'module' => $data['parentModule'],
                'id' => $data['parentId']
            ),
            "lang" => $dimension
        ));

        $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteSlugs (developer, `module`, id, entry, lang, urlname, `name`, urlpath) VALUES ('" . $data['developer'] . "','" . $data['module'] . "','" . $data['id'] . "','" . $data['entry'] . "','" . $dimension . "','" . $urlname . "','" . $name . "','" . $path . "');", 'insert');

        return $name;

    }
    public function prepareUpdate ( $col, $data, $libModule, $dimension ) {

        global $identity;
        global $config;
        $util = new DCUtil();

        $name = trim( $dimension ? $data[$dimension]['name'] : $data['name'] );

        $urlNameGen = $this->urlNameGen( $name );

        $urlname = $this->uniqueUrlname(array (
            'db' => $identity['db'],
            'lang' => $dimension,
            'urlname' => $urlNameGen,
            'newUrlname' => $urlNameGen,
            'level' => 0,
            'developer' => $data['module'],
            'module' => $data['module'],
            'id' => $data['id'],
            'parent' => $data['parent']
        ));

        $path = $this->urlPath(array(
            "db"=> $identity['db'],
            "parent"=> array(
                'developer' => $data['parentDeveloper'],
                'module' => $data['parentModule'],
                'id' => $data['parentId']
            ),
            "lang" => $dimension
        ));

        if ( $name ) {

            $urlnameSql = $util->dominoSql("SELECT * FROM " . $identity['db'] . ".DCDominoSiteSlugs WHERE entry='".$data['entry']."' AND lang='".$dimension."';",'fetch_one');
            if ( $urlnameSql )
                $util->dominoSql("UPDATE " . $identity['db'] . ".DCDominoSiteSlugs SET name='".$name."',urlname='".$urlname."',urlpath='".$path."' WHERE entry='".$data['entry']."' AND lang='".$dimension."';", 'update');
            else
                $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteSlugs (developer,`module`,`id`,entry,lang,urlname,`name`,urlpath) VALUES ('" . $data['developer'] . "','" . $data['module'] . "','" . $data['id'] . "','" . $data['entry'] . "','" . $dimension . "','" . $urlname . "','" . $name . "','" . $path . "');", 'insert');

        }

        return $name;

    }
    public function urlNameGen ( $url ) {

        $delimiter = '-';
        $locale = setlocale(LC_CTYPE, 0);
        setlocale(LC_ALL, 'en_US.UTF8');

        if (!empty( $replace ) )
            $url = str_replace((array)$replace, ' ', $url);

        $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $url);
        $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
        $clean = strtolower(trim($clean, '-'));
        $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);

        setlocale(LC_ALL, $locale);

        return $clean;
    }

    public function uniqueUrlname( $data ) {

        $util = new DCUtil();

        $row = $util->dominoSql("select si.* FROM ".$data["db"].".DCDominoSiteIndex si JOIN ".$data["db"].".DCDominoSiteSlugs ut ON ( si.indexId = ut.indexId ) WHERE ut.urlname='".$data["newUrlname"]."' AND ut.lang='".$data["lang"]."' AND si.developer='".$data["developer"]."' AND si.module='".$data["module"]."' AND si.id!='".$data["id"]."' AND si.parent='".$data['parent']."' AND si.status<2;",'fetch_one');
        if ( $row )
            return $this->uniqueUrlname(
                array (
                    'db' => $data["db"],
                    'lang' => $data["lang"],
                    'urlname' => $data["urlname"],
                    'newUrlname' => $data["urlname"]."-".$data["level"],
                    'level' => ( $data["level"] + 1 ),
                    'developer' => $row['developer'],
                    'module' => $row['module'],
                    'id' => $row['id'],
                    'parent' => $row['parent']
                )
            );
        else
            return $data["newUrlname"];

    }
    public function urlPath( $data ) {

        $urlBackTrack = rtrim($this->urlBackTrack (
            array(
                "db"=> $data['db'],
                "parent"=> $data["parent"],
                "lang" => $data["lang"]
            )
        ),",");

        $urlPath = "";
        if ( $urlBackTrack ) {
            $urlArr = explode ( ",",$urlBackTrack );
            $levels = count($urlArr)-1;
            for ( $i = $levels; $i >= 0; $i-- )
                $urlPath .= "/".$urlArr[$i];
        }

        return $urlPath;
    }
    public function urlBackTrack( $data ) {

        $util = new DCUtil();
        $row = $util->dominoSql("select ut.urlname,si.parentDeveloper,si.parentModule,si.parentId FROM ".$data['db'].".DCDominoSiteIndex si JOIN ".$data['db'].".DCDominoSiteSlugs ut ON ( si.entry = ut.entry ) WHERE si.developer='".$data['parent']['developer']."' AND si.module='".$data['parent']['module']."' AND si.id='".$data['parent']['id']."' AND ut.lang='".$data["lang"]."';",'fetch_one');
        //print "select ut.urlname,si.parentDeveloper,si.parentModule,si.parentId FROM ".$data['db'].".DCDominoSiteIndex si JOIN ".$data['db'].".DCDominoSiteSlugs ut ON ( si.indexId = ut.indexId ) WHERE si.developer='".$data['parent']['developer']."' AND si.module='".$data['parent']['module']."' AND si.id='".$data['parent']['id']."' AND ut.lang='".$data["lang"]."';";
        if ( $row ) {
            $ret = '';
            if ( $data['parent']['module'] != 'Menu' )
                $ret = $row['urlname'].",";
            $ret .= $this->urlBackTrack (
                array(
                    'db' => $data['db'],
                    'parent' => array(
                        'developer' => $row['parentDeveloper'],
                        'module' => $row['parentModule'],
                        'id' => $row['parentId']
                    ),
                    'lang' => $data['lang']
                )
            );
            return $ret;
        }

    }
}