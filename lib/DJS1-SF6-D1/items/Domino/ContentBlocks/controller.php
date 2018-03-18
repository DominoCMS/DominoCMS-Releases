<?php
class DominoContentBlocksController extends DCBaseController {

    function indexAction( $data ) {

        global $site;
        $util = new DCUtil();

        if ( isset( $data['id'] ) && !isset( $data['params']['id'] ) )
            return $this->contentBlock( $data['id'] );
        else if ( isset( $data['params']['id'] ) )
            return $this->contentBlock( $data['params']['id'] );

    }
    public function contentBlocks ( $parentDeveloper, $parentModule, $parentId ) {

        global $site;
        $util = new DCUtil();

        $DCJSonClass = new DCJson();

        $blocks = $util->dominoSql("select mt.* FROM " . $site['db'] . ".DCDominoContentBlocks mt JOIN " . $site['db'] . ".DCDominoSiteIndex si ON (mt.id = si.id) WHERE si.developer='Domino' AND si.module='ContentBlocks' AND si.parent='".$parentDeveloper.".".$parentModule.".".$parentId."' AND si.status=1 AND mt.lang='".$site['lang']."' ORDER BY si.`order` ASC;", 'fetch_array');
        if ( $blocks )
            foreach ( $blocks AS &$block ) {


                $sqlPicProfile = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picProfile=1;",'fetch_one');
                //print "select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picProfile=1 ORDER BY ordem ASC LIMIT 1;";
                $picProfile = ( $sqlPicProfile ) ? $util->displayPic( array( "id" => $sqlPicProfile["idRel"],"width"=>1980 ) ) : null;

                if ( $picProfile )
                    $block['picProfile'] = $picProfile;

                $picsCover = array();
                $sqlPicsCover = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picCover=1 ORDER BY ordem ASC LIMIT 1;",'fetch_array');
                if ( $sqlPicsCover )
                    for ( $i = 0; $i < count($sqlPicsCover); $i++ ) {
                        $picCover = $util->displayPic( array( "id" => $sqlPicsCover[$i]["idRel"],"width"=>1980 ) );
                        if ( $picCover )
                            $picsCover[] = $picCover;
                    }
                if ( $picsCover )
                    $block['picsCover'] = $picsCover;

                $pics= array();
                $sqlPics = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picCover=0 AND picProfile=0 ORDER BY ordem ASC LIMIT 1;",'fetch_array');
                if ( $sqlPics )
                    for ( $i = 0; $i < count($sqlPics); $i++ ) {
                        $pic = $util->displayPic( array( "id" => $sqlPics[$i]["idRel"],"width"=>1980 ) );
                        if ( $pic )
                            $pics[] = $pic;
                    }
                if ( $pics )
                    $block['pics'] = $pics;

                //$data = $block['componentData'] ? eval($block['componentData']) : null;

                if ( $block['componentData'] )
                    $block['componentData'] = $this->betterEval( $block['componentData'] );
                else {
                    $data = $block;
                    $data['developer'] = 'Domino';
                    $data['module'] = 'ContentBlocks';
                    if ( $block['componentParams'] ) {

                        $componentParams = $this->betterEval( $block['componentParams'] );
                        //$data = $componentParams;
                        $data['params'] = $componentParams;
                    }


                    if ( $block['component'] ) {
                        $component = $DCJSonClass->componentData( $block['component'], "index", $data );
                        if ( $component )
                            $block['componentData'] = $component;
                    }

                }

                //unset( $block['componentData'] );

                $children = $this->contentBlocks( 'Domino', 'ContentBlocks', $block['id'] );
                if ( $children )
                    $block['children'] = $children;


            }

        return $blocks;

    }
    public function contentBlock ( $id ) {

        global $site;
        $util = new DCUtil();

        $DCJSonClass = new DCJson();

        $blocks = $util->dominoSql("select mt.* FROM " . $site['db'] . ".DCDominoContentBlocks mt JOIN " . $site['db'] . ".DCDominoSiteIndex si ON (mt.id = si.id) WHERE si.developer='Domino' AND si.module='ContentBlocks' AND si.id='".$id."' AND si.status=1 AND mt.lang='".$site['lang']."' ORDER BY si.`order` ASC;", 'fetch_array');
        if ( $blocks )
            foreach ( $blocks AS &$block ) {


                $sqlPicProfile = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picProfile=1;",'fetch_one');
                //print "select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picProfile=1 ORDER BY ordem ASC LIMIT 1;";
                $picProfile = ( $sqlPicProfile ) ? $util->displayPic( array( "id" => $sqlPicProfile["idRel"],"width"=>1980 ) ) : null;

                if ( $picProfile )
                    $block['picProfile'] = $picProfile;


                // Reset all default fields
                $block['name'] = '';
                $block['subtitle'] = '';
                $block['class'] = '';
                $block['theme'] = '';
                $block['container'] = '';
                $block['containerCol'] = '';
                $block['type'] = '';

                /*$picsCover = array();
                $sqlPicsCover = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picCover=1 ORDER BY ordem ASC LIMIT 1;",'fetch_array');
                if ( $sqlPicsCover )
                    for ( $i = 0; $i < count($sqlPicsCover); $i++ ) {
                        $picCover = $util->displayPic( array( "id" => $sqlPicsCover[$i]["idRel"],"width"=>1980 ) );
                        if ( $picCover )
                            $picsCover[] = $picCover;
                    }
                if ( $picsCover )
                    $block['picsCover'] = $picsCover;

                $pics= array();
                $sqlPics = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.ContentBlocks.".$block['id']."' AND status=1 AND picCover=0 AND picProfile=0 ORDER BY ordem ASC LIMIT 1;",'fetch_array');
                if ( $sqlPics )
                    for ( $i = 0; $i < count($sqlPics); $i++ ) {
                        $pic = $util->displayPic( array( "id" => $sqlPics[$i]["idRel"],"width"=>1980 ) );
                        if ( $pic )
                            $pics[] = $pic;
                    }
                if ( $pics )
                    $block['pics'] = $pics;
*/
                //$data = $block['componentData'] ? eval($block['componentData']) : null;

                if ( $block['componentData'] )
                    $block['componentData'] = $this->betterEval( $block['componentData'] );
                else {
                    $data = $block;
                    $data['developer'] = 'Domino';
                    $data['module'] = 'ContentBlocks';
                    if ( $block['componentParams'] ) {

                        $componentParams = $this->betterEval( $block['componentParams'] );
                        //$data = $componentParams;
                        $data['params'] = $componentParams;
                    }


                    if ( $block['component'] ) {
                        $component = $DCJSonClass->componentData( $block['component'], "index", $data );
                        if ( $component )
                            $block['componentData'] = $component;
                    }

                }

                //unset( $block['componentData'] );

                $children = $this->contentBlocks( 'Domino', 'ContentBlocks', $block['id'] );
                if ( $children )
                    $block['children'] = $children;


            }

        return $blocks;

    }
    function betterEval($code) {
        $tmp = tmpfile ();
        $tmpf = stream_get_meta_data ( $tmp );
        $tmpf = $tmpf ['uri'];
        fwrite ( $tmp, $code );
        $ret = require ( $tmpf );
        fclose ( $tmp );
        return $ret;
    }


}