<?php

class DominoAdminEntryEditFieldTextEditorControlle1r extends DCBaseController {

    function indexAction( $data ) {

    }
    public function structureData ( $entry, $data ) {

        global $identity;
        global $config;
        $util = new DCUtil();

        $ret = array();

        foreach ( $data['dimensions'] AS $dimension ) {

            if ( $data['id'] == 'new' ) {
                $name = "";
            }
            else {
                $name = '';
            }

            $ret[$dimension['id']] = array(
                'name' => '',
            );
        }

        return $data;

    }
    public function prepareInsert ( $col, $data, $libModule, $dimension ) {



    }
    public function prepareUpdate ( $col, $data, $libModule, $dimension ) {



    }
}