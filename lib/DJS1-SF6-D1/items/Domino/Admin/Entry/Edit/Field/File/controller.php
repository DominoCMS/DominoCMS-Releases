<?php

class DominoAdminEntryEditFieldFileController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function structureData ( $entry, $data ) {

        global $config;
        global $site;

        $ret = array(
            'filename' => '',
            'thumb' => ''
        );

        if ( isset ( $data[$entry['element']] ) )
            $filename = $data[$entry['element']];

        if ( isset ( $dimensions[0] ) ) {

            $filename = '';
            if ( isset ( $data[$data['dimensions'][0]][$entry['element']] ) )
                $filename = $data[$data['dimensions'][0]][$entry['element']];

            $fileExt = isset( $data[$dimensions[0]] ) ? $data[$data['dimensions'][0]['id']]['fileExt'] : '';

            $ret = array(
                'mainDeveloper' => $data["developer"],
                'mainModule' => $data["module"],
                'mainId' => $data["id"],
                'filename' => $filename,
                'thumb' => '/identity/modules/Domino/Pictures/w250/' . $data['id'] . "." . $fileExt.'?id='.strtotime('now')
            );

        }

        return $ret;

    }
    public function prepareInsert ( $col, $data, $libModule, $dimension ) {


        $ret = $data[$col['element']];

        return $ret;

    }
    public function prepareUpdate ( $col, $data, $libModule, $dimension ) {

        print_r( $data);
        $ret = $data[$col['element']];


        return $ret;

    }
}