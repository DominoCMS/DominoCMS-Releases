<?php
require_once($config['includesRoot'] . 'backend/DCBaseView.php');

class DCSSR extends DCBaseView {

    function renderSite() {

        global $site;

        $ret = '';
        if ( isset( $site['page']['views'][0] ) ) {
            $view = $site['page']['views'][0];

            $ret .= $this->component( $view );
        }

        return $ret;

    }

}