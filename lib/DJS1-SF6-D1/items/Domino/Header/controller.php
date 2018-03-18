<?php
/**
 * filename: HeaderController.php
 * developer: Domino
 * item: Header
 * version: v1.0.0
 * date: 14. 8. 17
 */
class DominoHeaderController extends DCBaseController {

    function indexAction( $data ) {


        global $site;
        global $params;
        $util = new DCUtil();

        $ret = array(
            'container' => false
        );

        return $ret;

    }

    public function refreshAction ( $data ) {

        global $params;

        if ( isset ( $params['levels'][ $params['contentRootLevel'] ]['entry'] ) )
            return $params['levels'][ $params['contentRootLevel'] ]['entry'];

    }

}