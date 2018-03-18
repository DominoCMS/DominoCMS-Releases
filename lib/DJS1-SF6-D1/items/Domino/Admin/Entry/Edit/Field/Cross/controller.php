<?php
require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/List/controller.php');
class DominoAdminEntryEditFieldCrossController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function addCrossModulesAction( $data ) {

        global $site;
        global $identity;
        $util = new DCUtil();

        $entry = explode( '|', $data['entry'] );

        $modulesCrossed = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoModulesCrossed WHERE developer='".$site['page']['developer']."' AND module='".$site['page']['module']."' developerRel='".$entry[0]."' AND moduleRel='".$entry[1]."';",'fetch_one');
        if ( !$modulesCrossed )
            $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoModulesCrossed (developer,module,developerRel,moduleRel,status) VALUES ('".$site['page']['developer']."','".$site['page']['module']."','".$entry[0]."','".$entry[1]."',1);",'insert');
        return array();

    }
    public function structureData ( $entry, $data ) {

        $util = new DCUtil();
        global $site;

        $data['miniSelector'] = array(
            /*'form' => array(
                'value' => '',
                'name' => '',
                'element' => '',
                'type' => 'text',
            ),*/
            'id' => 'addCrossModules',
            //'icon' => 'icon-arrow_up',
            //'listData' => array,
            'listParams' => array(
                'actions' => array(),
                'subactions' => array(
                    'buttons' => array(
                        'filterEntries' => array(
                            'value' => '',
                            //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                            'icon' => 'arrow_left',
                            'position' => 'left'
                        )
                    )
                ),
                'list' => array(
                    'pagination' => array(
                        'currentPage' => 1,
                        'entriesPerPage' => 20
                    ),
                    'options' => array(
                        'developer' => 'Domino',
                        'module' => 'Modules',
                        'type' => 'noindex',
                        //'parent' => '',
                        'selectorId' => 'addCrossModules',
                        'element' => '',
                        'return' => array(
                            'parent' => array ( 'element' =>  'entry',
                                'name' => 'module'
                            )
                        )
                    )
                )

            )
        );
        global $config;

        require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Modules/controller.php" );
        $modulesClass = new DCLibModulesDominoModules();
        //$modulesClass->createModuleTable( $identity ,'Domino', 'ModulesCrossed' );

        $entryListClass = new DominoAdminEntryListController();

        // list ModulesCrossed
        $modulesCrossed = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoModulesCrossed WHERE developer='".$data["moduleData"]['developer']."' AND module='".$data["moduleData"]['module']."' AND status=1;",'fetch_array');
        if ( $modulesCrossed )
            foreach ( $modulesCrossed AS &$moduleCross ) {

                if ( $moduleCross['moduleRel'] == 'Pictures' ) {
                    $moduleCross['type'] = 'Pictures';
                    $moduleCross['crossType'] = 'CrossPictures';
                }
                else if ( $moduleCross['moduleRel'] == 'Files' ) {
                    $moduleCross['type'] = 'Files';
                    $moduleCross['crossType'] = 'Cross';
                }

                else {
                    $moduleCross['type'] = 'Entries';
                    $moduleCross['crossType'] = 'Cross';
                }

                $miniSelector = array(
                    'id' => 'addCross'.$moduleCross['developerRel'].$moduleCross['moduleRel'],
                    'listParams' => array(
                        'actions' => array(),
                        'subactions' => array(
                            'buttons' => array(
                                'filterEntries' => array(
                                    'value' => '',
                                    //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                                    'icon' => 'arrow_left',
                                    'position' => 'left'
                                )
                            )
                        ),
                        'list' => array(
                            'pagination' => array(
                                'currentPage' => 1,
                                'entriesPerPage' => 20
                            ),
                            'options' => array(
                                'developer' => $moduleCross['developerRel'],
                                'module' => $moduleCross['moduleRel'],
                                'type' => 'noindex',
                                'element' => $moduleCross['moduleRel'],
                                'mainColumn' => 'id',
                                'element' => '',
                                'selectorId' => 'addCross',
                                'return' => array(
                                    'parent' => array ( 'element' =>  'entry',
                                        'name' => 'id'
                                    )
                                )
                            )
                        )
                    )
                );

                $crossData = array(
                    'miniSelector' => $miniSelector,
                    'list' => $entryListClass->listAction(
                        array(
                            'actions' => array(),
                            'subactions' => array(),
                            'list' => array(
                                'options' => array(
                                    'type' => 'cross',
                                    'crossType' => $moduleCross['crossType'],
                                    'status' => 1,
                                    'developer' => $moduleCross['developer'],
                                    'module' => $moduleCross['module'],
                                    'id' => $data["moduleData"]['id'],
                                    'developerRel' => $moduleCross['developerRel'],
                                    'moduleRel' => $moduleCross['moduleRel'],
                                    'siteIndex' => false
                                )
                            )
                        )
                    )
                );

                $moduleCross['data'] = $crossData;

            }
        $data['ModulesCrossed'] = $modulesCrossed;

        return $data;

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
    public function addCrossAction( $data ) {

        global $site;
        global $identity;
        $util = new DCUtil();

        print_r($site);

        $newEntryRel = str_replace( '|', '.', $data['entry'] );
        $entry = explode( '.', $newEntryRel );


        $maxord = $util->dominoSql("select ordem FROM " . $identity['db'] . ".DCDominoSiteCross WHERE entry='".$site['page']['entry']."' AND developerRel='".$entry[0]."' AND moduleRel='".$entry[1]."' ORDER BY ordem DESC LIMIT 1;",'fetch_one');
        $order = $maxord['ordem'] + 1;

        $modulesCrossed = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCross WHERE developer='".$site['page']['developer']."' AND module='".$site['page']['module']."' developerRel='".$entry[0]."' AND moduleRel='".$entry[1]."';",'fetch_one');
        if ( !$modulesCrossed )
            $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteCross (entry,entryRel,developer,module,id,developerRel,moduleRel,idRel,status,ordem) VALUES ('".$site['page']['entry']."','".$newEntryRel."','".$site['page']['developer']."','".$site['page']['module']."','".$site['page']['id']."','".$entry[0]."','".$entry[1]."','".$entry[2]."',1,'".$order."');",'insert');

        return array();

    }
}