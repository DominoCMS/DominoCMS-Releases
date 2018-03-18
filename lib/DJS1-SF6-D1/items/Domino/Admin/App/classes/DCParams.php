<?php

class DCParams {

    function params() {

        global $site;
        global $config;

        $util = new DCUtil();
        $translate = new DCLibModulesDominoTranslate();

        $params = array(
            'urlLang' => '', //$site['urlLang'],
            'currentUrl' => '/domino',
            'currentUrlClean' => '/domino',
            'entryEdit' => false,
            'levels' => array(),
            'currentLevel' => 0
        );

        $params['contentRootLevel'] = 0;
        $site['db'] = $config['db'];
        $site['meta'] = array(
            'title' => 'DominoCMS',
            'description' => 'Open Source CMS'
        );

        $requestUriExp = explode( "?", $_SERVER['REQUEST_URI'] );
        $extraUri = (count($requestUriExp) > 1) ? end($requestUriExp) : '';


        if ( isset( $_GET["url"] ) ) {

            $url = ltrim( mysql_real_escape_string( $_GET["url"] ), "/" );
            $urlArr = explode("/", $url);
            $keyLevel = count( $urlArr ) - 1;

            for ( $i = 0; $i <= $keyLevel; $i++ ) {

                $levelUrlname = $urlArr[$i];
                $params['currentUrlClean'] = $params['currentUrl'] . "/" . $levelUrlname;
                $params['currentUrl'] = $params['currentUrl'] . "/" . $levelUrlname;
                $params['currentLevel'] = $params['currentLevel'] + $i;

                if ( strlen( $levelUrlname ) == 2 ) {

                    if ( !array_key_exists ( $levelUrlname , $site['languages'] ) )
                        $params['error'] = array(
                            'view' => 'Domino.Error',
                            'responseCode' => 404,
                            'translate' => $translate->showTranslate( array( 'title', 'name' ) )
                        );
                    else {

                        if ( $i > 1 )
                            $params['error'] = array(
                                'view' => 'Domino.Error',
                                'responseCode' => 404,
                                'translate' => $translate->showTranslate( array( 'title', 'name' ) )
                            );

                        $site['lang'] = $site['languages'][$levelUrlname]['iso6391'];
                        $params['urlLang'] = "/" . $levelUrlname;
                        $params['contentRootLevel'] = 1;
                        $levelType = 'lang';
                        $params['levels'][] = array(
                            'type' => $levelType,
                            'id' => '',
                            'entry' => '',
                            'title' => $levelUrlname,
                            'icon' => '',
                            'urlname' => $levelUrlname,
                            'url' => $params['currentUrl']
                        );
                    }
                }
                else {

                    $levelType = 'text';

                    // content
                    if ( $i > 0 ){

                        $parentSql = ( $site['page']['entry'] != $site['page']['entryFront'] ) ? "si.parent='".$site['page']['parent']."'" : "( si.parent='".$site['page']['parent']."' || ( si.parentDeveloper='Domino' AND si.parentModule='AdminMenu' ) )";

                        $line_key_page = $util->dominoSql( "SELECT *,si.entry FROM " . $config['db'] . ".DCDominoAdminSiteSlugs st JOIN " . $config['db'] . ".DCDominoAdminSiteIndex si ON (st.entry = si.entry) WHERE st.urlname='" . $levelUrlname . "' AND ".$parentSql." AND st.lang='".$site['lang']."' AND si.status=1;",'fetch_one');
//print "SELECT *,si.entry FROM " . $config['db'] . ".DCDominoAdminSiteSlugs st JOIN " . $config['db'] . ".DCDominoAdminSiteIndex si ON (st.entry = si.entry) WHERE st.urlname='" . $levelUrlname . "' AND ".$parentSql." AND st.lang='".$site['lang']."' AND si.status=1;";
                        if ( $line_key_page ) {

                            $site['page']['developer'] = $line_key_page["developer"];
                            $site['page']['module'] = $line_key_page["module"];
                            $site['page']['id'] = $line_key_page["id"];
                            $site['page']['entry'] = $line_key_page["entry"];
                            $site['page']['privacy'] = $line_key_page["privacy"];
                            $site['page']['status'] = $line_key_page["status"];
                            $site['page']['parentDeveloper'] = $line_key_page["parentDeveloper"];
                            $site['page']['parentModule'] = $line_key_page["parentModule"];
                            $site['page']['parentId'] = $line_key_page["parentId"];
                            $site['page']['title'] = $line_key_page["name"];
                            $site['page']['views'] = explode( ',', $line_key_page["views"] );
                            $site['page']['parent'] = $line_key_page["developer"].'.'.$line_key_page["module"].'.'.$line_key_page["id"];
                            $site['page']['viewParent'] = '';

                            if ( $i == $keyLevel ) {

                                $str = end( $site['page']['views'] );
                                preg_match_all("/\[(.*)\]/", $str , $matches);

                                if ( isset( $matches[1][0] ) ) {

                                    $site['page']['viewParent'] = $matches[1][0];
                                    $ex = explode('[', $str );
                                    $site['page']['views'][1] = $ex[0];
                                }

                            }

                            /*$site['meta'] = array(
                                'title' => $site['frontTitle'][$site['lang']] . " - " . ( isset ( $meta['metaTitle'] ) ? ( $meta['metaTitle'] ? $meta['metaTitle'] : $line_key_page["name"] ) : $line_key_page["name"] ),
                                'description' => ( isset ( $meta['metaDescription'] ) ? ( $meta['metaDescription'] ? str_replace('"','',$meta['metaDescription']) : '' ) : '' )
                            );*/

                            $params['levels'][] = array(
                                'type' => $levelType,
                                'developer' => $site['page']['developer'],
                                'module' => $site['page']['module'],
                                'id' => $site['page']['id'],
                                'entry' => $line_key_page["entry"],
                                'title' => $site['page']['title'],
                                'icon' => '',
                                'urlname' => $levelUrlname,
                                'url' => $params['currentUrl']
                            );

                            $currentView = end($site['page']['views']);
                            $currentItemArr = explode('.',$currentView);
                            $currentItem = end($currentItemArr);
                            $viewItemPath = str_replace('.','/',$currentView);


                            $currentDeveloper = $currentItemArr[0];
                            if ( isset( $currentItemArr[1] ) ) {
                                $currentItem = $currentItemArr[1];
                                $currentSubitem = '';
                                if ( count($currentItemArr) > 2 )
                                    for ( $n = 2; $n < count($currentItemArr); $n++ )
                                        $currentSubitem .= $currentItemArr[$n] . '/';

                                // First check in Library
                                $itemRoot = $config['libRoot'] . $site['technology']['id'] . '/items/'.$currentDeveloper.'/'.$currentItem.'/'.$currentSubitem;
                                $paramsFile = $itemRoot.'params.php';

                            }

                            // If Params file exists either in Library or in SiteRoot/items
                            if ( isset( $paramsFile ) )
                                if ( file_exists ( $paramsFile ) ) {
                                    require_once( $paramsFile );

                                    $paramsClass = str_replace('.','',$currentView).'Params';

                                    if ( class_exists( $paramsClass ) ) {

                                        $indexAction = new $paramsClass();
                                        $paramReturn = $indexAction -> levelAction( $params );
                                        if ( $paramReturn ) {

                                            foreach ( $paramReturn AS $pret )
                                                $params['levels'][] = $pret;

                                        }

                                    }

                                }

                        }
                    }
                }
            }
        }
        $params['currentUrlClean'] = $params['currentUrl'];
        if ( $extraUri )
            $params['currentUrl'] = $params['currentUrl'].'?'.$extraUri;


        return $params;
    }
}