<?php

class DCLibModulesDominoTranslate extends DCBaseController {

    public function showTranslate( $vars, $lang='') {

        global $config;
        global $site;

        $theLang = ( $lang ) ? $lang : $site['lang'];
        $arr = array();

        $util = new DCUtil();

        $varsNum = count( $vars );
        if ( $varsNum > 0 ) {
            $sqlVars = "";
            for ( $i = 0; $i < $varsNum; $i++ )
                $sqlVars .= " || id='".$vars[$i]."'";


            $customArray = array();
            $sqlExistsCustom = $util->dominoSql("select * FROM ".$config['db'].".DCDominoTranslations WHERE (". ltrim( $sqlVars, " || " ) .") AND lang='".$theLang."';", 'fetch_array');
            if ( $sqlExistsCustom ) {
                foreach ( $sqlExistsCustom AS $trans) {
                    $customArray[ $trans['id'] ] = $trans["name"];
                }
            }

            $trans_array = $util->dominoSql("select * FROM ".$config['db'].".DCDominoTranslations WHERE (". ltrim( $sqlVars, " || " ) .") AND lang='".$theLang."';", 'fetch_array');
            if( $trans_array ) {
                foreach ( $trans_array AS $trans) {
                    if ( array_key_exists( $trans['id'], $customArray )  )
                        $arr[ $trans['id'] ] = $customArray[$trans['id']];
                    else
                        $arr[ $trans['id'] ] = $trans["name"];
                }
            }
            else {
                $trans_array = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoTranslations WHERE (" . ltrim($sqlVars, " || ") . ") AND lang='" . $theLang . "';", 'fetch_array');
                if ($trans_array)
                    foreach ($trans_array AS $trans)
                        $arr[$trans['id']] = $trans["name"];
            }

            // set up empty array if it doesn't exist
            // TODO maybe in future do a fallback to default language
            $retArr = array();
            foreach ( $vars AS $var )  {

                if ( isset($arr[$var]) )
                    $retArr[$var] =  $arr[$var];
                else
                    $retArr[$var] =  '';
            }

        }
        return $retArr;
    }

}