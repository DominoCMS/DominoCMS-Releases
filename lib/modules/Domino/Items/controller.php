<?php
require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Identity/controller.php" );
class DCLibModulesDominoItems extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeFirstCreateAction ( $data ) {

        global $config;

        $util = new DCUtil();

        $util->makeDir( $config['identityRoot'] . 'items');

        return $data;

    }
    function afterFirstCreateAction ( $data ) {

        return $data;
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
    function createDesignModuleAction ( $data ) {

        global $config;

        $util = new DCUtil();

        $util->makeDir( $config['identityRoot'] . 'items/Domino');


    }
    function handleMVC ( $path , $technology, $item, $subitem ) {

        global $config;
        global $site;

        $component = $item;
        if ( $subitem )
            $component .= '/' . $subitem;

        $componentName = str_replace( '/', '.', $component );
        $componentNamePhp = str_replace( '/', '', $component);

        $path = $config['identityRoot'] .'items/';

        $filepath = $path . $item . '/';
        if ( $subitem )
            $filepath .= $subitem . '/';

        $view = $filepath . 'view.js';
        $viewJsx = $filepath . 'view.jsx';
        $controller = $filepath . 'controller.js';

        if ( file_exists( $view )  ) {
            $viewFile =  file_get_contents( $view, true );
            $viewFileJsx = file_get_contents( $viewJsx, true );
        }
        else {
            $path = $config['libRoot'] . $technology . '/items/';
            $filepath = $path . $item . '/';
            if ( $subitem )
                $filepath .= $subitem . '/';
            $view = $filepath . 'view.js';
            $viewJsx = $filepath . 'view.jsx';
            $controller = $filepath . 'controller.js';
            $viewFile =  file_exists( $view ) ? file_get_contents( $view, true ) : '';
            $viewFileJsx = file_exists( $view ) ? file_get_contents( $viewJsx, true ) : '';
        }

        // Find all inner modules^[a-zA-Z0-9_.-]*$
        preg_match_all('/view="([^"]*)"/i', $viewFileJsx, $matches);
        $matches = array_unique($matches[1]);

        preg_match_all('/view="([^"]*)" componentData/i', $viewFileJsx, $matchesComponent);
        $matchesComponent = array_unique( $matchesComponent[1] );

        $newMatches = array();
        foreach ( $matches AS $match )
            if ( !in_array( $match, $matchesComponent ) )
                $newMatches[] = $match;

        $numViews = $newMatches ? "'" . implode("','", $newMatches) . "'" : '';

        $controllerFile = ( file_exists( $controller ) ) ? file_get_contents( $controller, true ) : '';

        $controllerPhp = $filepath . 'controller.php';
        // If this one has refresh function

        $refViewsName = '';
        if ( file_exists( $controllerPhp ) ) {

            if ( exec('grep '.escapeshellarg('refreshAction').' '.$controllerPhp) ) {
                $refViewsName = $componentName;
            }

        }

        return array(
            'controllerName' => $controller,
            'view' => $viewFile,
            'controller' => $controllerFile,
            'num' => array(
                'name' => $componentName,
                'views' => $numViews
            ),
            'refresh' => $refViewsName

        );

    }
    function getDeployItems () {

        global $config;
        global $site;

        $util = new DCUtil();

        $itemsArr = array();
        $itemsIncluded = array();

        if ( isset($site['template'] ) ) {
            $templateArr = explode('.', $site['template']);
            $templateDeveloper = $templateArr[0];
            $templateId = $templateArr[1];

            $packs = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibTemplatesItemsPacks WHERE developer='" . $templateDeveloper . "' AND  id='" . $templateId . "' ORDER BY developerRel,idRel ASC;", 'fetch_array');
            if ( $packs )
                foreach ( $packs as $pack ) {

                    $items = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibTemplatesItemsPacksItems WHERE developer='" . $pack['developerRel'] . "' AND id='" . $pack['idRel'] . "' ORDER BY developerRel,idRel ASC;", 'fetch_array');
                    if ( $items )
                        foreach ( $items as $item ) {
                            $itemsIncluded[] = $item['developerRel'].'.'.$item['idRel'];
                            $itemsArr[] = array(
                                'developer' => $item['developerRel'],
                                'id' => $item['idRel'],
                            );
                        }
                }
            // 1. Then We check the lone LibTemplatesItems
            $items = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibTemplatesItems WHERE developer='" . $templateDeveloper . "' AND  id='" . $templateId . "' ORDER BY developerRel,idRel ASC;", 'fetch_array');
            if ( $items)
                foreach ( $items as $item ) {
                    $itemName = $item['developerRel'] . '.' . $item['idRel'];
                    if ( !in_array( $itemName, $itemsIncluded ) ) {
                        $itemsIncluded[] = $itemName;
                        $itemsArr[] = array(
                            'developer' => $item['developerRel'],
                            'id' => $item['idRel'],
                        );
                    }
                }
        }

        // 1. Then We check the loneTemplatesItems
        $items = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoItems WHERE status=1 ORDER BY `order` ASC;", 'fetch_array');
        if ( $items )
            foreach ( $items as $item ) {
                $itemsArr[] = array(
                    'developer' => $item['developer'],
                    'id' => $item['item'],
                );
            }
        return $itemsArr;

    }
    function deployApp () {

        global $config;
        global $site;

        $util = new DCUtil();

        $content = '';
        $debugItemsComponents = array();
        $debugLibItemsComponents = array();
        ### I. Deploy JS Components
        // these must also be in technology folder
        $items = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoItems WHERE status=1 ORDER BY `order` ASC;", 'fetch_array');
        if ( $items )
            foreach ( $items as $item ) {

                // First deploy custom components

                $listComponents = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoItemsComponents WHERE developer='" . $item['developer'] . "' AND item='" . $item['item'] . "' AND type='js' AND status=1 ORDER BY `order` ASC;", 'fetch_array');
                if ( $listComponents )
                    foreach ( $listComponents as $component ) {

                        $component = $item['developer'] . '/' . $item['item'] . '/' . $component['filename'];
                        $filename = $config['identityRoot'] .'items/' . $component . '.js';

                        // If any component does in fact exist
                        if ( file_exists( $filename ) ) {
                            $debugItemsComponents[] = $component . ' - ' . $filename;

                            $file = file_get_contents($filename, true);
                            $content .= $file . "\r\n";
                        }
                    }

                // Then deploy library components and ignore already deployed
                $listComponents = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibItemsComponents WHERE developer='" . $item['developer'] . "' AND item='" . $item['item'] . "' AND type='js' AND status=1 ORDER BY `order` ASC;", 'fetch_array');
                if ( $listComponents )
                    foreach ( $listComponents as $component ) {

                        $comp = $item['developer'] . '/' . $item['item'] . '/' . $component['filename'];

                        // ignore if already deployed a custom one
                        if ( !in_array( $comp, $debugItemsComponents ) ) {

                            // first check if technology file
                            $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['item'] . '/' . $component['filename'] . '.js';

                            // then check if it is not in technology folder (allaround)
                            if ( !file_exists( $filename ) )
                                $filename = $config['libRoot'] . 'components/' . $item['developer'] . '/' . $item['item'] . '/' . $component['filename'] . '.js';

                            if ( file_exists( $filename ) ) {
                                $debugLibItemsComponents[] = ' LibComp - ' . $filename;
                                $file = file_get_contents( $filename, true);
                                $content .= $file . "\r\n";
                            }
                        }

                    }

            }


        ### II. Deploy MVC components
        $debugRefViews = array();
        $debugItemsMVC = array();
        $viewsNum = '';
        $refreshViews = '';
        // 1. First We check the LibTemplatesItemsPacks

        $itemsArr = $this->getDeployItems();

        foreach ( $itemsArr as $item ) {


            $component = $item['developer'] . '/' . $item['id'];

            // 1. First deploy root components

            $handleMVC = $this->handleMVC( $config['identityRoot'] .'items/', $config['technology'], $component, '' );

            $viewsNum .= "'" . $handleMVC['num']['name'] . "' => array (" . $handleMVC['num']['views'] . "),\n";
            $content .= $handleMVC['view'] . "\r\n";
            $content .= $handleMVC['controller'] . "\r\n";
            $debugItemsMVC[] = $component;


            if ( $handleMVC['refresh'] ) {
                $debugRefViews[] = $handleMVC['refresh'];
                $refreshViews .= "'" . $handleMVC['refresh'] . "',\n";
            }

            // 2. Then deploy custom subitems

            $customSubitems = array();
            $mvc_array = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoItemsSubitems WHERE developer='" . $item['developer'] . "' AND item='" . $item['id'] . "' AND status=1 ORDER BY developer,item,subitem ASC;", 'fetch_array');
            if ( $mvc_array )
                foreach ( $mvc_array as $mvc ) {

                    $component = $item['developer'] . '/' . $item['id'] . '/' . $mvc['subitem'];
                    $customSubitems[] = $component;
                    $handleMVC = $this->handleMVC( $config['identityRoot'] .'items/', $config['technology'], $item['developer'] . '/' . $item['id'], $mvc['subitem'] );

                    $viewsNum .= "'" . $handleMVC['num']['name'] . "' => array (" . $handleMVC['num']['views'] . "),\n";
                    $content .= $handleMVC['view'] . "\r\n";
                    $content .= $handleMVC['controller'] . "\r\n";
                    $debugItemsMVC[] = $component;

                    if ( $handleMVC['refresh'] ) {
                        $debugRefViews[] = $handleMVC['refresh'];
                        $refreshViews .= "'" . $handleMVC['refresh'] . "',\n";
                    }

                }

            // 3. Then deploy lib subitems and ignore already deployed ones

            $mvc_array = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibItemsSubitems WHERE developer='" . $item['developer'] . "' AND item='" . $item['id'] . "' AND type='1' AND status='1' ORDER BY developer,item,subitem ASC;", 'fetch_array');
            if ( $mvc_array )
                foreach ($mvc_array as $mvc) {

                    $component = $item['developer'] . '/' . $item['id'] . '/' . $mvc['subitem'];

                    if ( !in_array( $component, $customSubitems ) ) {

                        $handleMVC = $this->handleMVC($config['libRoot'] . 'items/', $config['technology'], $item['developer'] . '/' . $item['id'], $mvc['subitem'] );

                        $viewsNum .= "'" . $handleMVC['num']['name'] . "' => array (" . $handleMVC['num']['views'] . "),\n";
                        $content .= $handleMVC['view'] . "\r\n";
                        $content .= $handleMVC['controller'] . "\r\n";
                        $debugItemsMVC[] = $component;

                        if ( $handleMVC['refresh'] ) {
                            $debugRefViews[] = $handleMVC['refresh'];
                            $refreshViews .= "'" . $handleMVC['refresh'] . "',\n";
                        }
                    }

                }

        }

        ### III. Add DesignViews
        $viewParams = '';
        $views = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoViewsStructure WHERE parent=0 AND status=1 AND component!='inner' ORDER BY `order` ASC;", 'fetch_array');
        if ( $views ) {
            $viewsArr = '';
            foreach ( $views as $view ) {
                $viewPars = $view['componentParams'] ? $view['componentParams'] : null;
                if ( $view['componentParams'] )
                    $viewParams .= "'".$view['developer'].".".$view['component']."' => ".$viewPars.",\n";
                $viewsArr .= "'".$view['developer'].".".$view['component']."',";
            }


            $viewsNum .= "'Domino.Design.Views' => array (" . rtrim ( $viewsArr , ',' ) . "),\n";
        }



        /*// tag manager
        if ( $identity["googleTagManager"] )
            $content .= "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','" . $identity["googleTagManager"] . "');";

        // ADD ANALYTICS
        if ( $identity["googleAnalytics"] )
            $content .= "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');


ga('create', '" . $identity["googleAnalytics"] . "', 'auto');"; //ga('send', 'pageview');
        */

        ### COMPILE
        require_once( $config['libRoot'] . 'components/' . "Patchwork/Jsqueeze/min-js.php");
        $jSqueeze = new JSqueeze();

        ### Write views.php
        $Mod = "<?php\n";
        $Mod .= "return array( 'views' => array(\n";
        $Mod .= $viewsNum;
        $Mod .= "),\n";
        $Mod .= "'viewParams' => array(\n";
        $Mod .= rtrim( $viewParams ,',\n');
        $Mod .= "),\n";
        $Mod .= "'refreshViews' => array(\n";
        $Mod .= rtrim( $refreshViews ,',\n');
        $Mod .= ")
        );";
        $util->writeFile( $config['identityRoot'] . 'items/views.php', $Mod );

        // DEPLOY TO THE DOMAIN
        $deployedDomains = array();
        $domains = $util->DominoSql("select * FROM " . $config['db'] . ".DCDominoIdentityDomains;", 'fetch_array');
        if ( $domains )
            foreach ( $domains as $domain ) {

                $deployedDomains[] = $config["domainsRoot"] . $domain["domain"];
                $util->writeFile( $config["domainsRoot"] . $domain["domain"] . "/app.min.js", $jSqueeze->squeeze($content, true, true, false));
                $util->writeFile( $config["domainsRoot"] . $domain["domain"] . "/app.js", $content );
            }

        $sql_update = $util->dominoSql("UPDATE " . $config['db'] . ".DCDominoIdentity SET verJs=verJs+1;",'update');

        $classModulesIdentity = new DCLibModulesDominoIdentity();
        $classModulesIdentity->siteVars();

        return array(
            'ItemsComponents' => $debugItemsComponents,
            'LibItemsComponents' => $debugLibItemsComponents,
            'ItemsMVC' => $debugItemsMVC,
            'refresh' => $debugRefViews,
            'domains' => $deployedDomains
        );



    }
}