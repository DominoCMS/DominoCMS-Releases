<?php

    error_reporting(E_ALL);
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    ini_set('max_execution_time', 30);

    session_start();

    $conf = require_once( __DIR__ . '/conf.php' );
    $config = require_once( $conf['configDir'] ."config.php" );

    require_once(  $config['includesRoot']. "backend/DCInit.php" );
    $init = new DCInit();

    echo $init->init();

    if( !isset($_SERVER['HTTP_X_REQUESTED_WITH']) ) // AJAX REQUEST
        if ( isset ( $params['error'] ) ) {
            http_response_code($params['error']['responseCode']);

            if ( isset( $params['error']['redirect'] ) )
                header("location:" . $params['error']['redirect']);
        }
