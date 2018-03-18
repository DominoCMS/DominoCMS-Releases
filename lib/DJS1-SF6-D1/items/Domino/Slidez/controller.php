<?php
/**
 * filename: SlidezController.php
 * developer: Domino
 * item: Slidez
 * version: v1.0.0
 * date: 18. 7. 17
 */
	class DominoSlidezController {

		function indexAction  ( $data ) {


            //return $this->refreshAction( array() );



            $ret = array(
                'el' => null,
                'slides' => array(),
                'navHolder' => null,
                'buttons' => true,
                'slideDown' => false,
                'nav' => true,
                'transitionHeight' => array(
                    'easing' => 'Ease-In-Out',
                    'duration' => 800
                ),
                'transitionIn' => array(
                    'easing' => 'Ease-In-Out',
                    'duration' => 500
                ),
                'transition' => array(
                    'easing' => 'Ease-In-Out',
                    'duration' => 1000
                ),
                'transition' => array(
                    'interval' => 12000,
                    'easing' => 'Ease-In-Out',
                    'duration' => 3000
                ),
                'slideDownOptions' => array(
                    'extra' => 0,
                    'easing' => 'Ease-In-Out',
                    'duration' => 2000
                ),
                'buttonSlidePrev' => null,
                'buttonSlideNext' => null,
                'slideNewNum' => null,
                'factor' => 0.8,
                'animHeight' => '0px'
            );

            global $site;
            $ret['title'] = $site['page']['title'];
            global $isBot;

            if ( $isBot == true ) {

                $util = new DCUtil();
                $slideshowSql = $util->dominoSql("select * FROM " . $site['db'] . ".DC" . $site['page']['developer'] . $site['page']['module'] . " WHERE id='" . $site['page']['id'] . "';", 'fetch_one');

                if ($slideshowSql['content']) {

                    $height = 'height-inside';
                    $ret['title'] = isset( $slideshowSql['metaTitle'] ) ? ( $slideshowSql['metaTitle'] ? $slideshowSql['metaTitle'] : '' ) : $slideshowSql['name'];

                }


                $slides = $this->refreshAction( $data );

                foreach ( $slides as $key => $value ) {
                    $ret[$key] = $value;
                }

            }

            return $ret;

		}
		public function refreshAction ( $data ) {

            global $site;
            $util = new DCUtil();


            $views = $util->dominoSql("select componentParams FROM " . $site['db'] . ".DCDominoViewsStructure WHERE component='Slidez';", 'fetch_one');
            if ( $views ) {
                if ( $views['componentParams'] )
                    //$data['params'] = $util->betterEval( $views['componentParams'] );
                    $data['params'] = $views['componentParams'];
            }

            $class1 = isset( $data['params']['container2'] ) ? $data['params']['container2'] : 'grid-x grid-container align-center';
            $class2 = isset( $data['params']['container3'] ) ? $data['params']['container3'] : 'small-12 cell';

            if ( $site['page']['entry'] == $site['page']['entryFront'] ) {

                $height = 'height-inside';
                $slideshowId = 'front';

                $slideshowSql = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoSlideshow WHERE id='".$slideshowId."';", 'fetch_one');

                $slides = $util->dominoSql("select * FROM ".$site['db'].".DCDominoSiteIndex si JOIN ".$site['db'].".DCDominoSlideshowSlides mt ON (si.id = mt.id) WHERE si.parent='Domino.Slideshow.".$slideshowId."' AND si.status=1 AND mt.dateStart<=UNIX_TIMESTAMP(CURDATE()) AND mt.dateEnd>=UNIX_TIMESTAMP(CURDATE()) AND mt.lang='".$site['lang']."' ORDER BY mt.dateStart ASC;",'fetch_array');
                if ( $slides ) {
                    $height = 'height-front';
                    foreach ( $slides AS &$slide ) {

                        $sqlCross = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='Domino.SlideshowSlides.".$slide['id']."' AND status=1 AND picProfile=1 ORDER BY ordem ASC LIMIT 1;",'fetch_one');

                        $slide['pic'] = ( $sqlCross ) ? $util->displayPic( array( "id" => $sqlCross["idRel"],"width"=>1920 ) ) : null;

                    }
                }
            } else {

                $height = 'height-empty';

                $pic = array();
                $sqlCross = $util->dominoSql("select idRel FROM ".$site['db'].".DCDominoSiteCrossPictures WHERE entry='".$site['page']['developer'].".".$site['page']['module'].".".$site['page']['id']."' AND status=1 AND picCover=1 ORDER BY ordem ASC;",'fetch_one');
                if ( $sqlCross ) {
                    $height = 'height-title';
                    $pic = $util->displayPic( array( "id" => $sqlCross["idRel"],"width"=>1920 ) );
                }

                $slide = $util->dominoSql("select * FROM " . $site['db'] . ".DC".$site['page']['developer'].$site['page']['module']." WHERE id='".$site['page']['id']."' AND ( content='title' || content2='title' ) AND lang='".$site['lang']."';", 'fetch_one');
                if ( $slide ) {

                    if ( $slide['content'] ) {

                        $height = ( $pic ) ? 'height-title' : 'height-inside';
                        $name = $slide['metaTitle'] ? $slide['metaTitle'] : $slide['name'];

                        $slideContent = '';
                        $slideContent .= '<div class="content' . ( $pic ? ' overlay' : '' ). '">';
                        $slideContent .= '<div class="' . $class1 . '">
                                <div class="' . $class2 . '">
                                <h1>'. $name .'</h1>';

                        if ( $slide['subtitle'] )
                            $slideContent .= '<h2>'. $slide['subtitle'] .'</h2>';
                        else if ( $slide['metaDescription'] )
                            $slideContent .= '<h3>'. $slide['metaDescription'] .'</h3>';

                        if ( $slide['content'] != 'title' && $slide['content2'] != 'title' )
                            $slideContent .= '<p>'. $slide['content'] .'</p>';

                        $slideContent .= '</div>';
                        $slideContent .= '</div>';
                        $slideContent .= '</div>';

                        $slide['content'] = $slideContent;

                    }
                }
                else
                    $slide = array();

                if ( $pic )
                    $slide['pic'] = $pic;

                $slides = array(
                    $slide
                );

            }

            return array(
                'options' => array(
                    'height' => $height
                ),
                //'content' => $slideshowSql['content'],
                'slides' => $slides
            );
		}
	}

?>