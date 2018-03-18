<?php

class DominoAdminLoginResetController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        $ret = array (
            'auth' => $config['auth'],
            'trans' => $util -> showTranslate( array('resetPassword',"reset_password_text","user","password","retype_password","password_length","password_length_short","set_new_password","reset_password_request_not_valid","reset_password_request_not_valid_text","reset_password_text","website_login","forgot_password","password_reset_success","password_reset_success_text","user_email")),
            /*"actions" => array(
                "login" => DisplayNameUrl( array( "id" => 14) ),
                "forgot" => DisplayNameUrl( array( "id" => 21) )
            )*/
        );

        if ( isset($_GET["h"]) ) {

            $hash = mysql_real_escape_string ( $_GET["h"] );

            $sql_users = "SELECT email,id,name,surname FROM ".$ModusDb."User WHERE password_hash='".$hash."';";
            if( $sql_users !== FALSE ) {
                if ( mysql_num_rows ( $result_users ) ) {
                    $line_users = mysql_fetch_array($result_users, MYSQL_ASSOC);

                    $ret["name"] = $line_users["name"]." ".$line_users["surname"];
                    $ret["email"] = $line_users["email"];
                    $ret["hash"] = $hash;
                    $ret["valid"] = 1;
                }
                else
                    $ret["valid"] = 0;
            }
            else
                $ret["valid"] = 0;
        }
        else
            $ret["valid"] = 0;

        return $ret;

    }

    function passwordReset( $data ) {

        $ret = array ();
        $post = $_POST['formData'];
        array_walk_recursive($post,function(&$item, $key) { $item = mysql_real_escape_string($item);});

        if ( $post["password"] && $post["password_retype"] ) {

            if ( $post["password"] === $post["password_retype"] ) {

                $sql_users = "SELECT id,email FROM ".$ModusDb."User WHERE password_hash='".$post["hash"]."';";
                $result_users = mysql_query($sql_users);
                if( $result_users !== FALSE ) {
                    $line_users = mysql_fetch_array($result_users, MYSQL_ASSOC);

                    $post["email"] = $line_users["email"];

                    $sql = "UPDATE ".$ModusDb."User SET password='".$post["password"]."',password_hash='' WHERE id='".$line_users["id"]."';";
                    mysql_query ($sql);

                    $ret["success"] = 1;

                    ######################################################
                    ### E-mail to User
                    ######################################################

                    $Content = "<h1>".$translate["password_reset_success"]."</h1>";
                    $Content .= "<p>";
                    $Content .= "<b>".$translate["user_email"]."</b>: ".$post["email"];
                    $Content .= "</p>";

                    sendSystemMail( array(
                        "to" => array($post["email"]),
                        "subject" => $translate["password_reset_success"]." - ".$SiteDomain,
                        "message" => $Content
                    ));

                }
                else {
                    $success = "Session is over or incorrect hash";
                    $ret["success"] = 2;
                }
            }
            else {
                $success = "Passwords are not the same";
                $ret = array (
                    "success" => 3
                );
            }
        }
        else {
            $success = "Passwords not provided";
            $ret = array (
                "success" => 4
            );
        }
        if ( isset( $fail ) ) {

            ######################################################
            ### E-mail to Stats
            ######################################################

            $Content = "<h1>".$translate["website_reset_password_failed"]."</h1>";
            $Content .= "<p>";
            $Content .= "<b>".$translate["user"]."</b>: ".$post["email"]."<br />";
            $Content .= "<b>".$translate["reason"]."</b>: ".$fail."<br />";
            $Content .= "<b>".$translate["date"]."</b>: ".TstampShort(date('Y-m-d h:i:s', time()));
            $Content .= "</p>";

            sendSystemMail( array(
                "subject" => $translate["website_reset_password_failed"]." ".$SiteDomain,
                "message" => $Content
            ));
        }

        return $ret;
    }

}