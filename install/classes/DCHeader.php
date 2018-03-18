<?php

class DCHeader {

    function header() {

        global $params;
        global $site;

        $return = '<meta charset="utf-8">';

        if ( isset( $params['error'] ) ) {

            $util = new DCUtil();
            $translate = $util->showTranslate(array('error') );
            $return .= '<title>' . $translate['error'] .  ' ' . $params['error']['responseCode'] . '</title>';
            $return .= '<link rel="stylesheet" type="text/css" href="/install/style.css" />';
            http_response_code( $params['error']['responseCode'] );
        }
        else {
            $return .= '<title>DominoCMS Install</title>';
            $return .= '<meta name="description" content="Install" />';
            $return .= '<meta name="keywords" content="CMS, open source, installer" />';
            $return .= '<meta name="generator" content="DominoCMS - Open Source Content Management System" />';
            $return .= '<meta name="author" content="DominoCMS" />';
            $return .= '<meta name="robots" content="NOINDEX, NOFOLLOW" />';
            $return .= '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />';
            $return .= '<link rel="stylesheet" type="text/css" href="/install/style.css" />';
            //$return .= '<link rel="icon" type="image/png" href="/install/favicon-16x16.png" sizes="16x16" />';

        }



        return $return;

    }
}