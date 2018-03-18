<?php

class DCParams {

    function params() {

        global $site;
        global $config;

        $util = new DCUtil();

        $params = array();


        $site['page']['views'] = array(
            'Domino.Installer.Welcome'
        );
        $site['meta'] = array(
            'title' => 'DominoCMS Install',
            'description' => ''
        );
        $site['url'] = '';
        $site['technology'] = array(
            'id' => 'DJS1-SF6-D1',
            'app' => 'DJS1',
            'template' => 'SF6',
            'model' => 'D1',
        );

        $site['lang'] = isset( $_GET["langl"] ) ? $_GET["lang"] : 'en';

        if (isset( $_GET["url"] ) ) {

            $url = trim( $_GET["url"] );
            $site['url'] = $url;
            if ( $url == 'Welcome' )
                $site['page']['views'] = array(
                    'Domino.Installer.Welcome'
                );
            else if ( $url == 'Success' )
                $site['page']['views'] = array(
                    'Domino.Installer.Success'
                );
            else
                $site['page']['views'] = array(
                    'Domino.Installer',
                    'Domino.Installer.'.$url
                );
                //$site['page']['views'][1] = 'Domino.AppInstall.Views.'.$url;

            $site['meta'] = array(
                'title' => $url. ' DominoCMS',
                'description' => ''

            );
        }


        return $params;
    }
}