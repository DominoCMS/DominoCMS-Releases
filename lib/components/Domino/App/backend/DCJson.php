<?php

class DCJson {

    function indexResult() {

        global $config;
        global $site;
        global $params;

        if ( !isset( $params['error'] ) ) {

            $CountView = require_once( $config['identityRoot'] . 'items/views.php');

            if ( $site['page']['views'][0] == $_SESSION["activeTemplate"] ) {
                $sviews = $site['page']['views'];
                unset( $sviews[0] );
                $sviews = array_values($sviews);
            }
            else {
                $sviews = $site['page']['views'];
                $_SESSION["activeTemplate"] = $site['page']['views'][0];
            }

            $viewParams = isset( $CountView['viewParams'] ) ? $CountView['viewParams'] : array();
            if ( isset( $CountView['views'] ) )
                $moduleData = $this->viewData( $sviews, $CountView['views'], $viewParams );
            else
                $moduleData = $this->viewData( $sviews, $CountView, $viewParams );

            if ( isset( $CountView['refreshViews'] ) )
                $refreshData = $this->refreshViewData( $CountView['refreshViews'] );


        }
        else
            $params['debug'] = "Error " . $params['error']['responseCode'];


        $newSite = array(
            'meta' => $site['meta'],
            'page' => $site['page'],
            'domain' => $site['domain'],
            'ver' => isset( $site['ver'] ) ? $site['ver'] : '',
            'username' => $site['username'],
            'theme' => $site['theme'],
            'lang' => $site['lang'],
            'langMain' => $site['langMain'],
            'languages' => $site['languages'],
            'google' => $site['google'],
            'page' => $site['page'],
            'urlLang' => $site['urlLang'],
            'frontTitle' => $site['frontTitle'],
            'frontDescription' => $site['frontDescription'],
        );
        return json_encode(array(
            'params' => $params,
            'site' => $newSite,
            'moduleData' => isset ( $moduleData ) ? $moduleData : array(),
            'refreshData' => isset ( $refreshData ) ? $refreshData : array()
        ));
    }

    function refreshViewData( $views ) {

        global $config;
        global $site;

        $data = array();
        for ($i = 0; $i < count( $views ); $i++ ) {
            $view = $views[$i];

            $viewArr = explode('.',$view);
            $viewName = end( $viewArr );
            $viewPath = str_replace('.', '/', $view);
            $className = str_replace('.', '', $view);
            $controllerName = $className.'Controller';

            $developer = $viewArr[0];
            $item = $viewArr[1];

            $newView = '';
            if ( count($viewArr) > 2 )
                for ( $n = 2; $n < count($viewArr); $n++ )
                    $newView .= $viewArr[$n] . '/';

            $filename = $config['identityRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'controller.php';

            if ( !file_exists( $filename ) )
                $filename = $config['libRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'controller.php';

            if ( file_exists( $filename ) ) {
                require_once $filename;

                if (class_exists($controllerName)) {
                    $controllerClass = new $controllerName();

                    if ($controllerClass)
                        if (method_exists($controllerClass, 'refreshAction'))
                            $data[$view] = $controllerClass->refreshAction(array());
                }
            }

        }
        return $data;

    }

    function viewData( $views, $CountView, $viewParams ) {

        global $config;
        global $site;

        $viewsNum = count( $views );
        $moduleData = array();

        for ($i = 0; $i < $viewsNum; $i++) {
            $view = $views[$i];

            $moduleData[$view] = $this->getViewData( $view, $CountView, $viewParams );

            if ( isset( $CountView[$view] ) ) {

                $inData = array();
                $inData = $this->viewData( $CountView[$view], $CountView, $viewParams );

                if ( $inData )
                    foreach ($inData AS $key => $value)
                        $moduleData[$key] = $value;

            }

        }

        return $moduleData;
    }

    function getViewData( $view, $CountView, $viewParams ) {

        global $config;
        global $site;

        $util = new DCUtil();

        $viewArr = explode('.',$view);
        $viewName = end( $viewArr );
        $viewPath = str_replace('.', '/', $view);
        $className = str_replace('.', '', $view);
        //$modelName = $className.'Model';
        $controllerName = $className.'Controller';

        $developer = $viewArr[0];
        $item = $viewArr[1];

        $newView = '';
        if ( count($viewArr) > 2 )
            for ( $n = 2; $n < count($viewArr); $n++ )
                $newView .= $viewArr[$n] . '/';

        $filename = $config['identityRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'controller.php';

        if ( !file_exists( $filename ) )
            $filename = $config['libRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'controller.php';

        $data = isset( $viewParams[$view] ) ? $viewParams[$view] : array();

        if ( file_exists( $filename ) ) {
            require_once $filename;

            if ( class_exists( $controllerName ) ) {

                $indexAction = new $controllerName();
                return $indexAction -> indexAction( $data );
            } else
                return array();
        }

    }

    function ajaxResult() {

        global $config;
        global $site;
        global $params;

        $util = new DCUtil();

        $postData = json_decode(file_get_contents('php://input'), true);

        $arr = array();
        $postView = $postData["view"];
        $postAction = $postData["action"];

        $site = $postData["site"];
        $params = $postData["params"];
        $identity = $postData["identity"];
        $data = $postData["data"];

        if ( !isset( $identity['root'] ) )
            $identity['root'] =  $config['identitiesRoot'] . $identity['username']. '/';

        $viewPath = str_replace('.', '/', $postView);
        $viewArr = explode( '.', $postView );
        $viewName = end ( $viewArr );
        $controllerName = str_replace('.', '', $postView).'Controller';

        $developer = $viewArr[0];
        $item = $viewArr[1];

        $newView = '';
        if ( count($viewArr) > 2 )
            for ( $n = 2; $n < count($viewArr); $n++ )
                $newView .= $viewArr[$n] . '/';

        $filename = $config['identityRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'controller.php';

        if ( !file_exists( $filename ) )
            $filename = $config['libRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView .  'controller.php';

        if ( file_exists( $filename ) ) {

            require_once $filename;
            if ( class_exists( $controllerName ) ) {
                $getData = new $controllerName();
                $arr = $getData -> {$postAction.'Action'}($data);
            }
        }

        return  json_encode( $arr );

    }

    function componentData( $component, $action, $data ) {

        global $config;
        global $site;

        $arr = null;
        if ( $component ) {
            $util = new DCUtil();

            $viewPath = str_replace('.', '/', $component);
            $viewArr = explode('.', $component);
            $viewName = end($viewArr);
            $controllerName = str_replace('.', '', $component) . 'Controller';

            $developer = $viewArr[0];
            $item = $viewArr[1];

            $newViewDot = ltrim( str_replace($developer . '.' . $item,'',$component), '.');
            $newView = str_replace('.', '/', $newViewDot);

            // if subcomponent
            if ( $newView )
                $filename = $config['identityRoot'] . '/items/' . $developer . '/' . $item . '/' . $newView . '/' . 'controller.php';
            else
                $filename = $config['identityRoot'] . '/items/' . $developer . '/' . $item . '/' . 'controller.php';

            if (!file_exists($filename)) {
                if ( $newView )
                    $filename = $config['libRoot'] . 'items/' . $developer . '/' . $item . '/' . $newView . '/controller.php';
                else
                    $filename = $config['libRoot'] . 'items/' . $developer . '/' . $item . '/controller.php';
            }

            $arr = array();

            if ( file_exists( $filename ) ) {
                require_once $filename;
                if (class_exists( $controllerName ) ) {
                    $getData = new $controllerName();
                    $arr = $getData->{$action . 'Action'}($data);
                }
            } else
                $arr = $component;
        }

        return  $arr;

    }

}