<?php

class DominoAdminEntryListFieldVarcharController extends DCBaseController {

    function indexAction( $data ) {

    }

    public function listStructure1Data ( $col, $data ) {

        global $site;
        global $config;

        $value = $data[$col['element']];

        //if ( isset ( $col['module'] ) )
            //if ( $col['module'] == 'Content' || $col['module'] == 'ContentBlocks' || $col['module'] == 'Products' )
               // $value .= " - ".$col['developer'].".".$col['module'].".".$data['id']."";


        return $value;

    }
}