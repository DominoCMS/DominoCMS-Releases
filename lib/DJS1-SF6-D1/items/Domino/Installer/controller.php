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