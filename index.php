<?php

    ##################################################################
    ### DominoCMS MultiSite Licence 1.0
    ##################################################################
    ###
    ###	(c) 2016 Domdesign - Lepota Oblike d. o. o.
    ### Created by Dominik Černelič
    ### www.dominocms.net
    ###
    ##################################################################
    ###	To know ten thousand things, know one well.
    ### Miyamoto Musashi
    ###
    ### v 0.0.2
    ### 20. 8. 2016, 9:37
    ### Dominik Černelič

    error_reporting(E_ALL);
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    ini_set('max_execution_time', 30);

    session_start();
    //header ("Access-Control-Allow-Origin: *");
    try {

        $configFolder = __DIR__ . '/../private/config/';
        $config = require_once( $configFolder ."config.php" );


        require_once(  $config['includesRoot']. "classes/DCInit.php" );

        $init = new DCInit();

        echo $init->init();

        if( !isset($_SERVER['HTTP_X_REQUESTED_WITH']) ) // AJAX REQUEST
            if ( isset ( $params['error'] ) ) {
                http_response_code($params['error']['responseCode']);

                if ( isset( $params['error']['redirect'] ) )
                    header("location:" . $params['error']['redirect']);
            }


    } catch (\Exception $e) {
        echo $e->getMessage();
    }