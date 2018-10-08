<?php

class DCLibModulesDominoModules extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        global $config;
        global $site;

        $util = new DCUtil();

        $this->createModuleTable( $site, $data['formData']['developer'], $data['formData']['module']);

        return $data;
    }
    function afterCreateAction ( $data ) {

        global $config;
        require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/Edit/controller.php');
        // When Module is added to the identity run custom actions for what module it is
        $entryEditClass = new DominoEntryEditController();

        $data = $entryEditClass->runModuleAction ( $data, $data['formData']['developer'], $data['formData']['module'], 'createDesignModule' );

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        global $config;
        global $site;

        $util = new DCUtil();

        $this->createModuleTable( $site,$data['formData']['developer'],$data['formData']['module']);
        $this->updateModuleTable( $site,$data['formData']['developer'],$data['formData']['module']);

        // list all parent modules
        $entries = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesParent WHERE developerRel='".$data['formData']['developer']."' AND moduleRel='".$data['formData']['module']."' ORDER BY developer,module ASC;",'fetch_array');
        if ( $entries )
            foreach ( $entries AS $entry ){
                $this->createModuleTable($site,$entry['developer'],$entry['module']);
                $this->updateModuleTable($site,$entry['developer'],$entry['module']);
            }

        // list all dependent modules
        $entries = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesDependent WHERE developerRel='".$data['formData']['developer']."' AND moduleRel='".$data['formData']['module']."' ORDER BY developer,module ASC;",'fetch_array');
        if ( $entries )
            foreach ( $entries AS $entry ){
                $this->createModuleTable($site,$entry['developer'],$entry['module']);
                $this->updateModuleTable($site,$entry['developer'],$entry['module']);
            }

        return $data;

    }
    function modulesParamsAction ( $data ) {

        global $site;
        global $config;
        $util = new DCUtil();

        $params = $data['params'];
        $paramLevels = array();

        // list or edit
        if ( isset( $_GET['developer'] ) && isset( $_GET['module'] ) ) {

            $developer = $util->sanitize( $_GET['developer'] );
            $module = $util->sanitize( $_GET['module'] );

            // Die if module is non-existent
            $editModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='" . $developer . "' AND module='" . $module . "';", 'fetch_one');
            if ( !$editModule )
                $params['error'] = 404;

            // Add params level
            $paramLevels[] = array(
                'type' => '',
                'title' => $developer.'.'.$module,
                'icon' => '',
                'url' => $params['currentUrlClean'] . "?developer=" . $developer . "&module=" . $module
            );

            // Edit
            if ( isset( $_GET['id'] ) ) {

                $id = $util->sanitize( $_GET['id'] );
                $site['page']['editList'] = 'edit';

                $paramLevels[] = array(
                    'type' => '',
                    'title' => $id,
                    'icon' => '',
                    'url' => $params['currentUrlClean'] . "?developer=" . $developer . "&module=" . $module
                );

                /*
                $site['page']['editLink'] = ;
                $site['page']['listLink'] = ;

                // for new
                $devModule =  $site['page']['viewParent'] ? '&developer=' . $developer . '&module='.$module : '';
                $parRoot = isset( $data['parent'] ) ? '&parent='.$data['parent'] : '';
                $devModulePar = $devModule . $parRoot;
                $urlParams = $devModulePar ? '?' . ltrim( $devModulePar , '&' ) : '';
                //$par = isset( $moduleData['parent'] ) ? $devStuff . '&parent='.$moduleData['parent'] : '';


                // for update
                $devModule =  $site['page']['viewParent'] ? '&developer=' . $developer . '&module='.$module : '';
                $parRoot = isset( $data['parent'] ) ? '&parent='.$data['parent'] : '';
                $devModulePar = $devModule . $parRoot;
                $urlParams = $devModulePar ? '?' . ltrim( $devModulePar , '&' ) : '';
                $urlParamsNew = $devModulePar ? '?' . ltrim( $devModulePar , '&' ).'&id=new' : '?id=new';
                $urlParamsNewInto = $devModulePar ? '?' . ltrim( $devModulePar , '&' ).'&id=new&type=into&entry=' . $data['entry'] : '?id=new&type=into&entry=' . $data['entry'];
*/

                // new entry
                if ( $id == 'new' )
                    $site['entry'] = array(
                        'type' => 'edit',
                        'options' => array(
                            'developer' => $developer,
                            'module' => $module,
                            'id' => 'new',
                            'link' => '',
                            'linkUrl' => ''
                        ),
                        'actions' => array(
                            'options' => array(),
                            'buttons' => array(
                                'back' => array(
                                    'value' => 'Back',
                                    'link' => $params['levels'][$params['currentLevel']]['url'] . '?developer=' . $developer . '&module=' . $module,
                                    'icon' => 'arrow_left',
                                    'position' => 'left'
                                ),
                                'create' => array(
                                    'value' => 'Save & close',
                                    'icon' => 'save',
                                    'position' => 'left',
                                    'name' => 'create',
                                    'type' => 'submit'
                                ),
                                'createOpen' => array(
                                    'value' => 'Save',
                                    'icon' => 'save',
                                    'position' => 'left',
                                    'name' => 'createOpen',
                                    'type' => 'submit'
                                )
                            )
                        ),
                        'subactions' => array(
                            //'dimensions' => $dimensions,
                            'lang' => $site['lang'],
                            'buttons' => array(
                                'langSwitcher' => array(
                                    'value' => '',
                                    //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                                    'icon' => 'arrow_left',
                                    'position' => 'medium-offset-9'
                                )
                            )
                        )
                    );
                // update entry
                else
                    $site['entry'] = array(
                        'type' => 'edit',
                        'options' => array(
                            'developer' => $developer,
                            'module' => $module,
                            'id' => $id,
                            'link' => '',
                            'linkUrl' => ''
                        ),
                        'actions' => array (
                            'options' => array(),
                            'buttons' => array(
                                'back' => array(
                                    'value' => 'Back',
                                    'link' => $params['levels'][$params['currentLevel']]['url'] . '?developer=' . $developer . '&module=' . $module, //.$urlParams
                                    'icon' => 'arrow_left',
                                    'position' => 'left'
                                ),
                                'update' => array(
                                    'value' => 'Save & close',
                                    'icon' => 'save',
                                    'position' => 'left',
                                    'name' => 'update',
                                    'type' => 'submit'
                                ),
                                'save' => array(
                                    'value' => 'Save',
                                    'icon' => 'save',
                                    'position' => 'left',
                                    'name' => 'save',
                                    'type' => 'submit'
                                ),
                                'createNew' => array(
                                    'value' => 'New',
                                    'link' => $params['levels'][$params['currentLevel']]['url'], //.$urlParamsNew
                                    'icon' => 'edit',
                                    'position' => 'left',
                                    'name' => 'createNew',
                                    'type' => 'submit'
                                ),
                                'createNewInto' => array(
                                    'value' => 'New into',
                                    'link' => $params['levels'][$params['currentLevel']]['url'], //.$urlParamsNewInto
                                    'icon' => 'edit',
                                    'position' => 'left',
                                    'name' => 'createNewInto',
                                    'type' => 'submit'
                                ),
                                'duplicate' => array(
                                    'value' => 'Duplicate',
                                    'icon' => 'edit',
                                    'position' => 'medium-offset-3',
                                    'type' => 'submit',
                                    'name' => 'duplicate'
                                ),
                                'sitemap' => array(
                                    'value' => 'Sitemap',
                                    'icon' => 'list',
                                    'position' => '',
                                    'name' => 'sitemap'
                                ),
                                'delete' => array(
                                    'value' => 'Delete',
                                    'link' => '#',
                                    'icon' => 'delete',
                                    'position' => 'right',
                                    'type' => 'submit',
                                    'name' => 'delete'
                                )
                            )
                        ),
                        'subactions' => array(
                            //'dimensions' => $dimensions,
                            'lang' => $site['lang'],
                            'buttons' => array(
                                'langSwitcher' => array(
                                    'value' => '',
                                    //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                                    'icon' => 'arrow_left',
                                    'position' => 'medium-offset-9'
                                )
                            )
                        )
                    );
            }
            else
                $site['entry'] = array(
                    'type' => 'list',
                    'list' => array(
                        'options' => array(
                            'developer' => $developer,
                            'module' => $module,
                            'link' => 'list',
                            'linkUrl' => $params['levels'][1]['url'] . "?developer=" . $developer . "&module=" . $module. "&id="
                        )
                    ),
                    'actions' => array (
                        'options' => array(),
                        'buttons' => array(
                            'back' => array(
                                'value' => 'Nazaj',
                                'link' => $params['levels'][1]['url'],
                                'icon' => 'arrow_left',
                                'position' => 'left'
                            ),
                            'new' => array(
                                'value' => 'Nov',
                                'action' => 'new',
                                'link' => $params['currentUrlClean'] . "?developer=" . $developer . "&module=" . $module. "&id=new",
                                'icon' => 'edit',
                                'position' => 'left'
                            )
                        )
                    ),
                    'subactions' => array(
                        'buttons' => array(
                            'filterEntries' => array(
                                'value' => '',
                                //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                                'icon' => 'arrow_left',
                                'position' => 'left'
                            )
                        )
                    )
                );

        }
        // Modules page
        else
            $site['entry'] = array(
                'type' => 'list',
                'list' => array(
                    'options' => array(
                        'developer' => $data['developer'],
                        'module' => $data['module'],
                        'link' => 'modules',
                        'linkUrl' => ''
                    )
                ),
                'actions' => array (
                    'options' => array(),
                    'buttons' => array(
                        'back' => array(
                            'value' => 'Back',
                            'link' => $params['levels'][$params['currentLevel']-1]['url'],
                            'icon' => 'arrow_left',
                            'position' => 'left'
                        )
                    )
                ),
                'subactions' => array(
                    'buttons' => array(
                        'filterEntries' => array(
                            'value' => '',
                            //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                            'icon' => 'arrow_left',
                            'position' => 'left'
                        )
                    )
                )
            );

        return $paramLevels;

    }
    public function createModuleTable ( $site, $developer, $module ) {

        global $config;

        $util = new DCUtil();

        $insert = "CREATE TABLE IF NOT EXISTS ".$site['db'].".`DC".$developer.$module."` (";

        $entries = '';
        // Add columns
        $cols = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesCols WHERE developer='".$developer."' AND module='".$module."' ORDER BY `order` ASC;",'fetch_array');
        if ( $cols )
            foreach ( $cols AS $col ) {

                // List element
                $el = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElements WHERE developer='".$col['elementDeveloper']."' AND element='".$col['element']."';",'fetch_one');

                $entries .= "`".$el['element']."` ".$el['colType'];

                if ( $el['colLength'] )
                    $entries .= "(".$el['colLength'].")";

                $entries .= " ".$el['colNull'].",";

            }

        // Add dimension columns
        $dimensions = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesDimensions WHERE developer='".$developer."' AND module='".$module."' ORDER BY level ASC;",'fetch_array');
        foreach ( $dimensions AS $dimension ) {

            $el = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElements WHERE developer='".$dimension['elementDeveloper']."' AND element='".$dimension['element']."';",'fetch_one');
            $entries .= "`".$dimension['element']."` ".$el['colType']."(".$el['colLength'].") ".$el['colNull'].",";
        }

        // Add indexes
        $keys = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesKeys WHERE developer='".$developer."' AND module='".$module."' ORDER BY `order` ASC;",'fetch_array');
        if ( $keys )
            foreach ( $keys AS $key ) {

                //KEY `id` (`id`),
                //KEY `name` (`name`),
                //KEY `lang` (`lang`)
            }

        $insert .= rtrim($entries,',').") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

        $util->dominoSql($insert,'insert');

        // Insert tables for all parents
        $children = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesParent WHERE developerRel='".$developer."' AND moduleRel='".$module."' ORDER BY developer,module ASC;",'fetch_array');
        if ( $children )
            foreach ( $children AS $child ) {

                $this->createModuleTable($site,$child['developer'],$child['module']);
            }

        // Insert tables for all dependent
        $children = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesDependent WHERE developer='".$developer."' AND module='".$module."' ORDER BY developer,module ASC;",'fetch_array');
        if ( $children )
            foreach ( $children AS $child ) {
                $this->createModuleTable($site,$child['developerRel'],$child['moduleRel']);
            }



    }
    public function updateModuleTable ( $site, $developer, $module ) {

        global $config;
        $util = new DCUtil();

        // Check columns
        $cols = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesCols WHERE developer='".$developer."' AND module='".$module."' ORDER BY `order` ASC;",'fetch_array');
        if ( $cols )
            foreach ( $cols AS $col ) {

                // Check table for col
                $colExist = $util->dominoSql("select ".$col['element']." FROM ".$site['db'].".DC".$developer.$module.";",'fetch_one');
                if ( !$colExist ) {

                    $el = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElements WHERE developer='".$col['elementDeveloper']."' AND element='".$col['element']."';",'fetch_one');

                    $colLen = $el['colLength'] ? "(".$el['colLength'].")" : '';
                    $util->dominoSql( "ALTER TABLE ".$site['db'].".DC".$developer.$module." ADD `".$col['element']."` ".$el['colType'].$colLen." ".$el['colNull'].";", 'add');
                    //print "\n\rALTER TABLE ".$identity['db'].".DC".$developer.$module." ADD `".$col['element']."` ".$el['colType'].$colLen." ".$el['colNull'].";"."|";
                }
            }

        // Check dimension columns
        $dimensions = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesDimensions WHERE developer='".$developer."' AND module='".$module."' ORDER BY level ASC;",'fetch_array');
        foreach ( $dimensions AS $dimension ) {

            // Check table for dimension col
            $colExist = $util->dominoSql("select ".$dimension['element']." FROM ".$site['db'].".DC".$developer.$module.";",'fetch_one');
            if ( !$colExist ) {
                $el = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElements WHERE developer='" . $dimension['elementDeveloper'] . "' AND element='" . $dimension['element'] . "';", 'fetch_one');

                $util->dominoSql("ALTER TABLE " . $site['db'] . ".DC" . $developer . $module . " ADD `" . $dimension['element'] . "` " . $el['colType'] . "(" . $el['colLength'] . ") " . $el['colNull'] . ";", 'add');
            }
        }

        // Insert tables for all parents
        $children = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesParent WHERE developerRel='".$developer."' AND moduleRel='".$module."' ORDER BY developer,module ASC;",'fetch_array');
        if ( $children )
            foreach ( $children AS $child ) {
                $this->updateModuleTable($site,$child['developer'],$child['module']);
            }

        // Insert tables for all dependent
        $children = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesDependent WHERE developer='".$developer."' AND module='".$module."' ORDER BY developer,module ASC;",'fetch_array');
        if ( $children )
            foreach ( $children AS $child ) {
                $this->updateModuleTable($site,$child['developerRel'],$child['moduleRel']);
            }

        // Check indexes

    }
}