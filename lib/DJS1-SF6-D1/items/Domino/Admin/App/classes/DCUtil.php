<?php

class DCUtil {

    public function dominoSql ( $query, $array='fetch_array' ) {

        $sql = mysql_query($query);
        if ( $sql !== FALSE ) {
            if ( $array == 'num_rows' )
                return mysql_num_rows($sql);
            else if ( $array == 'fetch_array' ) {
                $row = array();
                while ( $line = mysql_fetch_array( $sql, MYSQL_ASSOC ) )
                    $row[] = $line;
                return $row;
            }
            else if ( $array == 'fetch_one' ) {
                return mysql_fetch_assoc($sql);
            }
            else if ( $array == 'print' ) {
                return $sql;
            }
            else // array
                return true;
        }
        else
            return false;
    }
    public function identityPath ( $username ) {

        global $config;

        if ( $config['identityType'] == 0 ) // namespace
            $path = $username.'/';
        else { // id structure
            $IdentityId = sprintf("%012d", $username); // 000000000117
            $FolderArr = str_split($IdentityId, 3); // 0=>000 1=>000 2=>000 3=>117
            $path = implode("/",$FolderArr)."/"; // 000/000/000/117/
        }
        return $config['identitiesRoot'].$path;

    }
    public function writeFile($filename,$file){
        $file_temp = fopen( $filename, "w" );
        fwrite( $file_temp, $file);
        fclose( $file_temp );

    }
    public function moduleTable ( $developer, $module ) {
        return 'DC'.ucfirst($developer).ucfirst($module);
    }
    public function makeDir ( $dir ) {
        if ( !file_exists( $dir ) )
            mkdir(  $dir );
    }

    public function randomChar($string){
        return $string[mt_rand(0,(strlen($string)-1))];
    }

    public function randomString($length=62,$charset_string=null){
        if (!$charset_string) { $charset_string = "a10AbFcG4deSfghij9zZkUUlmDno2pqrsItLuPvEwCx9G0yz12Y346P45M6Q7W8909D8G7J6HRH54X321plsi"; }

        mt_srand((double)microtime()*1000000);
        $return_string = "";
        for($x=0;$x<$length;$x++) {
            $return_string .= $this->randomChar($charset_string);
        }
        return $return_string;
    }

    public function tableCreator( $db1, $table1, $db2, $table2 ) {
        $sql = "CREATE TABLE IF NOT EXISTS ".$db2.".".$table2." like ".$db1.".".$table1."";
        mysql_query($sql);
    }

    public function setUpdateCookie($name,$content) {
        if ( $name && $content ) {
            if ( isset( $_COOKIE[$name] ) )
                setcookie($name, $content, time() + (10 * 365 * 24 * 60 * 60),'/');
            else
                setcookie($name, $content, time() + (10 * 365 * 24 * 60 * 60),'/');
        }
        else if ( $name && !$content )
            setcookie($name, null, -1, '/');
    }
    public function unsetCookie($name) {
        if ( isset( $_COOKIE[$name] ) ) {
            unset($_COOKIE[$name]);
            setcookie($name, null, -1, '/');
        }
    }
    public function showCookie($name,$default="") {
        return ( isset( $_COOKIE[$name] ) ) ? $_COOKIE[$name] : $default;
    }

    public function dataEncode ($data) {
        $key = "AnaLovro";
        return base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $data, MCRYPT_MODE_CBC, md5(md5($key))));
    }
    public function dataDecode ($data) {
        $key = "AnaLovro";
        return rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($data), MCRYPT_MODE_CBC, md5(md5($key))), "\0");
    }
    public function sanitize ( $data ) {

        // source: https://stackoverflow.com/questions/1587695/sanitize-get-parameters-to-avoid-xss-and-other-attacks
        // $page = preg_replace('/[^-a-zA-Z0-9_]/', '', $data);
        return preg_replace('/\'\"/', '', $data);
    }
    public function scanFiles ( $dir, $orig='' ) {

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
    public function uniqueFilename( $data ) {

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

    public function copyFolder ( $source, $destination ) {

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
    function betterEval($code) {
        $tmp = tmpfile ();
        $tmpf = stream_get_meta_data ( $tmp );
        $tmpf = $tmpf ['uri'];
        fwrite ( $tmp, $code );
        $ret = require ( $tmpf );
        fclose ( $tmp );
        return $ret;
    }
    function csv_to_array( $filename="", $delimiter="," ){
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
}