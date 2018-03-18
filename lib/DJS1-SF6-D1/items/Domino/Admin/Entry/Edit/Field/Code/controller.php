<?php

class DominoAdminEntryEditFieldCodeController extends DCBaseController {

    function indexAction( $data ) {

    }
    public function structureData ( $entry, $data ) {

        global $config;
        global $identity;

        if ( isset ( $data['id'] ) ) {

            $id = explode( "|", $data['id'] );

            if ( $entry['element'] == 'model' )
                $elem = 'controller.php';
            else if ( $entry['element'] == 'controller' )
                $elem = 'controller.js';
            else if ( $entry['element'] == 'viewSsr' )
                $elem = 'view.php';
            else if ( $entry['element'] == 'theme' )
                $elem = 'themes/component.scss';
            else if ( $entry['element'] == 'themeSettings' )
                $elem = 'themes/' . $id[0] . '/Default/settings.scss';
            else
                $elem = 'view.jsx';


            $ret = array(
                'file' => ''
                );


            //$technology = $identity['techApp'] . '-' . $identity['techTemplate'] . '-' . $identity['techModel'];
            $technology = 'DJS1-SF6-D1';

            $filename = $config['libRoot'] . 'items/' . $id[0] . '/' . $id[1] . '/' . $technology . '/' . $elem;

            if ( file_exists( $filename ) ) {
                $ret['file'] = file_get_contents($filename, true);
            }

            return $ret;

        }




    }
    public function prepareInsert ( $col, $data, $libModule, $dimension ) {

        $ret = array();

        return $ret;

    }
    public function prepareUpdate ( $col, $data, $libModule, $dimension ) {

        $ret = array();



        return $ret;

    }
}