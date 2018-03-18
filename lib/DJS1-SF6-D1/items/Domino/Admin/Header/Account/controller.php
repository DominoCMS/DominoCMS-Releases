<?php

class DominoAdminHeaderAccountController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        global $user;
        global $site;

        $util = new DCUtil();

        $sql = $util->dominoSql( "select si.*,mt.name AS Name,ut.urlname AS Urlname,ut.urlpath AS Urlpath,mt.subtitle FROM ".$config['db'].".DCDominoAdminSiteIndex si LEFT JOIN ".$config['db'].".DCDominoAdminContent mt ON ( si.id = mt.id ) LEFT JOIN ".$config['db'].".DCDominoAdminSiteSlugs ut ON ( si.entry = ut.entry ) WHERE si.parent='Domino.AdminMenu.account' AND si.module='AdminContent' AND si.status=1 AND mt.lang='".$site['lang']."' AND ut.lang='".$site['lang']."' ORDER BY si.`order` ASC;",'fetch_array');
        if ( $sql )
            foreach ( $sql AS $row ) {

                $entries[] = array(
                    'id' => $row["id"],
                    'name' => $row["Name"],
                    'link' => '/'. $config['dominoDir'].$site['lang'].$row["Urlpath"]."/".$row["Urlname"],
                    'icon' => 'html5_perfintegration',
                    'subtitle' => $row["subtitle"]
                );
            }


        if ( $config['auth'] === true ) {

            $ret = array(
                'auth' => true,
                'auth_name' => $user['name'],
                'auth_surname' => $user['surname'],
                //'pic' => $pic,
                'entries' => $entries
            );

        }
        else
            $ret = array(
                'auth' => false
            );


        return $ret;

    }

}