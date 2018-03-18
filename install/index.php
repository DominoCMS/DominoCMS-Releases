<?php

    ##################################################################
    ### DominoCMS Open Source 1.0 Installer
    ##################################################################
    ###
    ###	(c) 2018 Domdesign, d. o. o.
    ### Created by Dominik Černelič
    ### www.dominocms.com
    ###
    ##################################################################
    ###	To know ten thousand things, know one well.
    ### Miyamoto Musashi
    ###
    ### v 1.0.0 b
    ### 2018-02-26 21:48
    ### Dominik Černelič

    error_reporting(E_ALL);
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    ini_set('max_execution_time', 30);

    session_start();
    try {

        $config = array(
            'lang' => 'en',
            'installRoot' => $_SERVER["DOCUMENT_ROOT"] . '/install/',
            'itemsRoot' => $_SERVER["DOCUMENT_ROOT"] .'/lib/DJS1-SF6-D1/items/Domino/Installer/',
            'libRoot' => $_SERVER["DOCUMENT_ROOT"] .'/lib/'
        );

        require_once( $config['installRoot'] . 'classes/DCInit.php' );

        $init = new DCInit();

        echo $init->init();


    } catch (\Exception $e) {
        echo $e->getMessage();
    }