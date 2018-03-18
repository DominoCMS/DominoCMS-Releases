<?php

require_once ( $config['libRoot'] . "DJS1-SF6-D1/items/Domino/Admin/Entry/controller.php" );
class DominoAdminEntryEditController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function editAction ( $data ) {

        $funct = ( $data['options']['id'] === "new" ) ? 'newEntry' : 'editEntry';

        return $this->$funct($data);
    }
    public function newEntry ( $data ) {

        global $config;
        global $params;
        global $site;
        $util = new DCUtil();
        $entryClass = new DominoAdminEntryController();

        $db = isset( $data['db'] ) ? $data['db'] : $site['db'];

        $libModule = $entryClass->moduleVars( $data['options']['developer'], $data['options']['module'] );
        $colsMain = $entryClass->getColsMain( $data['options']['developer'], $data['options']['module'] );

        $dimensions = array();

        $structureData = array(
            'options' => $data['options'],
            'dimensions' => array(),
            'moduleData' => array()
        );

        // Last Entry SiteIndexData
        $siteIndexData = null;
        if ( $libModule['moduleType'] == 'index' ) {
            $siteIndexData = $util->dominoSql("select * FROM " . $db . ".DCDominoSiteIndex WHERE developer='" . $data['options']['developer'] . "' AND module='" . $data['options']['module'] . "' ORDER BY `order` DESC LIMIT 1;", 'fetch_one');
            if ( $siteIndexData )
                foreach($siteIndexData as $key => $value)
                    $structureData['moduleData'][$key] = $value;

            $structureData['moduleData']['developer'] = $data['options']['developer'];
            $structureData['moduleData']['module'] = $data['options']['module'];
            $structureData['moduleData']['id'] = 'new';
            $structureData['moduleData']['order'] = isset( $structureData['moduleData']['order'] ) ? ( $structureData['moduleData']['order'] + 1 ) : 1;

            /*if ( isset( $_GET['parent'] ) )
                    $moduleData['parent'] = $_GET['parent'];
                if ( isset( $_GET['entry'] ) ) {
                    $entry = $_GET['entry'];
                    $siteIndexData = $util->dominoSql("select * FROM " . $db . ".DCDominoSiteIndex WHERE entry='" . $entry . "';", 'fetch_one');
                    if ( $siteIndexData )
                        foreach($siteIndexData as $key => $value)
                            $moduleData[$key] = $value;

                    if ( $_GET['type'] == 'into' )
                        $moduleData['parent'] = $entry;


                    if ( isset( $_GET['type'] ) ) {
                        if ( $_GET['type'] == 'before' )
                            $moduleData['order'] = $moduleData['order'];
                        else if ( $_GET['type'] == 'after' )
                            $moduleData['order'] = $moduleData['order'] + 1;
                        else if ( $_GET['type'] == 'into' )
                            $moduleData['order'] = 1;
                    }

                }*/
        }

        // Get the dimensions
        $dimSql = $entryClass->getDimensions( $data['options']['developer'], $data['options']['module'] );
        if ( $dimSql )
            foreach ( $dimSql AS $dimension ) {

                // get the instances (languages, regions) of a dimension for this identity
                $dimensionModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$dimension['dimensionDeveloper']."' AND module='".$dimension['dimensionModule']."';", 'fetch_one');
                $dimensionInstances = $util->dominoSql("select * FROM " . $db . ".DC".$dimension['dimensionDeveloper'].$dimension['dimensionModule']." ORDER BY ".$dimensionModule["queryOrderBy"]." ".$dimensionModule["querySort"].";", 'fetch_array');

                $dimensionColsMain = $entryClass->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);

                $inst = array();
                if ( $dimensionInstances )
                    foreach ( $dimensionInstances AS $instance ) {

                        $colMain = $dimensionColsMain[0]['element'];

                        //$add = " AND ".$dimension['element']."='".$instance[$colMain]."'";

                        $structureData['dimensions'][] = array(
                            'id' => $instance[$colMain],
                            'name' => $instance[$colMain]
                        );
                        $structureData['moduleData'][$instance[$colMain]] = array();

                    }
            }

        $title = array(
            'entry' => '',
            'developer' => $data['options']['developer'],
            'module' => $data['options']['module'],
            'id' => $data['options']['id'],
            'name' => '',
            'created' => array(
                'date' => '',
                'user' => ''
            ),
            'lastChange' => array(
                'date' => '',
                'user' => ''
            )
        );
        $data['subactions']['dimensions'] = $structureData['dimensions'];

        $ret = array(
            'options' => $data['options'],
            'dimensions' => $structureData['dimensions'],
            'structure' => $entryClass->moduleStructure( $structureData, 0 ),
            'title' => $title,
        );
        if ( isset( $data['actions'] ) )
            $ret['actions'] = $data['actions'];
        if ( isset( $data['subactions'] ) )
            $ret['subactions'] = $data['subactions'];

        return $ret;

    }
    public function editEntry ( $data ) {

        global $config;
        global $params;
        global $site;

        $util = new DCUtil();
        $entryClass = new DominoAdminEntryController();

        $db = isset( $data['db'] ) ? $data['db'] : $site['db'];

        $libModule = $entryClass->moduleVars( $data['options']['developer'], $data['options']['module'] );
        $colsMain = $entryClass->getColsMain( $libModule['developer'], $libModule['module'] );

        $queryWhere = $entryClass->getColsMainWhere( $colsMain, $data['options']['id'] );

        $structureData = array(
            'options' => $data['options'],
            'dimensions' => array(),
            'moduleData' => array()
        );

        // Get the dimensions
        $dimSql = $entryClass->getDimensions( $data['options']['developer'], $data['options']['module'] );

        if ( !$dimSql )
            $structureData['moduleData'] = $util->dominoSql("select * FROM " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " WHERE " . ltrim($queryWhere, ' AND ') . ";", 'fetch_one');
        else {
            foreach ( $dimSql AS $dimension ) {

                $dimensionModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$dimension['dimensionDeveloper']."' AND module='".$dimension['dimensionModule']."';", 'fetch_one');
                $dimensionInstances = $util->dominoSql("select * FROM " . $db . ".DC".$dimension['dimensionDeveloper'].$dimension['dimensionModule']." ORDER BY ".$dimensionModule["queryOrderBy"]." ".$dimensionModule["querySort"].";", 'fetch_array');

                $dimensionColsMain = $entryClass->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);

                foreach ( $dimensionInstances AS $instance ) {

                    $colMain = $dimensionColsMain[0]['element'];

                    $add = " AND ".$dimension['element']."='".$instance[$colMain]."'";

                    $structureData['dimensions'][] = array(
                        'id' => $instance[$colMain],
                        'name' => $instance[$colMain]
                    );

                    $structureData['moduleData'][$instance[$colMain]] = $util->dominoSql("select * FROM " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " WHERE " . ltrim( $queryWhere, ' AND ' ) . $add . ";", 'fetch_one');
                }
            }
        }
        if ( $data['options']['module'] == 'SiteCross' || $data['options']['module'] == 'SiteCrossPictures' ) {

        }
        else
            $structureData['moduleData']['entry'] = $data['options']['id'];


        // SiteIndexData
        if ( $libModule['moduleType'] == 'index' ) {
            $siteIndexData = $util->dominoSql("select * FROM " . $db . ".DCDominoSiteIndex WHERE developer='" . $data['options']['developer'] . "' AND module='" . $data['options']['module'] . "' AND id='" . $data['options']['id'] . "';", 'fetch_one');
            if ( $siteIndexData )
                foreach( $siteIndexData as $key => $value )
                    $structureData['moduleData'][$key] = $value;
        }


        $title = array(
            'entry' => $data['options']['developer'].".".$data['options']['module'].".".$data['options']['id'],
            'developer' => $data['options']['developer'],
            'module' => $data['options']['module'],
            'id' => $data['options']['id'],
            'name' => isset ( $data['name'] ) ? $data['name'] : '',
            'created' => array(
                'date' => '',
                'user' => ''
            ),
            'lastChange' => array(
                'date' => '',
                'user' => ''
            )
        );

        $data['subactions']['dimensions'] = $structureData['dimensions'];

        $ret = array(
            'options' => $data['options'],
            'dimensions' => $structureData['dimensions'],
            'structure' => $entryClass->moduleStructure( $structureData, 0),
            'title' => $title,
        );
        if ( isset( $data['actions'] ) )
            $ret['actions'] = $data['actions'];
        if ( isset( $data['subactions'] ) )
            $ret['subactions'] = $data['subactions'];

        return $ret;

    }
    public function createAction ( $data ) {

        global $site;
        global $config;

        $util = new DCUtil();
        $date = new DCDate();
        $entryClass = new DominoAdminEntryController();

        $db = $config['db'];

        $debug = array();
        $libModule = $entryClass->moduleVars( $data['options']['developer'], $data['options']['module'] );
        $colsMain = $entryClass->getColsMain( $libModule['developer'], $libModule['module'] );
        $structureCols = $entryClass->structureCols( $libModule['developer'], $libModule['module'] );
        $moduleColsArr = $entryClass->moduleColsArr( $libModule['developer'], $libModule['module'] );
        $dimSql = $entryClass->getDimensions( $data['options']['developer'], $data['options']['module'] );
        $moduleData = array();

        if ( $libModule['increment'] == 1 ) {
            // last id
            $colMain = $colsMain[0]['element'];
            $lastEntry = $util->dominoSql("select ".$colMain." FROM " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " ORDER BY CAST(".$colMain." AS UNSIGNED) DESC LIMIT 1;", 'fetch_one');
            $data['options']['id'] = $lastEntry['id'] + 1;
        }

        ####################################################################################
        ### Run Custom Module Controller - BEFORE
        ####################################################################################

        $entryClass->runModuleAction( $data, $data['options']['developer'], $data['options']['module'], 'beforeCreate' );

        ####################################################################################
        ### Insert into SiteIndex
        ####################################################################################

        if ( $libModule['moduleType'] == 'index' ) {

            $indexFields = '';
            $indexValues = '';

            if ( $libModule['increment'] != 1 ) // generate id from fields
                $data['options']['id'] = $entryClass->getColsMainId( $data['formData'], $colsMain );

            $indexFields = 'entry,developer,module,id';
            $indexValues = "'" . $data['options']['developer'] . "." . $data['options']['module'] . "." . $data['options']['id'] . "','" . $data['options']['developer'] . "','" . $data['options']['module'] . "','" . $data['options']['id'] . "'";

            if ( isset( $data['formData']['parent'] ) ) {
                $parent = explode(".",$data['formData']['parent']);
                $data['formData']['parentDeveloper'] = ( count($parent) == 3 ) ? $parent[0] : '';
                $data['formData']['parentModule'] = ( count($parent) == 3 ) ? $parent[1] : '';
                $data['formData']['parentId'] = ( count($parent) == 3 ) ? $parent[2] : '';
                $indexFields .= ',parent,parentDeveloper,parentModule,parentId';
                $indexValues .= ",'".$data['formData']['parent']."','".$data['formData']['parentDeveloper']."','".$data['formData']['parentModule']."','".$data['formData']['parentId']."'";
            }
            else
                $data['formData']['parent'] = '';

            $data['formData']['id'] = $data['options']['id'];
            $data['formData']['developer'] = $data['options']['developer'];
            $data['formData']['module'] = $data['options']['module'];
            $data['formData']['entry'] = $data['options']['developer'] . "." . $data['options']['module'] . "." . $data['options']['id'];

            $indexFields .= ',status';
            $indexValues .= ",'". ( isset( $data['formData']['status'] ) ? $data['formData']['status'] : 1 )."'";

            if ( isset( $data['formData']['order'] ) ) {
                $indexFields .= ',`order`';
                $indexValues .= ",'".$data['formData']['order']."'";
            }
            else {
                // always add maximum SiteIndex order based on parent
                $entriesInParent = $util->dominoSql("select COUNT(status) AS entries FROM " . $db . ".DCDominoSiteIndex WHERE parent='".$data['formData']['parent']."';", 'fetch_one');
                $indexFields .= ',`order`';
                $data['formData']['order'] = ( $entriesInParent['entries'] + 1 ) ;
                $indexValues .= ",'". $data['formData']['order'] ."'";
            }
            if ( isset( $data['formData']['privacy'] ) ) {
                $indexFields .= ',privacy';
                $indexValues .= ",'".$data['formData']['privacy']."'";
            }
            if ( isset( $data['formData']['views'] ) ) {
                $indexFields .= ',views';
                $indexValues .= ",'".$data['formData']['views']."'";
            }
            if ( isset( $data['formData']['ghost'] ) ) {
                $indexFields .= ',ghost';
                $indexValues .= ",'".$data['formData']['ghost']."'";
            }
            if ( isset( $data['formData']['icon'] ) ) {
                $indexFields .= ',icon';
                $indexValues .= ",'".$data['formData']['icon']."'";
            }

            // update all order in the same parent +1
            $update = $util->dominoSql("UPDATE " . $db . ".DCDominoSiteIndex SET `order`=`order`+1 WHERE parent='". $data['formData']['parent'] ."' AND `order`>=".$data['formData']['order'].";", 'update');
            $debug["SiteIndexOrder"] = "UPDATE " . $db . ".DCDominoSiteIndex SET `order`=`order`+1 WHERE parent='". $data['formData']['parent'] ."' AND `order`>=".$data['formData']['order'].";";

            $insert = $util->dominoSql("INSERT INTO " . $db . ".DCDominoSiteIndex (" . $indexFields . ") VALUES (" . $indexValues . ");", 'insert');
            $debug["SiteIndex"] = "INSERT INTO " . $db . ".DCDominoSiteIndex (" . $indexFields . ") VALUES (" . $indexValues . ");";


        }

        ####################################################################################
        ### Insert into Module table
        ####################################################################################

        // NO DIMENSIONS

        if ( !$dimSql ) {

            if ( $libModule['increment'] == 1 ) {
                $fields = 'id,';
                $values = "'".$data['options']['id']."',";
            }
            else {
                $fields = '';
                $values = '';
            }

            $entryEmpty = NULL;
            if ( $structureCols )
                foreach ( $structureCols AS $structureCol ) {

                    // only insert into module table if element exists in module table
                    if ( in_array($structureCol['element'], $moduleColsArr ) ) {

                        // if field is sent, give the value or set it to empty
                        $valueField = isset ( $data['formData'][$structureCol['element']] ) ? $data['formData'][$structureCol['element']] : '';

                        // format value to the custom structure element
                        $FormatValue = $entryClass->formatFieldValue( 'prepareInsert', $data['formData'], $structureCol, $libModule, '' );
                        $valueField = $FormatValue ? $FormatValue : $valueField;

                        if ( $valueField )
                            $entryEmpty = 1;

                        if ( $valueField !== 'ignore' ) {
                            $fields .= "`" . $structureCol['element'] . "`,";
                            $values .= "'" . $entryClass->prepareInsert( $valueField ) . "',";
                        }

                    }
                }

            if ( $data['options']['module'] == 'SiteCrossPictures' || $data['options']['module'] == 'SiteCross' ) {

                $formEntry = explode(".",$data['formData']['entry']);
                $formEntryRel = explode(".",$data['formData']['entryRel']);

                $fields .= "developer,module,id,";
                $values .= "'".$formEntry[0]."','".$formEntry[1]."','".$formEntry[2]."',";
                $fields .= "developerRel,moduleRel,idRel,";
                $values .= "'".$formEntryRel[0]."','".$formEntryRel[1]."','".$formEntryRel[2]."',";


            }


            if ( $entryEmpty !== NULL )
                $insert = $util->dominoSql("INSERT INTO " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " (" . rtrim($fields, ',') . ") VALUES (" . rtrim($values, ',') . ");", 'insert');
            $debug["NoDimension"] = "INSERT INTO " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " (" . rtrim($fields, ',') . ") VALUES (" . rtrim($values, ',') . ");";
        }
        else { // DIMENSIONS

            // insert into module table
            foreach ( $dimSql AS $dimension ) {

                $dimensionModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$dimension['dimensionDeveloper']."' AND module='".$dimension['dimensionModule']."';", 'fetch_one');
                $dimensionInstances = $util->dominoSql("select * FROM " . $db . ".DC".$dimension['dimensionDeveloper'].$dimension['dimensionModule']." ORDER BY ".$dimensionModule["queryOrderBy"]." ".$dimensionModule["querySort"].";", 'fetch_array');

                $dimensionColsMain = $entryClass->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);

                $inst = array();
                foreach ( $dimensionInstances AS $instance ) {

                    $colMain = $dimensionColsMain[0]['element'];

                    if ( $libModule['increment'] == 1 ) {
                        $fields = 'id,';
                        $values = "'".$data['options']['id']."',";
                    }
                    else {
                        $fields = '';
                        $values = '';
                    }

                    $entryEmpty = NULL;
                    if ( $structureCols )
                        foreach ( $structureCols AS &$structureCol ) {

                            // only insert into module table if element exists in module table
                            if ( in_array($structureCol['element'], $moduleColsArr ) ) {

                                // if structure element is dimensionable look for dimension value, otherwise use nondimension
                                if ( $structureCol['dimensional'] == true ) {
                                    $valueField = isset ($data['formData'][$instance[$colMain]][$structureCol['element']]) ? $data['formData'][$instance[$colMain]][$structureCol['element']] : '';
                                    if ( ( $valueField || ( $instance[$colMain] == $instance['lang'] ) ) )
                                        $entryEmpty = 1;
                                }
                                else
                                    $valueField = isset ( $data['formData'][$structureCol['element']] ) ? $data['formData'][$structureCol['element']] : '';


                                // format value to the custom structure element

                                $FormatValue = $entryClass->formatFieldValue( 'prepareInsert', $data['formData'], $structureCol, $libModule, $instance[$colMain] );
                                $valueField = $FormatValue ? $FormatValue : $valueField;
                                if ( $valueField !== 'ignore' ) {
                                    $fields .= "`" . $structureCol['element'] . "`,";
                                    $values .= "'" . $entryClass->prepareInsert($valueField) . "',";
                                }
                            }

                        }

                    // Add dimension
                    $fields .= "`".$dimension['element'] . "`,";
                    $values .= "'" . $instance[$colMain] . "',";

                    // INSERT 2 MODULE table
                    if ( $entryEmpty !== NULL )
                       $insert = $util->dominoSql("INSERT INTO " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " (" . rtrim($fields, ',') . ") VALUES (" . rtrim($values, ',') . ");", 'insert');
                    $debug["Dimension.". $instance[$colMain]] = "INSERT INTO " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " (" . rtrim($fields, ',') . ") VALUES (" . rtrim($values, ',') . ");";
                }
            }
        }

        ####################################################################################
        ### Run Custom Module Controller - BEFORE
        ####################################################################################

        $entryClass->runModuleAction( $data, $data['options']['developer'], $data['options']['module'], 'afterCreate' );


        ####################################################################################
        ### Insert Timestamp
        ####################################################################################

        global $user;
        $date = new DCDate();
        $insert = $util->dominoSql("INSERT INTO " . $db . ".DCDominoTimestamps (developer,module,id,userId,dateCreated) VALUES ('".$data['options']['developer']."','".$data['options']['module']."','".$data['options']['id']."','".$user['id']."','".$date->dateNowInt()."');", 'insert');

        global $params;
        return array(
            'debug' => $debug,
            'link' => $params['levels'][3]['url'] . '?developer=' . $data['options']['developer'] . '&module=' . $data['options']['module'] . '&id=' . $data['options']['id']
        );
    }
    public function updateAction ( $data ) {

        global $site;
        global $config;

        $util = new DCUtil();
        $date = new DCDate();
        $entryClass = new DominoAdminEntryController();
        $debug = array();

        $db = $config['db'];
        $libModule = $entryClass->moduleVars( $data['options']['developer'], $data['options']['module'] );
        $colsMain = $entryClass->getColsMain( $libModule['developer'], $libModule['module'] );
        $structureCols = $entryClass->structureCols( $libModule['developer'], $libModule['module'] );
        $moduleColsArr = $entryClass->moduleColsArr( $libModule['developer'], $libModule['module'] );

        $queryWhere = $entryClass->getColsMainWhere( $colsMain, $data['options']['id'] );
        $indexQuery = '';

        $dimSql = $entryClass->getDimensions( $data['options']['developer'], $data['options']['module'] );
        $moduleData = array();

        ##########################################
        ### Change ID if it changes
        ##########################################

        if ( $libModule['increment'] != 1 ) {
            $newIdValue = $entryClass->getColsMainId( $data['formData'], $colsMain );

            if ( $newIdValue != $data['options']['id'] ) {

                $changeIdModuleTableQuery = "";
                //foreach( $colsMain AS $col )
                    //$changeIdModuleTableQuery .= ",`".$col['element']."`='". $data['formData'][$col['element']] ."'";

                $indexQuery .= "entry='".$data['options']['developer'].".".$data['options']['module'].".".$newIdValue."',id='" . $newIdValue . "'";
            }
        }

        ####################################################################################
        ### Run Custom Module Controller - BEFORE
        ####################################################################################

        $entryClass->runModuleAction( $data, $data['options']['developer'], $data['options']['module'], 'beforeUpdate' );


        ####################################################################################
        ### Update SiteIndex
        ####################################################################################

        if ( $libModule['moduleType'] === 'index' ) {

            if ( isset( $data['formData']['status'] ) )
                $indexQuery .= ",status='" . $data['formData']['status'] . "'";
            if ( isset( $data['formData']['privacy'] ) )
                $indexQuery .= ",privacy='" . $data['formData']['privacy'] . "'";
            if ( isset( $data['formData']['views'] ) )
                $indexQuery .= ",views='" . $data['formData']['views'] . "'";
            if ( isset( $data['formData']['icon'] ) )
                $indexQuery .= ",icon='" . $data['formData']['icon'] . "'";
            if ( isset( $data['formData']['order'] ) )
                $indexQuery .= ",`order`='" . $data['formData']['order'] . "'";
            if ( isset( $data['formData']['parent'] ) ) {
                $parent = explode(".",$data['formData']['parent']);
                $data['formData']['parentDeveloper'] = ( count($parent) == 3 ) ? $parent[0] : '';
                $data['formData']['parentModule'] = ( count($parent) == 3 ) ? $parent[1] : '';
                $data['formData']['parentId'] = ( count($parent) == 3 ) ? $parent[2] : '';
                $indexQuery .= ",`parent`='" . $data['formData']['parent'] . "',parentDeveloper='" . $data['formData']['parentDeveloper'] . "',parentModule='" . $data['formData']['parentModule'] . "',parentId='" . $data['formData']['parentId'] . "'";
            }
            $data['formData']['developer'] = $data['options']['developer'];
            $data['formData']['module'] = $data['options']['module'];
            $data['formData']['id'] = $data['options']['id'];
            $data['formData']['entry'] = $data['options']['developer'] . "." . $data['options']['module'] . "." . $data['options']['id'];

            // Update Sitemap
            if ( $indexQuery ) {
                $update = $util->dominoSql("UPDATE " . $db . ".DCDominoSiteIndex SET " . ltrim($indexQuery, ",") . " WHERE entry='" . $data['formData']['entry'] . "';", 'update');
                $debug["SiteIndex"] = "UPDATE " . $db . ".DCDominoSiteIndex SET " . ltrim($indexQuery, ",") . " WHERE entry='". $data['formData']['entry'] ."';\n";
            }
            else
                $debug["SiteIndex"] = 'no changes to SiteIndex';

            // REORDER if change in parent id and if different order

        }

        ####################################################################################
        ### Update module table
        ####################################################################################

        // NO DIMENSIONS

        if ( !$dimSql ) {

            $updateModuleQuery = '';
            if ( $structureCols )
                foreach ( $structureCols AS $structureCol ) {

                    // only insert into module table if element exists in module table
                    if ( in_array($structureCol['element'], $moduleColsArr ) ) {

                        // if field is sent, give the value or set it to empty
                        $valueField = isset ($data['formData'][$structureCol['element']]) ? $data['formData'][$structureCol['element']] : '';

                        // format value to the custom structure element
                        $FormatValue = $entryClass->formatFieldValue( 'prepareUpdate', $data['formData'], $structureCol, $libModule, '' );
                        $valueField = $FormatValue ? $FormatValue : $valueField;

                        if ( $valueField !== 'ignore' )
                            $updateModuleQuery .= ",`".$structureCol['element'] . "`='" . $entryClass->prepareInsert($valueField) . "'";
                    }
                }

            if ( isset( $changeIdModuleTableQuery ) )
                $updateModuleQuery .= $changeIdModuleTableQuery;

            if ( $data['options']['module'] == 'SiteCrossPictures' || $data['options']['module'] == 'SiteCross' ) {

                $formEntry = explode(".",$data['formData']['entry']);
                $formEntryRel = explode(".",$data['formData']['entryRel']);

                $updateModuleQuery .= ",developer='" . $formEntry[0] . "',module='" . $formEntry[1] . "',id='" . $formEntry[2] . "'";
                $updateModuleQuery .= ",developerRel='" . $formEntryRel[0] . "',moduleRel='" . $formEntryRel[1] . "',idRel='" . $formEntryRel[2] . "'";

            }


            if ( $updateModuleQuery )
                $update = $util->dominoSql("UPDATE " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " SET " . ltrim($updateModuleQuery, ',') . " WHERE ". ltrim($queryWhere, ' AND ') .";", 'update');
            $debug["NoDimension"] = "UPDATE " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " SET " . ltrim($updateModuleQuery, ',') . " WHERE ". ltrim($queryWhere, ' AND ') .";";
        }
        else { // DIMENSIONS



            foreach ( $dimSql AS $dimension ) {

                $dimensionModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$dimension['dimensionDeveloper']."' AND module='".$dimension['dimensionModule']."';", 'fetch_one');
                $dimensionInstances = $util->dominoSql("select * FROM " . $db . ".DC".$dimension['dimensionDeveloper'].$dimension['dimensionModule']." ORDER BY ".$dimensionModule["queryOrderBy"]." ".$dimensionModule["querySort"].";", 'fetch_array');

                $dimensionColsMain = $entryClass->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);
/*
                $dimensions = array();
                foreach ( $dimensionInstances AS $dim ) {
                    $dim[] = array(
                        'id' => $dimensionColsMain[0]['element'],
                        'name' => $dimensionColsMain[0]['element']
                    );
                }*/


                foreach ( $dimensionInstances AS $instance ) {

                    $fields = '';
                    $values = '';
                    // not ok when index entry and id is not single but combined
                    if ( $libModule['moduleType'] == 'index' ) {
                        $fields = 'id,';
                        $values = "'".$data['options']['id']."',";
                    }

                    $colMain = $dimensionColsMain[0]['element'];
                    $updateModuleQuery = '';
                    $dimQueryWhere = $queryWhere;
                    $entryEmpty = null;
                    if ( $structureCols )
                        foreach ( $structureCols AS $structureCol ) {

                            // only insert into module table if element exists in module table
                            if ( in_array($structureCol['element'], $moduleColsArr ) ) {

                                // if structure element is dimensionable look for dimension value, otherwise use nondimension
                                if ( $structureCol['dimensional'] == true ) {

                                    $valueField = isset ( $data['formData'][$instance[$colMain]][$structureCol['element']] ) ? $data['formData'][$instance[$colMain]][$structureCol['element']] : '';

                                    if ( ( $valueField || ( $instance[$colMain] == $instance['lang'] ) ) )
                                        $entryEmpty = 1;
                                }
                                else
                                    $valueField = isset ( $data['formData'][$structureCol['element']] ) ? $data['formData'][$structureCol['element']] : '';

                                // format value to the custom structure element
                                $FormatValue = $entryClass->formatFieldValue( 'prepareUpdate', $data['formData'], $structureCol, $libModule, $instance[$colMain] );
                                $valueField = $FormatValue ? $FormatValue : $valueField;

                                $prepareInsert = $entryClass->prepareInsert( $valueField );
                                if ( $valueField !== 'ignore' ) {
                                    $updateModuleQuery .= ",`" . $structureCol['element'] . "`='" . $prepareInsert . "'";
                                    $fields .= "`" . $structureCol['element'] . "`,";
                                    $values .= "'" . $prepareInsert . "',";
                                }

                            }

                        }

                    // Change ID if it changes
                    if ( isset( $changeIdModuleTableQuery ) )
                        $updateModuleQuery .= $changeIdModuleTableQuery;

                    $dimQueryWhere .= " AND ".$dimension['element']."='".$instance[$colMain]."'";
                    $fields .= "`".$dimension['element'] . "`,";
                    $values .= "'" . $instance[$colMain] . "',";


                    if ( $entryEmpty !== NULL ) {


                        $entryExist = $util->dominoSql("select * FROM " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . "  WHERE " . ltrim($dimQueryWhere, ' AND ') . ";", 'fetch_one');

                        if ( $entryExist ) {
                            $update = $util->dominoSql("UPDATE " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " SET " . ltrim($updateModuleQuery, ',') . " WHERE " . ltrim($dimQueryWhere, ' AND ') . ";", 'update');
                            $debug["Dimension" . $instance[$colMain]] = "UPDATE " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " SET " . ltrim($updateModuleQuery, ',') . " WHERE " . ltrim($dimQueryWhere, ' AND ') . ";";
                        }
                        else {
                            $insert = $util->dominoSql("INSERT INTO " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " (" . rtrim($fields, ',') . ") VALUES (" . rtrim($values, ',') . ");", 'insert');
                            $debug["Dimension" . $instance[$colMain]] = "INSERT INTO " . $db . ".DC" . $data['options']['developer'] . $data['options']['module'] . " (" . rtrim($fields, ',') . ") VALUES (" . rtrim($values, ',') . ");";
                        }
                    }

                    // add another instance entry if conditions met and previously doesn't yet exist
                    $insert = '';

                }
            }
        }

        ####################################################################################
        ### Run Custom Module Controller - AFTER
        ####################################################################################

        $entryClass->runModuleAction( $data, $data['options']['developer'], $data['options']['module'], 'afterUpdate' );

        ####################################################################################
        ### Insert Timestamp
        ####################################################################################

        global $user;
        $date = new DCDate();
        $insert = $util->dominoSql("INSERT INTO " . $db . ".DCDominoTimestamps (developer,module,id,userId,dateCreated) VALUES ('".$data['options']['developer']."','".$data['options']['module']."','".$data['options']['id']."','".$user['id']."','".$date->dateNowInt()."');", 'insert');

        return $debug;

    }
}