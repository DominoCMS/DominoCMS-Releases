<?php
require_once ($config['libRoot'] . 'items/Domino/Entry/DJS1-SF6-D1/List/controller.php');
class DominoAdminIdentitiesController extends DCBaseController {

    function indexAction($data) {

        global $config;
        global $params;
        global $site;
        global $identity;
        $util = new DCUtil();
        $entryListClass = new DominoAdminEntryListController();

        $columns = array(
            array(
                'name' => 'Ime',
                'element' => 'name',
                'width' => '',
                'clickable' => true,
                'hide' => '',
                'sortable' => true,
                'structureType' => 'varchar',
                'structureItem' => 'Varchar'
            )
        );

        $sql = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoIdentities ORDER BY username ASC;",'fetch_array');

        $i = 0;
        if ( $sql )
            foreach ( $sql AS &$module ) {
                $module['index'] = $i++;
                $module['link'] = "/".$module['username'].$site['urlLang'];
                $module['namespace'] = $module['username'];
                $module['name'] = $module['title'];
                $module['data'] = $entryListClass->entryData( $columns, $module);
                $module['children'] = array();
            }

        $pagination = array(
            'paginate' => true,
            'entriesPerPageOptions' => '10,20,50,100',
            'entriesPerPage' => 20
        );
        $actions = array (
            'options' => array(),
            'buttons' => array(
                'back' =>
                    array(
                        'value' => 'Nazaj',
                        'link' => $params['levels'][0]['url'],
                        'icon' => 'arrow_left',
                        'position' => 'left'
                    ),
                'new' =>
                    array(
                        'value' => 'Nova',
                        'link' => $params['levels'][1]['url']."/nova-identiteta",
                        'icon' => 'new',
                        'position' => 'left'
                    )
            )
        );



        return array(
            'children' => array(
                'pagination' => $pagination,
                'columns' => $columns,
                'entries' => $sql
            ),
            'actions' => $actions
        );
    }

}