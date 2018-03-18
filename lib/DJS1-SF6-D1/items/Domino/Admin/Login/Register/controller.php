<?php

class DominoAdminLoginRegisterController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        unset($_SESSION['userId']);
        $util->unsetCookie('user');

        $translate = ShowTranslate( array("new_website_registration","website_registration_info","website_registration_text","email","date","register_success_text","login_details","password","retype_password","password_length_short","password_length","customer_details","buying_as_person","buying_as_company","name","surname","company_title","address","vatin","street_and_number","zip","city","telephone","mobile","eletter_subscribe_wish_txt","register_unsuccess","register_success","register_success_text","register_unsuccess_text","register","website_login","renew_forgot_password","already_registered","already_registered_text","home_page","browse_items","user_profile","basket_review","name_and_surname","taxable_person","yes","no","submitted_details","website_logged","website_logged_text","reason"));
        $translate["password_length_short"] = str_replace("{number}","6",$translate["password_length_short"]);
        $translate["password_length"] = str_replace("{number}","6",$translate["password_length"]);

        $ret = array (
            "auth" => ( $auth == 1 ) ? true : false,
            "actions" => array(
                "home" => DisplayNameUrl( array( "id" => 1) ),
                "login" => DisplayNameUrl( array( "id" => 14) ),
                "profile" => DisplayNameUrl( array( "id" => 43) ),
                "forgot" => DisplayNameUrl( array( "id" => 21) )
            )
        );

        return array(
            'redirect' => '/'
        );

    }

    function registerUser( $data ) {
        $ret = array ();
        $post = $_POST['formData'];
        array_walk_recursive($post,function(&$item, $key) { $item = mysql_real_escape_string($item);});

        if ( filter_var($post["user"]["email"], FILTER_VALIDATE_EMAIL) && $post["user"]["name"] && $post["user"]["surname"] && $post["client"]["vatin"] && $post["client"]["tel"] && $post["client"]["address"] && $post["client"]["address_nr"] && $post["client"]["zip"] && $post["client"]["city"] && filter_var($post["client"]["email"], FILTER_VALIDATE_EMAIL) ) {

            if ( strlen($post["user"]["password"]) > 6) {
                if ( $post["user"]["password"] === $post["user"]["password_retype"] ) {

                    $sql_users = "SELECT id FROM ".$ModusDb."User WHERE email='".$post["user"]["email"]."';";
                    $result_users = mysql_query($sql_users);
                    if ( mysql_num_rows($result_users) == 0 ) {

                        $hash = random_string(128);
                        $date_created = strtotime(date("Y-m-d H:i:s"));

                        $sql = "INSERT INTO ".$ModusDb."User(email,name,surname,username,password,hash,date_created) VALUES ('".$post["user"]["email"]."','".$post["user"]["name"]."','".$post["user"]["surname"]."','".$post["user"]["email"]."','".$post["user"]["password"]."','".$hash."','".strtotime(date("Y-m-d H:i:s"))."');";
                        mysql_query($sql);

                        // User id
                        $query_users_data = "SELECT * FROM ".$ModusDb."User WHERE hash='".$hash."'";
                        $result_users_data = mysql_query($query_users_data);
                        $line_users_data = mysql_fetch_array($result_users_data, MYSQL_ASSOC);
                        $UserId = $line_users_data["id"];
                        setEkdisUserId ( array ( "id"=>$UserId ) );

                        $sql = "INSERT INTO ".$ModusDb."Client(email,company_title,company_title_2,vatin,taxperson,address,address_nr,zip,city,tel,user_id_created,date_created,include_signature_list) VALUES ('".$post["client"]["email"]."','".$post["client"]["company_title"]."','".$post["client"]["company_title_2"]."','".$post["client"]["vatin"]."','".$post["client"]["taxperson"]."','".$post["client"]["address"]."','".$post["client"]["address_nr"]."','".$post["client"]["zip"]."','".$post["client"]["city"]."','".$post["client"]["tel"]."','".$UserId."','".strtotime(date("Y-m-d H:i:s"))."',1);";
                        mysql_query($sql);

                        $arr = array("email","name","surname","tel");
                        $user = array();
                        for ( $i = 0; $i < count($arr); $i++ ) {
                            $field = $arr[$i];
                            $user[$field] = $line_users_data[$field];
                        }
                        setUpdateCookie("user",serialize($user));

                        // Client id
                        $sql_client_data = "SELECT * FROM ".$ModusDb."Client WHERE email='".$post["client"]["email"]."'";
                        $result_client_data = mysql_query($sql_client_data);
                        $line_client_data = mysql_fetch_array($result_client_data, MYSQL_ASSOC);
                        $ClientId = $line_client_data["id"];

                        // CONNECT CLIENT AND USER
                        $sql = "INSERT INTO ".$ModusDb."UserClient (user_id,client_id,date_created) VALUES ('".$UserId."','".$ClientId."','".$date_created."');";
                        mysql_query($sql);

                        $arr = array("email","company_title","company_title_2","vatin","address","address_nr","zip","city","tel","taxperson","id_number");
                        $client = array();
                        for ( $i = 0; $i < count($arr); $i++ ) {
                            $field = $arr[$i];
                            $client[$field] = $line_client_data[$field];
                        }
                        setUpdateCookie("client",serialize($client));

                        ######################################################
                        ### Insert E-letter
                        ######################################################

                        if ( isset( $post["elist"] ) ) {
                            $sql_elist = "SELECT id,status FROM ".$SiteDb."m_174 WHERE email='".$post["user"]["email"]."';";
                            $result_elist = mysql_query($sql_elist);
                            $res = mysql_num_rows ( $result_elist );
                            if ( $res > 0 ) {
                                $line_elist = mysql_fetch_array($result_elist, MYSQL_ASSOC);
                                $sql = "UPDATE ".$SiteDb."m_174 SET status=1 WHERE id=".$line_elist["id"].";";
                                mysql_query ($sql);
                            }
                            else {
                                $sql_elist = "INSERT INTO ".$SiteDb."m_174(email,UserId,status) VALUES ('".$post["user"]["email"]."','".$UserId."',1);";
                                mysql_query($sql_elist);

                            }
                            $_SESSION["EletterSignup"] = 1;
                        }

                        ######################################################
                        ### E-mail to User
                        ######################################################

                        $Content = "<h1>".$translate["website_registration_info"]."</h1>";
                        $Content .= "<p>".$translate["register_success"]."</p>";
                        $Content .= "<h2>Podatki za prijavo:</h2>";
                        $Content .= "<p>";
                        $Content .= "<b>".$translate["name_and_surname"]."</b>: ".$post["user"]["name"]." ".$post["user"]["surname"]."<br />";
                        $Content .= "<b>".$translate["email"]."</b>: ".$post["user"]["email"]."<br />";

                        $Content .= "<h2>Podatki naročnika:</h2>";
                        $Content .= "<b>".$translate["company_title"]."</b>: ".$post["client"]["company_title"]."<br />";
                        if ( $post["client"]["company_title_2"] )
                            $Content .= "<b>".$translate["company_title"]."</b>: ".$post["client"]["company_title_2"]."<br />";
                        $taxperson_text = ( $post["client"]["taxperson"] == 1 ) ? $translate["yes"] : $translate["no"];
                        $vatin_text = $post["client"]["vatin"] ? $post["client"]["vatin"]." (".$translate["taxable_person"].": ".$taxperson_text.")" : "/";
                        $Content .= "<b>".$translate["vatin"]."</b>: ".$vatin_text."<br />";
                        $Content .= "<b>".$translate["address"]."</b>: ".$post["client"]["address"]." ".$post["client"]["address_nr"]."<br />";
                        $Content .= "<b>".$translate["city"]."</b>: ".$post["client"]["zip"]." ".$post["client"]["city"]."<br />";
                        $Content .= "<b>".$translate["telephone"]."</b>: ".$post["client"]["tel"]."<br />";
                        $Content .= "<b>".$translate["email"]."</b>: ".$post["client"]["email"]."<br />";
                        $Content .= "</p>";

                        sendSystemMail( array(
                            "to" => array($post["user"]["email"]),
                            "subject" => $translate["website_registration_info"]." - ".$SiteDomain,
                            "message" => $Content
                        ));

                        $ret["success"] = 0;
                        $ret["user"] = $post["user"]["name"].' '.$post["user"]["surname"];
                    }
                    else
                        $ret["success"] = 1; // already is in database
                }
                else
                    $ret["success"] = 2;
            }
            else
                $ret["success"] = 3;
        }
        else
            $ret["success"] = 4;

        return $ret;
    }
    function checkUserExist( $data ) {
        $email = mysql_real_escape_string($_POST["email"]);

        $sql_users = "SELECT id FROM ".$ModusDb."User WHERE email='".$email."';";
        $result_users = mysql_query($sql_users);
        $success = ( mysql_num_rows($result_users) == 0 ) ? 0 : 1;
        $ret = array(
            "success" => $success
        );
        return $ret;
    }
}