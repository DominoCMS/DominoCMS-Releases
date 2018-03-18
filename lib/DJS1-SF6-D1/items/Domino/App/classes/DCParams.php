<?php
class DCParams {

    function params() {

        global $site;
        global $config;

        $util = new DCUtil();
        $translate = new DCLibModulesDominoTranslate();

        $params = array(
            'urlLang' => $site['urlLang'],
            'currentUrl' => '',
            'entryEdit' => false,
            'levels' => array()
        );

        if ( $site['page']['entryFront'] == $site['page']['entry'] ) {

            $keywordList = "";
            $keywords = $util->dominoSql("select keyword FROM " . $site['db'] . ".DCDominoKeywords mt JOIN " . $site['db'] . ".DCDominoSiteIndex si ON (mt.id = si.id) WHERE si.module='Keywords' AND mt.lang='".$site['lang']."' AND si.status=1 ORDER BY mt.keyword ASC;", 'fetch_array');
            if ( $keywords )
                foreach ( $keywords AS $keyword )
                    $keywordList .= $keyword["keyword"] . ",";

            $site['meta'] = array(
                'title' => $site['frontTitle'][$site['lang']],
                'description' => $site['frontDescription'][$site['lang']],
                'keywords' => rtrim( $keywordList, ",")
            );
        }

        $site['page']['parent'] = '';
        $site['ver'] = isset( $site['ver'] ) ? $site['ver'] : '';
        $site['protocol'] = isset( $site['protocol'] ) ? $site['protocol'] : 'http';
        $site['page']['parentDeveloper'] = '';
        $site['page']['parentModule'] = '';
        $site['page']['viewParent'] = '';
        $params['contentRootLevel'] = 0;

        $requestUriExp = explode( "?", $_SERVER['REQUEST_URI'] );
        $extraUri = (count($requestUriExp) > 1) ? end($requestUriExp) : '';

        if (isset( $_GET["url"] ) ) {

            $url = ltrim( mysql_real_escape_string( $_GET["url"] ), "/" );
            $urlArr = explode("/", $url);
            $keyLevel = count( $urlArr ) - 1;

            for ( $i = 0; $i <= $keyLevel; $i++ ) {

                $levelUrlname = $urlArr[$i];
                $params['currentUrl'] = $params['currentUrl'] . "/" . $levelUrlname;

                if (
                    ( ( $site['urlType'] == 'domino' ) && ( strlen( $levelUrlname ) == 2 ) ) ||
                    ( ( $site['urlType'] == 'lang' ) && ( $i == 0 ) ) ||
                    //( ( $site['urlType'] == 'noLangLang' ) && ( $i == 0 ) && ( strlen( $levelUrlname ) === 2 ) && ( $levelUrlname !== $site['lang'] ) )
                    ( ( $site['urlType'] == 'noLang' ) && ( $i == 0 ) && ( strlen( $levelUrlname ) === 2 ) && ( $levelUrlname !== $site['lang'] ) )
                ) {

                    if ( !array_key_exists ( $levelUrlname , $site['languages'] ) )
                        $params['error'] = array(
                            'view' => 'Domino.Error',
                            'responseCode' => 404,
                            'translate' => $translate->showTranslate( array( 'title', 'name' ) )
                        );
                    else {
                        if (($i != 0) && ($site['urlType'] == 'lang'))
                            $params['error'] = array(
                                'view' => 'Domino.Error',
                                'responseCode' => 404,
                                'translate' => $translate->showTranslate( array( 'title', 'name' ) )
                            );
                        if (($i > 1) && ($site['urlType'] == 'domino'))
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
                    if ( ( ( $levelType != 'identity' ) || ( $i > 0 ) ) ){ // && ( $site['page']['id'] != 9 )

                        $parentSql = ( $site['page']['entry'] != $site['page']['entryFront'] ) ? "d2.parent='".$site['page']['parent']."'" : "( d2.parent='".$site['page']['parent']."' || ( d2.parentDeveloper='Domino' AND d2.parentModule='Menu' ) )";

                        $line_key_page = $util->dominoSql("SELECT *,d2.entry FROM " . $site['db'] . ".DCDominoSiteSlugs d1 JOIN " . $site['db'] . ".DCDominoSiteIndex d2 ON (d1.entry = d2.entry) WHERE d1.urlname='" . $levelUrlname . "' AND ".$parentSql." AND d1.lang='".$site['lang']."' AND d2.status=1;",'fetch_one');

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

                            $meta = $util->dominoSql("select metaTitle,metaDescription,metaKeywords FROM " . $site['db'] . ".DC".$site['page']['developer'].$site['page']['module']." WHERE id='".$site['page']['id']."' AND lang='".$site['lang']."';", 'fetch_one');

                            $site['meta'] = array(
                                'title' => $site['frontTitle'][$site['lang']] . " - " . ( isset ( $meta['metaTitle'] ) ? ( $meta['metaTitle'] ? $meta['metaTitle'] : $line_key_page["name"] ) : $line_key_page["name"] ),
                                'description' => ( isset ( $meta['metaDescription'] ) ? ( $meta['metaDescription'] ? str_replace('"','',$meta['metaDescription']) : '' ) : '' ),
                                'keywords' => rtrim(( isset ( $meta['metaKeywords'] ) ? $meta['metaKeywords'] : '' ), ",")
                            );

                            $iconName = '';
                            if ( $line_key_page["icon"] ) {
                                $sql_icon = $util->dominoSql("select name FROM " . $config['db'] . ".DCDominoIcons WHERE name=" . $line_key_page["icon"] . ";", 'fetch_array');
                                if ( $sql_icon )
                                    $iconName = $sql_icon["name"];
                            }

                            $params['levels'][] = array(
                                'type' => $levelType,
                                'developer' => $site['page']['developer'],
                                'module' => $site['page']['module'],
                                'id' => $site['page']['id'],
                                'entry' => $line_key_page["entry"],
                                'title' => $site['page']['title'],
                                'icon' => $iconName,
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
                                $itemRoot = $config['libRoot'] . $site['technology']['id'] . 'items/'.$currentDeveloper.'/'.$currentItem.'/'.$currentSubitem;
                                $paramsFile = $itemRoot.'params.php';

                                // If params don't exist in library, check in SiteRoot/items
                                if ( !file_exists ( $paramsFile ) ) {
                                    $itemRoot = $config['identityRoot'] . 'items/'.$currentDeveloper.'/'.$currentItem.'/'.$currentSubitem;
                                    $paramsFile = $itemRoot.'params.php';
                                }
                            }

                            // If Params file exists either in Library or in identityRoot
                            if ( isset( $paramsFile ) )
                                if ( file_exists ( $paramsFile ) ) {
                                    require_once( $paramsFile );

                                    $paramsClass = str_replace('.','',$currentView).'Params';

                                    if ( class_exists( $paramsClass ) ) {

                                        $indexAction = new $paramsClass();
                                        $paramReturn = $indexAction -> levelAction( array() );
                                        if ( $paramReturn ) {

                                            foreach ( $paramReturn AS $pret )
                                                $params['levels'][] = $pret;

                                        }
                                    }
                                }
                        }
                        // PAGE REDIRECTS
                        else {

                            $addExtraUri = $extraUri ? "?" . $extraUri : "";

                            $redirect = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoPageRedirects WHERE urlSource='/" . $url . $addExtraUri . "' AND status=1;", 'fetch_one');
                            if ( $redirect ) {
                                if ( $redirect["urlRedirect"] )
                                    $redirPath = $redirect["urlRedirect"];
                                else {
                                    //$new_redirect = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoSiteIndex WHERE lang='".$site['lang']."' AND entry=".$redirect["entry"].";", 'fetch_array');
                                    //$redirPath = $params['urlLang'] . $new_redirect['urlpath'] . "/" . $new_redirect['urlname'];
                                    $redirPath = '/';
                                }

                                $params['error'] = array(
                                    'redirect' => $redirPath,
                                    'responseCode' => $redirect['responseCode'] ? $redirect['responseCode'] : 301,
                                    'translate' => $translate->showTranslate( array( 'title', 'name' ) )
                                );
                            }
                            else
                                $params['error'] = array(
                                    'view' => 'Domino.Error',
                                    'responseCode' => 404,
                                    'translate' => $translate->showTranslate( array( 'title', 'name' ) )
                                );
                        }
                    }
                }
            }
        }

        $params['currentUrlClean'] = $params['currentUrl'];
        if ( $extraUri )
            $params['currentUrl'] = $params['currentUrl'].'?'.$extraUri;
        $params['currentLevel'] = isset( $i ) ? $i - 1 : 0;


        $params['fullUrl'] = $site['protocol'].'://' . $_SERVER['HTTP_HOST'] . $params['currentUrl'];
        $params['rootUrl'] = $site['protocol'].'://' . $_SERVER['HTTP_HOST'];


        return $params;
    }
}