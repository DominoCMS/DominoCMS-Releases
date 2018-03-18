<?php


require_once ( $config['libRoot'] . 'DJS1-SF6-D1/modules/Domino/Translate/controller.php' );
require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/SiteIndex/controller.php" );
class DominoAdminEntryController extends DCBaseController {

    function indexAction( $data ) {

    }
    function runModuleAction ( $data, $developer, $module, $action ) {

        global $config;
        $filename = $config['libRoot'] . 'modules/' . $developer . '/' . $module . '/controller.php';
        $controllerName = $developer. $module . 'Controller';
        $actionName = $action.'Action';

        if ( file_exists( $filename ) ) {
            require_once $filename;

            if (class_exists($controllerName)) {
                $controllerClass = new $controllerName();

                if ( $controllerClass ) {
                    if ( method_exists( $controllerClass, $actionName ) )
                        return $controllerClass->$actionName( $data );
                    else return $data;

                } return $data;

            } return $data;
        }
        else return $data;

    }
    public function getDimensions ( $developer, $module ) {

        global $config;
        $util = new DCUtil();

        return $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesDimensions WHERE developer='".$developer."' AND module='".$module."' ORDER BY level ASC;", 'fetch_array');
    }
    public function getDimensionWhere ( $dimSql, $libModule ) {

        global $config;
        global $site;
        $util = new DCUtil();

        if ( $dimSql ) {
            $dimension = $dimSql[0];

            $dimensionModule = $util->dominoSql("select queryOrderBy,querySort FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='" . $dimension['dimensionDeveloper'] . "' AND module='" . $dimension['dimensionModule'] . "';", 'fetch_one');
            $db1 = $site['db'];
            $db = $dimension['dimensionIdentity'] ? $dimension['dimensionIdentity'] : $db1;
            $instances = $util->dominoSql("select * FROM " . $db . ".DC" . $dimension['dimensionDeveloper'] . $dimension['dimensionModule'] . " ORDER BY " . $dimensionModule["queryOrderBy"] . " " . $dimensionModule["querySort"] . ";", 'fetch_array');
            $instance = $instances[0];

            $colsMain = $this->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);

            $sqlModulePrefix = ($libModule['moduleType'] == 'index') ? 'mt.' : '';
            $dimInst = '';
            foreach ($colsMain AS $col) {
                $dimInst .= " AND " . $sqlModulePrefix . $col['element'] . "='" . $instance[$col['element']] . "'";
            }
            return $dimInst;
        }
        else
            return '';

    }
    public function structureCols( $developer, $module ) {

        global $config;
        $util = new DCUtil();

        $structureCols = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesStructure WHERE developer='". $developer ."' AND module='". $module ."' ORDER BY ordem ASC;", 'fetch_array');

        foreach ( $structureCols AS &$structureCol )
            $structureCol['structureItem'] = ucfirst($structureCol['structureType']);

        return $structureCols;

    }
    public function moduleVars( $developer, $module ) {

        global $config;
        global $site;
        $util = new DCUtil();

        $db = $config['db'];

        $libModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$developer."' AND module='".$module."';", 'fetch_one');

        $identityModule = $util->dominoSql("select * FROM " . $db . ".DCDominoModules WHERE developer='".$developer."' AND module='".$module."';", 'fetch_one');

        // overrides if fields in installed module exist
        /*if ( $identityModule ) {
            if ( $identityModule['querySort'] )
                $libModule['querySort'] = $identityModule['querySort'];
            if ( $identityModule['moduleType'] )
                $libModule['moduleType'] = $identityModule['moduleType'];
        }*/

        return $libModule;
    }
    public function getColsMainId ( $entry, $cols ) {

        $cname = '';

        foreach ( $cols AS $col )
            $cname .= $entry[$col['element']].'|';

        return rtrim($cname,'|');

    }
    public function getColsMainWhere ( $colsMain, $entry ) {

        $entry = explode('|', $entry );

        $queryWhere = '';

        $i = 0;
        foreach ( $colsMain AS $col ) {
            $queryWhere .= " AND `".$col['element']."`='".$entry[$i++]."'";
        }

        return $queryWhere;

    }
    public function getColsMain ( $developer, $module ) {

        global $config;
        $util = new DCUtil();

        return $util->dominoSql("select element FROM " . $config['db'] . ".DCDominoLibModulesColsMain WHERE developer='".$developer."' AND module='".$module."' ORDER BY ordem ASC;", 'fetch_array');

    }
    public function moduleCols( $developer, $module ) {

        global $config;
        global $site;
        $util = new DCUtil();

        $db = $site['db'];

        $moduleCols = $util->dominoSql("select * FROM " . $db . ".DCDominoModulesCols WHERE developer='". $developer ."' AND module='". $module ."' ORDER BY `order` ASC;", 'fetch_array');

        if ( !$moduleCols )
            $moduleCols = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesCols WHERE developer='". $developer ."' AND module='". $module ."' ORDER BY `order` ASC;", 'fetch_array');

        return $moduleCols;

    }
    public function moduleColsArr( $developer, $module ) {

        global $config;
        global $site;

        $db = $config['db'];

        $util = new DCUtil();

        $moduleCols = $util->dominoSql("select * FROM " . $db . ".DCDominoModulesCols WHERE developer='". $developer ."' AND module='". $module ."' ORDER BY `order` ASC;", 'fetch_array');

        if ( !$moduleCols )
            $moduleCols = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesCols WHERE developer='". $developer ."' AND module='". $module ."' ORDER BY `order` ASC;", 'fetch_array');

        $arr = array();
        foreach ( $moduleCols AS $col )
            $arr[] = $col['element'];

        return $arr;

    }
    public function moduleStructure( $data, $parentId ) {

        global $site;
        global $config;
        $util = new DCUtil();

        $db = $config['db'];

        $structure = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesStructure WHERE developer='".$data['options']['developer']."' AND module='".$data['options']['module']."' AND parent_id=".$parentId." ORDER BY ordem ASC;", 'fetch_array');
        if ( $structure )
            foreach ( $structure AS &$entry ) {

                $elItem = ucfirst( $entry['structureType'] );
                $entry['elementItem'] = $elItem;
                $entry['data'] = array();

                if ( $entry['dimensional'] == 1 ) {
                    $entry['data'] = array();
                    for ( $i = 0; $i < count($data['dimensions']); $i++ ) {
                        $dimension = $data['dimensions'][$i];

                        $entry['data'][$dimension['id']] =  ( isset( $data['moduleData'][$dimension['id']][$entry['element']] ) ? $data['moduleData'][$dimension['id']][$entry['element']] : '');
                    }
                }
                else {
                    $entry['data'] = ( isset( $data['moduleData'][$entry['element']] ) ) ? $data['moduleData'][$entry['element']] : '';

                    // if module is dimensional but entry not
                    //if ( !$entry['data'] && count( $data['dimensions'] ) )
                      //  $entry['data'] = ( isset( $moduleData[$data['dimensions'][0]['id']][$entry['element']] ) ) ? $moduleData[$data['dimensions'][0]['id']][$entry['element']] : '';
                }
                $entry['dimensional'] = ( $entry['dimensional'] == 1 ) ? true : false;

                // Format data for specific Fields
                $ClassFile = $config['libRoot']."DJS1-SF6-D1/items/Domino/Admin/Entry/Edit/Field/".$elItem."/controller.php";
                if ( file_exists ( $ClassFile ) ) {
                    require_once ( $ClassFile );
                    $controllerName = "DominoAdminEntryEditField".$elItem."Controller";

                    if ( class_exists ( $controllerName ) ) {
                        $structureClass = new $controllerName();

                        if ( $structureClass ) {
                            if ( method_exists ( $structureClass, 'structureData' ) )
                                $entry['data'] = $structureClass->structureData( $entry, $data );
                        }
                    }
                }

                // 1. element name
                $entry['name'] = $entry['element'];

                $element = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElements WHERE developer='".$entry['developer']."' AND element='".$entry['element']."';", 'fetch_one');

                if ( !$entry['structureType'] )
                    $entry['structureType'] = $element['structureType'];

                // 2. default element name
                $name = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModulesElementsNames WHERE developer='".$entry['developer']."' AND element='".$entry['element']."' AND lang='".$site['lang']."';", 'fetch_one');

                if ( $name['name'] )
                    $entry['name'] = $name['name'];

                // 2. override element name
                $name = $util->dominoSql("select name FROM " . $config['db'] . ".DCDominoLibModulesColsNames WHERE developer='".$data['options']['developer']."' AND module='".$data['options']['module']."' AND elementDeveloper='".$entry['developer']."' AND element='".$entry['element']."' AND lang='".$site['lang']."';", 'fetch_one');

                // 2. override element name
                if ( $entry['structureName'] )
                    $name = $util->dominoSql("select name FROM " . $config['db'] . ".DCDominoLibModulesStructureNames WHERE developer='Domino' AND id='".$entry['structureName']."' AND lang='".$site['lang']."';", 'fetch_one');

                if ( $name['name'] )
                    $entry['name'] = $name['name'];

                $entry['children'] = $this->moduleStructure( $data, $entry['id'] );
            }

        return $structure;
    }
    public function prepareInsert( $data ) {

        $data = addSlashes( $data );
        $data = trim($data);
        return $data;
    }
    public function formatFieldValue ( $function, $data, $col, $libModule, $dimension ) {

        global $config;


        $ClassFile = $config['libRoot']."items/Domino/Entry/DJS1-SF6-D1/Edit/Field/".$col['structureItem']."/controller.php";

        if ( file_exists ( $ClassFile ) ) {
            require_once ( $ClassFile );
            $controllerName = "DominoAdminEntryEditField".$col['structureItem']."Controller";
            if ( class_exists ( $controllerName ) ) {
                $structureClass = new $controllerName();

                if ( $structureClass ) {
                    if ( method_exists ( $structureClass, $function ) )
                        return $structureClass->$function( $col, $data, $libModule, $dimension );
                }
            }
        }


    }
    public function sitemapAction ( $data ) {


        $deploy = new DCLibModulesDominoSiteIndex();

        return $deploy->sitemap();

    }
    public function translateAction ( $data ) {

        $translate = new DCTranslate();

        return $translate->translateIdentity( $data['id'] );

    }
}