<?php

class DominoAdminEntryEditFieldAddEntriesController extends DCBaseController {

    function indexAction( $data ) {

    }
    function statusAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $status = $data['status'] == 1 ? 0 : 1;
        $update = $util->dominoSql( "UPDATE " . $identity['db'] . ".DCDominoUsersIdentities SET status='".$status."' WHERE identity='".$data['id']."';", 'update');


        return $data;
    }
    function deleteAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $update = $util->dominoSql( "DELETE FROM " . $identity['db'] . ".DCDominoUsersIdentities WHERE identity='".$data['id']."';", 'update');

        return $data;
    }
    public function structureData ( $entry, $data ) {

        global $config;
        global $site;
        $util = new DCUtil();

        $db = $config['db'];
        $id = 1;

        $entries = $util->dominoSql("select m1.*,m2.title AS name,m2.username AS link FROM " . $db . ".DCDominoUse m1 JOIN " . $db . ".DCDominoI m2 ON (m1.identity = m2.username) WHERE m1.userId='".$id."' AND m1.status<3;",'fetch_array');
        if ( $entries )
            foreach ( $entries AS &$entry ) {

            }

        $ret = array(
            'entries' => $entries
        );

        return $ret;

    }
    public function prepareInsert1 ( $col, $data, $libModule, $dimension ) {

    }
    public function prepareUpdate1 ( $col, $data, $libModule, $dimension ) {

    }
}