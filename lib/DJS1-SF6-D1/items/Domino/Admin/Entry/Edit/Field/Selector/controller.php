<?php

class DominoAdminEntryEditFieldSelectorController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function structureData ( $entry, $data ) {


       if ( $entry['element'] == 'parent' &&  $data['options']['module'] == 'Content' )
            $newData = array(
                'actions' => array(),
                'subactions' => array(),
                'list' => array(
                    'options' => array(
                        'developer' => 'Domino',
                        'module' => 'Content',
                        //'parent' => '',
                        'element' => $entry['element'],
                        //'mainColumn' => 'name',
                        'selectorId' => 'fieldSelector',
                        'return' => array(
                            'parent' => array (
                                'element' =>  'entry',
                                'name' => 'name'
                            )
                        )
                    )
                )
            );
        else
            $newData = array(
                'actions' => array(),
                'subactions' => array(),
                'list' => array(
                    'options' => array(
                        'developer' => 'Domino',
                        'module' => 'Content',
                        //'parent' => '',
                        'element' => $entry['element'],
                        //'mainColumn' => 'name',
                        'selectorId' => 'fieldSelector',
                        'return' => array(
                            'parent' => array ( 'element' =>  'entry',
                                'name' => 'name'
                            )
                        )
                    )
                )
            );

        $util = new DCUtil();

        /*if ( $libModule['moduleType'] == 'noindex' )
            $sql = $util->dominoSql("select ".$newData['list']['options']['mainColumn']." AS mainCol FROM " . $identity['db'] . ".DC" . $newData['list']['options']['developer'] . $newData['list']['options']['module'] . " WHERE ".ltrim ( $queryWhere, 'AND ') . ";", 'fetch_one');
        else
            $sql = $util->dominoSql("select ".$newData['list']['options']['mainColumn']." AS mainCol FROM " . $identity['db'] . ".DC" . $newData['list']['options']['developer'] . $newData['list']['options']['module'] . " mt JOIN " . $identity['db'] . ".DCDominoSiteIndex si ON ( mt.id = si.id ) WHERE si.developer='".$newData['list']['options']['developer']."' AND si.module='".$newData['list']['options']['module']."' AND si.entry='".$data['entry'] . "';", 'fetch_one');
*/
        $ret = array(
            'id' => 'fieldSelector',
            'form' => array(
                'value' => isset( $data[$entry['element']] ) ? $data[$entry['element']] : '',
                'name' => isset( $data[$entry['element']] ) ? $data[$entry['element']] : '', //isset( $sql['mainCol'] ) ? $sql['mainCol'] : $data['entry'],
                'element' => $entry['element'],
                'type' => 'hidden',
            ),
            'listParams' => $newData

        );

        return $ret;

    }
    public function getEntriesAction ( $data ) {


        $entryListClass = new DominoAdminEntryListController();
        $entryEditClass = new DominoAdminEntryEditController();
        $libModule = $entryEditClass->moduleVars( $data['developer'], $data['module'] );

        return $entryListClass->listAction(
            array(
                'actions' => array(),
                'subactions' => array(),
                'options' => array(
                    'developer' => $libModule['developer'],
                    'module' => $libModule['module'],
                    'link' => 'return',
                    'return' => $data['return'],
                    'element' => $data['element'],
                    //'parent' => '',
                    'columnsType' => 'display',
                    'siteIndex' => true,
                    'status' => 1
                )
            )
        );


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
}