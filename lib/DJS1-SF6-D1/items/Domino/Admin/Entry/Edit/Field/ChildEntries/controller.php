<?php
require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/List/controller.php');
class DominoAdminEntryEditFieldChildEntriesController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function structureData ( $entry, $data ) {

        $entryListClass = new DominoAdminEntryListController();

        /*return $entryListClass->listAction( array(
            'developer' => 'Domino',
            'module' => 'ContentBlocks',
            'parent' => $data['entry']
        ) );*/


    }
    public function prepareInsert1 ( $col, $data, $libModule, $dimension ) {

        $date = $data[$col['element']];
        $d = explode( '.', $date );

        $newDate = $d[2] . '-' . $d[1] . '-' . $d[0];

        $ret = strtotime ( $newDate . ' 00:00:00' );

        return $ret;

    }
    public function prepareUpdate1 ( $col, $data, $libModule, $dimension ) {

        $date = $data[$col['element']];
        /*$d = explode( '-', $date );
        $newDate = $d[2] . '-' . $d[1] . '-' . $d[0];
print $date;*/
        $ret = strtotime ( $date . ' 00:00:00');

        return $ret;

    }
}