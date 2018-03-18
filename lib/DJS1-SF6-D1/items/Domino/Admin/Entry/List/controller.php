<?php

require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/controller.php');

class DominoAdminEntryListController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function listAction( $data ) {

        global $params;
        global $site;

        $entryClass = new DominoAdminEntryController();

        $list = array();
        if ( isset( $data['list'] ) ) {

            if ( !isset( $data['list']['options']['type'] ) ) {

                if ( isset( $data['list']['options']['developer'] ) && isset( $data['list']['options']['module'] ) ) {
                    $libModule = $entryClass->moduleVars( $data['list']['options']['developer'], $data['list']['options']['module'] );
                    $data['list']['options']['type'] = $libModule['moduleType'];
                }
                else if ( isset( $data['list']['options']['developer'] ) && isset( $data['list']['options']['module'] ) && isset( $data['list']['options']['developerRel'] ) && isset( $data['list']['options']['moduleRel'] ) ) {
                    $data['list']['options']['type'] = 'cross';
                }
                else
                    $data['list']['options']['type'] = 'index';
            }

            // noindex entries
            if ( $data['list']['options']['type'] == 'cross' ) $list = $this->entriesCrossAction( $data['list'] );
            else if ( $data['list']['options']['type'] == 'noindex' ) $list = $this->entriesAction( $data['list'] );
            // index entries
            else $list = $this->entriesIndexAction( $data['list'] );

        }

        $arr =  array(
            'list' => $list,
            'actions' => isset( $data['actions'] ) ? $data['actions'] : array (),
            'subactions' => isset( $data['subactions'] ) ? $data['subactions'] : array ()
        );

        if ( isset( $_GET['parent'] ) )
            $arr['moveToParent'] = $_GET['parent'];

        return $arr;
    }
    public function entriesAction ( $data ) {

        global $site;
        global $config;
        global $params;

        $util = new DCUtil();
        $entryClass = new DominoAdminEntryController();

        if ( !isset( $data['libModule'] ) ) {
            $data['libModule'] = $entryClass->moduleVars( $data['options']['developer'], $data['options']['module'] );
            $data['columns'] = $this->moduleListColumns( $data['options']['developer'], $data['options']['module'] );
        }
        else {
            $data['libModule'] = $data['libModule'];
            $data['columns'] = $data['columns'];
        }

        $queryWhere = $this->queryWhere( $data['options'], $data['columns'] );

        // addColumns
        if ( isset ( $data['options']['edit'] ) ) {

            // If status add it here

            $data['columns'][] = array(
                'id' => '',
                'uniqueId' => '',
                'status' => '',
                'developer' => '',
                'module' => '',
                'elementDeveloper' => '',
                'element' => 'bool',
                'ordem' => '',
                'width' => '50px',
                'hide' => '',
                'clickable' => '',
                'structureType' => 'edit',
                'structureName' => 'as',
                'sortable' => '',
                'name' => '',
                'structureItem' => 'Edit'
            );

            $data['columns'][] = array(
                'id' => '',
                'uniqueId' => '',
                'status' => '',
                'developer' => '',
                'module' => '',
                'elementDeveloper' => '',
                'element' => 'bool',
                'ordem' => '',
                'width' => '50px',
                'hide' => '',
                'clickable' => '',
                'structureType' => 'bool',
                'structureName' => 'as',
                'sortable' => '',
                'name' => '',
                'structureItem' => 'Delete'
            );

            // If reorder add it here

        }

        $colsMain = $entryClass->getColsMain( $data['libModule']['developer'], $data['libModule']['module'] );
        $dimSql = $entryClass->getDimensions( $data['libModule']['developer'], $data['libModule']['module'] );
        $dimensionWhere = $entryClass->getDimensionWhere( $dimSql, $data['libModule'] );

        if ( !isset( $data['pagination'] ) )
            $data['pagination'] = array(
                'entriesPerPage' => 20,
                'currentPage' => 1
            );
        else {
            $data['pagination']['entriesPerPage'] = isset( $data['pagination']['entriesPerPage'] ) ? $data['pagination']['entriesPerPage'] : 200;
            $data['pagination']['currentPage'] = isset( $data['pagination']['currentPage'] ) ? $data['pagination']['currentPage'] : 1;
        }

        $parent = isset( $data['parent'] ) ? " AND parent'". $data['parent']."'" : '';
        $status = isset( $data['status'] ) ? $data['status'] : 1;
        $data['options']['db'] = isset( $data['options']['db'] ) ? $data['options']['db'] : ( isset( $data['options']['db'] ) ? $site['db'] : $config['db'] );
        $statusBefore = ( $status == 1 ) ? '<' : '';

        $childrenAjax = true;

        $where = ( $dimensionWhere || $queryWhere ) ? ' WHERE '. ltrim( $dimensionWhere.$queryWhere, ' AND ') : '';

        if ( !isset ( $data['entries'] ) ) {
            $numEntries = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DC" . $data['libModule']['developer'] . $data['libModule']['module'] . ' mt '.$where . ";", 'num_rows');

            $entries = array();

            $entriesSql = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DC" . $data['libModule']['developer'] . $data['libModule']['module'] . ' mt '. $where . " ORDER BY mt.".$data['libModule']["queryOrderBy"]." ".$data['libModule']["querySort"]." LIMIT ".$this->queryLimit( $data['pagination'] ).";", 'fetch_array');
            if ( $entriesSql )
                foreach ( $entriesSql AS $entrySql ) {

                    $entry = array();
                    $entry['data'] = $this->entryData( $data['columns'], $entrySql);

                    $colMainId = $entryClass->getColsMainId( $entrySql, $colsMain );

                    if ( isset( $data['options']['link'] ) ) {

                        if ( $data['options']['link'] == 'modules' )
                            $entry['link'] = $data['options']['linkUrl'] . '?developer=' . $entrySql['developer'] . '&module=' . $entrySql['module'];
                        else if ( $data['options']['link'] == 'list' )
                            $entry['link'] = $data['options']['linkUrl'] . $colMainId;
                        else
                            $entry['link'] = $data['options']['linkUrl'];
                    }

                    $entry['entry'] = $colMainId;
                    $entry['id'] = $colMainId;
                    $entry['entry'] = $data['libModule']['developer'].'.'.$data['libModule']['module'].'.'.$colMainId;

                    $entry['entries'] = array();
                    if ( isset ( $entry['parent'] ) ) {
                        $data['options']['parent'] = $entry['parent'];
                        $entry['list'] = $this->entriesAction( $data );
                    }

                    $entries[] = $entry;
                }
        }
        else {
            $entries = $data['entries'];
            $numEntries = count();
        }

        $ret = array(
            'options' => $data['options'],
            'entries' => $entries,
            'columns' => $data['columns'],
            'pagination' => $this->setPagination( array(
                    'entriesPerPage' =>  $data['pagination']['entriesPerPage'],
                    'currentPage' => $data['pagination']['currentPage'],
                    'numEntries' => $numEntries
                ) )
        );

        return $ret;

    }
    function queryWhere ( $options, $columns ) {


        $queryWhere = '';
        if ( isset( $options['query'] ) ) {
            $query = rtrim(ltrim(mysql_real_escape_string($options['query'])));

            if( strlen( $query ) >= 2 ) {

                $query = str_replace("'", "\'", $query);
                $arr_words = explode(" ", $query);

                while ( list( $key, $val ) = each($arr_words ) ) {

                    $queryFields = '';
                    foreach ( $columns AS $col )
                        $queryFields .= " || mt.".$col['element']." LIKE '%$val%'";

                    if ($val <> " " && strlen( $val ) > 0)
                        $queryWhere .= ' AND ('.ltrim( $queryFields, ' || ').')';
                }
            }
        }

        return $queryWhere;

    }
    function queryLimit( $pagination ) {

        return ( ( $pagination['currentPage'] - 1 ) * $pagination['entriesPerPage'] ).",".$pagination['entriesPerPage'];

    }
    function setPagination ( $data ) {

        $translate = new DCLibModulesDominoTranslate();
        $paginationTranslate = $translate->showTranslate(array('page','pageOf','allEntries'));

        return array(
            'translate' => $paginationTranslate,
            'currentPage' => $data['currentPage'],
            'pages' => ceil ( $data['numEntries'] / $data['entriesPerPage'] ),
            'numEntries' => $data['numEntries'],
            'paginate' => true,
            'entriesPerPageOptions' => '10,20,50,100',
            'entriesPerPage' => $data['entriesPerPage']
        );

    }
    public function moduleListColumns( $developer, $module ) {

        global $site;
        global $config;
        $util = new DCUtil();

      
        // core structure
        //if ( !$list )
        $list = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesListStructure WHERE developer='".$developer."' AND module='".$module."' ORDER BY ordem ASC;", 'fetch_array');

        if ( $list )
            foreach ($list AS &$entry) {

                // 1. column name
                $entry['name'] = $entry['element'];

                $entry['structureItem'] = ucfirst($entry['structureType']);

                // 2. default element name
                $name = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElementsNames WHERE element='".$entry['element']."' AND lang='".$site['lang']."';", 'fetch_one');
                if ( $name['name'] )
                    $entry['name'] = $name['name'];

                // 3. overide with translation
                $name = $util->dominoSql("select name FROM " . $config['db'] . ".DCDominoLibModulesColsNames WHERE developer='".$site['page']['developer']."' AND module='".$site['page']['module']."' AND elementDeveloper='".$entry['developer']."' AND element='".$entry['element']."' AND lang='".$site['lang']."';", 'fetch_one');

                if ( $name['name'] )
                    $entry['name'] = $name['name'];


            }
        return $list;
    }
    public function moduleListColumnsDisplay( $developer, $module ) {

        global $site;
        global $config;
        $util = new DCUtil();

        //custom structure
        $list = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoModulesListStructure WHERE developer='".$developer."' AND module='".$module."' AND clickable=1 ORDER BY ordem ASC;", 'fetch_array');

        // core structure
        if ( !$list )
            $list = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesListStructure WHERE developer='".$developer."' AND module='".$module."' AND clickable=1 ORDER BY ordem ASC;", 'fetch_array');

        if ( $list )
            foreach ($list AS &$entry) {

                // 1. column name
                $entry['name'] = $entry['element'];

                $entry['structureItem'] = ucfirst($entry['structureType']);

                // 2. default element name
                $name = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElementsNames WHERE element='".$entry['element']."' AND lang='".$site['lang']."';", 'fetch_one');
                if ( $name['name'] )
                    $entry['name'] = $name['name'];

                // 3. overide with translation
                $name = $util->dominoSql("select name FROM " . $config['db'] . ".DCDominoLibModulesColsNames WHERE developer='".$site['page']['developer']."' AND module='".$site['page']['module']."' AND elementDeveloper='".$entry['developer']."' AND element='".$entry['element']."' AND lang='".$site['lang']."';", 'fetch_one');

                if ( $name['name'] )
                    $entry['name'] = $name['name'];


            }
        return $list;
    }
    function entryData ( $columns, $data ) {

        global $config;

        $entryCols = array();

        foreach ( $columns AS $col ) {

            $elItem = ucfirst($col['structureType']);
            $ClassFile = $config['libRoot']."DJS1-SF6-D1/items/Domino/Admin/Entry/List/Field/".$elItem."/controller.php";

            $colData = null;
            if ( file_exists ( $ClassFile ) ) {
                require_once ( $ClassFile );

                $controllerName = "DominoAdminEntryListField".$elItem."Controller";
                if ( class_exists ( $controllerName ) ) {
                    $structureClass = new $controllerName();

                    if ( $structureClass ) {
                        if ( method_exists ( $structureClass, 'listStructureData' ) )
                            $colData = $structureClass->listStructureData( $col, $data );
                    }
                }
            }

            $entryCols[] = ( $colData !== null ) ? $colData : ( isset ( $data[$col['element']] ) ? $data[$col['element']] : 'krneki' );

        }

        return $entryCols;
    }
    public function entriesIndexAction ( $data ) {

        global $site;
        global $config;
        global $params;

        $data['options']['db'] = isset( $data['options']['db'] ) ? $data['options']['db'] : isset( $site['db'] ) ? $site['db'] : $site['db'];

        $util = new DCUtil();
        $entryClass = new DominoAdminEntryController();

        if ( !isset( $data['pagination'] ) )
            $data['pagination'] = array(
                'entriesPerPage' => 20,
                'currentPage' => 1
            );
        else {
            $data['pagination']['entriesPerPage'] = isset( $data['pagination']['entriesPerPage'] ) ? $data['pagination']['entriesPerPage'] : 200;
            $data['pagination']['currentPage'] = isset( $data['pagination']['currentPage'] ) ? $data['pagination']['currentPage'] : 1;
        }

        if ( isset( $data['options']['parent'] ) )
            $parent = isset( $data['options']['parent'] ) ? " AND si.parent='" . $data['options']['parent'] . "'" : " AND si.parent=''";
        else
            $parent = " AND si.parent=''";

        $parentSel = isset( $data['options']['parent'] ) ? $data['options']['parent'] : '';
        $developerWhere = isset( $data['options']['developer'] ) ? " AND si.developer='" . $data['options']['developer'] . "'" : '';
        $moduleWhere = isset( $data['options']['module'] ) ? " AND si.module='" . $data['options']['module'] . "'" : '';
        $status = isset( $data['options']['status'] ) ? $data['options']['status'] : 1;
        $statusBefore = ( $status == 1 ) ? '<' : '';
        $childrenAjax = true;

        $entries = array();
        $columns = $this->moduleListColumnsDisplay( 'Domino', 'Content' );

        $queryWhere = '';
        $whereDevModList = ( isset( $data['options']['siteIndex'] ) && isset( $data['options']['siteIndexHack'] ) ) ? '' : $developerWhere. $moduleWhere;

        // Count entries
        if ( isset( $data['options']['developer'] ) && isset( $data['options']['module'] ) )
            $numEntries = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSiteIndex si JOIN " . $data['options']['db'] . ".DC" . $data['options']['developer'] . $data['options']['module'] . " mt ON ( mt.id = si.id ) WHERE si.status". $statusBefore ."='" . $status . "'" . $parent . $whereDevModList . $queryWhere . ";", 'num_rows');
        else
            $numEntries = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSiteIndex si WHERE si.status". $statusBefore ."='" . $status . "'" . $parent . $whereDevModList . ";", 'num_rows');

        $distinctSql = $util->dominoSql("select DISTINCT(module),developer FROM " . $data['options']['db'] . ".DCDominoSiteIndex si WHERE si.status". $statusBefore ."='" . $status . "' AND si.parent='" . $parentSel . "'" . $whereDevModList . " ORDER BY si.module ASC;", 'fetch_array');

        if ( $distinctSql )
            foreach ( $distinctSql AS $distinctModule ) {

                $developer = $distinctModule['developer'];//$distinctModule['developer'];
                $module = $distinctModule['module'];
                $libModule = $entryClass->moduleVars( $developer, $module );
                if ( !isset( $data['options']['siteIndex'] ) )
                    $columns = $this->moduleListColumns( $developer, $module );

                $queryWhere = $this->queryWhere( $data['options'], $columns );
                // addColumns
                if ( isset ( $data['options']['edit'] ) ) {

                    $columns[] = array(
                        'id' => '',
                        'uniqueId' => '',
                        'status' => '',
                        'developer' => '',
                        'module' => '',
                        'elementDeveloper' => '',
                        'element' => 'status',
                        'ordem' => '',
                        'width' => '50px',
                        'hide' => '',
                        'clickable' => '',
                        'structureType' => 'bool',
                        'structureName' => 'status',
                        'sortable' => '',
                        'name' => '',
                        'structureItem' => 'Bool'
                    );

                    $columns[] = array(
                        'id' => '',
                        'uniqueId' => '',
                        'status' => '',
                        'developer' => '',
                        'module' => '',
                        'elementDeveloper' => '',
                        'element' => 'bool',
                        'ordem' => '',
                        'width' => '50px',
                        'hide' => '',
                        'clickable' => '',
                        'structureType' => 'edit',
                        'structureName' => 'as',
                        'sortable' => '',
                        'name' => '',
                        'structureItem' => 'Edit'
                    );


                    $columns[] = array(
                        'id' => '',
                        'uniqueId' => '',
                        'status' => '',
                        'developer' => '',
                        'module' => '',
                        'elementDeveloper' => '',
                        'element' => 'bool',
                        'ordem' => '',
                        'width' => '50px',
                        'hide' => '',
                        'clickable' => '',
                        'structureType' => 'delete',
                        'structureName' => 'as',
                        'sortable' => '',
                        'name' => '',
                        'structureItem' => 'Delete'
                    );
                    $columns[] = array(
                        'id' => '',
                        'uniqueId' => '',
                        'status' => '',
                        'developer' => '',
                        'module' => '',
                        'elementDeveloper' => '',
                        'element' => 'bool',
                        'ordem' => '',
                        'width' => '50px',
                        'hide' => '',
                        'clickable' => '',
                        'structureType' => 'delete',
                        'structureName' => 'as',
                        'sortable' => '',
                        'name' => '',
                        'structureItem' => 'Order'
                    );

                }

                $colsMain = $entryClass->getColsMain( $libModule['developer'], $libModule['module'] );
                $dimSql = $entryClass->getDimensions( $libModule['developer'], $libModule['module'] );
                $dimensionWhere = $entryClass->getDimensionWhere( $dimSql, $libModule );

                if ( ( $libModule["queryOrderBy"] == 'order' ) )
                    $orderby = 'si.`order`';
                else {
                    if ( ( $libModule['increment'] == 1 ) && ( $libModule["queryOrderBy"] == 'id' ) )
                        $orderby = 'CAST(mt.`'.$libModule["queryOrderBy"]."` AS UNSIGNED)";
                    else
                        $orderby = 'mt.`'.$libModule["queryOrderBy"].'`';
                }

                $entriesSql = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DC" . $developer . $module . " mt JOIN " . $data['options']['db'] . ".DCDominoSiteIndex si ON ( mt.id = si.id ) WHERE si.developer='".$developer."' AND si.module='".$module."'".$dimensionWhere."".$parent." AND si.status". $statusBefore ."='" . $status . "'".$queryWhere." ORDER BY ".$orderby." ".$libModule["querySort"]." LIMIT ".$this->queryLimit( $data['pagination'] ).";", 'fetch_array');

                if ( $entriesSql )
                    foreach ( $entriesSql AS $entrySql ) {

                        $entry = array();


                        $entry['data'] = $this->entryData( $columns, $entrySql );

                        $entry['id'] = $entrySql['id'];
                        if ( isset( $data['options']['link'] ) )
                            $entry['link'] = $params['currentUrl'] . '&id=' . $entry['id'];

                        $whereDevMod =  !isset( $data['siteIndex'] ) ? " AND developer='".$developer."' AND module='".$module."'" : '';
                        $entry['hasChildren'] = ($util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSiteIndex WHERE parent='" . $entrySql['entry'] . "' AND status". $statusBefore ."='". $status . "'" . $whereDevMod . " LIMIT 1;", 'fetch_one') == false) ? false : true;

                        $entry['entry'] = $entrySql['developer'] . "." . $entrySql['module'] . "." . $entrySql['id'];

                        $entry['entries'] = array();
                        if ( $childrenAjax == false ) {
                            $paginate = array(
                                'currentPage' => 1
                            );
                            if ( isset( $data['pagination']['entriesPerPage'] ) ? $data['pagination']['entriesPerPage'] : '' )
                                $paginate['entriesPerPage'] = $data['pagination']['entriesPerPage'];

                            $arrChild = array(
                                'options' => $data['options'],
                                'pagination' => $paginate
                            );
                            $arrChild['options']['parent'] = $entrySql['developer'] . '.' . $entrySql['module'] . '.' . $entrySql['id'];
                            if ( isset( $data['siteIndexHack'] ) )
                                $arrChild['siteIndexHack'] = true;

                            $entry['list'] = $this->entriesIndexAction( $arrChild );
                        }

                        $entries[] = $entry;
                    }
            }

        // Entries from other parent module
        if ( isset( $data['options']['developer'] ) && isset( $data['options']['module'] ) AND !isset( $data['options']['parent'] ) ) {

            $paginate = array(
                'currentPage' => 1
            );
            if ( isset( $data['pagination']['entriesPerPage'] ) ? $data['pagination']['entriesPerPage'] : '' )
                $paginate['entriesPerPage'] = $data['pagination']['entriesPerPage'];

            $entriesOther = $this->entriesIndexParentAction(
                array(
                    'options' => $data['options'],
                    'pagination' => $paginate
                )
            );
            foreach ($entriesOther AS $entryOther)
                $entries[] = $entryOther;

            $numEntries += count($entriesOther);
        }

        $ret = array(
            'options' => $data['options'],
            'entries' => $entries,
            'columns' => $columns,
            'pagination' => $this->setPagination( array(
                'entriesPerPage' =>  $data['pagination']['entriesPerPage'],
                'currentPage' => $data['pagination']['currentPage'],
                'numEntries' => $numEntries
            ) )
        );


        return $ret;

    }
    public function entriesIndexParentAction ( $data ) {

        $util = new DCUtil();

        $entries = array();
        $entryClass = new DominoAdminEntryController();
        $childrenAjax = true;
        $libModule = $entryClass->moduleVars( $data['options']['developer'], $data['options']['module'] );
        $columns = $this->moduleListColumnsDisplay( $data['options']['developer'], $data['options']['module'] );

        $entriesPerPage = isset( $data['pagination']['entriesPerPage'] ) ? $data['pagination']['entriesPerPage'] : 20;
        $currentPage = 1;

        // List all parent entries not from the same module
        $entriesIncludeOther = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSiteIndex WHERE developer='" . $libModule['developer'] . "' AND module='" . $libModule['module'] . "' AND ( ( parentDeveloper!='" . $libModule['developer'] . "' AND parentModule!='" . $libModule['module'] . "' ) || ( parentDeveloper='" . $libModule['developer'] . "' AND parentModule!='" . $libModule['module'] . "' ) ) AND parent!='' GROUP BY parent ORDER BY `order` ASC;", 'fetch_array');
//print "select * FROM " . $data['db'] . ".DCDominoSiteIndex WHERE developer='" . $libModule['developer'] . "' AND module='" . $libModule['module'] . "' AND ( ( parentDeveloper!='" . $libModule['developer'] . "' AND parentModule!='" . $libModule['module'] . "' ) || ( parentDeveloper='" . $libModule['developer'] . "' AND parentModule!='" . $libModule['module'] . "' ) ) AND parent!='' GROUP BY parent ORDER BY `order` ASC;";
        //$ent = array();

        $entriesParent = array();
        foreach ($entriesIncludeOther AS $entryOther ) {
            //$ent[] = "select * FROM " . $data['db'] . ".DCDominoSiteIndex WHERE entry='" . $entryOther['parentDeveloper'] . "." . $entryOther['parentModule'] . "." . $entryOther['parentId'] . "';";
            $entrySql = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSiteIndex WHERE entry='" . $entryOther['parentDeveloper'] . "." . $entryOther['parentModule'] . "." . $entryOther['parentId'] . "';", 'fetch_one');
            if ( $entrySql )
                $entriesParent[] = $entrySql;
        }

        foreach ( $entriesParent AS $entry ) {

            $name = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DC".$entry['developer'].$entry['module']." WHERE id='" . $entry['id'] . "';", 'fetch_one');

            //$entry['data'] = $this->entryData( $columns, $entry);
            $entry['colName'] = $name ? ( isset( $name['name'] ) ? $name['name'] : $entry['developer'].".".$entry['module'].".".$entry['id'] ) : $entry['developer'].".".$entry['module'].".".$entry['id'];

            $entry['hasChildren'] = ( $util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSiteIndex WHERE developer='".$libModule['developer']."' AND module='".$libModule['module']."' AND parent='".$entry['entry']."' LIMIT 1;", 'fetch_one') == false ) ? false : true;

            $data['parent'] = $entry['developer'] . '.' . $entry['module'] . '.' . $entry['id'];
            if ( $childrenAjax == false )
                $entry['entries'] = $this->entriesIndexAction( array(
                    'libModule' => $libModule,
                    'columns' => $columns,
                    'options' => $data['options'],
                    'pagination' => $data['pagination'],
                    'siteIndexHack' => true
                ) );
            else
                $entry['entries'] = array();

            $entries[] = $entry;
        }

        return $entries;

    }
    public function entriesCrossAction ( $data ) {

        global $site;
        global $config;
        global $params;

        $util = new DCUtil();
        $entryClass = new DominoAdminEntryController();

        $data['libModule'] = $entryClass->moduleVars( $data['options']['developerRel'], $data['options']['moduleRel'] );
        $data['columns'] = $this->moduleListColumnsDisplay( $data['options']['developerRel'], $data['options']['moduleRel'] );

        // addColumns
        if ( isset ( $data['options']['edit'] ) ) {
            $data['columns'][] = array(
                'id' => '',
                'uniqueId' => '',
                'status' => '',
                'developer' => '',
                'module' => '',
                'elementDeveloper' => '',
                'element' => 'bool',
                'ordem' => '',
                'width' => '50px',
                'hide' => '',
                'clickable' => '',
                'structureType' => 'bool',
                'structureName' => 'as',
                'sortable' => '',
                'name' => '',
                'structureItem' => 'Bool'
            );
        }

        $colsMain = $entryClass->getColsMain( $data['libModule']['developer'], $data['libModule']['module'] );
        $dimSql = $entryClass->getDimensions( $data['libModule']['developer'], $data['libModule']['module'] );
        $dimensionWhere = $entryClass->getDimensionWhere( $dimSql, $data['libModule'] );

        if ( !isset( $data['pagination'] ) )
            $data['pagination'] = array(
                'entriesPerPage' => 20,
                'currentPage' => 1
            );
        else {
            $data['pagination']['entriesPerPage'] = isset( $data['pagination']['entriesPerPage'] ) ? $data['pagination']['entriesPerPage'] : 20;
            $data['pagination']['currentPage'] = isset( $data['pagination']['currentPage'] ) ? $data['pagination']['currentPage'] : 1;
        }

        $parent = isset( $data['parent'] ) ? " AND parent'". $data['parent']."'" : '';
        $status = isset( $data['status'] ) ? $data['status'] : 1;
        $data['options']['db'] = isset( $data['options']['db'] ) ? $data['options']['db'] : $site['db'];
        $statusBefore = ( $status == 1 ) ? '<' : '';

        $childrenAjax = true;

        $where = " AND sc.entry='".$data['options']['developer'].".".$data['options']['module'].".".$data['options']['id']."' AND sc.developerRel='".$data['options']['developerRel']."' AND sc.moduleRel='".$data['options']['moduleRel']."'";

        if ( !isset ( $data['entries'] ) ) {
            $numEntries = $util->dominoSql("select * FROM " . $data['options']['db'] . ".DCDominoSite".$data['options']['crossType']." sc WHERE sc.status='".$status."'" . $where . ";", 'num_rows');

            $entries = array();
            $entriesSql = $util->dominoSql("select mt.* FROM " . $data['options']['db'] . ".DCDominoSite".$data['options']['crossType']." sc JOIN " . $data['options']['db'] . ".DC".$data['options']['developerRel'].$data['options']['moduleRel']." mt ON (sc.idRel = mt.id ) WHERE sc.status='".$status."'" . $where . $dimensionWhere . " ORDER BY ".$data['libModule']["queryOrderBy"]." ".$data['libModule']["querySort"]." LIMIT ".( $data['pagination']['currentPage'] - 1 ).",".$data['pagination']['entriesPerPage'].";", 'fetch_array');

            if ( $entriesSql )
                foreach ( $entriesSql AS $entrySql ) {

                    $entry = array();
                    $entry['data'] = $this->entryData( $data['columns'], $entrySql);

                    $colMainId = $entryClass->getColsMainId( $entrySql, $colsMain );

                    if ( isset( $data['options']['link'] ) ) {
                        print $data['options']['link'];
                        if ( $data['options']['link'] == 'modules' )
                            $entry['link'] = $params['currentUrlClean'] . '?developer=' . $data['libModule']['developer'] . '&module=' . $data['libModule']['module'];
                        else if ( $data['options']['link'] == 'list' )
                            $entry['link'] = $params['currentUrlClean'] . '?developer=' . $data['libModule']['developer'] . '&module=' . $data['libModule']['module'] . '&id=' . $colMainId;
                        else
                            $entry['link'] = $data['options']['link'];
                    }


                    $entry['id'] = $colMainId;
                    $entry['entry'] = $data['libModule']['developer'].'.'.$data['libModule']['module'].'.'.$colMainId;

                    $entry['entries'] = array();
                    $entries[] = $entry;
                }
        }
        else {
            $entries = $data['entries'];
            $numEntries = count();
        }

        $ret = array(
            'options' => $data['options'],
            'entries' => $entries,
            'columns' => $data['columns'],
            'pagination' => $this->setPagination( array(
                'entriesPerPage' =>  $data['pagination']['entriesPerPage'],
                'currentPage' => $data['pagination']['currentPage'],
                'numEntries' => $numEntries
            ) )
        );

        return $ret;
    }
    function filterEntriesAction( $data ) {

        $data['list']['options']['query'] = $data['query'];

        if ( isset( $data['list']['entries'] ) )
            unset( $data['list']['entries'] );

        $list = $this->listAction(
            array(
                'list' => $data['list']
            ) );

        return $list;

    }
    function pageEntriesAction( $data ) {


        if ( isset( $data['entries'] ) )
            unset( $data['entries'] );

        $list = $this->listAction(
            array(
                'list' => $data
            ) );

        return $list;

    }
}