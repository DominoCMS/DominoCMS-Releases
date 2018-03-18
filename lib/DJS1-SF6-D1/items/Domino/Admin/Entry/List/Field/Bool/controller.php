<?php
require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/controller.php');
class DominoAdminEntryListFieldBoolController extends DCBaseController {

    function indexAction( $data ) {

    }

    public function listStructureData ( $col, $data ) {


        $value = isset( $data[$col['element']] ) ? $data[$col['element']] : null;

        return $value;

    }
    public function changeAction ( $data ) {

        global $identity;
        global $config;
        $util = new DCUtil();
        $entryClass = new DominoAdminEntryController();

        $element = $util->sanitize($data['element']);
        $developer = $util->sanitize($data['developer']);
        $module = $util->sanitize($data['module']);
        $id = $util->sanitize($data['id']);
        $value = $util->sanitize($data['value']);

        //$id = $this->getColsMainId( $data['formData'], $colsMain );

        $colsMain = $entryClass->getColsMain( $developer, $module );
        $queryWhere = $entryClass->getColsMainWhere( $colsMain, $id );


        $entry = $developer . '.' . $module. '.' . $id;
        $boolVal = ( $value == 1 ) ? 0 : 1;

        // Update SiteIndex
        $util->dominoSql("UPDATE " . $identity['db'] . ".DCDominoSiteIndex SET `".$element."`='".$boolVal."' WHERE entry='".$entry."';", 'update');

        // updateModuleTable
        $util->dominoSql("UPDATE " . $identity['db'] . ".DC".$developer.$module." SET `".$element."`='".$boolVal."' WHERE ".ltrim($queryWhere,'AND ').";", 'update');


    }
}