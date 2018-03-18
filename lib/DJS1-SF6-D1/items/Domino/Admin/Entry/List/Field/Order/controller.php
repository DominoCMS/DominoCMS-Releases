<?php

class DominoAdminEntryListFieldOrderController extends DCBaseController {

    function indexAction( $data ) {

    }

    public function listStructureData ( $col, $data ) {


        $value = isset( $data['order'] ) ? $data['order'] : $data['ordem'];


        return $value;

    }
    public function changeAction ( $data ) {

        global $identity;
        global $config;
        $util = new DCUtil();

        $element = $util->sanitize($data['element']);
        $developer = $util->sanitize($data['developer']);
        $module = $util->sanitize($data['module']);
        $id = $util->sanitize($data['id']);
        $value = $util->sanitize($data['value']);

        $entry = $developer . '.' . $module. '.' . $id;
        $boolVal = ( $value == 1 ) ? 0 : 1;

        // Update SiteIndex
        $util->dominoSql("UPDATE " . $identity['db'] . ".DCDominoSiteIndex SET `".$element."`='".$boolVal."' WHERE entry='".$entry."';", 'update');

        // updateModuleTable
        $util->dominoSql("UPDATE " . $identity['db'] . ".DC".$developer.$module." SET `".$element."`='".$boolVal."' WHERE id='".$id."';", 'update');


    }
}