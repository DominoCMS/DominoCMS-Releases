<?php

class DominoInstallerStep3Controller {

    function indexAction($data) {

        return array(
            'firstname' => isset( $_SESSION['firstname'] ) ? $_SESSION['firstname'] : '',
            'surname' => isset( $_SESSION['surname'] ) ? $_SESSION['surname'] : '',
            'username' => isset( $_SESSION['username'] ) ? $_SESSION['username'] : '',
            'email' => isset( $_SESSION['email'] ) ? $_SESSION['email'] : '',
            'developer' => isset( $_SESSION['developer'] ) ? $_SESSION['developer'] : '',
            'developerUsername' => isset( $_SESSION['developerUsername'] ) ? $_SESSION['developerUsername'] : ''
        );
    }
    function submitAction( $data ) {

        $util = new DCUtil();
        $installClass = new DominoInstallerController();

        foreach ( $data AS $key => $val ) {
            $_SESSION[$key] = $val;
        }

        mysql_connect($_SESSION['dbHost'],$_SESSION['dbUsername'],$_SESSION['dbPassword']) or die('Cannot connect to the database, try again later<br>' . mysql_error());
        mysql_select_db($_SESSION['dbName']) or die('Cannot find database, try again later<br>' . mysql_error());
        mysql_query('set names utf8');


        # Create User tables
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Users');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'UsersLoginFail');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'UsersLoginLog');
        $installClass->createModuleTable( $_SESSION['dbName'], 'Domino', 'Developers');

        $hash = 'asdasds';

        // Insert user
        $util->dominoSql( "INSERT INTO " . $_SESSION['dbName'] . ".DCDominoUsers (id,email,username,password,firstname,surname,status) VALUES ('1','".$data['email']."','".$data['username']."','".$data['password']."','".$data['firstname']."','".$data['surname']."','1');", 'insert' );

        // Insert developer
        $util->dominoSql( "INSERT INTO " . $_SESSION['dbName'] . ".DCDominoDevelopers (id,username) VALUES ('','".$data['developerUsername']."');", 'insert' );

        // Create user vars
        $util->makeDir( $_SESSION['identityRoot'] . "modules/Domino/Users/" );
        $util->makeDir( $_SESSION['identityRoot'] . "modules/Domino/Users/1/" );

        $content = "<?php
return array(
    'id' => '1',
    'username' => '".$data['username']."',
    'name' => '".$data['firstname']."',
    'surname' => '".$data['surname']."'
);";

        $util->writeFile( $_SESSION['identityRoot'] . "modules/Domino/Users/1/variables.php", $content);


        return array(
            'success' => 'success'
        );
    }

}