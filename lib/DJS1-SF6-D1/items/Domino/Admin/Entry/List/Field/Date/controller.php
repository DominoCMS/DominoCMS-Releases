<?php

class DominoAdminEntryListFieldDateController extends DCBaseController {

    function indexAction( $data ) {

    }

    public function listStructureData ( $col, $data ) {

        global $site;
        global $config;

        $date = new DCDate();

        if ( is_numeric($data[$col['element']]))
            $dateVal = date( 'Y-m-d', $data[$col['element']] );
        else
            $dateVal = $data[$col['element']];

        return $date->DateFormat2( $dateVal );

    }
}