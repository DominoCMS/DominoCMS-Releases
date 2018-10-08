<?php

class DCBaseView {

    public function component ( $view, $data = array() ) {

        global $config;
        global $site;
        $json = new DCJson();

        $ret = '';

        $viewArr = explode('.',$view);
        $viewName = end( $viewArr );
        $viewPath = str_replace('.', '/', $view);
        $className = str_replace('.', '', $view);
        //$modelName = $className.'Model';
        $controllerName = $className.'View';

        $developer = $viewArr[0];
        $item = $viewArr[1];

        $newView = '';
        for ( $i = 2; $i < count($viewArr); $i++ )
            $newView .= $viewArr[$i] . '/';

        $filename = $config['identitiesRoot'] . $site['username'] . '/items/' . $developer . '/' . $item . '/' . $newView .  'view.php';

        if ( !file_exists( $filename ) )
            $filename = $config['libRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'view.php';

        if ( file_exists( $filename ) ) {
            require_once $filename;

            if ( class_exists( $controllerName ) ) {
                $indexAction = new $controllerName();

                $moduleData = $data ? $data : $json->getViewData( $view, array(), array() );

                $ret = $indexAction -> indexAction( $moduleData );
            }

        }


        return $ret;

    }

}