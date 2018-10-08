<?php
use Leafo\ScssPhp\Compiler;
require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Identity/controller.php" );
require_once ( $config['libRoot'] . "DJS1-SF6-D1/modules/Domino/Items/controller.php" );
class DCLibModulesDominoThemes extends DCBaseController {
    function modulesParamsAction ( $data ) {

        global $site;
        global $config;
        $util = new DCUtil();

        $paramLevels = array();

        $params = $data['params'];
        $developer = $data['developer'];
        $module = $data['module'];

        // Edit
        if ( isset( $_GET['id'] ) ) {

            $id = $util->sanitize( $_GET['id'] );
            $site['page']['editList'] = 'edit';

            $paramLevels[] = array(
                'type' => '',
                'title' => $id,
                'icon' => '',
                'url' => $params['currentUrlClean']
            );

            // new entry
            if ( $id == 'new' )
                $site['entry'] = array(
                    'type' => 'edit',
                    'options' => array(
                        'developer' => $developer,
                        'module' => $module,
                        'id' => 'new',
                        'link' => '',
                        'linkUrl' => ''
                    ),
                    'actions' => array(
                        'options' => array(),
                        'buttons' => array(
                            'back' => array(
                                'value' => 'Back',
                                'link' => $params['levels'][$params['currentLevel']-1]['url'] ,
                                'icon' => 'arrow_left',
                                'position' => 'left'
                            ),
                            'create' => array(
                                'value' => 'Save & close',
                                'icon' => 'save',
                                'position' => 'left',
                                'name' => 'create',
                                'type' => 'submit'
                            ),
                            'createOpen' => array(
                                'value' => 'Save',
                                'icon' => 'save',
                                'position' => 'left',
                                'name' => 'createOpen',
                                'type' => 'submit'
                            )
                        )
                    ),
                    'subactions' => array(
                        'buttons' => array(
                            'langs' => array(
                                'value' => '',
                                //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                                'icon' => 'arrow_left',
                                'position' => 'right'
                            )
                        )
                    )
                );
            // update entry
            else
                $site['entry'] = array(
                    'type' => 'edit',
                    'options' => array(
                        'developer' => $developer,
                        'module' => $module,
                        'id' => $id,
                        'link' => '',
                        'linkUrl' => ''
                    ),
                    'actions' => array (
                        'options' => array(),
                        'buttons' => array(
                            'back' => array(
                                'value' => 'Back',
                                'link' => $params['levels'][$params['currentLevel']-1]['url'],
                                'icon' => 'arrow_left',
                                'position' => 'left'
                            ),
                            'update' => array(
                                'value' => 'Save & close',
                                'icon' => 'save',
                                'position' => 'left',
                                'name' => 'update',
                                'type' => 'submit'
                            ),
                            'save' => array(
                                'value' => 'Save',
                                'icon' => 'save',
                                'position' => 'left',
                                'name' => 'save',
                                'type' => 'submit'
                            )
                        )
                    ),
                    'subactions' => array(
                        'lang' => $site['lang'],
                        'buttons' => array(
                            'langSwitcher' => array(
                                'value' => '',
                                //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                                'icon' => 'arrow_left',
                                'position' => 'medium-offset-9'
                            )
                        )
                    )
                );
        }
        else
            $site['entry'] = array(
                'type' => 'list',
                'list' => array(
                    'options' => array(
                        'developer' => $developer,
                        'module' => $module,
                        'id' => 1,
                        'link' => 'list',
                        'linkUrl' => $params['levels'][$params['currentLevel']-1]['url'] . "?id="
                    )
                ),
                'actions' => array (
                    'options' => array(),
                    'buttons' => array(
                        'back' => array(
                            'value' => 'Back',
                            'link' => $params['levels'][1]['url'],
                            'icon' => 'arrow_left',
                            'position' => 'left'
                        ),
                        'new' => array(
                            'value' => 'New',
                            'action' => 'new',
                            'link' => $params['currentUrlClean'] . "?id=new",
                            'icon' => 'edit',
                            'position' => 'left'
                        )
                    )
                ),
                'subactions' => array(
                    'buttons' => array(
                        'filterEntries' => array(
                            'value' => '',
                            //'link' => $params['levels'][3]['url'].'?developer='.$data['developer'].'&module='.$data['module'],
                            'icon' => 'arrow_left',
                            'position' => 'left'
                        )
                    )
                )
            );

        return $paramLevels;

    }
    function deployCss () {

        global $config;

        $util = new DCUtil();
        $deployItems = new DCLibModulesDominoItems();

        $identity = $util->dominoSql( "select * FROM " . $config['db'] . ".DCDominoIdentity;", 'fetch_one');

        $themeArr = explode( '.', $identity['theme'] );

        if ( isset( $themeArr[0] ) && isset( $themeArr[1] ) ) {
            $themeDeveloper = $themeArr[0];
            $theme = $themeArr[1];
        }
        else {
            $themeDeveloper = 'Domino';
            $theme = 'Default';
        }

        // CSS/SCSS/LESS LIBRARIES

        $paths = "";
        /*if ( $techCss == "SF6" )
            $paths = $config['libRoot'] . 'items/Zurb/Foundation6/';
        else if ( $techCss == "SB3" )
            $paths = $config['libRoot'] . 'items/Twitter/Bootstrap3/';*/

        $content = "";

        ### 1. First deploy theme default settings
        $debugThemes = array();
        $defaultArr = array( 'settings', 'framework', 'settings', 'global');
        foreach ( $defaultArr AS $def ) {

            $filename = $config['identityRoot'] . $config['technology'] . '/themes/' . $themeDeveloper . '/' . $theme . '/' . $def . '.scss';
            //print $filename;
            if ( !file_exists( $filename ) )
                $filename = $config['libRoot'] . $config['technology'] . '/themes/' . $themeDeveloper . '/' . $theme . '/' . $def . '.scss';
            if ( file_exists( $filename ) ) {
                $file = file_get_contents( $filename, true );
                $debugThemes[] = $filename;
                $content .= $file . "\r\n";
            }
            else
                $debugThemes[] = 'NULL ' . $filename;
        }

        ### 2. Deploying item components
        $itemsArr = $deployItems->getDeployItems( $identity );
        $debugComponents = array();
        foreach ( $itemsArr as $item ) {

            ### 2.1 Default MVC

            // Settings
            $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/themes/' . $themeDeveloper . '/' . $theme . '/settings.scss';
            if ( !file_exists( $filename ) )
                $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['id'] . '/themes/' . $themeDeveloper . '/' . $theme . '/settings.scss';

            if ( file_exists( $filename ) ) {
                $file = file_get_contents( $filename, true );
                $content .= $file . "\r\n";
                $debugComponents[] = $filename;
            }
            // Component with fallbacks
            $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/' . $config['technology'] . '/themes/' . $themeDeveloper . '/' . $theme . '/component.scss';

            if ( !file_exists( $filename ) )
                $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['id'] . '/themes/' . $themeDeveloper . '/' . $theme . '/component.scss';
            if ( !file_exists( $filename ) )
                $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/component.scss';
            if ( !file_exists( $filename ) )
                $filename = $config['libRoot'] . $config['technology'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/component.scss';

            //$report[] = $filename;
            if ( file_exists( $filename ) ) {
                $file = file_get_contents( $filename, true );
                $content .= $file . "\r\n";
                $debugComponents[] = $filename;
            }
            else {
                $debugComponents[] = "NULL ". $item['developer'] . '/' . $item['id'];
            }

            ### 2.2 Sub MVC
            // Identity
            $customComponents = array();
            $mvc_array = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoItemsSubitems WHERE developer='" . $item['developer'] . "' AND item='" . $item['id'] . "' AND status=1 ORDER BY developer,item,subitem ASC;", 'fetch_array');
            if ( $mvc_array )
                foreach ( $mvc_array as $mvc ) {

                    // Identity
                    $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/' . $mvc['subitem'] . '/component.scss';
                    if ( file_exists( $filename ) ) {
                        $file = file_get_contents( $filename, true );
                        $content .= $file . "\r\n";
                        $debugComponents[] = $filename;
                    }
                    // Library
                    else {

                        $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['id'] . '/'  . $mvc['subitem'] . '/component.scss';
                        if ( file_exists( $filename ) ) {
                            $file = file_get_contents( $filename, true );
                            $content .= $file . "\r\n";
                            $debugComponents[] = $filename;
                        }
                        else
                            $debugComponents[] = "NULL ".$filename;

                    }

                }

            // Lib subitems
            $libraries_components = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibItemsSubitems WHERE developer='" . $item['developer'] . "' AND item='" . $item['id'] . "' AND type='1' AND status=1 ORDER BY developer,item,subitem ASC;", 'fetch_array');
            if ( $libraries_components )
                foreach ( $libraries_components as $component ) {
                    //print $item['id'] . '/' . $component['subitem']."\n";
                    // Always add lib settings so that possible custom don't need to be complete
                    $filename = $config['libRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/' . $themeDeveloper . '/' . $theme . '/settings.scss';
                    if ( !file_exists( $filename ) )
                        $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/themes/' . $themeDeveloper . '/Default/settings.scss';
                    if ( file_exists( $filename ) ) {
                        $file = file_get_contents( $filename, true );
                        $content .= $file . "\r\n";
                        $debugComponents[] = $filename;
                    }

                    // Identity Settings
                    $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/themes/' . $themeDeveloper . '/' . $theme . '/settings.scss';
                    if ( file_exists( $filename ) ) {
                        $file = file_get_contents( $filename, true );
                        $content .= $file . "\r\n";
                        $debugComponents[] = $filename;
                    }
                    else
                        $debugComponents[] = "NULL ".$filename;

                    // Component with fallbacks
                    $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/themes/' . $themeDeveloper . '/' . $theme . '/component.scss';
                    if ( !file_exists( $filename ) )
                        $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/themes/' . $themeDeveloper . '/' . $theme . '/component.scss';
                    if ( !file_exists( $filename ) )
                        $filename = $config['identityRoot'] . 'items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/component.scss';
                    if ( !file_exists( $filename ) )
                        $filename = $config['libRoot'] . $config['technology'] . '/items/' . $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'] . '/component.scss';

                    if ( file_exists( $filename ) ) {
                        $file = file_get_contents( $filename, true );
                        $content .= $file . "\r\n";
                        $debugComponents[] = $filename;
                    }
                    else {
                        $debugComponents[] = $item['developer'] . '/' . $item['id'] . '/' . $component['subitem'];
                    }

                }

            ### 2.3 Custom lib components
            $libraries_components = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibItemsComponents WHERE developer='" . $item['developer'] . "' AND item='" . $item['id'] . "' AND type IN ('css','scss','less') AND status=1 ORDER BY `order` ASC;", 'fetch_array');
            if ( $libraries_components )
                foreach ( $libraries_components as $component ) {

                    $filename = $config['libRoot'] . $config['technology'] . 'items/' . $component['developer'] . '/' . $component['item'] . '/' . $component['filename'] . '.'.$component['type'];

                    if ( file_exists( $filename ) ) {
                        $file = file_get_contents($filename, true);
                        $content .= $file . "\r\n";
                        $debugComponents[] = $filename;
                    }
                    else
                        $debugComponents[] = 'NULL' . $filename;

                }
        }

        ### 3. Whatever extra CSS/SCSS/LESS COMPONENTS
        $components = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoItemsComponents WHERE type IN ('css','scss','less') ORDER BY `order` ASC;", 'fetch_array');
        if ( $components )
            foreach ( $components as $comp ) {

            }


        require_once $config['libRoot'] . "components/Leafo/Scssphp/scss.inc.php";

        $scss = new Compiler();
        $scss->setFormatter('Leafo\ScssPhp\Formatter\Compressed');
        $scss->setImportPaths( $paths );
        $content = $scss->compile( $content );

        $deployedDomains = array();
        $domains = $util->DominoSql("select * FROM " . $config['db'] . ".DCDominoIdentityDomains;", 'fetch_array');
        if ( $domains )
            foreach ( $domains as $domain ) {
                $deployedDomains[] = $config["domainsRoot"] . $domain["domain"];
                $util->writeFile( $config["domainsRoot"] . $domain["domain"] . "/style.css", $content );
            }

        $identSql = $util->DominoSql("select * FROM " . $config['db'] . ".DCDominoIdentity WHERE id=1;", 'fetch_one ');
        if ( $identSql )
            if ( $identSql['verCss'] == NULL )
                $sql_update = $util->dominoSql("UPDATE " . $config['db'] . ".DCDominoIdentity SET verCss=1;",'update');

        $sql_update = $util->dominoSql("UPDATE " . $config['db'] . ".DCDominoIdentity SET verCss=verCss+1;",'update');

        $classModulesIdentity = new DCLibModulesDominoIdentity();
        $classModulesIdentity->siteVars();

        return array(
            'themes' => $debugThemes,
            'components' => $debugComponents,
            'domains' => $deployedDomains
        );
    }
}