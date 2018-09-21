<?php

    error_reporting(E_ALL);
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    ini_set('max_execution_time', 30);

    session_start();

    $configFolder = __DIR__ . '/../private/config/';
    $config = require_once( $configFolder ."config.php" );


    require_once(  $config['includesRoot']. "classes/DCInit.php" );

    $init = new DCInit();

    echo $init->init();
