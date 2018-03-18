<?php

class DominoAdminEntryListFieldEditController extends DCBaseController {

    function indexAction( $data ) {

    }

    public function listStructureData ( $col, $data ) {

        global $params;

  //      $id = isset($data['entry']) ? $data['entry'] : $data['id'];
        $id = null;
        $value = array(
            //'editEntry' => $params['currentUrl'] . '&id=new',
            'createBefore' => $params['currentUrl'] . '&id=new&type=before&entry=' . $id,
            'createAfter' => $params['currentUrl'] . '&id=new&type=after&entry=' . $id,
        );

        if ( isset ( $data['parent'] ) )
            $value['createInto'] = $params['currentUrl'] . '&id=new&type=into&entry=' . $id;

        return $value;

    }

}