<?php

class DominoAdminHeaderSearchController extends DCBaseController {

    function indexAction( $data ) {


        $translate = new DCLibModulesDominoTranslate();

        $ret = array(
            "trans" => $translate->showTranslate( array( 'search' ) )
        );

        return $ret;


    }
    function searchAction( $data ) {

        $util = new DCUtil();
        global $site;
        global $params;
        global $config;

        if ( $config['auth'] === true ) {

            $ret = array(
                'entries' => array()
            );

            $query = rtrim( ltrim( $data['query'] ) );
            $query = mysql_real_escape_string ($query);
            $strquery = $query;

            if( strlen( $query ) >= 2 ) {
                $query = str_replace("'", "\'", $query);

                $arr_words = explode(" ", $query);

                $websites_q = "";
                $user_name_q = "";
                $user_surname_q = "";
                $user_username_q = "";

                while (list($key, $val) = each($arr_words)) {
                    $websites_search_fields = " module LIKE '%$val%' AND ";
                    $user_name_fields = " title LIKE '%$val%' AND ";
                    $user_surname_fields = " surname LIKE '%$val%' AND ";
                    $user_username_fields = " username LIKE '%$val%' AND ";

                    if ($val <> " " && strlen($val) > 0) {
                        $websites_q .= $websites_search_fields;
                        $user_name_q .= $user_name_fields;
                        $user_surname_q .= $user_surname_fields;
                        $user_username_q .= $user_username_fields;
                    }
                }

                $websites_q = rtrim($websites_q, " AND");
                $user_name_q = "(" . rtrim($user_name_q, " AND") . ") OR ";
                $user_surname_q = "(" . rtrim($user_surname_q, " AND") . ") OR ";
                $user_username_q = "(" . rtrim($user_username_q, " AND") . ") ";

                // Modules
                $sql = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoModules WHERE " . $websites_q . " ORDER BY module ASC LIMIT 10;", 'fetch_array');


                if ( $sql )
                    foreach ( $sql AS $row ) {

                        $summary = $row["module"];
                        $name = $row["module"];
                        $linkvar = "/" . $row['module'];
                        $Category = "Modules";

                        $ret['entries'][] = array(
                            'summary' => $summary,
                            'name' => $name,
                            'link' => $linkvar,
                            'category' => $Category,
                        );
                    }

            }
            return $ret;
        }
    }

}