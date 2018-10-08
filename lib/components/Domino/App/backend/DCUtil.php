<?php

class DCUtil {

    function connectDb() {

        global $config;

        $config['con'] = new mysqli( $config['host'], $config['user'], $config['dbPass'], $config['db'] );

        $config['con'] ->set_charset("utf8");

        if (mysqli_connect_errno()) {
            printf("Connect failed: %s\n", mysqli_connect_error());
            exit();
        }

    }

    function getDb( $data, $debug = false ) {

        global $config;

        // TYPE
        $query = '';
        if ( isset( $data['type'] ) ) {

            if ( $data['type'] == 'select' )
                $query = 'SELECT';
            else if ( $data['type'] == 'update' )
                $query = 'UPDATE';
            else if ( $data['type'] == 'insert' )
                $query = 'INSERT';
            else if ( $data['type'] == 'delete' )
                $query = 'DELETE';
            else if ( $data['type'] == 'truncate' )
                $query = 'TRUNCATE';

        }

        // SELECT FIELDS
        if ( isset( $data['selectFields'] ) ) {

            // All
            if ( $data['selectFields'] == 'all' )
                $query .= ' *';
            // Custom
            else {

                $selFields = '';
                foreach( $data['selectFields'] AS $sel ) {

                    $selFields .= ',';

                    if ( isset( $sel['table'] ) )
                        $selFields .= '' . $sel['table'] . '.';

                    $field = $sel['field'] == 'all' ? '*' : '`' . $sel['field'] . '`';

                    $selFields .= $field;

                    if ( isset( $sel['as'] ) )
                        $selFields .= ' AS ' . $sel['as'];

                }
                $query .= ' ' . ltrim( $selFields, ',' );
            }
        }

        // FROM
        if ( isset( $data['from'] ) ) {

            $query .= ' FROM ';

            if ( isset($data['from']['table'] ) ) {

                if ( isset($data['from']['db'] ) )
                    $query .= '`' . $data['from']['db'] . '`.';

                $query .= '`' . $data['from']['table'] . '`';

            }
            else {

                foreach( $data['from'] AS $key => $val ) {

                    $query .= ' ';
                    if ( isset( $val['type'] ) ) {
                        if ( $val['type'] == 'join' )
                            $joinType = 'JOIN';
                        else if ( $val['type'] == 'innerJoin' )
                            $joinType = 'INNER JOIN';
                        else if ( $val['type'] == 'leftJoin' )
                            $joinType = 'LEFT JOIN';

                        $query .= $joinType . ' ';
                    }

                    $query .= '`' . $val['db'] . '`.`' . $val['table'] . '` ' . $key;

                    if (isset($val['on'])) {

                        $query .= ' ON ';

                        foreach ( $val['on'] AS $on ) {

                            if (isset($on['type']))
                                $query .= ' ' . $on['type'] . ' ';

                            $query .= '(';
                            $i = 0;
                            foreach ($on['fields'] AS $fieldKey => $fieldVal) {
                                if ($i++ == 1)
                                    $query .= ' = ';

                                $query .= '' . $fieldKey . '.`' . $fieldVal . '`';

                            }
                            $query .= ')';
                        }
                    }

                }
            }
        }

        // SET
        if (isset($data['set'])) {

            $set = '';
            foreach( $data['set'] AS $value )
                $set .= ',`' . $value['field'] . '`=`' . $value['value'] . '`';

            $query .= ' SET ' . ltrim( $set, ',' );

        }

        // INTO
        if (isset($data['into'])) {

            $keysArr = array();
            $valuesArr = array();
            foreach( $data['into'] AS $key => $val ) {
                $keysArr[] = $key;
                $valuesArr[] = $val;
            }

            $keys = '';
            foreach( $keysArr AS $key )
                $keys .= ',`' . $key . '`';

            $values = '';
            foreach( $valuesArr AS $value )
                $values .= ',`' . $value . '`';

            $query .= ' INTO (' . ltrim( $keys, ',' ) . ') VALUES (' . ltrim( $values, ',' ) . ')';

        }

        // WHERE
        if ( isset( $data['where'] ) ) {

            $where = '';
            if ( count($data['where']) > 0 )
                for( $i = 0; $i < count($data['where']); $i++ ) {
                    $arr = $data['where'][$i];


                    if ( $i != 0 )
                        $where .= ( isset( $arr['type'] ) ) ? ' ' . $arr['type'] . ' ' : ' AND ';

                    if (isset($arr['field'])) {

                        if (isset($arr['table']))
                            $where .= '' . $arr['table'] . '.';

                        $operator = isset($arr['operator']) ? $arr['operator'] : '=';
                        if ( $operator == 'like' )
                            $where .= '`' . $arr['field'] . '` LIKE \'%' . $arr['value'] . '%\'';
                        else
                            $where .= '`' . $arr['field'] . '` ' . $operator . ' \'' . $arr['value'] . '\'';

                    }

                    // second level
                    if ( isset( $arr['where'] ) ) {
                        $where .= '(';

                        for( $j = 0; $j < count($arr['where']); $j++ ) {
                            $subArr = $arr['where'][$j];

                            if ($j != 0)
                                $where .= ( isset( $subArr['type'] ) ) ? ' ' . $subArr['type'] . ' ' : ' AND ';

                            if (isset($subArr['field'])) {

                                if (isset($subArr['table']))
                                    $where .= '' . $subArr['table'] . '.';

                                $operator = isset($subArr['operator']) ? $subArr['operator'] : '=';
                                if ( $operator == 'like' )
                                    $where .= '`' . $subArr['field'] . '` LIKE \'%' . $subArr['value'] . '%\'';
                                else
                                    $where .= '`' . $subArr['field'] . '` ' . $operator . ' \'' . $subArr['value'] . '\'';

                            }
                        }
                        $where .= ')';
                    }

                }

            if ( $where )
                $query .= ' WHERE ' . $where . '';

        }

        if (isset($data['group'])) {


            if ( isset( $data['group']['field'] ) ) {

                $table = ( isset( $data['group']['table'] ) ) ? $data['group']['table'].'.' : '';
                $query .= ' GROUP BY '.$table.'`' . $data['group']['field'].'`';
            }



        }

        // ORDER
        if (isset($data['order'])) {

            $order = '';
            foreach ( $data['order'] AS $ord ) {
                if ( isset( $ord['field'] ) && isset( $ord['sort'] ) ) {

                    $order .= ',';
                    if ( isset( $ord['table'] ) )
                        $order .= '' . $ord['table'] . '.';

                    $order .= '`' . $ord['field'] . '` ' . $ord['sort'];

                }
                else if ( isset( $ord['fields'] ) && isset( $ord['sort'] ) ) {

                    $ordFld = '';
                    foreach ( $ord['fields'] AS $fld ) {

                        if ( isset( $fld['table'] ) )
                            $ordFld .= $fld['table'] . '.';

                        $ordFld .= '`' . $fld['field'] . '`,';

                    }

                    $order .= rtrim( $ordFld, ',' ) . ' ' . $ord['sort'];
                }
            }

            $query .= ' ORDER BY ' . ltrim( $order, ',' );
        }

        // LIMIT
        if ( isset( $data['limit'] ) ) {
            if ( is_numeric( $data['limit'] ) )
                $query .= ' LIMIT ' . $data['limit'];

            if ( isset( $data['offset'] ) )
                if ( is_numeric( $data['offset'] ) )
                    $query .= ' OFFSET ' . $data['offset'];
        }

        //print $query.'\n';

        // QUERY
        if ( $debug )
            return $query;
        $sql = mysqli_query( $config['con'], $query );
        if ( $sql !== FALSE ) {
            if ( isset( $data['result'] ) ) {
                if ( $data['result'] == 'num_rows' )
                    return mysqli_num_rows( $sql );
                else if ( $data['result'] == 'fetch_array' ) {
                    $row = array();
                    while ( $line = mysqli_fetch_array( $sql, MYSQLI_ASSOC ) )
                        $row[] = $line;
                    return $row;
                }
                else if ( $data['result'] == 'fetch_one' )
                    return mysqli_fetch_assoc( $sql );
                else
                    return true;
            }
            else
                return TRUE;
        }
        else {
            // Return error only in debug mode - we need false otherwise
            if ( isset( $data['debug'] ) )
                return "Error: " . $sql . "<br>" . mysqli_error($config['con']);
            else
                return FALSE;
        }


    }

    function csv_to_array( $filename="", $delimiter="," ) {

        if(!file_exists($filename) || !is_readable($filename))
            return FALSE;

        $header = NULL;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== FALSE)
        {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
            {
                if( !$header )
                    $header = $row;
                else
                    $data[] = array_combine($header, $row);
            }
            fclose($handle);
        }
        return $data;
    }

    function moduleTable( $developer, $module ) {

        return 'DC'. ucfirst( $developer ) . ucfirst( $module );
    }

    function makeDir( $dir ) {

        if ( !file_exists( $dir ) )
            mkdir( $dir );
    }

    function randomChar( $string ) {

        return $string[mt_rand(0,(strlen($string)-1))];
    }

    function randomString( $length=62, $charset_string = null ) {

        if (!$charset_string) { $charset_string = "a10AbFcG4deSfghij9zZkUUlmDno2pqrsItLuPvEwCx9G0yz12Y346P45M6Q7W8909D8G7J6HRH54X321plsi"; }

        mt_srand((double)microtime()*1000000);
        $return_string = "";
        for($x=0;$x<$length;$x++) {
            $return_string .= $this->randomChar($charset_string);
        }
        return $return_string;
    }

    function setUpdateCookie( $name, $content ) {

        if ( $name && $content ) {
            if ( isset( $_COOKIE[$name] ) )
                setcookie($name, $content, time() + (10 * 365 * 24 * 60 * 60),'/');
            else
                setcookie($name, $content, time() + (10 * 365 * 24 * 60 * 60),'/');
        }
        else if ( $name && !$content )
            setcookie($name, null, -1, '/');
    }

    function unsetCookie( $name ) {

        if ( isset( $_COOKIE[$name] ) ) {
            unset($_COOKIE[$name]);
            setcookie($name, null, -1, '/');
        }
    }

    function showCookie( $name, $default = "" ) {

        return ( isset( $_COOKIE[$name] ) ) ? $_COOKIE[$name] : $default;
    }

    function dataEncode( $data ) {

        global $config;

        $val = openssl_encrypt( $data , "AES-256-CFB" , $config['salt'] , OPENSSL_RAW_DATA, 'krnekikrneki1234');

        return  rtrim(  str_replace('/','_', base64_encode( $val ) ) );


    }

    function dataDecode( $data ) {

        global $config;

        $val = base64_decode( str_replace('_','/', $data ) );

        return openssl_decrypt( $data , "AES-256-CFB" , $config['salt'] , OPENSSL_RAW_DATA, 'krnekikrneki1234');

    }

    function sanitize( $data ) {

        return preg_replace('/\'\"/', '', $data);
    }

    function displayUrl( $url ) {

        // Source: https://stackoverflow.com/questions/16027102/get-domain-name-from-full-url
        $pieces = parse_url( $url );
        $domain = isset($pieces['host']) ? $pieces['host'] : $pieces['path'];
        if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $regs)) {
            return $regs['domain'];
        }
        return false;
    }

    function siteUrl( $data ) {

        global $site;

        $util = new DCUtil();

        if ( is_array( $data ) )
            $entry = $data['entry'];
        else
            $entry = $data;

        $row = $util->dominoSql("select ut.urlname AS Urlname,ut.urlpath AS Urlpath FROM ".$site['db'].".DCDominoSiteIndex si LEFT JOIN ".$site['db'].".DCDominoContent mt ON ( si.id = mt.id ) LEFT JOIN ".$site['db'].".DCDominoSiteSlugs ut ON ( si.entry = ut.entry )  WHERE si.entry='".$entry."' AND si.status=1 AND si.privacy=0 AND mt.lang='".$site['lang']."' AND ut.lang='".$site['lang']."' AND ut.name!='';",'fetch_one');
        if ( $row )
            return $site['urlLang'].$row["Urlpath"]."/".$row["Urlname"];
        else return false;

    }

    function scanFiles( $dir, $orig = '' ) {

        $orig = ( $orig == "" ) ? $dir : $orig;
        $dir = rtrim( $dir, '/' );
        if ( is_dir($dir)) {
            $allFiles = scandir($dir);
            $files = array_diff($allFiles, array('.', '..'));
            $ret = array();

            foreach ($files AS $file) {

                $newFile = $dir . '/' . $file;
                //print $newFile."\r";

                $ret[] = str_replace($orig, '', $newFile);

                if (is_dir($newFile)) {

                    $sub = $this->scanFiles($newFile, $orig);

                    foreach ($sub as $subfile) {
                        $newSubFile = str_replace($orig, '', $subfile);
                        //print "::: ".$newSubFile."\r";
                        $ret[] = $newSubFile;

                    }

                }

            }

            return $ret;
        }

    }

    function urlNameGen( $url ) {

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

    function uniqueUrlname( $data ) {

        $util = new DCUtil();

        $row = $util->dominoSql("select si.* FROM ".$data["db"].".DCDominoSiteIndex si JOIN ".$data["db"].".DCDominoSiteSlugs ut ON ( si.indexId = ut.indexId ) WHERE ut.urlname='".$data["newUrlname"]."' AND ut.lang='".$data["lang"]."' AND si.developer='".$data["developer"]."' AND si.module='".$data["module"]."' AND si.id!='".$data["id"]."' AND si.parent='".$data['parent']."' AND ut.lang='".$data['lang']."' AND si.status<2;",'fetch_one');
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

    function uniqueFilename( $data ) {

        $util = new DCUtil();

        $row = $util->dominoSql("select * FROM ".$data["db"].".DCDominoSiteIndex si JOIN ".$data["db"].".DC".$data['developer'].$data['module']." mt ON ( si.id = mt.id ) WHERE mt.filename='".$data["newFilename"]."' AND mt.lang='".$data["lang"]."' AND si.developer='".$data["developer"]."' AND si.module='".$data["module"]."' AND si.id!='".$data["id"]."' AND si.status<2;",'fetch_one');
        if ( $row )
            return $this->uniqueFilename(
                array (
                    'db' => $data["db"],
                    'lang' => $data["lang"],
                    'filename' => $data["filename"],
                    'newFilename' => $data["filename"]."-".$data["level"],
                    'level' => ( $data["level"] + 1 ),
                    'developer' => $row['developer'],
                    'module' => $row['module'],
                    'id' => $row['id']
                )
            );
        else
            return $data["newFilename"];

    }

    function urlPath( $data ) {

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

    function urlBackTrack( $data ) {

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

    function displayPic( $arr ) {

        global $config;
        global $site;

        $util = new DCUtil();

        if ( isset( $arr["id"] ) ) {

            $path = isset( $arr["path"] ) ? $arr["path"] : '';
            $absPath = isset( $arr["path"] ) ? $arr["path"] : '';
            $widthHeight = "";
            $landscape = "";

            $host = '';
            if ( isset( $arr["host"] ) )
                $host = rtrim($arr["host"],'/');

            if ( isset( $arr["domain"] ) )
                $siteDomain = $arr["domain"];
            else
                $siteDomain = $site['domain'];

            /*if ( isset( $arr["db"] ) ) {
                $siteDb = $arr["db"];
                $siteRoot = $site['root'];
            }
            else*/
            if ( isset( $arr["db"] ) && isset( $arr["root"] ) ) {
                $siteDb = $arr["db"];
                $siteRoot = $arr["root"];
            }
            else {
                $siteDb = $site['db'];
                $siteRoot = $site['root'];
            }

            $lang = isset( $arr["lang"] ) ? $arr["lang"] : $site['lang'];

            $id = $arr['id'];
            if ( isset( $arr["developer"] ) && isset( $arr["module"] )) {
                $developer = $arr["developer"];
                $module = $arr["module"];
            }
            else {
                $developer = 'Domino';
                $module = 'Pictures';
            }

            $row = $util->dominoSql("select * FROM ".$siteDb.".DCDominoSiteIndex si JOIN ".$siteDb.".DC".$developer.$module." mt ON ( si.id = mt.id ) WHERE si.developer='".$developer."' AND si.module='".$module."' AND mt.id='".$arr['id']."' AND mt.lang='".$lang."';",'fetch_one');
            if ( !$row )
                $row = $util->dominoSql("select * FROM ".$siteDb.".DCDominoSiteIndex si JOIN ".$siteDb.".DC".$developer.$module." mt ON ( si.id = mt.id ) WHERE si.developer='".$developer."' AND si.module='".$module."' AND mt.id='".$arr['id']."' AND mt.lang='sl';",'fetch_one'); //".key($site['frontTitle'])."

            if ( $row ) {

                $originalFile = $siteRoot."modules/".$developer."/".$module."/".$arr["id"].".".$row["fileExt"];

                $folderPath = $siteDomain."/modules/".$developer."/".$module."/";
                $rootFilename = $config['domainsRoot'].$folderPath.$row["filename"].".".$row["fileExt"];
                $folderPathOut = 'domains/'.$siteDomain."/modules/".$developer."/".$module."/";

                /*if ( $line_module["photographer"] != 0 ) {
                    $sql_author = "select name_".$LangId." AS Name,link FROM x_".$NewDb.".m_224 WHERE id=".$line_module["photographer"].";";
                    $result_author = mysql_query($sql_author);
                    $line_author = mysql_fetch_array($result_author, MYSQL_ASSOC);
                    $photographer = array(
                        "name" => $line_author["Name"],
                        "link" => $line_author["link"]
                    );
                }
                else
                    $photographer = "";*/

                if ( file_exists ( $originalFile ) ) {

                    if ( !file_exists( $rootFilename ) )
                        link($originalFile, $rootFilename);

                    /*if ( $line_module["ordem"] == 1 ) {

                        if ( file_exists( $RootFilename ) )
                            unlink ($RootFilename);
                        link($OriginalFile, $RootFilename);

                        foreach (glob($AbsPath.$FolderPath.$PicUrlName."_*") as $filenameDel)
                            unlink($filenameDel);

                        $sql_update = "UPDATE x_".$NewDb.".m_".$ModuleId." SET ordem=0 WHERE id=".$Arr["id"].";";
                        mysql_query($sql_update);
                    }*/

                    if ( isset ( $arr["height"] ) || isset ( $arr["width"] ) ) {

                        $width = isset ( $arr["width"] ) ? $arr["width"] : "";
                        $height = isset ( $arr["height"] ) ? $arr["height"] : "";

                        if ( $height && $width )
                            $widthHeight = "_".$width."x".$height;
                        else {
                            if ( $width )
                                $widthHeight = "_w".$width;
                            else
                                $widthHeight = "_h".$height;
                        }

                        list($width_orig, $height_orig) = getimagesize($originalFile);

                        $landscape = ( $width_orig >= $height_orig ) ? true : false;

                        $filenameThumb = $config['domainsRoot'].$folderPath.$row["filename"].$widthHeight.".".$row["fileExt"];

                        if ( file_exists( $originalFile ) )
                            if ( !file_exists( $filenameThumb ) ) {

                                /*$FileContents = file_get_contents($OriginalFile, true);
                                if (!get_magic_quotes_gpc())
                                        $FileContents = addslashes($FileContents);*/

                                ##################################################################
                                ### Create resized picture or cut a thumb
                                ##################################################################

                                if ( $height && $width ){

                                    $ratio_w = $width_orig / $width;
                                    $ratio_h = $height_orig / $height;


                                    if ( $ratio_h < $ratio_w ) {
                                        $ResHeight = ( $width / $width_orig ) * $height_orig;
                                        $ResWidth = $width;
                                    }
                                    else if ( $ratio_h == $ratio_w ) {
                                        if ( $height_orig >= $width_orig ) {
                                            $ResHeight = ( $width / $width_orig ) * $height_orig;
                                            $ResWidth = $width;
                                        }
                                        else {
                                            $ResWidth = ( $height / $height_orig ) * $width_orig;
                                            $ResHeight = $height;
                                        }
                                    }
                                    else {
                                        $ResWidth = ( $height / $height_orig ) * $width_orig;
                                        $ResHeight = $height;
                                    }
                                    $PosX = - ( ( $ResWidth - $width ) / 2 );
                                    $PosY = - ( ( $ResHeight - $height ) / 2 );

                                } else {

                                    if ( $width ){
                                        $ResHeight = ( $width / $width_orig ) * $height_orig;
                                        $ResWidth = $width;
                                    } else {
                                        $ResWidth = ( $height / $height_orig ) * $width_orig;
                                        $ResHeight = $height;
                                    }
                                    $PosX = 0;
                                    $PosY = 0;
                                }
                                $PicNew = imagecreatetruecolor( $ResWidth, $ResHeight );

                                if ( $row['fileExt'] == "png" ) {
                                    imagealphablending($PicNew, false);
                                    imagesavealpha($PicNew,true);
                                    $transparent = imagecolorallocatealpha($PicNew, 255, 255, 255, 127);
                                    imagefilledrectangle($PicNew, 0, 0, $ResWidth, $ResHeight, $transparent);
                                    $PicOrig = imagecreatefrompng( $originalFile );

                                }
                                else if ( $row['fileExt'] == "jpg" )
                                    $PicOrig = imagecreatefromjpeg($originalFile);
                                else if ( $row['fileExt'] == "jpeg" )
                                    $PicOrig = imagecreatefromjpeg($originalFile);
                                else if ( $row['fileExt'] == "gif" )
                                    $PicOrig = imagecreatefromgif($originalFile);

                                imagecopyresampled($PicNew, $PicOrig, $PosX, $PosY, 0, 0, $ResWidth, $ResHeight, $width_orig, $height_orig);

                                if ( $row['fileExt'] == "png" )
                                    ImagePng ( $PicNew, $filenameThumb , 8 );
                                else if ( $row['fileExt'] == "jpg" )
                                    ImageJpeg ( $PicNew, $filenameThumb , 90 );
                                else if ( $row['fileExt'] == "jpeg" )
                                    ImageJpeg ( $PicNew, $filenameThumb , 90 );
                                else if ( $row['fileExt'] == "gif" )
                                    ImageGif ( $PicNew, $filenameThumb , 90 );

                                ImageDestroy ( $PicOrig );
                                ImageDestroy ( $PicNew );

                            }
                    }

                    $filename = $host."/".$folderPathOut.$row["filename"].$widthHeight.".".$row["fileExt"];
                    $original = $host."/".$folderPathOut.$row["filename"].".".$row["fileExt"];

                    $dateCreated = '';
                    if (isset($row["dateCreated"]))
                        $dateCreated = $row["dateCreated"] ? '?i='.$row["dateCreated"] : '';


                    return array (
                        "id" => $row["id"],
                        "filename" => $filename.$dateCreated,
                        "filenameOrig" =>  $row["filename"].$dateCreated,
                        "original" => $original,
                        "alt" => $row["name"]." (".$row["id"].")",
                        "bg_pos_x" => isset ( $row["bgPosX"] ) ? $row["bgPosX"] : '',
                        "bg_pos_y" => isset ( $row["bgPosY"] ) ? $row["bgPosY"] : '',
                        //"photographer" => $photographer,
                        "landscape" => $landscape
                    );
                }
            }
        }
        else
            return array (
                "id" => 0,
                "filename" => '',
                "filenameOrig" =>  '',
                "original" => '',
                "alt" => '',
                "bg_pos_x" => '',
                "bg_pos_y" => '',
                //"photographer" => '',
                "landscape" => ''
            );

    }

    function copyFolder( $source, $destination ) {

        print $source;

        print $destination;

        $util = new DCUtil();

        $files = $util->scanFiles( $source );

        $util->makeDir( $destination );

        $copy = array();

        //print_r($files);

        foreach ( $files as $file ) {
            if (in_array($file, array(".",".."))) continue;

            // If we copied this successfully, mark it for deletion
            $copy[] = $destination.$file;
            if ( !is_dir( $source.$file ) )
                copy($source.$file, $destination.$file);
            else {
                $util->makeDir( $destination . $file );
            }
        }

        return $copy;

    }

    function betterEval( $code ) {
        $tmp = tmpfile ();
        $tmpf = stream_get_meta_data ( $tmp );
        $tmpf = $tmpf ['uri'];
        fwrite ( $tmp, $code );
        $ret = require ( $tmpf );
        fclose ( $tmp );
        return $ret;
    }

    function writeFile( $filename, $file ) {

        $file_temp = fopen( $filename, "w" );
        fwrite( $file_temp, $file);
        fclose( $file_temp );

    }

}