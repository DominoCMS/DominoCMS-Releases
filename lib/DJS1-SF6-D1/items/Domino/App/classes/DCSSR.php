<?php
require_once ( $config['includesRoot'] . 'classes/DCBaseView.php' );
class DCSSR extends DCBaseView {

    public function renderSite() {

        global $site;
        $ret = '';
        if ( isset( $site['page']['views'][0] ) ) {
            $view = $site['page']['views'][0];
            $ret .= $this->component( $view );
        }

        return $ret;

    }

}