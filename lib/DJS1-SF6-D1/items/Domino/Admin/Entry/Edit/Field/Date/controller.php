<?php

class DominoAdminEntryEditFieldDateController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function structureData ( $element, $libModule, $data, $dimensions ) {

        $dataEl = date( 'd.m.Y' );

        if ( isset ( $data[$element] ) )
            $dataEl = $data[$element];

        if ( isset ( $dimensions[0] ) )
            if ( isset ( $data[$data['dimensions'][0]][$element] ) )
                $dataEl = $data[$data['dimensions'][0]][$element];

        //if ( isset ( $data[$element] ) ) {
            if ( is_numeric( $dataEl ) )
                $ret = date('d.m.Y', $dataEl);
            else {
                $ex = explode ( "-", $dataEl);
                if ( isset( $ex[2] ) )
                    $ret = $ex[2].".".$ex[1].".".$ex[0];
                else
                    $ret = $dataEl;
            }


        return $ret;

    }
    public function prepareInsert ( $col, $data, $libModule, $dimension ) {

        $date = $data[$col['element']];
        $d = explode( '.', $date );

        $newDate = $d[2] . '-' . $d[1] . '-' . $d[0];

        $ret = strtotime ( $newDate . ' 00:00:00' );

        return $ret;

    }
    public function prepareUpdate ( $col, $data, $libModule, $dimension ) {

        $date = $data[$col['element']];
        /*$d = explode( '-', $date );
        $newDate = $d[2] . '-' . $d[1] . '-' . $d[0];
print $date;*/
        $ret = strtotime ( $date . ' 00:00:00');

        return $ret;

    }
}