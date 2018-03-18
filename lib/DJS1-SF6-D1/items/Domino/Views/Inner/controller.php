<?php

class DominoViewsInnerController extends DCBaseController {

    function indexAction( $data ) {

        global $site;
        global $config;
        $util = new DCUtil();

        $row = $util->dominoSql("select * FROM " . $site['db'] . ".DC".$site['page']['developer'].$site['page']['module']." WHERE id='".$site['page']['id']."' AND lang='".$site['lang']."';", 'fetch_one');

        $blocks = array();
        //$filename = $config['identityRoot'] . $site['username'] . '/items/Domino/' . '/ContentBlocks/controller.php';
        $filename = "";
        if ( !file_exists( $filename ) )
            $filename = $config['libRoot'] . $site['technology']['id'] . '/items/Domino/ContentBlocks/controller.php';

        if ( file_exists( $filename ) ) {
            require_once ( $filename );
            $blocksClass = new DominoContentBlocksController();

            if ( $site['page']['viewParent'] ) {
                $viewParent = explode('.',$site['page']['viewParent']);
                $developer = isset( $viewParent[0] ) ? $viewParent[0] : '';
                $module = isset( $viewParent[1] ) ? $viewParent[1] : '';
                $id = isset( $viewParent[2] ) ? $viewParent[2] : '';
            }
            else {
                $developer = $site['page']['developer'];
                $module = $site['page']['module'];
                $id = $site['page']['id'];
            }
            $blocks = $blocksClass->contentBlocks( $developer, $module, $id );
        }

        return array(
            'title' => $row['name'],
            'content' => isset( $row['content'] ) ? $row['content'] : '',
            'blocks' => $blocks
        );
    }



}