<?php

    ##################################################################
    ### DominoCMS Open Source 1.0 alpha
    ##################################################################
    ###
    ###	(c) 2018 Domdesign, d. o. o.
    ### Created by Dominik Černelič
    ### www.dominocms.com
    ###
    ##################################################################
    ###	To know ten thousand things, know one well.
    ### Miyamoto Musashi


    error_reporting(E_ALL);
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    ini_set('max_execution_time', 30);

    session_start();
    try {

        $configFolder = __DIR__ . '/../../private/config/';
        $config = require_once( $configFolder ."config.php" );

        if ( !file_exists( $config['libRoot'] ) ) {
            $config['dominoAdminRoot'] = $_SERVER['DOCUMENT_ROOT'] . '/../web/lib/DJS1-SF6-D1/items/Domino/Admin/';
            $config['libRoot'] = $_SERVER['DOCUMENT_ROOT'] . '/../web/lib/';
        }

        require_once( $config['dominoAdminRoot'] . 'App/classes/DCInit.php' );

        $init = new DCInit();

        echo $init->init();


    } catch (\Exception $e) {
        echo $e->getMessage();
    }