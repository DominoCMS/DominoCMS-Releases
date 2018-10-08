<?php

class DCHeader {

    function header() {

        global $params;
        global $site;

        $return = '<meta charset="utf-8">';

        if ( isset( $params['error'] ) ) {

            $util = new DCUtil();
            $translate = new DCLibModulesDominoTranslate();
            $translate = $translate->showTranslate(array('error') );
            $return .= '<title>' . $translate['error'] .  ' ' . $params['error']['responseCode'] . '</title>';
            $return .= '<link rel="stylesheet" type="text/css" href="/' . $site['domainRoot'] . 'style.css" />';
            http_response_code( $params['error']['responseCode'] );

        }
        else {
            $return .= '<title>' . $site['meta']['title'] . '</title>';

            if ( $site['meta']['description'] )
                $return .= '<meta name="description" content="' . $site['meta']['description'] . '" />';

            if ( $site['meta']['keywords'] )
                $return .= '<meta name="keywords" content="' . $site['meta']['keywords'] . '" />';

            $return .= '<meta name="generator" content="DominoCMS - Open Source Content Management System" />';

            $return .= '<meta name="author" content="' . $site['author'][$site['lang']] . '" />';
            $return .= '<meta name="robots" content="' . $site['robots'] . '" />';

            $return .= '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />';
            $return .= '<link rel="stylesheet" type="text/css" href="/' . $site['domainRoot'] . 'style.css?v=' . $site['version']['css'] . '" />';
            $return .= '<link rel="icon" href="/' . $site['domainRoot'] . 'favicon.ico">';

            if ( file_exists( $site['domainRoot'] . 'favicon/favicon-196x196.png' ) ) {

                $return .= '<link rel="apple-touch-icon-precomposed" sizes="57x57" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-57x57.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-114x114.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-72x72.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-144x144.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="60x60" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-60x60.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="120x120" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-120x120.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="76x76" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-76x76.png" />';
                $return .= '<link rel="apple-touch-icon-precomposed" sizes="152x152" href="/' . $site['domainRoot'] . 'favicon/apple-touch-icon-152x152.png" />';
                $return .= '<link rel="icon" type="image/png" href="/' . $site['domainRoot'] . 'favicon/favicon-196x196.png" sizes="196x196" />';
                $return .= '<link rel="icon" type="image/png" href="/' . $site['domainRoot'] . 'favicon/favicon-96x96.png" sizes="96x96" />';
                $return .= '<link rel="icon" type="image/png" href="/' . $site['domainRoot'] . 'favicon/favicon-32x32.png" sizes="32x32" />';
                $return .= '<link rel="icon" type="image/png" href="/' . $site['domainRoot'] . 'favicon/favicon-16x16.png" sizes="16x16" />';
                $return .= '<link rel="icon" type="image/png" href="/' . $site['domainRoot'] . 'favicon/favicon-128.png" sizes="128x128" />';
                $return .= '<meta name="application-name" content="&nbsp;" />';
                $return .= '<meta name="msapplication-TileColor" content="#FFF" />';
                $return .= '<meta name="msapplication-TileImage" content="/' . $site['domainRoot'] . 'favicon/mstile-144x144.png" />';
                $return .= '<meta name="msapplication-square70x70logo" content="/' . $site['domainRoot'] . 'favicon/mstile-70x70.png" />';
                $return .= '<meta name="msapplication-square150x150logo" content="/' . $site['domainRoot'] . 'favicon/mstile-150x150.png" />';
                $return .= '<meta name="msapplication-wide310x150logo" content="/' . $site['domainRoot'] . 'favicon/mstile-310x150.png" />';
                $return .= '<meta name="msapplication-square310x310logo" content="/' . $site['domainRoot'] . 'favicon/mstile-310x310.png" />';
            }

            if ( isset( $site['google']['verification'] ) )
                $return .= '<meta name="google-site-verification" content="' . $site['google']['verification'] . '" />';

            if ( isset( $site['themeColor'] ) )
                $return .= '<!-- Chrome, Firefox OS and Opera --><meta name="theme-color" content="' . $site['themeColor'] . '"><!-- Windows Phone --><meta name="msapplication-navbutton-color" content="' . $site['themeColor'] . '"><!-- iOS Safari --><meta name="apple-mobile-web-app-status-bar-style" content="' . $site['themeColor'] . '">';

        }

        // Redirect to anywhere
        if ( isset( $params['redirect'] ) )
            header("location: " . $params['redirect']);

        return $return;

    }
}