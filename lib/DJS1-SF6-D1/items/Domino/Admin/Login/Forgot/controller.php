<?php

class DominoAdminLoginForgotController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth'],
            'translate' => $util -> showTranslate( array('forgotPassword','tryAgain','forgotPasswordText','send','forgotPasswordSuccess','forgotPasswordSuccessText','userEmail','forgotPasswordText2'))
        );

    }

    function forgotPass( $data ) {

        $ret = array ();
        $post = $_POST['formData'];
        array_walk_recursive($post,function(&$item, $key) { $item = mysql_real_escape_string($item);});

        /*
        if ( filter_var($post["user"]["email"], FILTER_VALIDATE_EMAIL) ) {

            // Check if user exists
            $sql_users = "SELECT email,id FROM ".$ModusDb."User WHERE email='".$post["user"]["email"]."';";
            $result_users = mysql_query($sql_users);
            if ( mysql_num_rows( $result_users ) ) {
                $line_users = mysql_fetch_array($result_users, MYSQL_ASSOC);

                $sql = "INSERT INTO ".$ModusDb."UserLogForgot(user_id,created) VALUES ('".$line_users["id"]."','".strtotime(date("Y-m-d H:i:s"))."');";
                mysql_query($sql);

                $hash = random_string(64);

                $sql = "UPDATE ".$ModusDb."User SET password_hash='".$hash."' WHERE id=".$line_users["id"].";";
                mysql_query ($sql);

                ######################################################
                ### E-mail to User
                ######################################################

                $Content = "<h1>".$translate["reset_password"]."</h1>";
                $Content .= "<p>";
                $Content .= "<b>".$translate["user_email"]."</b>: ".$post["user"]["email"];
                $Content .= "</p>";
                $Content .= "<p>";
                $Content .= "".$translate["reset_password_text"]."<br>";
                $url = DisplayNameUrl(array("id"=>$resetPasswordPage));
                $link = "www.".$SiteDomain.$url["link"].'?h='.$hash;
                $Content .= '<a href="http://'.$link.'">'.substr($link,0,60).' ...</a>';
                $Content .= "</p>";

                sendSystemMail( array(
                    "to" => array($post["user"]["email"]),
                    "subject" => $translate["reset_password"]." - ".$SiteDomain,
                    "message" => $Content
                ));
                $loginStatus = 1;
            }
            else
                $loginStatus = 5;
        }
        else
            $loginStatus = 4;

        $ret["success"] = $loginStatus;

        if ( $loginStatus > 1 ) {

            //$sql = "INSERT INTO ".$ModusDb."UserLogFail(email,type,status,created) VALUES ('".$post["user"]["email"]."','2','".$loginStatus."','".strtotime(date("Y-m-d H:i:s"))."');";
           // mysql_query($sql);
        }
        return $ret;
*/

    }

}