<?php

class DominoAdminLoginFormController extends DCBaseController {

    function indexAction( $data ) {


        $util = new DCUtil();
        $translate = new DCLibModulesDominoTranslate();
        return array(
            "auth" => false,
            "trans" => $translate->showTranslate( array('password','emailUsername','loginSubmit','userPasswordIncorrect','enterPassword','enterUsernameEmail') )

        );
    }

    function loginAction( $data ) {

        global $config;
        global $site;

        $ret = array ();
        $util = new DCUtil();
        //$translate = new DCLibModulesDominoTranslate();

        $failUser = null;

        if ( strlen ( $data['password'] ) > 6 ) {

            $user = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoUsers WHERE ( email='".$data["username"]."' || username='".$data["username"]."');",'fetch_one');
            if ( !$user )
                $loginStatus = 2;
            else { // user exists
                $failUser = $user['id'];
                // correct password
                if ( ( $data['password'] === $user['password'] ) ) {

                    $util->dominoSql("INSERT INTO " . $config['db'] . ".DCDominoUsersLoginLog (userId,dateCreated,dateEnd) VALUES (".$user['id'].",".strtotime("now").",".strtotime("now").");",'insert');

                    $_SESSION['userId'] = $user['id'];
                    $util->setUpdateCookie("user",$user['hash']);

                    //$link = DisplayNameUrl( array( "id" => 22) );
                    $ret = array (
                        //"redirect" => $link["link"],
                        "redirect" => '/domino/'. $site['lang'].'/loading', //nalaganje
                        "success" => 0
                    );
                    $loginStatus = 0;

                }
                else
                    $loginStatus = 1;
            }
        }
        else
            $loginStatus = 3;

        $ret["success"] = $loginStatus;

       // if ( $loginStatus > 0 )
            //$util->dominoSql("INSERT INTO " . $site['db'] . ".DCDominoUsersLoginFail (username,userId,status,created) VALUES ('".$data["username"]."','".$failUser."',".$loginStatus.",".$date->dateNowInt().");",'insert');

        return $ret;

    }


}