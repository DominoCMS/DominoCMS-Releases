<?php

class DominoAdminFrontController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        global $site;
        $util = new DCUtil();

        $entries = array();

        $sql = $util->dominoSql( "select si.*,mt.name AS Name,ut.urlname AS Urlname,ut.urlpath AS Urlpath,mt.subtitle FROM ".$config['db'].".DCDominoAdminSiteIndex si LEFT JOIN ".$config['db'].".DCDominoAdminContent mt ON ( si.id = mt.id ) LEFT JOIN ".$config['db'].".DCDominoAdminSiteSlugs ut ON ( si.entry = ut.entry ) WHERE si.parent='Domino.AdminMenu.main' AND si.module='AdminContent' AND si.status=1 AND mt.lang='".$site['lang']."' AND ut.lang='".$site['lang']."' ORDER BY si.`order` ASC;",'fetch_array');
        if ( $sql )
            foreach ( $sql AS $row ) {

                $entries[] = array(
                    'name' => $row["Name"],
                    'link' => '/'. $config['dominoDir'].$site['lang'].$row["Urlpath"]."/".$row["Urlname"],
                    'icon' => 'html5_perfintegration',
                    'subtitle' => $row["subtitle"]
                );
            }

        return array(
            'entries' => $entries
        );

    }

}