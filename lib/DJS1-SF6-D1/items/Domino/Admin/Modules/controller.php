<?php




class DominoAdminModulesController extends DCBaseController {

    function indexAction( $data ) {

        global $params;
        global $site;
        global $config;
        $util = new DCUtil();

        $ret = array(
            'display' => $site['entry']['type']
        );

        if ( $site['entry']['type'] == 'edit' ) {
            require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/Edit/controller.php');
            $entryEditClass = new DominoAdminEntryEditController();
            $ret['component'] =  $entryEditClass->editAction( $site['entry'] );

        }
        else if ( $site['entry']['type'] == 'list' ) {
            require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/List/controller.php');
            $entryListClass = new DominoAdminEntryListController();
            $ret['component'] =  $entryListClass->listAction( $site['entry'] );

        }
        else
            $params['error'] = 404;

        return $ret;

    }

}