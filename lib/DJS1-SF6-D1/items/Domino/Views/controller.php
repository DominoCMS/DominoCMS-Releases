<?php
class DominoViewsController extends DCBaseController {

    function indexAction ( $data ) {

        global $site;
        $util = new DCUtil();

        $views = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoViewsStructure WHERE parent=0 AND status=1 ORDER BY `order` ASC;", 'fetch_array');
        if ( $views )
            foreach ( $views AS &$view ) {

                if ( $view['componentData'] )
                    $view['componentData'] =  $util->betterEval( $view['componentData'] );

            }

        return $views;
    }
}