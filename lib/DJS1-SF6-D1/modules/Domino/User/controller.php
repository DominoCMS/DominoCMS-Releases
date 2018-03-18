<?php
class DCLibModulesDominoUser extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        return $data;
    }
    function afterCreateAction ( $data ) {

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        return $data;
    }
    function modulesParamsAction ( $data ) {

        global $site;
        global $user;

        $paramLevels = array();

        $site['entry'] = array(
            'type' => 'edit',
            'edit' => array(
                'developer' => $data['developer'],
                'module' => $data['module'],
                'id' => $user['id']
            ),
            'actions' => array (
                'options' => array(),
                'buttons' => array(
                    'save' => array(
                        'value' => 'Shrani',
                        'icon' => 'save',
                        'position' => 'left',
                        'name' => 'save',
                        'type' => 'submit'
                    )
                )
            )
        );

        return $paramLevels;

    }
}