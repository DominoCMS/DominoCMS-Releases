<?php

class DCHeader {

    function header() {

        global $params;
        global $config;

        $return = '<meta charset="utf-8">';

        if ( isset( $params['error'] ) ) {
            $return .= '<title>Error ' . $params['error']['responseCode'] . '</title>';
            $return .= '<link rel="stylesheet" type="text/css" href="/' . $config['dominoDir'] . 'style.css" />';
            http_response_code( $params['error']['responseCode'] );
        }
        else {
            $return .= '<title>DominoCMS</title>';
            $return .= '<meta name="description" content="Open Source CMS" />';
            $return .= '<meta name="generator" content="DominoCMS - Open Source Content Management System" />';
            $return .= '<meta name="author" content="DominoCMS" />';
            $return .= '<meta name="robots" content="NOINDEX, NOFOLLOW" />';
            $return .= '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />';
            $return .= '<link rel="icon" href="/' . $config['dominoDir'] . '"favicon.ico" type="image/x-icon" />';
            $return .= '<link rel="stylesheet" type="text/css" href="/' . $config['dominoDir'] . 'style.css" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="57x57" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-57x57.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-114x114.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-72x72.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-144x144.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="60x60" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-60x60.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="120x120" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-120x120.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="76x76" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-76x76.png" />';
            $return .= '<link rel="apple-touch-icon-precomposed" sizes="152x152" href="/' . $config['dominoDir'] . 'favicon/apple-touch-icon-152x152.png" />';
            $return .= '<link rel="icon" type="image/png" href="/' . $config['dominoDir'] . 'favicon/favicon-196x196.png" sizes="196x196" />';
            $return .= '<link rel="icon" type="image/png" href="/' . $config['dominoDir'] . 'favicon/favicon-96x96.png" sizes="96x96" />';
            $return .= '<link rel="icon" type="image/png" href="/' . $config['dominoDir'] . 'favicon/favicon-32x32.png" sizes="32x32" />';
            $return .= '<link rel="icon" type="image/png" href="/' . $config['dominoDir'] . 'favicon/favicon-16x16.png" sizes="16x16" />';
            $return .= '<link rel="icon" type="image/png" href="/' . $config['dominoDir'] . 'favicon/favicon-128.png" sizes="128x128" />';
            $return .= '<meta name="application-name" content="&nbsp;"/>';
            $return .= '<meta name="msapplication-TileColor" content="#FFFFFF" />';
            $return .= '<meta name="msapplication-TileImage" content="/' . $config['dominoDir'] . 'favicon/mstile-144x144.png" />';
            $return .= '<meta name="msapplication-square70x70logo" content="/' . $config['dominoDir'] . 'favicon/mstile-70x70.png" />';
            $return .= '<meta name="msapplication-square150x150logo" content="/' . $config['dominoDir'] . 'favicon/mstile-150x150.png" />';
            $return .= '<meta name="msapplication-wide310x150logo" content="/' . $config['dominoDir'] . 'favicon/mstile-310x150.png" />';
            $return .= '<meta name="msapplication-square310x310logo" content="/' . $config['dominoDir'] . 'favicon/mstile-310x310.png" />';
            $return .= '<!-- Chrome, Firefox OS and Opera --><meta name="theme-color" content="#1D71B8"><!-- Windows Phone --><meta name="msapplication-navbutton-color" content="#1D71B8"><!-- iOS Safari --><meta name="apple-mobile-web-app-status-bar-style" content="#1D71B8">';

        }

        return $return;

    }
}