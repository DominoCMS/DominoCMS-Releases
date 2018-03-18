<?php
class DominoViewsView extends DCBaseView {

    function indexAction( $data ) {

        global $config;
        global $site;
        $ret = '';

        if ( count( $data ) )
            for ( $i = 0; $i < count( $data ); $i++ ) {
                $viewData = $data[$i];

                if ( $viewData['component'] == 'inner') {
                    if ( isset($site['page']['views'][1]) )
                        $ret .= $this->component( $site['page']['views'][1] );
                }
                else
                    $ret .= $this->component( $viewData['developer'].'.'.$viewData['component'] );
            }

        return $ret;
    }

}