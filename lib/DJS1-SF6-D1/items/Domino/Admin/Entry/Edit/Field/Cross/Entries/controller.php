<?php
require_once ($config['libRoot'] . 'items/Domino/Entry/DJS1-SF6-D1/Edit/controller.php');
class DominoAdminEntryEditFieldCrossEntriesController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth']
        );

    }
    public function structureData ( $element, $libModule, $moduleData, $dimensions ) {

        global $config;
        global $identity;
        $util = new DCUtil();

        $miniSelector = array(
            'id' => 'addCrossEntries',
            'listData' => array(
                'actions' => array(),
                'subactions' => array(),
                'list' => array(
                    'options' => array (
                        'developer' => 'Domino',
                        'module' => 'Pictures',
                        'parent' => '',
                        'type' => 'noindex',
                        'element' => 'Pictures',
                        'mainColumn' => 'name',
                        'selectorId' => 'addCrossEntries',
                        'return' => array(
                            'parent' => array ( 'element' =>  'entry',
                                'name' => 'name'
                            )
                        )
                    )
                )
            )
        );
        $ret = array(
            'miniSelector' => $miniSelector,
            'entries' => array(),
            'identity' => $identity["username"],
            'mainDeveloper' => $moduleData["developer"],
            'mainModule' => $moduleData["module"],
            'mainId' => $moduleData["id"],
            'crossLink' => '/'
        );

        return $ret;

    }
    public function prepareInsert ( $data ) {

        global $site;
        global $config;


        $ret = array();



        return $ret;

    }
    function deleteAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $update = $util->dominoSql( "DELETE FROM " . $identity['db'] . ".DCDominoSiteCross WHERE entry='".$data['entry']."' AND entryRel='".$data['entryRel']."';", 'update');


        return $data;
    }
    function manualCrossAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $entry = explode('.',$data['entry']);
        $entryRel = explode('.',$data['newEntry']);

        $entries = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCross WHERE entry='".$data['entry']."';",'fetch_array');
        $next = count( $entries ) + 1;

        $update = $util->dominoSql( "INSERT INTO " . $identity['db'] . ".DCDominoSiteCross (`entry`, `developer`, `module`, `id`, `entryRel`, `developerRel`, `moduleRel`, `idRel`, `ordem`, `status`) VALUES ('".$data['entry']."','".$entry[0]."','".$entry[1]."','".$entry[2]."','".$data['newEntry']."','".$entryRel[0]."','".$entryRel[1]."','".$entryRel[2]."','".$next."','1');", 'insert');


        return $data;
    }
}