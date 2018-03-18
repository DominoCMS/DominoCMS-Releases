<?php

class DominoAdminEntryEditFieldPasswordController extends DCBaseController {

    function indexAction( $data ) {


    }
    public function structureData ( $entry, $data ) {

        global $config;

        $ret = array(
            'passwordRetype' => 'Retype password'
        );

        return $ret;

    }
    public function prepareInsert ( $col, $data, $libModule, $dimension ) {

        global $config;

        $pass = $data['password'] ? $data['password'] : 'ignore';


        return $pass;

    }
    public function prepareUpdate ( $col, $data, $libModule, $dimension ) {

        global $config;

        $pass = $data['password'] ? $data['password'] : 'ignore';


        return $pass;

    }
}