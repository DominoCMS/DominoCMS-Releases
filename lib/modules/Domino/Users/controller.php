<?php
//require_once( $config['includesRoot'] . "classes/DCMail.php" );
class DCLibModulesDominoUsers extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        return $data;
    }
    function afterCreateAction ( $data ) {
        // Deploy user vars
        $this->userVars( array( 'userId' => $data['entry']['id']  ) );

        // Send mail
        if ( $data['formData']['pass'] )
            $this->userMail( array( 'userId' => $data['entry']['id'], 'password' => $data['formData']['pass']   ) );

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        $this->userVariables( array( 'userId' => $data['entry']['id']  ) );

        // Send mail
        if ( $data['formData']['pass'] )
            $this->userMail( array( 'userId' => $data['entry']['id'], 'password' => $data['formData']['pass']  ) );

        return $data;
    }
    function userVariables( $arr ){

        global $config;
        global $identity;

        require_once $config['includesRoot'] . "classes/DCUtil.php";
        $util = new DCUtil();

        $db = $identity['db'];

        if ( isset ( $db ) ) {
            $util->makeDir( $identity["root"] . 'modules/Domino/Users/' );
            $userDir = $identity["root"] . 'modules/Domino/Users/' . $arr['userId'];
            $util->makeDir( $userDir );

            $user = $util->dominoSql( "select * FROM " . $db . ".DCDominoUsers WHERE id=".$arr['userId'].";", 'fetch_one');

            $content = "<?php\n\n";
            $content .= "return array(\n";
            $content .= "'id' => '".$user["id"]."',\n";
            $content .= "'name' => '".$user["firstname"]."',\n";
            $content .= "'surname' => '".$user["surname"]."',\n";
            $content .= "'username' => '".$user["username"]."',\n";
            $content .= "'email' => '".$user["email"]."',\n";
            //$content .= "'rank' => '".$line_user["rank"]."',\n";


            // ADD USER RIGHTS HERE - ACL TYPE (identity, module, action )

            $content .= ");";

            $util->writeFile( $userDir . '/variables.php', $content);
        }
    }
    function userMail ( $arr ) {

        global $config;
        global $site;

        $mail = new DCMail();
        $util = new DCUtil();

        $user = $util->dominoSql( "select * FROM " . $site['db'] . ".DCDominoUsers WHERE id=".$arr['userId'].";", 'fetch_one');

        $content = "<h1>New user in the system!</h1>";

        $content .= "<p>";
        $content .= "Welcome to the CMS - <b>Domino</b>! This is your login for website editing";
        $content .= "</p>";

        $content .= "<p>";
        $content .= "<b>Name and surname</b>: ".$user["firstname"]." ".$user["surname"]."<br />";
        $content .= "<b>Username</b>: ".$user["username"]."<br />";
        $content .= "<b>User e-mail</b>: ".$user["email"]."<br />";
        $content .= "<b>Password</b>: ".$arr["password"]."<br />";
        $content .= "</p>";

        $content .= "<p>";
        $content .= 'Access to the admin: <a href="https://">/</a>';
        $content .= "</p>";

        $mail->sendSystemMail( array(
            "to" => array( $user['email'] ),
            "subject" => "Domino - New registration",
            "message" => $content
        ));

    }

    function userId() {

        global $site;
        global $config;
        $util = new DCUtil();

        if ( isset($_SESSION["userId"])) {
            $config["auth"] = true;
            return $_SESSION["userId"];
        }
        else {

            if ( isset( $_COOKIE["user"] ) ) {

                $cookieHash = mysql_real_escape_string ( $_COOKIE["user"] );
                $user = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoUsers WHERE hash='".$cookieHash."';",'fetch_one');
                if ( $user ) {
                    $config["auth"] = true;
                    $_SESSION["userId"] = $user['id'];
                    return $user['id'];
                }
                else
                    return 0;
            }
            else
                return 0;
        }
    }

    function userVars () {

        global $config;

        $noVars = array(
            'visitor' => 0,
            'id' => 0
        );

        if ( $config["auth"] === true ) {
            if (file_exists($config['identityRoot'] . "modules/Domino/Users/" . $_SESSION['userId'] . "/variables.php"))
                return require_once($config['identityRoot'] . "modules/Domino/Users/" . $_SESSION['userId'] . "/variables.php");
            else
                return $noVars;
        }
        else
            return $noVars;

    }
}