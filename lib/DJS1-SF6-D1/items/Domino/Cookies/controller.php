<?php
class DominoCookiesController extends DCBaseController {

    function indexAction( $data ) {
        $util = new DCUtil();

        $ret = array(
            'translate' => $util->showTranslate(array("cookies_policy_message","cookies_policy_button")),
            "display" => isset( $_COOKIE["DominoCookies"] ) ? false : true
        );

        return $ret;
    }
    public function acceptAction ( $data ) {

        setcookie("DominoCookies", true, time() + (10 * 365 * 24 * 60 * 60));

    }
}
