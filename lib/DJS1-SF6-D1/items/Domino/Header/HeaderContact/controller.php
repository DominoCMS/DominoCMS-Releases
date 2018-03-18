<?php

class DominoHeaderHeaderContactController extends DCBaseController {

    function indexAction( $data ) {

        global $site;
        $util = new DCUtil();

        $entries = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoHeaderContact WHERE status=1 ORDER BY ordem ASC;", 'fetch_array');
        if ( $entries )
            foreach ( $entries AS &$entry ) {

                if ( $entry['type'] == 'langs' ) {

                    $entry['domain'] = $site['domain'];
                    $entry['langs'] = array();
                    $domains = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoIdentityDomains ORDER BY domain ASC;", 'fetch_array');
                    foreach ( $domains AS &$domain ) {

                        $entry['langs'][] = array(
                            'domain' => $domain['domain'],
                            'url' => $domain['protocol'].'://www.'.$domain['domain'],
                            'lang' => $domain['lang']
                        );
                    }

                }
            }
        $ret = array(
            'entries' => $entries
        );

        return $ret;
    }
}