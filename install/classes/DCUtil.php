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


}